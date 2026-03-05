import { NextRequest, NextResponse } from "next/server";
import { fetchCompanyNews, categorizeByKeywords } from "@/lib/finnhub";
import { classifyNewsWithAI } from "@/lib/ai";
import { generateStockData, generateNewsData } from "@/lib/mockData";
import type { NewsItem } from "@/types";

export async function GET(req: NextRequest) {
  const symbol = req.nextUrl.searchParams.get("symbol") || "AAPL";

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

      // Try AI classification, fallback to keyword-based
      let classifications: {
        category: string;
        sentiment: string;
        bullets: string[];
      }[] = [];

      if (process.env.MOONSHOT_API_KEY) {
        classifications = await classifyNewsWithAI(
          rawNews.map((n) => ({ title: n.title, summary: n.summary }))
        );
      }

      const news: NewsItem[] = rawNews.map((raw, i) => {
        const aiResult = classifications[i];
        const keywordResult = categorizeByKeywords(raw.title, raw.summary);

        const category = aiResult
          ? (aiResult.category as NewsItem["category"])
          : keywordResult.category;
        const sentiment = aiResult
          ? (aiResult.sentiment as NewsItem["sentiment"])
          : keywordResult.sentiment;
        const bullets = aiResult?.bullets?.length
          ? aiResult.bullets
          : [raw.summary.slice(0, 80)];

        return {
          id: `${symbol}-${i}`,
          date: raw.date,
          title: raw.title,
          summary: raw.summary.slice(0, 200),
          bullets,
          category,
          sentiment,
          source: raw.source,
          url: raw.url,
          imageUrl: raw.imageUrl,
          returnT1: 0, // Will be computed with stock data
          returnT5: 0,
        };
      });

      // Compute T+1 and T+5 returns using stock prices
      try {
        const { fetchStockData } = await import("@/lib/yahoo");
        const candles = await fetchStockData(symbol);
        const sortedDates = candles.map((c) => c.time).sort();
        const priceByDate = new Map(candles.map((c) => [c.time, c]));

        // Find nearest trading day at or before the given date
        function findNearestIdx(date: string): number {
          let lo = 0, hi = sortedDates.length - 1;
          while (lo <= hi) {
            const mid = (lo + hi) >> 1;
            if (sortedDates[mid] <= date) lo = mid + 1;
            else hi = mid - 1;
          }
          return hi; // largest index where sortedDates[idx] <= date
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
