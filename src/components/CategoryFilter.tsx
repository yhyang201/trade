"use client";

import type { NewsCategory, NewsItem } from "@/types";

const CATEGORIES: {
  key: NewsCategory;
  label: string;
  icon: string;
  color: string;
  activeColor: string;
  iconBg: string;
}[] = [
  { key: "market", label: "Market", icon: "📊", color: "border-blue-800/40", activeColor: "border-blue-500 bg-blue-950/40 shadow-[0_0_15px_rgba(59,130,246,0.15)]", iconBg: "bg-blue-900/40" },
  { key: "policy", label: "Policy", icon: "🏛️", color: "border-purple-800/40", activeColor: "border-purple-500 bg-purple-950/40 shadow-[0_0_15px_rgba(168,85,247,0.15)]", iconBg: "bg-purple-900/40" },
  { key: "earnings", label: "Earnings", icon: "💰", color: "border-yellow-800/40", activeColor: "border-yellow-500 bg-yellow-950/40 shadow-[0_0_15px_rgba(234,179,8,0.15)]", iconBg: "bg-yellow-900/40" },
  { key: "product", label: "Product & Tech", icon: "🔧", color: "border-cyan-800/40", activeColor: "border-cyan-500 bg-cyan-950/40 shadow-[0_0_15px_rgba(6,182,212,0.15)]", iconBg: "bg-cyan-900/40" },
  { key: "competition", label: "Competition", icon: "⚔️", color: "border-orange-800/40", activeColor: "border-orange-500 bg-orange-950/40 shadow-[0_0_15px_rgba(249,115,22,0.15)]", iconBg: "bg-orange-900/40" },
  { key: "management", label: "Management", icon: "👔", color: "border-emerald-800/40", activeColor: "border-emerald-500 bg-emerald-950/40 shadow-[0_0_15px_rgba(16,185,129,0.15)]", iconBg: "bg-emerald-900/40" },
];

interface Props {
  news: NewsItem[];
  selectedCategory: NewsCategory | null;
  onCategorySelect: (cat: NewsCategory | null) => void;
  sentimentFilter: "all" | "positive" | "negative";
  onSentimentFilter: (f: "all" | "positive" | "negative") => void;
}

export default function CategoryFilter({
  news,
  selectedCategory,
  onCategorySelect,
  sentimentFilter,
  onSentimentFilter,
}: Props) {
  const categoryCounts = CATEGORIES.map((cat) => ({
    ...cat,
    count: news.filter((n) => n.category === cat.key).length,
  }));

  const filteredByCategory = selectedCategory
    ? news.filter((n) => n.category === selectedCategory)
    : news;

  const allCount = filteredByCategory.length;
  const positiveCount = filteredByCategory.filter(
    (n) => n.sentiment === "positive"
  ).length;
  const negativeCount = filteredByCategory.filter(
    (n) => n.sentiment === "negative"
  ).length;

  return (
    <div>
      <div className="grid grid-cols-3 gap-2.5 mb-4">
        {categoryCounts.map((cat, i) => (
          <button
            key={cat.key}
            onClick={() =>
              onCategorySelect(
                selectedCategory === cat.key ? null : cat.key
              )
            }
            className={`flex items-center gap-2.5 px-3.5 py-3 rounded-xl text-sm transition-all duration-200 border backdrop-blur-sm animate-fade-in-up ${
              selectedCategory === cat.key
                ? cat.activeColor + " text-white"
                : "bg-gray-800/40 " + cat.color + " text-gray-300 hover:bg-gray-800/60 hover:border-gray-600"
            }`}
            style={{ animationDelay: `${i * 50}ms` }}
          >
            <span className={`text-lg w-8 h-8 flex items-center justify-center rounded-lg ${cat.iconBg}`}>{cat.icon}</span>
            <div className="flex flex-col items-start min-w-0">
              <span className="font-medium text-xs leading-tight">{cat.label}</span>
              <span className={`text-lg font-bold leading-tight tabular-nums ${cat.count > 0 ? "text-cyan-400" : "text-gray-600"}`}>
                {cat.count}
              </span>
            </div>
          </button>
        ))}
      </div>
      <div className="flex gap-2 mb-3">
        <button
          onClick={() => onSentimentFilter("all")}
          className={`px-4 py-1.5 text-xs rounded-full transition-all duration-200 font-medium ${
            sentimentFilter === "all"
              ? "bg-gray-600 text-white shadow-sm"
              : "bg-gray-800/50 text-gray-400 hover:bg-gray-700/60"
          }`}
        >
          All {allCount}
        </button>
        <button
          onClick={() => onSentimentFilter("positive")}
          className={`px-4 py-1.5 text-xs rounded-full transition-all duration-200 font-medium ${
            sentimentFilter === "positive"
              ? "bg-green-900/60 text-green-400 border border-green-500/60 shadow-[0_0_10px_rgba(34,197,94,0.15)]"
              : "bg-gray-800/50 text-gray-400 hover:bg-gray-700/60"
          }`}
        >
          ▲ Bullish {positiveCount}
        </button>
        <button
          onClick={() => onSentimentFilter("negative")}
          className={`px-4 py-1.5 text-xs rounded-full transition-all duration-200 font-medium ${
            sentimentFilter === "negative"
              ? "bg-red-900/60 text-red-400 border border-red-500/60 shadow-[0_0_10px_rgba(239,68,68,0.15)]"
              : "bg-gray-800/50 text-gray-400 hover:bg-gray-700/60"
          }`}
        >
          ▼ Bearish {negativeCount}
        </button>
      </div>
    </div>
  );
}
