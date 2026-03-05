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
      <div className="text-gray-500 text-xs py-4 text-center">
        Hover over the chart to see news for a specific date
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-gray-400 text-xs font-medium tracking-wider uppercase">News</span>
        <span className="bg-cyan-900/30 text-cyan-400 text-xs px-2.5 py-0.5 rounded-full border border-cyan-800/30">
          {displayDate}
        </span>
        <span className="text-gray-500 text-xs tabular-nums">
          {articleCount} articles
        </span>
        <span className="ml-auto text-gray-600 text-xs border border-gray-700/50 px-2 py-0.5 rounded-full">
          Locked
        </span>
      </div>
      <div className="space-y-2.5 max-h-[350px] overflow-y-auto pr-1 custom-scrollbar stagger-children">
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
  return (
    <div
      className={`border rounded-lg p-3 transition-smooth animate-fade-in-up hover:translate-y-[-1px] hover:shadow-lg ${
        item.sentiment === "positive"
          ? "border-green-800/40 bg-green-950/20 hover:border-green-700/60 hover:shadow-green-900/10"
          : item.sentiment === "negative"
            ? "border-red-800/40 bg-red-950/20 hover:border-red-700/60 hover:shadow-red-900/10"
            : "border-gray-700/50 bg-gray-800/30 hover:border-gray-600/60"
      }`}
      style={{ animationDelay: `${Math.min(index * 50, 300)}ms` }}
    >
      <div className="flex items-start gap-2">
        <span
          className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${
            item.sentiment === "positive"
              ? "bg-green-400"
              : item.sentiment === "negative"
                ? "bg-red-400"
                : "bg-yellow-400"
          }`}
        />
        <div className="flex-1 min-w-0">
          <h4 className="text-white text-xs font-medium leading-snug mb-1">
            {item.title}
          </h4>
          <p className="text-gray-400 text-[11px] mb-2 leading-relaxed">
            {item.summary}
          </p>
          <ul className="space-y-0.5 mb-2">
            {item.bullets.map((b, i) => (
              <li key={i} className="text-[11px] text-gray-500 flex items-start gap-1">
                <span
                  className={
                    item.sentiment === "positive"
                      ? "text-green-500"
                      : "text-red-500"
                  }
                >
                  +
                </span>
                {b}
              </li>
            ))}
          </ul>
          <div className="flex items-center gap-3 text-[10px]">
            <span className="text-gray-600">{item.source}</span>
            <span
              className={
                item.returnT1 >= 0 ? "text-green-400" : "text-red-400"
              }
            >
              T+1 {item.returnT1 > 0 ? "+" : ""}
              {item.returnT1}%
            </span>
            <span
              className={
                item.returnT5 >= 0 ? "text-green-400" : "text-red-400"
              }
            >
              T+5 {item.returnT5 > 0 ? "+" : ""}
              {item.returnT5}%
            </span>
            <button
              onClick={onFindSimilar}
              className="ml-auto text-cyan-500 hover:text-cyan-300 transition-smooth hover:drop-shadow-[0_0_4px_rgba(34,211,238,0.4)]"
            >
              Find Similar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
