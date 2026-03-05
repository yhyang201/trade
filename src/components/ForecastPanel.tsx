"use client";

import type { ForecastResult } from "@/types";

interface Props {
  forecast: ForecastResult | null;
  period: "7d" | "30d";
  onPeriodChange: (p: "7d" | "30d") => void;
  loading: boolean;
}

export default function ForecastPanel({
  forecast,
  period,
  onPeriodChange,
  loading,
}: Props) {
  if (loading) {
    return (
      <div className="space-y-4 animate-fade-in">
        <div className="h-4 bg-blue-800/15 rounded w-1/3 shimmer" />
        <div className="h-24 bg-blue-800/15 rounded-xl shimmer" />
        <div className="h-16 bg-blue-800/15 rounded-xl shimmer" />
        <div className="h-4 bg-blue-800/15 rounded w-2/3 shimmer" />
      </div>
    );
  }

  if (!forecast) return null;

  const isUp = forecast.direction === "up";

  return (
    <div className="space-y-5 animate-fade-in-up">
      {/* Period Toggle */}
      <div className="flex items-center gap-3">
        <span className="text-blue-300/50 text-xs font-semibold tracking-widest uppercase">Forecast</span>
        <div className="flex gap-1 bg-[#162036]/80 rounded-full p-0.5 border border-[rgba(99,132,199,0.1)]">
          <button
            onClick={() => onPeriodChange("7d")}
            className={`px-3 py-1 text-xs rounded-full transition-all duration-200 font-medium ${
              period === "7d"
                ? "bg-blue-600 text-white shadow-[0_0_10px_rgba(59,130,246,0.3)]"
                : "text-blue-300/40 hover:text-blue-200"
            }`}
          >
            7D
          </button>
          <button
            onClick={() => onPeriodChange("30d")}
            className={`px-3 py-1 text-xs rounded-full transition-all duration-200 font-medium ${
              period === "30d"
                ? "bg-blue-600 text-white shadow-[0_0_10px_rgba(59,130,246,0.3)]"
                : "text-blue-300/40 hover:text-blue-200"
            }`}
          >
            30D
          </button>
        </div>
        <div className="flex items-center gap-1.5 ml-auto">
          <span
            className={`text-sm font-bold ${isUp ? "text-green-400" : "text-red-400"}`}
          >
            {isUp ? "↑" : "↓"} {isUp ? "UP" : "DOWN"}
          </span>
          <div className="flex gap-0.5 ml-1">
            {[40, 60, 75].map((threshold) => (
              <div
                key={threshold}
                className={`w-5 h-1.5 rounded-full transition-all ${
                  forecast.confidence > threshold
                    ? isUp ? "bg-green-500 shadow-[0_0_4px_rgba(34,197,94,0.5)]" : "bg-red-500 shadow-[0_0_4px_rgba(239,68,68,0.5)]"
                    : "bg-blue-800/30"
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* AI Forecast Badge */}
      <div className={`rounded-xl p-4 border transition-all ${
        isUp
          ? "bg-gradient-to-br from-green-500/10 to-green-500/2 border-green-500/20"
          : "bg-gradient-to-br from-red-500/10 to-red-500/2 border-red-500/20"
      }`}>
        <div className="flex items-center justify-between">
          <div>
            <div className="text-blue-300/35 text-[10px] mb-1 tracking-widest font-medium">AI FORECAST</div>
            <div className="flex items-center gap-2">
              <span className={`text-2xl ${isUp ? "text-green-400" : "text-red-400"}`}>
                {isUp ? "↑" : "↓"}
              </span>
              <span className={`text-xl font-bold ${isUp ? "gradient-text-bullish" : "gradient-text-bearish"}`}>
                {forecast.label}
              </span>
            </div>
          </div>
          <div className={`text-4xl font-bold tabular-nums ${
            isUp
              ? "text-green-400 drop-shadow-[0_0_20px_rgba(34,197,94,0.35)]"
              : "text-red-400 drop-shadow-[0_0_20px_rgba(239,68,68,0.35)]"
          }`}>
            {forecast.confidence}%
          </div>
        </div>
      </div>

      {/* Analysis Text */}
      <div className="glass-card rounded-xl p-3.5">
        <div className="text-blue-300/45 text-xs font-semibold mb-2 tracking-widest uppercase">Analysis</div>
        <p className="text-slate-300/80 text-xs leading-relaxed">
          <span className="text-amber-500 mr-1">●</span>
          {forecast.analysis}
        </p>
      </div>

      {/* T+1/T+5 predictions */}
      <div className="grid grid-cols-2 gap-2.5">
        {[
          { pred: forecast.t1, label: "T+1" },
          { pred: forecast.t5, label: "T+5" },
        ].map(({ pred, label }) => {
          const predUp = pred.direction === "up";
          return (
            <div
              key={label}
              className={`border rounded-xl p-3 transition-all duration-200 ${
                predUp
                  ? "border-green-500/15 bg-gradient-to-b from-green-500/8 to-transparent hover:border-green-500/25"
                  : "border-red-500/15 bg-gradient-to-b from-red-500/8 to-transparent hover:border-red-500/25"
              }`}
            >
              <div className="text-blue-300/30 text-[10px] tracking-wider mb-1">{label}</div>
              <div className="flex items-center justify-between">
                <span
                  className={`text-sm font-bold ${predUp ? "text-green-400" : "text-red-400"}`}
                >
                  {predUp ? "↑ UP" : "↓ DOWN"}
                </span>
                <span
                  className={`text-lg font-bold tabular-nums ${predUp ? "text-green-400" : "text-red-400"}`}
                >
                  {pred.confidence}%
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Key Topics */}
      <div>
        <div className="text-blue-300/45 text-xs font-semibold mb-2.5 tracking-widest uppercase">
          Key Topics
        </div>
        <div className="flex flex-wrap gap-2">
          {forecast.keyTopics.map((topic, i) => (
            <span
              key={topic}
              className="bg-[#162036]/80 text-blue-200/60 text-[11px] px-3 py-1.5 rounded-full border border-[rgba(99,132,199,0.12)] transition-all duration-200 hover:border-blue-500/30 hover:text-blue-200 cursor-default animate-fade-in"
              style={{ animationDelay: `${i * 40}ms` }}
            >
              {topic}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
