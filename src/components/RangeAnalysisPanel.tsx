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
          <span className="text-white text-sm font-medium">Range Analysis</span>
          <button onClick={onClose} className="text-gray-500 hover:text-white text-xs">
            Close
          </button>
        </div>
        <div className="space-y-2">
          <div className="h-3 bg-gray-700/60 rounded w-2/3 shimmer" />
          <div className="h-3 bg-gray-700/60 rounded w-1/2 shimmer" />
          <div className="h-3 bg-gray-700/60 rounded w-3/4 shimmer" />
        </div>
      </div>
    );
  }

  if (!analysis) return null;

  return (
    <div className="glass-card rounded-xl p-4 animate-fade-in-up">
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center gap-2">
          <span className="text-white text-sm font-medium tracking-wide">
            Range Analysis
          </span>
          <span
            className={`text-sm font-bold ${
              analysis.percentChange >= 0
                ? "text-green-400"
                : "text-red-400"
            }`}
          >
            {analysis.percentChange >= 0 ? "+" : ""}
            {analysis.percentChange}%
          </span>
        </div>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-white text-xs"
        >
          Close
        </button>
      </div>

      <div className="text-gray-400 text-xs mb-1">{analysis.dateRange}</div>

      <p className="text-gray-300 text-xs mb-3 leading-relaxed">
        {analysis.summary}
      </p>

      {analysis.keyEvents.length > 0 && (
        <div className="mb-3">
          <div className="text-gray-400 text-xs font-medium mb-1.5">
            KEY EVENTS
          </div>
          <ul className="space-y-1">
            {analysis.keyEvents.map((e, i) => (
              <li key={i} className="text-gray-300 text-[11px] flex items-start gap-1">
                <span className="text-yellow-500">●</span> {e}
              </li>
            ))}
          </ul>
        </div>
      )}

      {analysis.bullishFactors.length > 0 && (
        <div className="mb-3">
          <div className="text-green-400 text-xs font-medium mb-1.5">
            BULLISH FACTORS
          </div>
          <ul className="space-y-1">
            {analysis.bullishFactors.map((f, i) => (
              <li key={i} className="text-gray-300 text-[11px] flex items-start gap-1">
                <span className="text-green-500">●</span> {f}
              </li>
            ))}
          </ul>
        </div>
      )}

      {analysis.bearishFactors.length > 0 && (
        <div>
          <div className="text-red-400 text-xs font-medium mb-1.5">
            BEARISH FACTORS
          </div>
          <ul className="space-y-1">
            {analysis.bearishFactors.map((f, i) => (
              <li key={i} className="text-gray-300 text-[11px] flex items-start gap-1">
                <span className="text-red-500">●</span> {f}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
