"use client";

import type { NewsCategory, NewsItem } from "@/types";

const CATEGORIES: {
  key: NewsCategory;
  label: string;
  icon: string;
  gradient: string;
  activeBorder: string;
}[] = [
  { key: "market", label: "Market", icon: "📊", gradient: "from-blue-500/20 to-blue-600/5", activeBorder: "border-blue-500/60 shadow-[0_0_15px_rgba(59,130,246,0.15)]" },
  { key: "policy", label: "Policy", icon: "🏛️", gradient: "from-violet-500/20 to-violet-600/5", activeBorder: "border-violet-500/60 shadow-[0_0_15px_rgba(139,92,246,0.15)]" },
  { key: "earnings", label: "Earnings", icon: "💰", gradient: "from-amber-500/20 to-amber-600/5", activeBorder: "border-amber-500/60 shadow-[0_0_15px_rgba(245,158,11,0.15)]" },
  { key: "product", label: "Product & Tech", icon: "🔧", gradient: "from-cyan-500/20 to-cyan-600/5", activeBorder: "border-cyan-500/60 shadow-[0_0_15px_rgba(6,182,212,0.15)]" },
  { key: "competition", label: "Competition", icon: "⚔️", gradient: "from-orange-500/20 to-orange-600/5", activeBorder: "border-orange-500/60 shadow-[0_0_15px_rgba(249,115,22,0.15)]" },
  { key: "management", label: "Management", icon: "👔", gradient: "from-emerald-500/20 to-emerald-600/5", activeBorder: "border-emerald-500/60 shadow-[0_0_15px_rgba(16,185,129,0.15)]" },
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
        {categoryCounts.map((cat, i) => {
          const isActive = selectedCategory === cat.key;
          return (
            <button
              key={cat.key}
              onClick={() =>
                onCategorySelect(isActive ? null : cat.key)
              }
              className={`flex items-center gap-2.5 px-3.5 py-3 rounded-xl text-sm transition-all duration-200 border animate-fade-in-up ${
                isActive
                  ? `bg-gradient-to-br ${cat.gradient} ${cat.activeBorder} text-white`
                  : "bg-[#162036]/70 border-[rgba(99,132,199,0.12)] text-blue-100/70 hover:bg-[#1c2a46] hover:border-[rgba(99,132,199,0.25)]"
              }`}
              style={{ animationDelay: `${i * 50}ms` }}
            >
              <span className="text-lg w-8 h-8 flex items-center justify-center rounded-lg bg-white/5">{cat.icon}</span>
              <div className="flex flex-col items-start min-w-0">
                <span className="font-medium text-xs leading-tight">{cat.label}</span>
                <span className={`text-lg font-bold leading-tight tabular-nums ${cat.count > 0 ? "text-blue-300" : "text-blue-300/20"}`}>
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
              ? "bg-blue-600/30 text-blue-300 border border-blue-500/40"
              : "bg-[#162036]/50 text-blue-200/40 hover:text-blue-200/70 hover:bg-[#1c2a46]"
          }`}
        >
          All {allCount}
        </button>
        <button
          onClick={() => onSentimentFilter("positive")}
          className={`px-4 py-1.5 text-xs rounded-full transition-all duration-200 font-medium ${
            sentimentFilter === "positive"
              ? "bg-green-500/15 text-green-400 border border-green-500/40 shadow-[0_0_10px_rgba(34,197,94,0.1)]"
              : "bg-[#162036]/50 text-blue-200/40 hover:text-green-300/70 hover:bg-[#1c2a46]"
          }`}
        >
          ▲ Bullish {positiveCount}
        </button>
        <button
          onClick={() => onSentimentFilter("negative")}
          className={`px-4 py-1.5 text-xs rounded-full transition-all duration-200 font-medium ${
            sentimentFilter === "negative"
              ? "bg-red-500/15 text-red-400 border border-red-500/40 shadow-[0_0_10px_rgba(239,68,68,0.1)]"
              : "bg-[#162036]/50 text-blue-200/40 hover:text-red-300/70 hover:bg-[#1c2a46]"
          }`}
        >
          ▼ Bearish {negativeCount}
        </button>
      </div>
    </div>
  );
}
