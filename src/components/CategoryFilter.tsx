"use client";

import type { NewsCategory, NewsItem } from "@/types";

const CATEGORIES: {
  key: NewsCategory;
  label: string;
  icon: string;
  color: string;
  activeBg: string;
  activeBorder: string;
}[] = [
  { key: "market", label: "Market", icon: "📊", color: "text-blue-600", activeBg: "bg-blue-50", activeBorder: "border-blue-300 shadow-blue-100" },
  { key: "policy", label: "Policy", icon: "🏛️", color: "text-violet-600", activeBg: "bg-violet-50", activeBorder: "border-violet-300 shadow-violet-100" },
  { key: "earnings", label: "Earnings", icon: "💰", color: "text-amber-600", activeBg: "bg-amber-50", activeBorder: "border-amber-300 shadow-amber-100" },
  { key: "product", label: "Product & Tech", icon: "🔧", color: "text-cyan-600", activeBg: "bg-cyan-50", activeBorder: "border-cyan-300 shadow-cyan-100" },
  { key: "competition", label: "Competition", icon: "⚔️", color: "text-orange-600", activeBg: "bg-orange-50", activeBorder: "border-orange-300 shadow-orange-100" },
  { key: "management", label: "Management", icon: "👔", color: "text-emerald-600", activeBg: "bg-emerald-50", activeBorder: "border-emerald-300 shadow-emerald-100" },
];

interface Props {
  news: NewsItem[];
  selectedCategory: NewsCategory | null;
  onCategorySelect: (cat: NewsCategory | null) => void;
  sentimentFilter: "all" | "positive" | "negative";
  onSentimentFilter: (f: "all" | "positive" | "negative") => void;
}

export default function CategoryFilter({
  news, selectedCategory, onCategorySelect, sentimentFilter, onSentimentFilter,
}: Props) {
  const categoryCounts = CATEGORIES.map((cat) => ({
    ...cat,
    count: news.filter((n) => n.category === cat.key).length,
  }));

  const filteredByCategory = selectedCategory
    ? news.filter((n) => n.category === selectedCategory)
    : news;

  const allCount = filteredByCategory.length;
  const positiveCount = filteredByCategory.filter((n) => n.sentiment === "positive").length;
  const negativeCount = filteredByCategory.filter((n) => n.sentiment === "negative").length;

  return (
    <div>
      <div className="grid grid-cols-3 gap-2.5 mb-4">
        {categoryCounts.map((cat, i) => {
          const isActive = selectedCategory === cat.key;
          return (
            <button
              key={cat.key}
              onClick={() => onCategorySelect(isActive ? null : cat.key)}
              className={`flex items-center gap-2.5 px-3.5 py-3 rounded-xl text-sm transition-all duration-200 border animate-fade-in-up ${
                isActive
                  ? `${cat.activeBg} ${cat.activeBorder} shadow-sm`
                  : "bg-white/60 border-slate-200/80 hover:bg-white hover:border-slate-300 hover:shadow-sm"
              }`}
              style={{ animationDelay: `${i * 50}ms` }}
            >
              <span className="text-lg w-8 h-8 flex items-center justify-center rounded-lg bg-slate-50">{cat.icon}</span>
              <div className="flex flex-col items-start min-w-0">
                <span className={`font-medium text-xs leading-tight ${isActive ? cat.color : "text-slate-600"}`}>{cat.label}</span>
                <span className={`text-lg font-bold leading-tight tabular-nums ${cat.count > 0 ? (isActive ? cat.color : "text-slate-800") : "text-slate-300"}`}>
                  {cat.count}
                </span>
              </div>
            </button>
          );
        })}
      </div>
      <div className="flex gap-2 mb-3">
        <button
          onClick={() => onSentimentFilter("all")}
          className={`px-4 py-1.5 text-xs rounded-full transition-all duration-200 font-medium ${
            sentimentFilter === "all"
              ? "bg-slate-800 text-white shadow-sm"
              : "bg-slate-100 text-slate-500 hover:bg-slate-200"
          }`}
        >
          All {allCount}
        </button>
        <button
          onClick={() => onSentimentFilter("positive")}
          className={`px-4 py-1.5 text-xs rounded-full transition-all duration-200 font-medium ${
            sentimentFilter === "positive"
              ? "bg-emerald-500 text-white shadow-sm shadow-emerald-200"
              : "bg-emerald-50 text-emerald-600 hover:bg-emerald-100"
          }`}
        >
          ▲ Bullish {positiveCount}
        </button>
        <button
          onClick={() => onSentimentFilter("negative")}
          className={`px-4 py-1.5 text-xs rounded-full transition-all duration-200 font-medium ${
            sentimentFilter === "negative"
              ? "bg-red-500 text-white shadow-sm shadow-red-200"
              : "bg-red-50 text-red-600 hover:bg-red-100"
          }`}
        >
          ▼ Bearish {negativeCount}
        </button>
      </div>
    </div>
  );
}
