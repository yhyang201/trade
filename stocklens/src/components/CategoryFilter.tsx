"use client";

import type { NewsCategory, NewsItem } from "@/types";

const CATEGORIES: {
  key: NewsCategory;
  label: string;
  icon: string;
}[] = [
  { key: "market", label: "市场影响", icon: "📊" },
  { key: "policy", label: "政策影响", icon: "🏛" },
  { key: "earnings", label: "业绩财报", icon: "💰" },
  { key: "product", label: "产品科技", icon: "🔧" },
  { key: "competition", label: "行业竞争", icon: "⚔" },
  { key: "management", label: "管理层变动", icon: "👔" },
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
      <div className="grid grid-cols-2 gap-2 mb-3">
        {categoryCounts.map((cat) => (
          <button
            key={cat.key}
            onClick={() =>
              onCategorySelect(
                selectedCategory === cat.key ? null : cat.key
              )
            }
            className={`flex items-center gap-2 px-3 py-2 rounded text-xs transition border ${
              selectedCategory === cat.key
                ? "bg-blue-900/50 border-blue-500 text-blue-300"
                : "bg-gray-800/50 border-gray-700 text-gray-300 hover:border-gray-500"
            }`}
          >
            <span>{cat.icon}</span>
            <span className="font-medium">{cat.label}</span>
            <span className="text-gray-500 ml-auto">{cat.count} 篇</span>
          </button>
        ))}
      </div>
      <div className="flex gap-2 mb-3">
        <button
          onClick={() => onSentimentFilter("all")}
          className={`px-3 py-1 text-xs rounded transition ${
            sentimentFilter === "all"
              ? "bg-gray-600 text-white"
              : "bg-gray-800 text-gray-400 hover:bg-gray-700"
          }`}
        >
          全部 {allCount}
        </button>
        <button
          onClick={() => onSentimentFilter("positive")}
          className={`px-3 py-1 text-xs rounded transition ${
            sentimentFilter === "positive"
              ? "bg-green-900/50 text-green-400 border border-green-600"
              : "bg-gray-800 text-gray-400 hover:bg-gray-700"
          }`}
        >
          ▲ 利好 {positiveCount}
        </button>
        <button
          onClick={() => onSentimentFilter("negative")}
          className={`px-3 py-1 text-xs rounded transition ${
            sentimentFilter === "negative"
              ? "bg-red-900/50 text-red-400 border border-red-600"
              : "bg-gray-800 text-gray-400 hover:bg-gray-700"
          }`}
        >
          ▼ 利空 {negativeCount}
        </button>
      </div>
    </div>
  );
}
