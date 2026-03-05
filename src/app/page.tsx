"use client";

import { useState, useEffect, useCallback } from "react";
import dynamic from "next/dynamic";
import StockSelector from "@/components/StockSelector";
import CategoryFilter from "@/components/CategoryFilter";
import NewsList from "@/components/NewsList";
import ForecastPanel from "@/components/ForecastPanel";
import RangeAnalysisPanel from "@/components/RangeAnalysisPanel";
import SimilarDaysPanel from "@/components/SimilarDays";
import type {
  StockCandle,
  NewsItem,
  NewsCategory,
  ForecastResult,
  RangeAnalysis,
} from "@/types";

const CandlestickChart = dynamic(
  () => import("@/components/CandlestickChart"),
  { ssr: false }
);

export default function Home() {
  const [symbol, setSymbol] = useState("AAPL");
  const [candles, setCandles] = useState<StockCandle[]>([]);
  const [allNews, setAllNews] = useState<NewsItem[]>([]);
  const [selectedCategory, setSelectedCategory] =
    useState<NewsCategory | null>(null);
  const [sentimentFilter, setSentimentFilter] = useState<
    "all" | "positive" | "negative"
  >("all");
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [forecast, setForecast] = useState<ForecastResult | null>(null);
  const [forecastPeriod, setForecastPeriod] = useState<"7d" | "30d">("7d");
  const [forecastLoading, setForecastLoading] = useState(false);
  const [rangeAnalysis, setRangeAnalysis] = useState<RangeAnalysis | null>(null);
  const [rangeLoading, setRangeLoading] = useState(false);
  const [similarNewsItem, setSimilarNewsItem] = useState<NewsItem | null>(null);
  const [chartLoading, setChartLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setChartLoading(true);
      const [stockRes, newsRes] = await Promise.all([
        fetch(`/api/stock?symbol=${symbol}`),
        fetch(`/api/news?symbol=${symbol}`),
      ]);
      const stockData = await stockRes.json();
      const newsData = await newsRes.json();
      setCandles(stockData);
      setAllNews(newsData);
      setSelectedDate(null);
      setRangeAnalysis(null);
      setSimilarNewsItem(null);
      setSelectedCategory(null);
      setSentimentFilter("all");
      setChartLoading(false);
    }
    loadData();
  }, [symbol]);

  useEffect(() => {
    async function loadForecast() {
      setForecastLoading(true);
      const res = await fetch("/api/analysis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ symbol, type: "forecast" }),
      });
      const data = await res.json();
      setForecast(data);
      setForecastLoading(false);
    }
    loadForecast();
  }, [symbol, forecastPeriod]);

  const filteredNews = allNews.filter((n) => {
    if (selectedCategory && n.category !== selectedCategory) return false;
    if (sentimentFilter !== "all" && n.sentiment !== sentimentFilter) return false;
    return true;
  });

  const handleDateClick = useCallback((date: string) => {
    setSelectedDate(date);
    setSimilarNewsItem(null);
    setRangeAnalysis(null);
  }, []);

  const handleRangeSelect = useCallback(
    async (start: string, end: string, percentChange: number) => {
      setRangeLoading(true);
      setSimilarNewsItem(null);
      const res = await fetch("/api/analysis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ symbol, type: "range", startDate: start, endDate: end, percentChange }),
      });
      const data = await res.json();
      setRangeAnalysis(data);
      setRangeLoading(false);
    },
    [symbol]
  );

  const handleFindSimilar = useCallback((item: NewsItem) => {
    setSimilarNewsItem(item);
    setRangeAnalysis(null);
  }, []);

  const isInitialLoad = candles.length === 0 && chartLoading;
  const currentPrice = candles.length ? candles[candles.length - 1].close : 0;
  const prevPrice = candles.length > 1 ? candles[candles.length - 2].close : currentPrice;
  const priceChange = currentPrice - prevPrice;
  const priceChangePct = prevPrice ? (priceChange / prevPrice) * 100 : 0;

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b border-slate-200/80 px-5 py-2.5 flex items-center gap-4 backdrop-blur-md bg-white/70 sticky top-0 z-40">
        <h1 className="font-bold text-lg tracking-wide select-none">
          <span className="text-blue-600 drop-shadow-[0_0_8px_rgba(59,130,246,0.3)]">K</span>
          <span className="text-slate-800">Story</span>
        </h1>
        <StockSelector symbol={symbol} onSelect={setSymbol} />
        {currentPrice > 0 && (
          <div className="flex items-center gap-2 animate-fade-in" key={symbol}>
            <span className="text-slate-800 text-sm font-semibold font-mono">
              ${currentPrice.toFixed(2)}
            </span>
            <span className={`text-xs font-medium font-mono px-2 py-0.5 rounded-md ${
              priceChange >= 0
                ? "text-emerald-600 bg-emerald-50"
                : "text-red-600 bg-red-50"
            }`}>
              {priceChange >= 0 ? "+" : ""}{priceChange.toFixed(2)} ({priceChangePct >= 0 ? "+" : ""}{priceChangePct.toFixed(2)}%)
            </span>
          </div>
        )}
        <div className="ml-auto flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse-glow" />
          <span className="text-emerald-600 text-[10px] font-semibold tracking-wider">LIVE</span>
        </div>
      </header>

      {/* Full-page loading state */}
      {isInitialLoad ? (
        <div className="flex items-center justify-center min-h-[80vh] animate-fade-in">
          <div className="flex flex-col items-center gap-6">
            {/* Animated bars */}
            <div className="flex items-end gap-2 h-14">
              {[0, 1, 2, 3, 4, 5, 6].map((i) => (
                <div
                  key={i}
                  className="chart-loading-bar rounded-full"
                  style={{
                    width: "8px",
                    height: "100%",
                    background: `linear-gradient(to top, ${
                      i % 3 === 0 ? '#16a34a' : i % 3 === 1 ? '#3b82f6' : '#8b5cf6'
                    }, ${
                      i % 3 === 0 ? '#86efac' : i % 3 === 1 ? '#93c5fd' : '#c4b5fd'
                    })`,
                    opacity: 0.6,
                    animationDelay: `${i * 80}ms`,
                  }}
                />
              ))}
            </div>
            <div className="text-center">
              <div className="text-slate-800 text-sm font-semibold mb-1">Loading {symbol}</div>
              <div className="text-slate-400 text-xs animate-breathe">Fetching market data & news...</div>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row">
          {/* Left Panel */}
          <div className="flex-1 p-4 min-w-0">
            <div className="animate-fade-in-up">
              <CandlestickChart
                candles={candles}
                news={filteredNews}
                loading={chartLoading}
                onDateClick={handleDateClick}
                onRangeSelect={handleRangeSelect}
              />
            </div>

            <div className="mt-4">
              <CategoryFilter
                news={allNews}
                selectedCategory={selectedCategory}
                onCategorySelect={setSelectedCategory}
                sentimentFilter={sentimentFilter}
                onSentimentFilter={setSentimentFilter}
              />
            </div>

            <div className="mt-1">
              {rangeAnalysis || rangeLoading ? (
                <RangeAnalysisPanel
                  analysis={rangeAnalysis}
                  loading={rangeLoading}
                  onClose={() => setRangeAnalysis(null)}
                />
              ) : similarNewsItem ? (
                <SimilarDaysPanel
                  newsItem={similarNewsItem}
                  candles={candles}
                  allNews={allNews}
                  onClose={() => setSimilarNewsItem(null)}
                />
              ) : (
                <NewsList
                  news={filteredNews}
                  selectedDate={selectedDate}
                  onFindSimilar={handleFindSimilar}
                />
              )}
            </div>
          </div>

          {/* Right Panel */}
          <div className="w-full lg:w-[360px] border-l border-slate-200/60 p-5 animate-slide-in-right">
            <ForecastPanel
              forecast={forecast}
              period={forecastPeriod}
              onPeriodChange={setForecastPeriod}
              loading={forecastLoading}
            />
          </div>
        </div>
      )}
    </div>
  );
}
