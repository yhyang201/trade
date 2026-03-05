import type { NewsCategory, NewsSentiment } from "@/types";

interface FinnhubNews {
  category: string;
  datetime: number;
  headline: string;
  id: number;
  image: string;
  related: string;
  source: string;
  summary: string;
  url: string;
}

export interface RawNewsItem {
  date: string;
  title: string;
  summary: string;
  source: string;
  url: string;
  imageUrl: string;
}

export async function fetchCompanyNews(
  symbol: string,
  fromDate: string,
  toDate: string
): Promise<RawNewsItem[]> {
  const apiKey = process.env.FINNHUB_API_KEY;
  if (!apiKey) {
    throw new Error("FINNHUB_API_KEY not set");
  }

  const url = `https://finnhub.io/api/v1/company-news?symbol=${symbol}&from=${fromDate}&to=${toDate}&token=${apiKey}`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Finnhub API error: ${res.status}`);
  }

  const data: FinnhubNews[] = await res.json();

  return data.map((item) => ({
    date: new Date(item.datetime * 1000).toISOString().split("T")[0],
    title: item.headline,
    summary: item.summary,
    source: item.source,
    url: item.url,
    imageUrl: item.image,
  }));
}

function countMatches(text: string, patterns: RegExp[]): number {
  let score = 0;
  for (const p of patterns) {
    if (p.test(text)) score++;
  }
  return score;
}

export function categorizeByKeywords(title: string, summary: string): {
  category: NewsCategory;
  sentiment: NewsSentiment;
} {
  const text = (title + " " + summary).toLowerCase();

  // Score each category with multiple patterns
  const scores: Record<NewsCategory, number> = {
    market: 0,
    policy: 0,
    earnings: 0,
    product: 0,
    competition: 0,
    management: 0,
  };

  scores.policy = countMatches(text, [
    /tariff/i, /regulat/i, /antitrust/i, /government/i, /congress/i,
    /fed\b/i, /federal reserve/i, /policy/i, /sanction/i, /legislat/i,
    /tax\b/i, /trade war/i, /trade deal/i, /white house/i, /biden/i,
    /trump/i, /sec\b/i, /ftc\b/i, /doj\b/i, /lawsuit/i, /ruling/i,
    /court/i, /ban\b/i, /restrict/i, /subsid/i, /geopolit/i,
    /election/i, /senate/i, /house bill/i, /interest rate/i,
  ]);

  scores.earnings = countMatches(text, [
    /earning/i, /revenue/i, /profit/i, /quarter/i, /q[1-4]\b/i,
    /eps\b/i, /guidance/i, /fiscal/i, /income/i, /margin/i,
    /beat expect/i, /miss expect/i, /financial result/i, /report/i,
    /forecast/i, /outlook/i, /dividend/i, /cash flow/i,
    /year.over.year/i, /yoy\b/i, /bottom line/i, /top line/i,
    /sales grew/i, /sales fell/i, /revenue grew/i, /revenue drop/i,
  ]);

  scores.product = countMatches(text, [
    /launch/i, /product/i, /feature/i, /releas/i, /updat/i,
    /patent/i, /innovat/i, /device/i, /chip\b/i, /ai\b/i,
    /technolog/i, /software/i, /hardware/i, /platform/i, /app\b/i,
    /model\b/i, /service/i, /iphone/i, /mac\b/i, /ipad/i,
    /pixel/i, /galaxy/i, /gpu\b/i, /cpu\b/i, /data center/i,
    /cloud/i, /robot/i, /vision pro/i, /self.driving/i, /fsd\b/i,
    /autopilot/i, /chatgpt/i, /copilot/i, /gemini/i, /llm\b/i,
    /machine learning/i, /neural/i, /semiconductor/i,
  ]);

  scores.competition = countMatches(text, [
    /compet/i, /rival/i, /market share/i, /overtake/i, /versus/i,
    /vs\b/i, /acqui/i, /merg/i, /deal\b/i, /partner/i,
    /alliance/i, /joint venture/i, /antitrust/i, /monopol/i,
    /dominant/i, /disrupt/i, /challenger/i, /battle/i,
  ]);

  scores.management = countMatches(text, [
    /ceo\b/i, /cfo\b/i, /cto\b/i, /coo\b/i, /executive/i,
    /board\b/i, /appoint/i, /resign/i, /hire/i, /fired/i,
    /layoff/i, /restructur/i, /buyback/i, /insider/i,
    /leadership/i, /founder/i, /director/i, /succession/i,
    /compensation/i, /stock option/i, /share repurchase/i,
  ]);

  // Market gets a small base score so it's the fallback
  scores.market = countMatches(text, [
    /stock/i, /market/i, /invest/i, /wall street/i, /s&p/i,
    /nasdaq/i, /dow\b/i, /bull/i, /bear/i, /rally/i,
    /sell.off/i, /volatil/i, /index/i, /etf\b/i, /fund\b/i,
    /portfolio/i, /valuation/i, /price target/i, /analyst/i,
    /upgrade/i, /downgrade/i, /buy\b/i, /sell\b/i, /hold\b/i,
    /overweight/i, /underweight/i,
  ]);

  // Find highest scoring category
  let bestCategory: NewsCategory = "market";
  let bestScore = 0;
  for (const [cat, score] of Object.entries(scores)) {
    if (score > bestScore) {
      bestScore = score;
      bestCategory = cat as NewsCategory;
    }
  }

  // If product and policy tie, or multiple high scores, prefer non-market
  if (bestCategory === "market" && bestScore <= 1) {
    for (const cat of ["product", "earnings", "policy", "competition", "management"] as NewsCategory[]) {
      if (scores[cat] > 0) {
        bestCategory = cat;
        break;
      }
    }
  }

  // Sentiment detection - count all individual keyword hits
  const posPatterns = [
    /surge/i, /rally/i, /beat/i, /upgrade/i, /record high/i,
    /strong/i, /gain/i, /rise/i, /boost/i, /bullish/i,
    /optimis/i, /soar/i, /outperform/i, /positive/i, /growth/i,
    /expand/i, /buy\b/i, /higher/i, /upside/i, /opportunity/i,
    /momentum/i, /breakout/i, /recover/i, /rebound/i, /top pick/i,
    /best/i, /winner/i, /success/i, /exceed/i, /impressive/i,
    /skyrocket/i, /surging/i, /jumps/i, /climbs/i, /advances/i,
  ];
  const negPatterns = [
    /drop/i, /fall/i, /miss/i, /downgrade/i, /weak/i,
    /decline/i, /loss/i, /cut\b/i, /bearish/i, /pessimis/i,
    /plunge/i, /crash/i, /concern/i, /risk/i, /threat/i,
    /sell\b/i, /warn/i, /slump/i, /tumble/i, /lower/i,
    /downside/i, /trouble/i, /worst/i, /loser/i, /disappoint/i,
    /struggle/i, /headwind/i, /pressure/i, /fear/i, /bubble/i,
    /overvalued/i, /hit.?a.?wall/i, /slides/i, /sinks/i, /dumps/i,
  ];

  const posScore = countMatches(text, posPatterns);
  const negScore = countMatches(text, negPatterns);

  let sentiment: NewsSentiment = "neutral";
  if (posScore > negScore + 1) sentiment = "positive";
  else if (negScore > posScore + 1) sentiment = "negative";
  else if (posScore > negScore) sentiment = "positive";
  else if (negScore > posScore) sentiment = "negative";

  return { category: bestCategory, sentiment };
}
