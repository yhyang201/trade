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
      <div className="text-blue-300/40 text-xs py-8 text-center animate-fade-in">
        Click on the chart to see news for a specific date
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <div className="flex items-center gap-2.5 mb-3">
        <span className="text-blue-300/60 text-xs font-semibold tracking-widest uppercase">News</span>
        <span className="bg-blue-500/10 text-blue-400 text-xs px-3 py-0.5 rounded-full border border-blue-500/20 font-mono">
          {displayDate}
        </span>
        <span className="text-blue-300/30 text-xs tabular-nums">
          {articleCount} articles
        </span>
        <span className="ml-auto text-blue-300/20 text-[10px] border border-blue-800/20 px-2.5 py-0.5 rounded-full">
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
          ? "border-green-500/15 bg-gradient-to-r from-green-500/8 to-transparent hover:border-green-500/30"
          : isNegative
            ? "border-red-500/15 bg-gradient-to-r from-red-500/8 to-transparent hover:border-red-500/30"
            : "border-[rgba(99,132,199,0.1)] bg-[#162036]/40 hover:border-[rgba(99,132,199,0.2)]"
      } hover:shadow-lg hover:shadow-black/10`}
      style={{ animationDelay: `${Math.min(index * 50, 300)}ms` }}
    >
      <div className="flex items-start gap-2.5">
        <span
          className={`w-2.5 h-2.5 rounded-full mt-1 flex-shrink-0 ${
            isPositive
              ? "bg-green-400 shadow-[0_0_8px_rgba(34,197,94,0.5)]"
              : isNegative
                ? "bg-red-400 shadow-[0_0_8px_rgba(239,68,68,0.5)]"
                : "bg-amber-400 shadow-[0_0_8px_rgba(245,158,11,0.4)]"
          }`}
        />
        <div className="flex-1 min-w-0">
          <h4 className="text-slate-200 text-xs font-medium leading-snug mb-1.5">
            {item.title}
          </h4>
          <p className="text-blue-200/40 text-[11px] mb-2 leading-relaxed">
            {item.summary}
          </p>
          {item.bullets.length > 0 && (
            <ul className="space-y-1 mb-2.5">
              {item.bullets.map((b, i) => (
                <li key={i} className="text-[11px] text-blue-200/50 flex items-start gap-1.5">
                  <span className={`mt-0.5 ${isPositive ? "text-green-500" : isNegative ? "text-red-500" : "text-amber-500"}`}>
                    {isPositive ? "+" : isNegative ? "-" : "~"}
                  </span>
                  {b}
                </li>
              ))}
            </ul>
          )}
          <div className="flex items-center gap-3 text-[10px]">
            <span className="text-blue-300/25">{item.source}</span>
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
              className="ml-auto text-blue-400 hover:text-blue-300 transition-all duration-200 hover:drop-shadow-[0_0_6px_rgba(96,165,250,0.5)] font-medium"
            >
              Find Similar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
