"use client";

import type { NewsItem } from "@/types";

interface Props {
  news: NewsItem[];
  selectedDate: string | null;
  onFindSimilar: (newsItem: NewsItem) => void;
}

export default function NewsList({ news, selectedDate, onFindSimilar }: Props) {
  const filteredNews = selectedDate ? news.filter((n) => n.date === selectedDate) : news.slice(-20);
  const displayDate = selectedDate || (filteredNews[0]?.date ?? "");
  const articleCount = filteredNews.length;

  if (filteredNews.length === 0) {
    return (
      <div className="text-slate-400 text-xs py-8 text-center animate-fade-in">
        Click on the chart to see news for a specific date
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <div className="flex items-center gap-2.5 mb-3">
        <span className="text-slate-500 text-xs font-semibold tracking-widest uppercase">News</span>
        <span className="bg-blue-50 text-blue-600 text-xs px-3 py-0.5 rounded-full border border-blue-200 font-mono">
          {displayDate}
        </span>
        <span className="text-slate-400 text-xs tabular-nums">{articleCount} articles</span>
      </div>
      <div className="space-y-2.5 max-h-[400px] overflow-y-auto pr-1 custom-scrollbar">
        {filteredNews.map((item, idx) => (
          <NewsCard key={item.id} item={item} index={idx} onFindSimilar={() => onFindSimilar(item)} />
        ))}
      </div>
    </div>
  );
}

function NewsCard({ item, index, onFindSimilar }: { item: NewsItem; index: number; onFindSimilar: () => void }) {
  const isPositive = item.sentiment === "positive";
  const isNegative = item.sentiment === "negative";

  return (
    <div
      className={`border rounded-xl p-3.5 transition-all duration-200 animate-fade-in-up hover:translate-y-[-1px] hover:shadow-md ${
        isPositive
          ? "border-emerald-200/80 bg-emerald-50/40 hover:border-emerald-300"
          : isNegative
            ? "border-red-200/80 bg-red-50/40 hover:border-red-300"
            : "border-slate-200/80 bg-white/60 hover:border-slate-300"
      }`}
      style={{ animationDelay: `${Math.min(index * 50, 300)}ms` }}
    >
      <div className="flex items-start gap-2.5">
        <span className={`w-2.5 h-2.5 rounded-full mt-1 flex-shrink-0 ${
          isPositive ? "bg-emerald-500" : isNegative ? "bg-red-500" : "bg-amber-400"
        }`} />
        <div className="flex-1 min-w-0">
          <h4 className="text-slate-800 text-xs font-medium leading-snug mb-1.5">{item.title}</h4>
          <p className="text-slate-500 text-[11px] mb-2 leading-relaxed">{item.summary}</p>
          {item.bullets.length > 0 && (
            <ul className="space-y-1 mb-2.5">
              {item.bullets.map((b, i) => (
                <li key={i} className="text-[11px] text-slate-500 flex items-start gap-1.5">
                  <span className={`mt-0.5 font-bold ${isPositive ? "text-emerald-500" : isNegative ? "text-red-500" : "text-amber-500"}`}>
                    {isPositive ? "+" : isNegative ? "-" : "~"}
                  </span>
                  {b}
                </li>
              ))}
            </ul>
          )}
          <div className="flex items-center gap-3 text-[10px]">
            <span className="text-slate-400">{item.source}</span>
            <span className={`font-semibold tabular-nums ${item.returnT1 >= 0 ? "text-emerald-600" : "text-red-600"}`}>
              T+1 {item.returnT1 > 0 ? "+" : ""}{item.returnT1}%
            </span>
            <span className={`font-semibold tabular-nums ${item.returnT5 >= 0 ? "text-emerald-600" : "text-red-600"}`}>
              T+5 {item.returnT5 > 0 ? "+" : ""}{item.returnT5}%
            </span>
            <button onClick={onFindSimilar} className="ml-auto text-blue-500 hover:text-blue-600 transition-colors font-semibold">
              Find Similar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
