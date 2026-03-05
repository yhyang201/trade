"use client";

import type { RangeAnalysis } from "@/types";

interface Props {
  analysis: RangeAnalysis | null;
  loading: boolean;
  onClose: () => void;
}

export default function RangeAnalysisPanel({
  analysis,
  loading,
  onClose,
}: Props) {
  if (loading) {
    return (
      <div className="glass-card rounded-xl p-4 animate-fade-in">
        <div className="flex justify-between items-center mb-3">
          <span className="text-slate-200 text-sm font-medium">Range Analysis</span>
          <button onClick={onClose} className="text-blue-300/30 hover:text-white text-xs transition-colors">
            Close
          </button>
        </div>
        <div className="space-y-2.5">
          <div className="h-3 bg-blue-800/15 rounded w-2/3 shimmer" />
          <div className="h-3 bg-blue-800/15 rounded w-1/2 shimmer" />
          <div className="h-3 bg-blue-800/15 rounded w-3/4 shimmer" />
        </div>
      </div>
    );
  }

  if (!analysis) return null;

  const isUp = analysis.percentChange >= 0;

  return (
    <div className="glass-card rounded-xl p-4 animate-fade-in-up">
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center gap-2.5">
          <span className="text-slate-200 text-sm font-semibold tracking-wide">
            Range Analysis
          </span>
          <span
            className={`text-sm font-bold px-2 py-0.5 rounded-full ${
              isUp
                ? "text-green-400 bg-green-500/10"
                : "text-red-400 bg-red-500/10"
            }`}
          >
            {isUp ? "+" : ""}
            {analysis.percentChange}%
          </span>
        </div>
        <button
          onClick={onClose}
          className="text-blue-300/30 hover:text-white text-xs transition-colors"
        >
          Close
        </button>
      </div>

      <div className="text-blue-400/50 text-xs mb-2 font-mono">{analysis.dateRange}</div>

      <p className="text-slate-300/70 text-xs mb-4 leading-relaxed">
        {analysis.summary}
      </p>

      {analysis.keyEvents.length > 0 && (
        <div className="mb-4">
          <div className="text-blue-300/45 text-xs font-semibold mb-2 tracking-widest uppercase">
            Key Events
          </div>
          <ul className="space-y-1.5">
            {analysis.keyEvents.map((e, i) => (
              <li key={i} className="text-slate-300/70 text-[11px] flex items-start gap-2 animate-fade-in" style={{ animationDelay: `${i * 40}ms` }}>
                <span className="text-amber-500 mt-0.5">●</span> {e}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="grid grid-cols-2 gap-3">
        {analysis.bullishFactors.length > 0 && (
          <div>
            <div className="text-green-400 text-xs font-semibold mb-2 tracking-wider">
              BULLISH
            </div>
            <ul className="space-y-1.5">
              {analysis.bullishFactors.map((f, i) => (
                <li key={i} className="text-slate-300/70 text-[11px] flex items-start gap-1.5">
                  <span className="text-green-500 mt-0.5">▲</span> {f}
                </li>
              ))}
            </ul>
          </div>
        )}

        {analysis.bearishFactors.length > 0 && (
          <div>
            <div className="text-red-400 text-xs font-semibold mb-2 tracking-wider">
              BEARISH
            </div>
            <ul className="space-y-1.5">
              {analysis.bearishFactors.map((f, i) => (
                <li key={i} className="text-slate-300/70 text-[11px] flex items-start gap-1.5">
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
