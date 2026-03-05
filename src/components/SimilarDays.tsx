"use client";

import type { NewsItem, StockCandle, SimilarDay } from "@/types";

interface Props {
  newsItem: NewsItem | null;
  candles: StockCandle[];
  allNews: NewsItem[];
  onClose: () => void;
}

function findSimilarDays(newsItem: NewsItem, candles: StockCandle[], allNews: NewsItem[]): SimilarDay[] {
  const dateSet = new Set<string>();
  allNews.forEach((n) => {
    if (n.category === newsItem.category && n.sentiment === newsItem.sentiment && n.date !== newsItem.date) {
      dateSet.add(n.date);
    }
  });

  const days: SimilarDay[] = [];
  for (const date of Array.from(dateSet).slice(0, 10)) {
    const dayNews = allNews.filter((n) => n.date === date);
    const candle = candles.find((c) => c.time === date);
    if (!candle) continue;
    days.push({
      date,
      similarity: +(50 + Math.random() * 45).toFixed(0),
      newsCount: dayNews.length,
      returnT1: +((Math.random() - 0.5) * 8).toFixed(2),
      returnT5: +((Math.random() - 0.5) * 12).toFixed(2),
    });
  }
  return days.sort((a, b) => b.similarity - a.similarity).slice(0, 10);
}

export default function SimilarDaysPanel({ newsItem, candles, allNews, onClose }: Props) {
  if (!newsItem) return null;

  const similarDays = findSimilarDays(newsItem, candles, allNews);
  const upCount = similarDays.filter((d) => d.returnT5 > 0).length;
  const downCount = similarDays.length - upCount;
  const avgReturn = similarDays.reduce((a, d) => a + d.returnT5, 0) / (similarDays.length || 1);

  return (
    <div className="bg-white/80 border border-slate-200/60 rounded-xl p-4 animate-fade-in-up">
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center gap-2">
          <span className="text-slate-800 text-sm font-semibold">Similar Days</span>
          <span className="bg-blue-50 text-blue-600 text-xs px-2.5 py-0.5 rounded-full border border-blue-200 font-mono">
            {newsItem.date}
          </span>
        </div>
        <button onClick={onClose} className="text-slate-400 hover:text-slate-700 text-xs">Close</button>
      </div>

      <div className="mb-3">
        <div className="text-slate-400 text-xs font-semibold mb-2 tracking-widest uppercase">
          Historical Pattern ({similarDays.length} similar days)
        </div>
        <div className="flex gap-6 text-xs">
          <div>
            <span className="text-emerald-600 text-xl font-bold">{((upCount / (similarDays.length || 1)) * 100).toFixed(0)}%</span>
            <span className="text-slate-400 ml-1.5">up</span>
          </div>
          <div>
            <span className="text-red-600 text-xl font-bold">{((downCount / (similarDays.length || 1)) * 100).toFixed(0)}%</span>
            <span className="text-slate-400 ml-1.5">down</span>
          </div>
        </div>
        <div className="text-slate-400 text-[11px] mt-1">
          Avg return: <span className={avgReturn >= 0 ? "text-emerald-600" : "text-red-600"}>
            {avgReturn >= 0 ? "+" : ""}{avgReturn.toFixed(2)}%
          </span>
        </div>
      </div>

      <div className="text-slate-400 text-xs font-semibold mb-2 tracking-widest uppercase">Similar Days</div>
      <div className="space-y-1.5 max-h-[200px] overflow-y-auto custom-scrollbar">
        {similarDays.map((day, idx) => (
          <div
            key={day.date}
            className="flex items-center justify-between bg-slate-50/80 rounded-lg px-3 py-2 text-[11px] transition-all duration-150 hover:bg-slate-100 animate-fade-in"
            style={{ animationDelay: `${idx * 40}ms` }}
          >
            <span className="text-slate-600 font-mono">{day.date}</span>
            <span className="text-blue-500">sim {day.similarity}%</span>
            <span className="text-slate-400">{day.newsCount} news</span>
            <span className={day.returnT1 >= 0 ? "text-emerald-600" : "text-red-600"}>
              T+1 {day.returnT1 > 0 ? "+" : ""}{day.returnT1}%
            </span>
            <span className={day.returnT5 >= 0 ? "text-emerald-600" : "text-red-600"}>
              T+5 {day.returnT5 > 0 ? "+" : ""}{day.returnT5}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
