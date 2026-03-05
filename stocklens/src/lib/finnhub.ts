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

// Simple keyword-based categorization fallback (used when AI is not available)
export function categorizeByKeywords(title: string, summary: string): {
  category: NewsCategory;
  sentiment: NewsSentiment;
} {
  const text = (title + " " + summary).toLowerCase();

  // Category detection
  let category: NewsCategory = "market";
  if (
    /tariff|regulation|antitrust|government|congress|fed |policy|sanction|ban|law|legislation|tax/i.test(
      text
    )
  ) {
    category = "policy";
  } else if (
    /earnings|revenue|profit|quarter|q[1-4]|eps|guidance|fiscal|income|margin|beat|miss/i.test(
      text
    )
  ) {
    category = "earnings";
  } else if (
    /launch|product|feature|release|update|patent|innovation|device|chip|ai model|technology/i.test(
      text
    )
  ) {
    category = "product";
  } else if (
    /compet|rival|market share|overtake|contract|acquisition|merge/i.test(
      text
    )
  ) {
    category = "competition";
  } else if (
    /ceo|cfo|executive|board|appoint|resign|hire|layoff|restructur|buyback|insider/i.test(
      text
    )
  ) {
    category = "management";
  }

  // Sentiment detection
  let sentiment: NewsSentiment = "neutral";
  const positiveWords =
    /surge|rally|beat|upgrade|record|strong|gain|rise|boost|bullish|optimis|soar|outperform|positive|growth|expand|buy/i;
  const negativeWords =
    /drop|fall|miss|downgrade|weak|decline|loss|cut|bearish|pessimis|plunge|crash|concern|risk|threat|sell|warn/i;

  const posScore = (text.match(positiveWords) || []).length;
  const negScore = (text.match(negativeWords) || []).length;

  if (posScore > negScore) sentiment = "positive";
  else if (negScore > posScore) sentiment = "negative";

  return { category, sentiment };
}
