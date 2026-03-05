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

  // Load stock and news data
  useEffect(() => {
    async function loadData() {
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

  return (
    <div className="min-h-screen bg-[#0a0e17]">
      {/* Header */}
      <header className="border-b border-gray-800 px-4 py-2 flex items-center gap-4">
        <h1 className="text-white font-bold text-lg tracking-wide">
          <span className="text-cyan-400">K</span>Story
        </h1>
        <StockSelector symbol={symbol} onSelect={setSymbol} />
        {currentPrice > 0 && (
          <span className="text-gray-400 text-sm ml-2">
            ${currentPrice.toFixed(2)}
          </span>
        )}
      </header>

      {/* Main Content */}
      <div className="flex flex-col lg:flex-row gap-0">
        {/* Left Panel */}
        <div className="flex-1 p-4 min-w-0">
          {/* Chart */}
          <CandlestickChart
            candles={candles}
            news={filteredNews}
            onDateClick={handleDateClick}
            onRangeSelect={handleRangeSelect}
          />

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
          <div className="mt-3">
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
        <div className="w-full lg:w-[340px] border-l border-gray-800 p-4 space-y-4">
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
