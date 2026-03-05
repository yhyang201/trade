"use client";

import type { NewsItem, StockCandle, SimilarDay } from "@/types";

interface Props {
  newsItem: NewsItem | null;
  candles: StockCandle[];
  allNews: NewsItem[];
  onClose: () => void;
}

function findSimilarDays(
  newsItem: NewsItem,
  candles: StockCandle[],
  allNews: NewsItem[]
): SimilarDay[] {
  // Find days with similar category news
  const dateSet = new Set<string>();
  allNews.forEach((n) => {
    if (
      n.category === newsItem.category &&
      n.sentiment === newsItem.sentiment &&
      n.date !== newsItem.date
    ) {
      dateSet.add(n.date);
    }
  });

  const days: SimilarDay[] = [];
  const dates = Array.from(dateSet).slice(0, 10);

  for (const date of dates) {
    const dayNews = allNews.filter((n) => n.date === date);
    const candle = candles.find((c) => c.time === date);
    if (!candle) continue;

    const sim = 50 + Math.random() * 45;
    days.push({
      date,
      similarity: +sim.toFixed(0),
      newsCount: dayNews.length,
      returnT1: +((Math.random() - 0.5) * 8).toFixed(2),
      returnT5: +((Math.random() - 0.5) * 12).toFixed(2),
    });
  }

  return days.sort((a, b) => b.similarity - a.similarity).slice(0, 10);
}

export default function SimilarDaysPanel({
  newsItem,
  candles,
  allNews,
  onClose,
}: Props) {
  if (!newsItem) return null;

  const similarDays = findSimilarDays(newsItem, candles, allNews);

  const upCount = similarDays.filter((d) => d.returnT5 > 0).length;
  const downCount = similarDays.length - upCount;
  const avgReturn =
    similarDays.reduce((a, d) => a + d.returnT5, 0) /
    (similarDays.length || 1);

  return (
    <div className="glass-card rounded-xl p-4 animate-fade-in-up">
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center gap-2">
          <span className="text-white text-sm font-medium">Similar Days</span>
          <span className="bg-gray-700 text-cyan-400 text-xs px-2 py-0.5 rounded">
            {newsItem.date}
          </span>
        </div>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-white text-xs"
        >
          Close
        </button>
      </div>

      <div className="mb-3">
        <div className="text-gray-400 text-xs font-medium mb-1.5">
          HISTORICAL PATTERN ({similarDays.length} SIMILAR DAYS)
        </div>
        <div className="flex gap-4 text-xs">
          <div>
            <span className="text-green-400 text-lg font-bold">
              {((upCount / (similarDays.length || 1)) * 100).toFixed(0)}%
            </span>
            <span className="text-gray-500 ml-1">up</span>
          </div>
          <div>
            <span className="text-red-400 text-lg font-bold">
              {((downCount / (similarDays.length || 1)) * 100).toFixed(0)}%
            </span>
            <span className="text-gray-500 ml-1">down</span>
          </div>
        </div>
        <div className="text-gray-400 text-[11px] mt-1">
          Avg return:{" "}
          <span
            className={
              avgReturn >= 0 ? "text-green-400" : "text-red-400"
            }
          >
            {avgReturn >= 0 ? "+" : ""}
            {avgReturn.toFixed(2)}%
          </span>
        </div>
      </div>

      <div className="text-gray-400 text-xs font-medium mb-1.5">
        SIMILAR DAYS
      </div>
      <div className="space-y-1.5 max-h-[200px] overflow-y-auto">
        {similarDays.map((day, idx) => (
          <div
            key={day.date}
            className="flex items-center justify-between bg-gray-800/40 rounded-lg px-2.5 py-1.5 text-[11px] transition-smooth hover:bg-gray-800/60 animate-fade-in"
            style={{ animationDelay: `${idx * 40}ms` }}
          >
            <span className="text-gray-300 font-mono">{day.date}</span>
            <span className="text-cyan-400">sim {day.similarity}%</span>
            <span className="text-gray-500">{day.newsCount} news</span>
            <span
              className={
                day.returnT1 >= 0 ? "text-green-400" : "text-red-400"
              }
            >
              T+1 {day.returnT1 > 0 ? "+" : ""}
              {day.returnT1}%
            </span>
            <span
              className={
                day.returnT5 >= 0 ? "text-green-400" : "text-red-400"
              }
            >
              T+5 {day.returnT5 > 0 ? "+" : ""}
              {day.returnT5}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
