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
      <div className="animate-pulse space-y-3">
        <div className="h-4 bg-gray-700 rounded w-1/3" />
        <div className="h-20 bg-gray-700 rounded" />
        <div className="h-4 bg-gray-700 rounded w-2/3" />
      </div>
    );
  }

  if (!forecast) return null;

  return (
    <div className="space-y-4">
      {/* Period Toggle */}
      <div className="flex items-center gap-3">
        <span className="text-gray-400 text-xs font-medium">FORECAST</span>
        <div className="flex gap-1">
          <button
            onClick={() => onPeriodChange("7d")}
            className={`px-2 py-0.5 text-xs rounded transition ${
              period === "7d"
                ? "bg-blue-600 text-white"
                : "bg-gray-700 text-gray-400 hover:bg-gray-600"
            }`}
          >
            7D
          </button>
          <button
            onClick={() => onPeriodChange("30d")}
            className={`px-2 py-0.5 text-xs rounded transition ${
              period === "30d"
                ? "bg-blue-600 text-white"
                : "bg-gray-700 text-gray-400 hover:bg-gray-600"
            }`}
          >
            30D
          </button>
        </div>
        <div className="flex items-center gap-1 ml-auto">
          <span
            className={`text-sm font-bold ${
              forecast.direction === "up"
                ? "text-green-400"
                : "text-red-400"
            }`}
          >
            {forecast.direction === "up" ? "↑" : "↓"}{" "}
            {forecast.direction === "up" ? "UP" : "DOWN"}
          </span>
          <div className="flex gap-0.5 ml-1">
            <div
              className={`w-4 h-1.5 rounded-full ${
                forecast.direction === "up"
                  ? "bg-green-500"
                  : "bg-red-500"
              }`}
            />
            <div
              className={`w-4 h-1.5 rounded-full ${
                forecast.confidence > 60
                  ? forecast.direction === "up"
                    ? "bg-green-500"
                    : "bg-red-500"
                  : "bg-gray-600"
              }`}
            />
            <div
              className={`w-4 h-1.5 rounded-full ${
                forecast.confidence > 75
                  ? forecast.direction === "up"
                    ? "bg-green-500"
                    : "bg-red-500"
                  : "bg-gray-600"
              }`}
            />
          </div>
        </div>
      </div>

      {/* AI Forecast Badge */}
      <div className="flex items-center justify-between">
        <div>
          <div className="text-gray-500 text-[10px] mb-0.5">AI FORECAST:</div>
          <div className="flex items-center gap-2">
            <span
              className={`text-xl ${
                forecast.direction === "up"
                  ? "text-green-400"
                  : "text-red-400"
              }`}
            >
              {forecast.direction === "up" ? "↑" : "↓"}
            </span>
            <span
              className={`text-lg font-bold ${
                forecast.direction === "up"
                  ? "text-green-400"
                  : "text-red-400"
              }`}
            >
              {forecast.label}
            </span>
          </div>
        </div>
        <div
          className={`text-3xl font-bold ${
            forecast.direction === "up"
              ? "text-green-400"
              : "text-red-400"
          }`}
        >
          {forecast.confidence}%
        </div>
      </div>

      {/* Analysis Text */}
      <div>
        <div className="text-gray-400 text-xs font-medium mb-2">ANALYSIS</div>
        <p className="text-gray-300 text-[11px] leading-relaxed">
          <span className="text-yellow-500">● </span>
          {forecast.analysis}
        </p>
      </div>

      {/* T+1/T+3/T+5 predictions */}
      <div className="grid grid-cols-2 gap-2">
        {[forecast.t1, forecast.t5].map((pred, idx) => (
          <div
            key={idx}
            className={`border rounded p-2 ${
              pred.direction === "up"
                ? "border-green-800/50 bg-green-950/20"
                : "border-red-800/50 bg-red-950/20"
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-gray-400 text-[10px]">
                T+{idx === 0 ? 1 : 5}
              </span>
              <span
                className={`text-xs font-semibold ${
                  pred.direction === "up"
                    ? "text-green-400"
                    : "text-red-400"
                }`}
              >
                {pred.direction === "up" ? "↑ UP" : "↓ DOWN"}
              </span>
              <span
                className={`text-xs ${
                  pred.direction === "up"
                    ? "text-green-400"
                    : "text-red-400"
                }`}
              >
                {pred.confidence}%
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Key Topics */}
      <div>
        <div className="text-gray-400 text-xs font-medium mb-2">
          KEY TOPICS
        </div>
        <div className="flex flex-wrap gap-1.5">
          {forecast.keyTopics.map((topic) => (
            <span
              key={topic}
              className="bg-gray-800 text-gray-300 text-[10px] px-2 py-0.5 rounded"
            >
              {topic}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
