import YahooFinance from "yahoo-finance2";
import type { StockCandle } from "@/types";

const yahooFinance = new YahooFinance();

interface ChartQuote {
  date: Date;
  open: number | null;
  high: number | null;
  low: number | null;
  close: number | null;
  volume: number | null;
}

export async function fetchStockData(
  symbol: string,
  months = 18
): Promise<StockCandle[]> {
  const endDate = new Date();
  const startDate = new Date();
  startDate.setMonth(startDate.getMonth() - months);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const result: any = await yahooFinance.chart(symbol, {
    period1: startDate.toISOString().split("T")[0],
    period2: endDate.toISOString().split("T")[0],
    interval: "1d",
  });

  const quotes: ChartQuote[] = result.quotes ?? [];

  if (quotes.length === 0) {
    throw new Error(`No data for ${symbol}`);
  }

  return quotes
    .filter(
      (q) =>
        q.open != null &&
        q.high != null &&
        q.low != null &&
        q.close != null
    )
    .map((q) => ({
      time: new Date(q.date).toISOString().split("T")[0],
      open: +q.open!.toFixed(2),
      high: +q.high!.toFixed(2),
      low: +q.low!.toFixed(2),
      close: +q.close!.toFixed(2),
      volume: q.volume ?? 0,
    }));
}
