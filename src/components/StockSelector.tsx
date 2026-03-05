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
        className="flex items-center gap-1.5 px-3.5 py-1.5 bg-[#162036] border border-blue-800/30 rounded-lg text-white font-semibold text-sm hover:bg-[#1c2a46] hover:border-blue-700/40 transition-all duration-200"
      >
        {symbol}
        <svg
          className={`w-3 h-3 text-blue-400/60 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
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
        <div className="absolute top-full left-0 mt-1.5 bg-[#131d35]/98 backdrop-blur-xl border border-blue-800/25 rounded-xl shadow-2xl shadow-black/30 z-50 p-4 min-w-[520px] max-h-[420px] overflow-auto custom-scrollbar animate-fade-in-up">
          {STOCK_SECTORS.map((sector) => (
            <div key={sector.name} className="mb-3.5">
              <div className="text-[11px] text-blue-400 font-semibold mb-2 tracking-wider uppercase">
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
                    className={`px-3 py-1.5 text-xs rounded-lg transition-all duration-150 font-medium ${
                      stock.symbol === symbol
                        ? "bg-blue-600 text-white shadow-[0_0_10px_rgba(59,130,246,0.3)]"
                        : "bg-[#1c2a46] text-blue-200/70 hover:bg-[#243352] hover:text-white border border-transparent hover:border-blue-700/30"
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
