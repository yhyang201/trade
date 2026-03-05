import { NextRequest, NextResponse } from "next/server";
import { fetchCompanyNews, categorizeByKeywords } from "@/lib/finnhub";
import { generateStockData, generateNewsData } from "@/lib/mockData";
import type { NewsItem } from "@/types";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const symbol = req.nextUrl.searchParams.get("symbol") || "AAPL";
  const debug = req.nextUrl.searchParams.get("debug") === "1";

  // Try Finnhub real news
  if (process.env.FINNHUB_API_KEY) {
    try {
      const endDate = new Date().toISOString().split("T")[0];
      const startDate = new Date();
      startDate.setMonth(startDate.getMonth() - 12);
      const fromDate = startDate.toISOString().split("T")[0];

      const rawNews = await fetchCompanyNews(symbol, fromDate, endDate);

      if (rawNews.length === 0) {
        throw new Error("No news returned");
      }

      // Always use keyword-based classification (fast, reliable)
      // AI classification was returning all "market"/"neutral" so we skip it
      const news: NewsItem[] = rawNews.map((raw, i) => {
        const kw = categorizeByKeywords(raw.title, raw.summary);

        return {
          id: `${symbol}-${i}`,
          date: raw.date,
          title: raw.title,
          summary: raw.summary.slice(0, 200),
          bullets: [raw.summary.slice(0, 100)],
          category: kw.category,
          sentiment: kw.sentiment,
          source: raw.source,
          url: raw.url,
          imageUrl: raw.imageUrl,
          returnT1: 0,
          returnT5: 0,
        };
      });

      // Compute T+1 and T+5 returns using stock prices
      try {
        const { fetchStockData } = await import("@/lib/yahoo");
        const candles = await fetchStockData(symbol);
        const sortedDates = candles.map((c) => c.time).sort();
        const priceByDate = new Map(candles.map((c) => [c.time, c]));

        function findNearestIdx(date: string): number {
          let lo = 0, hi = sortedDates.length - 1;
          while (lo <= hi) {
            const mid = (lo + hi) >> 1;
            if (sortedDates[mid] <= date) lo = mid + 1;
            else hi = mid - 1;
          }
          return hi;
        }

        for (const item of news) {
          const idx = findNearestIdx(item.date);
          if (idx < 0) continue;
          const current = priceByDate.get(sortedDates[idx]);
          if (!current) continue;

          if (idx + 1 < sortedDates.length) {
            const t1 = priceByDate.get(sortedDates[idx + 1])!;
            item.returnT1 = +(
              ((t1.close - current.close) / current.close) * 100
            ).toFixed(2);
          }
          if (idx + 5 < sortedDates.length) {
            const t5 = priceByDate.get(sortedDates[idx + 5])!;
            item.returnT5 = +(
              ((t5.close - current.close) / current.close) * 100
            ).toFixed(2);
          }
        }
      } catch {
        // Stock data not available, returns stay at 0
      }

      if (debug) {
        const cats: Record<string, number> = {};
        const sents: Record<string, number> = {};
        for (const n of news) {
          cats[n.category] = (cats[n.category] || 0) + 1;
          sents[n.sentiment] = (sents[n.sentiment] || 0) + 1;
        }
        return NextResponse.json({
          _debug: {
            version: "v4-keyword-only",
            totalNews: rawNews.length,
            categories: cats,
            sentiments: sents,
            sample: rawNews.slice(0, 5).map((r) => ({
              title: r.title.slice(0, 80),
              classified: categorizeByKeywords(r.title, r.summary),
            })),
          },
          news: news.slice(0, 5),
        });
      }

      return NextResponse.json(news);
    } catch (e) {
      console.warn(`Finnhub failed for ${symbol}, using mock data:`, e);
    }
  }

  // Fallback to mock data
  const candles = generateStockData(symbol);
  const news = generateNewsData(symbol, candles);
  return NextResponse.json(news);
}
