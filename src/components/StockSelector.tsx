"use client";

import { useState, useRef, useEffect } from "react";
import { STOCK_SECTORS } from "@/lib/stocks";

interface Props {
  symbol: string;
  onSelect: (symbol: string) => void;
}

export default function StockSelector({ symbol, onSelect }: Props) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1 px-3 py-1.5 bg-gray-800 border border-gray-600 rounded text-white font-semibold text-sm hover:bg-gray-700 transition"
      >
        {symbol}
        <svg
          className={`w-3 h-3 transition-transform ${open ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>
      {open && (
        <div className="absolute top-full left-0 mt-1 bg-gray-900/95 backdrop-blur-xl border border-gray-700/60 rounded-xl shadow-2xl z-50 p-4 min-w-[500px] max-h-[400px] overflow-auto animate-fade-in-up">
          {STOCK_SECTORS.map((sector) => (
            <div key={sector.name} className="mb-3">
              <div className="text-xs text-emerald-400 font-semibold mb-1.5">
                {sector.name}
              </div>
              <div className="flex flex-wrap gap-1.5">
                {sector.stocks.map((stock) => (
                  <button
                    key={stock.symbol}
                    onClick={() => {
                      onSelect(stock.symbol);
                      setOpen(false);
                    }}
                    className={`px-2.5 py-1 text-xs rounded transition ${
                      stock.symbol === symbol
                        ? "bg-blue-600 text-white"
                        : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                    }`}
                  >
                    {stock.symbol}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
