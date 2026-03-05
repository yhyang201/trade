import { NextRequest, NextResponse } from "next/server";
import { fetchCompanyNews, categorizeByKeywords } from "@/lib/finnhub";
import { classifyNewsWithAI } from "@/lib/ai";
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

      // Debug mode: show classification details
      if (debug) {
        const cats: Record<string, number> = {};
        const sents: Record<string, number> = {};
        for (const n of news) {
          cats[n.category] = (cats[n.category] || 0) + 1;
          sents[n.sentiment] = (sents[n.sentiment] || 0) + 1;
        }
        return NextResponse.json({
          _debug: {
            version: "v3-scoring",
            totalNews: rawNews.length,
            hasAI: !!process.env.MOONSHOT_API_KEY,
            aiClassifications: classifications.length,
            categories: cats,
            sentiments: sents,
            sample: rawNews.slice(0, 3).map((r) => ({
              title: r.title.slice(0, 80),
              summary: r.summary.slice(0, 80),
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

  if (debug) {
    const cats: Record<string, number> = {};
    const sents: Record<string, number> = {};
    for (const n of news) {
      cats[n.category] = (cats[n.category] || 0) + 1;
      sents[n.sentiment] = (sents[n.sentiment] || 0) + 1;
    }
    return NextResponse.json({
      _debug: {
        version: "v3-scoring",
        source: "mock",
        hasFinnhub: !!process.env.FINNHUB_API_KEY,
        totalNews: news.length,
        categories: cats,
        sentiments: sents,
      },
      news: news.slice(0, 5),
    });
  }

  return NextResponse.json(news);
}
