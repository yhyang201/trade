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
        <div className="h-4 bg-gray-700/50 rounded w-1/3 shimmer" />
        <div className="h-24 bg-gray-700/50 rounded-xl shimmer" />
        <div className="h-16 bg-gray-700/50 rounded-xl shimmer" />
        <div className="h-4 bg-gray-700/50 rounded w-2/3 shimmer" />
      </div>
    );
  }

  if (!forecast) return null;

  const isUp = forecast.direction === "up";

  return (
    <div className="space-y-5 animate-fade-in-up">
      {/* Period Toggle */}
      <div className="flex items-center gap-3">
        <span className="text-gray-400 text-xs font-semibold tracking-widest uppercase">Forecast</span>
        <div className="flex gap-1 bg-gray-800/60 rounded-full p-0.5">
          <button
            onClick={() => onPeriodChange("7d")}
            className={`px-3 py-1 text-xs rounded-full transition-all duration-200 font-medium ${
              period === "7d"
                ? "bg-blue-600 text-white shadow-[0_0_10px_rgba(59,130,246,0.3)]"
                : "text-gray-400 hover:text-gray-200"
            }`}
          >
            7D
          </button>
          <button
            onClick={() => onPeriodChange("30d")}
            className={`px-3 py-1 text-xs rounded-full transition-all duration-200 font-medium ${
              period === "30d"
                ? "bg-blue-600 text-white shadow-[0_0_10px_rgba(59,130,246,0.3)]"
                : "text-gray-400 hover:text-gray-200"
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
                    : "bg-gray-700"
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* AI Forecast Badge */}
      <div className={`rounded-xl p-4 border transition-all ${
        isUp
          ? "bg-gradient-to-br from-green-950/40 to-green-950/10 border-green-800/40"
          : "bg-gradient-to-br from-red-950/40 to-red-950/10 border-red-800/40"
      }`}>
        <div className="flex items-center justify-between">
          <div>
            <div className="text-gray-500 text-[10px] mb-1 tracking-widest font-medium">AI FORECAST</div>
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
              ? "text-green-400 drop-shadow-[0_0_16px_rgba(34,197,94,0.4)]"
              : "text-red-400 drop-shadow-[0_0_16px_rgba(239,68,68,0.4)]"
          }`}>
            {forecast.confidence}%
          </div>
        </div>
      </div>

      {/* Analysis Text */}
      <div className="glass-card rounded-xl p-3.5">
        <div className="text-gray-400 text-xs font-semibold mb-2 tracking-widest uppercase">Analysis</div>
        <p className="text-gray-300 text-xs leading-relaxed">
          <span className="text-yellow-500 mr-1">●</span>
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
              className={`border rounded-xl p-3 transition-all duration-200 animate-fade-in-up ${
                predUp
                  ? "border-green-800/40 bg-gradient-to-b from-green-950/30 to-transparent hover:border-green-700/50"
                  : "border-red-800/40 bg-gradient-to-b from-red-950/30 to-transparent hover:border-red-700/50"
              }`}
            >
              <div className="text-gray-500 text-[10px] tracking-wider mb-1">{label}</div>
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
        <div className="text-gray-400 text-xs font-semibold mb-2.5 tracking-widest uppercase">
          Key Topics
        </div>
        <div className="flex flex-wrap gap-2">
          {forecast.keyTopics.map((topic, i) => (
            <span
              key={topic}
              className="bg-gray-800/50 text-gray-300 text-[11px] px-3 py-1.5 rounded-full border border-gray-700/40 transition-all duration-200 hover:border-cyan-600/50 hover:text-cyan-300 hover:bg-gray-800/80 animate-fade-in cursor-default"
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
