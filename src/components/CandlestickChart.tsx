"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import {
  createChart,
  createSeriesMarkers,
  CandlestickData,
  CandlestickSeries,
  IChartApi,
  ISeriesApi,
  Time,
  MouseEventParams,
} from "lightweight-charts";
import type { StockCandle, NewsItem } from "@/types";

interface Props {
  candles: StockCandle[];
  news: NewsItem[];
  onDateClick: (date: string) => void;
  onRangeSelect: (start: string, end: string, percentChange: number) => void;
}

export default function CandlestickChart({
  candles,
  news,
  onDateClick,
  onRangeSelect,
}: Props) {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const candleSeriesRef = useRef<ISeriesApi<"Candlestick"> | null>(null);
  const [tooltip, setTooltip] = useState<{
    x: number;
    y: number;
    newsItem: NewsItem;
  } | null>(null);
  const [rangeStart, setRangeStart] = useState<string | null>(null);
  const [rangePopup, setRangePopup] = useState<{
    x: number;
    y: number;
    start: string;
    end: string;
    percentChange: number;
  } | null>(null);

  const newsMapRef = useRef<Map<string, NewsItem[]>>(new Map());

  useEffect(() => {
    const map = new Map<string, NewsItem[]>();
    news.forEach((n) => {
      const existing = map.get(n.date) || [];
      existing.push(n);
      map.set(n.date, existing);
    });
    newsMapRef.current = map;
  }, [news]);

  useEffect(() => {
    if (!chartContainerRef.current) return;

    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { color: "#0a0e17" },
        textColor: "#9ca3af",
      },
      grid: {
        vertLines: { color: "#1f2937" },
        horzLines: { color: "#1f2937" },
      },
      crosshair: {
        mode: 0,
      },
      rightPriceScale: {
        borderColor: "#374151",
      },
      timeScale: {
        borderColor: "#374151",
        timeVisible: false,
      },
      width: chartContainerRef.current.clientWidth,
      height: 380,
    });

    const candleSeries = chart.addSeries(CandlestickSeries, {
      upColor: "#22c55e",
      downColor: "#ef4444",
      borderUpColor: "#22c55e",
      borderDownColor: "#ef4444",
      wickUpColor: "#22c55e",
      wickDownColor: "#ef4444",
    });

    const candleData: CandlestickData<Time>[] = candles.map((c) => ({
      time: c.time as Time,
      open: c.open,
      high: c.high,
      low: c.low,
      close: c.close,
    }));

    candleSeries.setData(candleData);

    // Add news markers
    const markers = candles
      .filter((c) => newsMapRef.current.has(c.time))
      .map((c) => {
        const items = newsMapRef.current.get(c.time)!;
        const posCount = items.filter(
          (n) => n.sentiment === "positive"
        ).length;
        const negCount = items.filter(
          (n) => n.sentiment === "negative"
        ).length;
        const isPositive = posCount >= negCount;
        return {
          time: c.time as Time,
          position: isPositive
            ? ("belowBar" as const)
            : ("aboveBar" as const),
          color: isPositive ? "#22c55e" : "#ef4444",
          shape: "circle" as const,
          size: 0.5,
        };
      });

    createSeriesMarkers(candleSeries, markers);

    chartRef.current = chart;
    candleSeriesRef.current = candleSeries;

    // Handle crosshair move for tooltip
    chart.subscribeCrosshairMove((param: MouseEventParams<Time>) => {
      if (!param.time || !param.point) {
        setTooltip(null);
        return;
      }
      const dateStr = param.time as string;
      const items = newsMapRef.current.get(dateStr);
      if (items && items.length > 0) {
        setTooltip({
          x: param.point.x,
          y: param.point.y,
          newsItem: items[0],
        });
      } else {
        setTooltip(null);
      }
    });

    // Handle click for date selection and range
    chart.subscribeClick((param: MouseEventParams<Time>) => {
      if (!param.time) return;
      const dateStr = param.time as string;
      onDateClick(dateStr);
    });

    const handleResize = () => {
      if (chartContainerRef.current) {
        chart.applyOptions({
          width: chartContainerRef.current.clientWidth,
        });
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      chart.remove();
    };
  }, [candles, news, onDateClick]);

  const handleRangeClick = useCallback(
    (e: React.MouseEvent) => {
      if (!chartRef.current || !candleSeriesRef.current) return;

      // Get time from chart coordinate
      const chart = chartRef.current;
      const rect = chartContainerRef.current!.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const logical = chart.timeScale().coordinateToLogical(x);
      if (logical === null) return;

      const time = candles[Math.min(Math.max(0, Math.round(logical)), candles.length - 1)]?.time;
      if (!time) return;

      if (!rangeStart) {
        setRangeStart(time);
        setRangePopup(null);
      } else {
        const start = rangeStart < time ? rangeStart : time;
        const end = rangeStart < time ? time : rangeStart;
        const startCandle = candles.find((c) => c.time === start);
        const endCandle = candles.find((c) => c.time === end);
        if (startCandle && endCandle) {
          const pct =
            ((endCandle.close - startCandle.open) / startCandle.open) *
            100;
          setRangePopup({
            x: e.clientX - rect.left,
            y: e.clientY - rect.top,
            start,
            end,
            percentChange: +pct.toFixed(2),
          });
        }
        setRangeStart(null);
      }
    },
    [rangeStart, candles]
  );

  return (
    <div className="relative">
      <div
        ref={chartContainerRef}
        onDoubleClick={handleRangeClick}
        className="w-full"
      />
      {tooltip && (
        <div
          className="absolute pointer-events-none bg-gray-900/95 border border-gray-600 rounded-lg p-3 text-xs max-w-[280px] z-10"
          style={{ left: tooltip.x + 15, top: tooltip.y - 60 }}
        >
          <div className="text-white font-medium mb-1 leading-tight">
            {tooltip.newsItem.title}
          </div>
          <div
            className={`font-semibold ${
              tooltip.newsItem.sentiment === "positive"
                ? "text-green-400"
                : tooltip.newsItem.sentiment === "negative"
                  ? "text-red-400"
                  : "text-yellow-400"
            }`}
          >
            {tooltip.newsItem.sentiment === "positive"
              ? "Positive"
              : tooltip.newsItem.sentiment === "negative"
                ? "Negative"
                : "Neutral"}{" "}
            T+1: {tooltip.newsItem.returnT1 > 0 ? "+" : ""}
            {tooltip.newsItem.returnT1}%
          </div>
        </div>
      )}
      {rangeStart && (
        <div className="absolute top-2 right-2 bg-blue-600/80 text-white text-xs px-2 py-1 rounded">
          Range start: {rangeStart} (double-click end point)
        </div>
      )}
      {rangePopup && (
        <RangePopup
          {...rangePopup}
          onAsk={(question) => {
            onRangeSelect(
              rangePopup.start,
              rangePopup.end,
              rangePopup.percentChange
            );
            setRangePopup(null);
          }}
          onClose={() => setRangePopup(null)}
        />
      )}
      <div className="text-[10px] text-gray-600 mt-1">
        Double-click twice to select a date range for AI analysis
      </div>
    </div>
  );
}

function RangePopup({
  x,
  y,
  start,
  end,
  percentChange,
  onAsk,
  onClose,
}: {
  x: number;
  y: number;
  start: string;
  end: string;
  percentChange: number;
  onAsk: (question?: string) => void;
  onClose: () => void;
}) {
  const [question, setQuestion] = useState("");

  return (
    <div
      className="absolute bg-gray-800/95 border border-gray-600 rounded-lg p-4 z-20 w-[280px] shadow-2xl"
      style={{ left: Math.min(x, 400), top: Math.max(10, y - 150) }}
    >
      <div className="flex justify-between items-start mb-2">
        <div className="text-white text-xs">
          {start} ~ {end}
        </div>
        <span
          className={`text-sm font-bold ${
            percentChange >= 0 ? "text-green-400" : "text-red-400"
          }`}
        >
          {percentChange >= 0 ? "+" : ""}
          {percentChange}%
        </span>
      </div>
      <div className="text-cyan-400 text-xs font-medium mb-2">
        Ask KStory
      </div>
      <div className="space-y-1.5 mb-3">
        {[
          "What's driving the price movement?",
          "Summarize key news in this period",
          "What are the bull/bear factors?",
        ].map((q) => (
          <button
            key={q}
            onClick={() => onAsk(q)}
            className="block w-full text-left text-xs text-gray-300 hover:text-white hover:bg-gray-700 px-2 py-1.5 rounded transition"
          >
            {q}
          </button>
        ))}
      </div>
      <div className="flex gap-1">
        <input
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && onAsk(question)}
          placeholder="Ask a question..."
          className="flex-1 bg-gray-700 text-white text-xs px-2 py-1.5 rounded border border-gray-600 outline-none focus:border-blue-500"
        />
        <button
          onClick={() => onAsk(question)}
          className="bg-blue-600 text-white px-2 py-1.5 rounded text-xs hover:bg-blue-500"
        >
          &rarr;
        </button>
      </div>
      <button
        onClick={onClose}
        className="absolute top-1 right-2 text-gray-500 hover:text-white text-sm"
      >
        &times;
      </button>
    </div>
  );
}
