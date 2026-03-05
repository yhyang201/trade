import OpenAI from "openai";
import type { NewsItem, ForecastResult, RangeAnalysis } from "@/types";

function getClient(): OpenAI | null {
  const apiKey = process.env.MOONSHOT_API_KEY;
  if (!apiKey) return null;
  return new OpenAI({
    apiKey,
    baseURL: "https://api.moonshot.ai/v1",
  });
}

export async function classifyNewsWithAI(
  newsItems: { title: string; summary: string }[]
): Promise<
  { category: string; sentiment: string; bullets: string[] }[]
> {
  const client = getClient();
  if (!client) return [];

  const results: { category: string; sentiment: string; bullets: string[] }[] = [];
  const batchSize = 20;

  for (let i = 0; i < newsItems.length; i += batchSize) {
    const batch = newsItems.slice(i, i + batchSize);
    const prompt = `Classify each news item below. For each, return JSON with:
- category: one of "market", "policy", "earnings", "product", "competition", "management"
- sentiment: one of "positive", "negative", "neutral"
- bullets: array of 2-3 key takeaway strings (short, under 15 words each)

News items:
${batch.map((n, idx) => `${idx + 1}. Title: ${n.title}\n   Summary: ${n.summary}`).join("\n\n")}

Return ONLY a JSON array of objects. No other text.`;

    try {
      const response = await client.chat.completions.create({
        model: "kimi-k2.5",
        messages: [
          { role: "system", content: "You are a financial news classifier. Respond in JSON format." },
          { role: "user", content: prompt },
        ],
        response_format: { type: "json_object" },
        temperature: 0.6,
        max_tokens: 2000,
        // @ts-expect-error -- Kimi instant mode
        thinking: { type: "disabled" },
      });

      const text = response.choices[0]?.message?.content ?? "";
      // Parse JSON - might be { "items": [...] } or just [...]
      const parsed = JSON.parse(text);
      const arr = Array.isArray(parsed) ? parsed : parsed.items || parsed.results || [];
      results.push(...arr);
    } catch {
      batch.forEach(() =>
        results.push({ category: "market", sentiment: "neutral", bullets: [] })
      );
    }
  }

  return results;
}

export async function generateForecast(
  symbol: string,
  news: NewsItem[],
  period: string
): Promise<ForecastResult | null> {
  const client = getClient();
  if (!client) return null;

  const recent = news.slice(-30);
  const posCount = recent.filter((n) => n.sentiment === "positive").length;
  const negCount = recent.filter((n) => n.sentiment === "negative").length;

  const newsSummary = recent
    .slice(-15)
    .map(
      (n) =>
        `[${n.date}] ${n.sentiment === "positive" ? "+" : n.sentiment === "negative" ? "-" : "~"} ${n.title}`
    )
    .join("\n");

  const prompt = `You are a stock market analyst AI. Analyze recent news for ${symbol} and provide a forecast.

Recent news (last 30 items): ${posCount} positive, ${negCount} negative, ${recent.length - posCount - negCount} neutral.

Latest news:
${newsSummary}

Forecast period: ${period}

Return JSON with this exact structure:
{
  "direction": "up" or "down",
  "confidence": number 40-95,
  "label": "Bullish" or "Bearish",
  "analysis": "English analysis paragraph about the stock outlook based on news, under 200 chars. Include specific numbers and reasoning.",
  "t1": {"direction": "up" or "down", "confidence": number},
  "t3": {"direction": "up" or "down", "confidence": number},
  "t5": {"direction": "up" or "down", "confidence": number},
  "keyTopics": ["topic1", "topic2", ...up to 8 relevant keywords]
}`;

  try {
    const response = await client.chat.completions.create({
      model: "kimi-k2.5",
      messages: [
        { role: "system", content: "You are a stock analyst AI. Respond in JSON format." },
        { role: "user", content: prompt },
      ],
      response_format: { type: "json_object" },
      temperature: 0.6,
      max_tokens: 1000,
      // @ts-expect-error -- Kimi instant mode
      thinking: { type: "disabled" },
    });

    const text = response.choices[0]?.message?.content ?? "";
    return JSON.parse(text) as ForecastResult;
  } catch (e) {
    console.error("Forecast generation error:", e);
    return null;
  }
}

export async function generateRangeAnalysis(
  symbol: string,
  news: NewsItem[],
  startDate: string,
  endDate: string,
  percentChange: number,
  question?: string
): Promise<RangeAnalysis | null> {
  const client = getClient();
  if (!client) return null;

  const rangeNews = news.filter(
    (n) => n.date >= startDate && n.date <= endDate
  );

  const newsSummary = rangeNews
    .slice(0, 30)
    .map(
      (n) =>
        `[${n.date}] ${n.sentiment === "positive" ? "+" : n.sentiment === "negative" ? "-" : "~"} (${n.category}) ${n.title}`
    )
    .join("\n");

  const prompt = `You are a stock analyst. Analyze why ${symbol} moved ${percentChange >= 0 ? "up" : "down"} ${Math.abs(percentChange).toFixed(2)}% from ${startDate} to ${endDate}.

${question ? `User question: ${question}` : ""}

News during this period (${rangeNews.length} total):
${newsSummary}

Return JSON:
{
  "dateRange": "${startDate} ~ ${endDate}",
  "percentChange": ${percentChange},
  "summary": "English summary of the analysis, 2-3 sentences",
  "keyEvents": ["event1 with date", "event2", ...up to 5],
  "bullishFactors": ["factor1 with date", ...up to 5],
  "bearishFactors": ["factor1 with date", ...up to 5]
}`;

  try {
    const response = await client.chat.completions.create({
      model: "kimi-k2.5",
      messages: [
        { role: "system", content: "You are a stock analyst AI. Respond in JSON format." },
        { role: "user", content: prompt },
      ],
      response_format: { type: "json_object" },
      temperature: 0.6,
      max_tokens: 1000,
      // @ts-expect-error -- Kimi instant mode
      thinking: { type: "disabled" },
    });

    const text = response.choices[0]?.message?.content ?? "";
    return JSON.parse(text) as RangeAnalysis;
  } catch (e) {
    console.error("Range analysis error:", e);
    return null;
  }
}
