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
  const [rangeAnalysis, setRangeAnalysis] = useState<RangeAnalysis | null>(
    null
  );
  const [rangeLoading, setRangeLoading] = useState(false);
  const [similarNewsItem, setSimilarNewsItem] = useState<NewsItem | null>(
    null
  );
  const [loading, setLoading] = useState(true);

  // Load stock and news data
  useEffect(() => {
    async function loadData() {
      setLoading(true);
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
      setLoading(false);
    }
    loadData();
  }, [symbol]);

  // Load forecast
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

  // Filter news
  const filteredNews = allNews.filter((n) => {
    if (selectedCategory && n.category !== selectedCategory) return false;
    if (sentimentFilter !== "all" && n.sentiment !== sentimentFilter)
      return false;
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
        body: JSON.stringify({
          symbol,
          type: "range",
          startDate: start,
          endDate: end,
          percentChange,
        }),
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

  const currentPrice = candles.length
    ? candles[candles.length - 1].close
    : 0;
  const prevPrice = candles.length > 1
    ? candles[candles.length - 2].close
    : currentPrice;
  const priceChange = currentPrice - prevPrice;
  const priceChangePct = prevPrice ? (priceChange / prevPrice) * 100 : 0;

  return (
    <div className="min-h-screen bg-[#0a0e17]">
      {/* Header */}
      <header className="border-b border-gray-800/50 px-5 py-2.5 flex items-center gap-4 backdrop-blur-md bg-[#0a0e17]/90 sticky top-0 z-40">
        <h1 className="text-white font-bold text-lg tracking-wide animate-fade-in select-none">
          <span className="text-cyan-400 drop-shadow-[0_0_10px_rgba(34,211,238,0.5)]">K</span>
          <span className="text-gray-200">Story</span>
        </h1>
        <StockSelector symbol={symbol} onSelect={setSymbol} />
        {currentPrice > 0 && (
          <div className="flex items-center gap-2 animate-fade-in">
            <span className="text-white text-sm font-semibold font-mono">
              ${currentPrice.toFixed(2)}
            </span>
            <span className={`text-xs font-medium font-mono px-1.5 py-0.5 rounded ${
              priceChange >= 0
                ? "text-green-400 bg-green-900/20"
                : "text-red-400 bg-red-900/20"
            }`}>
              {priceChange >= 0 ? "+" : ""}{priceChange.toFixed(2)} ({priceChangePct >= 0 ? "+" : ""}{priceChangePct.toFixed(2)}%)
            </span>
          </div>
        )}
        <div className="ml-auto flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
          <span className="text-green-400 text-[10px] font-semibold tracking-wider">LIVE</span>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex flex-col lg:flex-row">
        {/* Left Panel */}
        <div className="flex-1 p-4 min-w-0">
          {/* Chart */}
          <div className="animate-fade-in-up">
            <CandlestickChart
              candles={candles}
              news={filteredNews}
              onDateClick={handleDateClick}
              onRangeSelect={handleRangeSelect}
            />
          </div>

          {/* Category Filters */}
          <div className="mt-4">
            <CategoryFilter
              news={allNews}
              selectedCategory={selectedCategory}
              onCategorySelect={setSelectedCategory}
              sentimentFilter={sentimentFilter}
              onSentimentFilter={setSentimentFilter}
            />
          </div>

          {/* News / Range Analysis / Similar Days */}
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
        <div className="w-full lg:w-[360px] border-l border-gray-800/40 p-5">
          <ForecastPanel
            forecast={forecast}
            period={forecastPeriod}
            onPeriodChange={setForecastPeriod}
            loading={forecastLoading}
          />
        </div>
      </div>
    </div>
  );
}
