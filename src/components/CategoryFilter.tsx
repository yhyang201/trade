"use client";

import type { NewsCategory, NewsItem } from "@/types";

const CATEGORIES: {
  key: NewsCategory;
  label: string;
  icon: string;
}[] = [
  { key: "market", label: "Market", icon: "📊" },
  { key: "policy", label: "Policy", icon: "🏛" },
  { key: "earnings", label: "Earnings", icon: "💰" },
  { key: "product", label: "Product & Tech", icon: "🔧" },
  { key: "competition", label: "Competition", icon: "⚔" },
  { key: "management", label: "Management", icon: "👔" },
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
      <div className="grid grid-cols-2 gap-2 mb-3 stagger-children">
        {categoryCounts.map((cat) => (
          <button
            key={cat.key}
            onClick={() =>
              onCategorySelect(
                selectedCategory === cat.key ? null : cat.key
              )
            }
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs transition-smooth border animate-fade-in-up ${
              selectedCategory === cat.key
                ? "bg-blue-900/50 border-blue-500/70 text-blue-300 shadow-[0_0_12px_rgba(59,130,246,0.15)]"
                : "glass-card text-gray-300 hover:border-gray-500"
            }`}
          >
            <span className="text-sm">{cat.icon}</span>
            <span className="font-medium">{cat.label}</span>
            <span className={`ml-auto tabular-nums ${cat.count > 0 ? "text-cyan-400" : "text-gray-600"}`}>{cat.count}</span>
          </button>
        ))}
      </div>
      <div className="flex gap-2 mb-3">
        <button
          onClick={() => onSentimentFilter("all")}
          className={`px-3 py-1 text-xs rounded-full transition-smooth ${
            sentimentFilter === "all"
              ? "bg-gray-600 text-white shadow-sm"
              : "bg-gray-800/60 text-gray-400 hover:bg-gray-700"
          }`}
        >
          All {allCount}
        </button>
        <button
          onClick={() => onSentimentFilter("positive")}
          className={`px-3 py-1 text-xs rounded-full transition-smooth ${
            sentimentFilter === "positive"
              ? "bg-green-900/50 text-green-400 border border-green-600 shadow-[0_0_8px_rgba(34,197,94,0.2)]"
              : "bg-gray-800/60 text-gray-400 hover:bg-gray-700"
          }`}
        >
          ▲ Bullish {positiveCount}
        </button>
        <button
          onClick={() => onSentimentFilter("negative")}
          className={`px-3 py-1 text-xs rounded-full transition-smooth ${
            sentimentFilter === "negative"
              ? "bg-red-900/50 text-red-400 border border-red-600 shadow-[0_0_8px_rgba(239,68,68,0.2)]"
              : "bg-gray-800/60 text-gray-400 hover:bg-gray-700"
          }`}
        >
          ▼ Bearish {negativeCount}
        </button>
      </div>
    </div>
  );
}
