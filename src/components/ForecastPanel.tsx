"use client";

import type { ForecastResult } from "@/types";

interface Props {
  forecast: ForecastResult | null;
  period: "7d" | "30d";
  onPeriodChange: (p: "7d" | "30d") => void;
  loading: boolean;
}

export default function ForecastPanel({ forecast, period, onPeriodChange, loading }: Props) {
  if (loading) {
    return (
      <div className="space-y-4 animate-fade-in">
        <div className="h-4 bg-slate-100 rounded w-1/3 shimmer" />
        <div className="h-24 bg-slate-100 rounded-xl shimmer" />
        <div className="h-16 bg-slate-100 rounded-xl shimmer" />
        <div className="h-4 bg-slate-100 rounded w-2/3 shimmer" />
      </div>
    );
  }

  if (!forecast) return null;

  const isUp = forecast.direction === "up";

  return (
    <div className="space-y-5 animate-fade-in-up">
      {/* Period Toggle */}
      <div className="flex items-center gap-3">
        <span className="text-slate-400 text-xs font-semibold tracking-widest uppercase">Forecast</span>
        <div className="flex gap-1 bg-slate-100 rounded-full p-0.5">
          {(["7d", "30d"] as const).map((p) => (
            <button
              key={p}
              onClick={() => onPeriodChange(p)}
              className={`px-3 py-1 text-xs rounded-full transition-all duration-200 font-medium ${
                period === p ? "bg-blue-500 text-white shadow-sm" : "text-slate-400 hover:text-slate-600"
              }`}
            >
              {p.toUpperCase()}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-1.5 ml-auto">
          <span className={`text-sm font-bold ${isUp ? "text-emerald-600" : "text-red-600"}`}>
            {isUp ? "↑ UP" : "↓ DOWN"}
          </span>
          <div className="flex gap-0.5 ml-1">
            {[40, 60, 75].map((threshold) => (
              <div key={threshold} className={`w-5 h-1.5 rounded-full transition-all ${
                forecast.confidence > threshold
                  ? isUp ? "bg-emerald-500" : "bg-red-500"
                  : "bg-slate-200"
              }`} />
            ))}
          </div>
        </div>
      </div>

      {/* AI Forecast Badge */}
      <div className={`rounded-xl p-4 border ${
        isUp
          ? "bg-gradient-to-br from-emerald-50 to-white border-emerald-200"
          : "bg-gradient-to-br from-red-50 to-white border-red-200"
      }`}>
        <div className="flex items-center justify-between">
          <div>
            <div className="text-slate-400 text-[10px] mb-1 tracking-widest font-medium">AI FORECAST</div>
            <div className="flex items-center gap-2">
              <span className={`text-2xl ${isUp ? "text-emerald-500" : "text-red-500"}`}>
                {isUp ? "↑" : "↓"}
              </span>
              <span className={`text-xl font-bold ${isUp ? "gradient-text-bullish" : "gradient-text-bearish"}`}>
                {forecast.label}
              </span>
            </div>
          </div>
          <div className={`text-4xl font-bold tabular-nums ${isUp ? "text-emerald-500" : "text-red-500"}`}>
            {forecast.confidence}%
          </div>
        </div>
      </div>

      {/* Analysis Text */}
      <div className="bg-white/80 border border-slate-200/60 rounded-xl p-3.5">
        <div className="text-slate-400 text-xs font-semibold mb-2 tracking-widest uppercase">Analysis</div>
        <p className="text-slate-600 text-xs leading-relaxed">
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
            <div key={label} className={`border rounded-xl p-3 transition-all duration-200 ${
              predUp
                ? "border-emerald-200 bg-emerald-50/50 hover:border-emerald-300"
                : "border-red-200 bg-red-50/50 hover:border-red-300"
            }`}>
              <div className="text-slate-400 text-[10px] tracking-wider mb-1">{label}</div>
              <div className="flex items-center justify-between">
                <span className={`text-sm font-bold ${predUp ? "text-emerald-600" : "text-red-600"}`}>
                  {predUp ? "↑ UP" : "↓ DOWN"}
                </span>
                <span className={`text-lg font-bold tabular-nums ${predUp ? "text-emerald-600" : "text-red-600"}`}>
                  {pred.confidence}%
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Key Topics */}
      <div>
        <div className="text-slate-400 text-xs font-semibold mb-2.5 tracking-widest uppercase">Key Topics</div>
        <div className="flex flex-wrap gap-2">
          {forecast.keyTopics.map((topic, i) => (
            <span
              key={topic}
              className="bg-slate-50 text-slate-600 text-[11px] px-3 py-1.5 rounded-full border border-slate-200 transition-all duration-200 hover:border-blue-300 hover:text-blue-600 hover:bg-blue-50 cursor-default animate-fade-in"
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
