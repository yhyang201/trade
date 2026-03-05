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
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 px-3.5 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-800 font-semibold text-sm hover:bg-slate-50 hover:border-slate-300 transition-all duration-200 shadow-sm"
      >
        {symbol}
        <svg className={`w-3 h-3 text-slate-400 transition-transform duration-200 ${open ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {open && (
        <div className="absolute top-full left-0 mt-1.5 bg-white/98 backdrop-blur-xl border border-slate-200 rounded-xl shadow-xl z-50 p-4 min-w-[520px] max-h-[420px] overflow-auto custom-scrollbar animate-fade-in-up">
          {STOCK_SECTORS.map((sector) => (
            <div key={sector.name} className="mb-3.5">
              <div className="text-[11px] text-blue-600 font-semibold mb-2 tracking-wider uppercase">
                {sector.name}
              </div>
              <div className="flex flex-wrap gap-1.5">
                {sector.stocks.map((stock) => (
                  <button
                    key={stock.symbol}
                    onClick={() => { onSelect(stock.symbol); setOpen(false); }}
                    className={`px-3 py-1.5 text-xs rounded-lg transition-all duration-150 font-medium ${
                      stock.symbol === symbol
                        ? "bg-blue-500 text-white shadow-md shadow-blue-200"
                        : "bg-slate-50 text-slate-600 hover:bg-blue-50 hover:text-blue-600 border border-slate-100"
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
