"use client";

import type { NewsItem } from "@/types";

interface Props {
  news: NewsItem[];
  selectedDate: string | null;
  onFindSimilar: (newsItem: NewsItem) => void;
}

export default function NewsList({ news, selectedDate, onFindSimilar }: Props) {
  const filteredNews = selectedDate
    ? news.filter((n) => n.date === selectedDate)
    : news.slice(-20);

  const displayDate = selectedDate || (filteredNews[0]?.date ?? "");
  const articleCount = filteredNews.length;

  if (filteredNews.length === 0) {
    return (
      <div className="text-gray-500 text-xs py-8 text-center animate-fade-in">
        Click on the chart to see news for a specific date
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <div className="flex items-center gap-2.5 mb-3">
        <span className="text-gray-400 text-xs font-semibold tracking-widest uppercase">News</span>
        <span className="bg-cyan-900/30 text-cyan-400 text-xs px-3 py-0.5 rounded-full border border-cyan-700/30 font-mono">
          {displayDate}
        </span>
        <span className="text-gray-500 text-xs tabular-nums">
          {articleCount} articles
        </span>
        <span className="ml-auto text-gray-500 text-[10px] border border-gray-700/40 px-2.5 py-0.5 rounded-full bg-gray-800/30">
          Locked
        </span>
      </div>
      <div className="space-y-2.5 max-h-[400px] overflow-y-auto pr-1 custom-scrollbar">
        {filteredNews.map((item, idx) => (
          <NewsCard
            key={item.id}
            item={item}
            index={idx}
            onFindSimilar={() => onFindSimilar(item)}
          />
        ))}
      </div>
    </div>
  );
}

function NewsCard({
  item,
  index,
  onFindSimilar,
}: {
  item: NewsItem;
  index: number;
  onFindSimilar: () => void;
}) {
  const isPositive = item.sentiment === "positive";
  const isNegative = item.sentiment === "negative";

  return (
    <div
      className={`border rounded-xl p-3.5 transition-all duration-200 animate-fade-in-up hover:translate-y-[-1px] ${
        isPositive
          ? "border-green-800/30 bg-gradient-to-r from-green-950/30 to-transparent hover:border-green-700/50 hover:shadow-[0_4px_20px_rgba(34,197,94,0.08)]"
          : isNegative
            ? "border-red-800/30 bg-gradient-to-r from-red-950/30 to-transparent hover:border-red-700/50 hover:shadow-[0_4px_20px_rgba(239,68,68,0.08)]"
            : "border-gray-700/30 bg-gray-800/20 hover:border-gray-600/50 hover:shadow-[0_4px_20px_rgba(255,255,255,0.03)]"
      }`}
      style={{ animationDelay: `${Math.min(index * 50, 300)}ms` }}
    >
      <div className="flex items-start gap-2.5">
        <span
          className={`w-2.5 h-2.5 rounded-full mt-1 flex-shrink-0 ${
            isPositive
              ? "bg-green-400 shadow-[0_0_6px_rgba(34,197,94,0.5)]"
              : isNegative
                ? "bg-red-400 shadow-[0_0_6px_rgba(239,68,68,0.5)]"
                : "bg-yellow-400 shadow-[0_0_6px_rgba(234,179,8,0.5)]"
          }`}
        />
        <div className="flex-1 min-w-0">
          <h4 className="text-white text-xs font-medium leading-snug mb-1.5">
            {item.title}
          </h4>
          <p className="text-gray-400 text-[11px] mb-2 leading-relaxed">
            {item.summary}
          </p>
          {item.bullets.length > 0 && (
            <ul className="space-y-1 mb-2.5">
              {item.bullets.map((b, i) => (
                <li key={i} className="text-[11px] text-gray-400 flex items-start gap-1.5">
                  <span className={`mt-0.5 ${isPositive ? "text-green-500" : isNegative ? "text-red-500" : "text-yellow-500"}`}>
                    {isPositive ? "+" : isNegative ? "-" : "~"}
                  </span>
                  {b}
                </li>
              ))}
            </ul>
          )}
          <div className="flex items-center gap-3 text-[10px]">
            <span className="text-gray-500">{item.source}</span>
            <span
              className={`font-medium tabular-nums ${
                item.returnT1 >= 0 ? "text-green-400" : "text-red-400"
              }`}
            >
              T+1 {item.returnT1 > 0 ? "+" : ""}
              {item.returnT1}%
            </span>
            <span
              className={`font-medium tabular-nums ${
                item.returnT5 >= 0 ? "text-green-400" : "text-red-400"
              }`}
            >
              T+5 {item.returnT5 > 0 ? "+" : ""}
              {item.returnT5}%
            </span>
            <button
              onClick={onFindSimilar}
              className="ml-auto text-cyan-500 hover:text-cyan-300 transition-all duration-200 hover:drop-shadow-[0_0_6px_rgba(34,211,238,0.5)] font-medium"
            >
              Find Similar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
