"use client";

import type { RangeAnalysis } from "@/types";

interface Props {
  analysis: RangeAnalysis | null;
  loading: boolean;
  onClose: () => void;
}

export default function RangeAnalysisPanel({ analysis, loading, onClose }: Props) {
  if (loading) {
    return (
      <div className="bg-white/80 border border-slate-200/60 rounded-xl p-4 animate-fade-in">
        <div className="flex justify-between items-center mb-3">
          <span className="text-slate-800 text-sm font-medium">Range Analysis</span>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 text-xs">Close</button>
        </div>
        <div className="space-y-2.5">
          <div className="h-3 bg-slate-100 rounded w-2/3 shimmer" />
          <div className="h-3 bg-slate-100 rounded w-1/2 shimmer" />
          <div className="h-3 bg-slate-100 rounded w-3/4 shimmer" />
        </div>
      </div>
    );
  }

  if (!analysis) return null;
  const isUp = analysis.percentChange >= 0;

  return (
    <div className="bg-white/80 border border-slate-200/60 rounded-xl p-4 animate-fade-in-up">
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center gap-2.5">
          <span className="text-slate-800 text-sm font-semibold">Range Analysis</span>
          <span className={`text-sm font-bold px-2 py-0.5 rounded-full ${
            isUp ? "text-emerald-600 bg-emerald-50" : "text-red-600 bg-red-50"
          }`}>
            {isUp ? "+" : ""}{analysis.percentChange}%
          </span>
        </div>
        <button onClick={onClose} className="text-slate-400 hover:text-slate-700 text-xs">Close</button>
      </div>
      <div className="text-blue-500 text-xs mb-2 font-mono">{analysis.dateRange}</div>
      <p className="text-slate-600 text-xs mb-4 leading-relaxed">{analysis.summary}</p>

      {analysis.keyEvents.length > 0 && (
        <div className="mb-4">
          <div className="text-slate-400 text-xs font-semibold mb-2 tracking-widest uppercase">Key Events</div>
          <ul className="space-y-1.5">
            {analysis.keyEvents.map((e, i) => (
              <li key={i} className="text-slate-600 text-[11px] flex items-start gap-2 animate-fade-in" style={{ animationDelay: `${i * 40}ms` }}>
                <span className="text-amber-500 mt-0.5">●</span> {e}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="grid grid-cols-2 gap-3">
        {analysis.bullishFactors.length > 0 && (
          <div>
            <div className="text-emerald-600 text-xs font-semibold mb-2">BULLISH</div>
            <ul className="space-y-1.5">
              {analysis.bullishFactors.map((f, i) => (
                <li key={i} className="text-slate-600 text-[11px] flex items-start gap-1.5">
                  <span className="text-emerald-500 mt-0.5">▲</span> {f}
                </li>
              ))}
            </ul>
          </div>
        )}
        {analysis.bearishFactors.length > 0 && (
          <div>
            <div className="text-red-600 text-xs font-semibold mb-2">BEARISH</div>
            <ul className="space-y-1.5">
              {analysis.bearishFactors.map((f, i) => (
                <li key={i} className="text-slate-600 text-[11px] flex items-start gap-1.5">
                  <span className="text-red-500 mt-0.5">▼</span> {f}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
