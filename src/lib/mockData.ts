import {
  StockCandle,
  NewsItem,
  NewsCategory,
  NewsSentiment,
} from "@/types";

// Seeded random for reproducibility
function seededRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

export function generateStockData(
  symbol: string,
  days = 365
): StockCandle[] {
  const rand = seededRandom(
    symbol.split("").reduce((a, c) => a + c.charCodeAt(0), 0) * 137
  );

  const basePrices: Record<string, number> = {
    AAPL: 170,
    MSFT: 380,
    GOOGL: 140,
    META: 350,
    AMZN: 180,
    NVDA: 500,
    TSLA: 250,
    AMD: 150,
    TSM: 140,
    AVGO: 160,
    CRM: 260,
    ORCL: 120,
    IBM: 180,
    INTC: 40,
    ARM: 130,
  };

  const basePrice = basePrices[symbol] || 100 + rand() * 200;
  const candles: StockCandle[] = [];
  let price = basePrice;

  const startDate = new Date("2024-01-15");

  for (let i = 0; i < days; i++) {
    const date = new Date(startDate);
    date.setDate(date.getDate() + i);
    if (date.getDay() === 0 || date.getDay() === 6) continue;

    const change = (rand() - 0.48) * price * 0.03;
    const open = price;
    const close = price + change;
    const high = Math.max(open, close) + rand() * price * 0.015;
    const low = Math.min(open, close) - rand() * price * 0.015;

    candles.push({
      time: date.toISOString().split("T")[0],
      open: +open.toFixed(2),
      high: +high.toFixed(2),
      low: +low.toFixed(2),
      close: +close.toFixed(2),
      volume: Math.floor(rand() * 50000000 + 10000000),
    });

    price = close;
  }

  return candles;
}

const NEWS_TEMPLATES: Record<
  NewsCategory,
  { positive: string[]; negative: string[] }
> = {
  market: {
    positive: [
      "{company} Shares Rally as Market Sentiment Improves",
      "Wall Street Upgrades {company} Stock, Cites Strong Market Position",
      "{company} Outperforms Market as Investors Bet on Growth",
      "Analysts Raise {company} Price Target Amid Market Rally",
      "{company} Stock Hits New High on Broad Market Optimism",
    ],
    negative: [
      "{company} Shares Drop as Market Sells Off",
      "Market Downturn Drags {company} Stock Lower",
      "{company} Faces Headwinds as Market Volatility Spikes",
      "Sell-Off Deepens: {company} Among Hardest Hit",
      "{company} Stock Under Pressure from Macro Concerns",
    ],
  },
  policy: {
    positive: [
      "New Regulation Benefits {company} Competitive Position",
      "{company} Set to Gain from Government Infrastructure Spending",
      "Tax Policy Changes Could Boost {company} Earnings",
      "Trade Deal Positive for {company} Supply Chain",
    ],
    negative: [
      "Trump Tariff Strategy Creates 'Self-Inflicted Market Debacle': Analyst",
      "New Regulations Could Increase Compliance Costs for {company}",
      "Antitrust Scrutiny Intensifies for {company}",
      "China Trade Tensions Threaten {company} Revenue Stream",
      "Trump 104% China Tariff Announcement Rattles Markets",
    ],
  },
  earnings: {
    positive: [
      "{company} Beats Q4 Earnings Estimates, Revenue Up 15%",
      "{company} Reports Record Revenue, Raises Full-Year Guidance",
      "Strong Earnings Drive {company} Stock to 52-Week High",
      "{company} Quarterly Profit Surges on Strong Demand",
    ],
    negative: [
      "{company} Misses Earnings Expectations, Stock Drops 5%",
      "{company} Revenue Falls Short, Issues Weak Guidance",
      "Disappointing Earnings Send {company} Shares Tumbling",
      "{company} Cuts Full-Year Forecast on Slowing Demand",
    ],
  },
  product: {
    positive: [
      "Why AI Won't Create a New Batch of Tech Giants -- It Will Cement the Old Ones",
      "{company} Launches Revolutionary AI-Powered Product",
      "{company} New Product Line Exceeds Sales Expectations",
      "Analysts Praise {company} Innovation Pipeline",
      "{company} Product Launch Draws Record Consumer Interest",
    ],
    negative: [
      "{company} Product Recall Raises Quality Concerns",
      "{company} Faces Criticism Over Latest Product Update",
      "Competitor Overtakes {company} in Key Product Category",
      "{company} Product Delays Frustrate Customers and Investors",
    ],
  },
  competition: {
    positive: [
      "{company} Gains Market Share from Competitors",
      "{company} Strategic Acquisition Strengthens Market Position",
      "{company} Wins Major Contract Over Rivals",
      "{company} Expands into New Markets Ahead of Competition",
    ],
    negative: [
      "Rival Company Threatens {company} Market Dominance",
      "{company} Loses Key Contract to Competitor",
      "Industry Disruption Challenges {company} Business Model",
      "New Entrant Threatens {company} Core Business",
    ],
  },
  management: {
    positive: [
      "{company} CEO Announces Bold Strategic Vision",
      "{company} Appoints Industry Veteran as New CFO",
      "Insider Buying at {company} Signals Management Confidence",
      "{company} Board Announces $10B Buyback Program",
    ],
    negative: [
      "{company} CEO Departure Raises Succession Concerns",
      "{company} Faces Shareholder Revolt Over Executive Pay",
      "Key Executive Leaves {company} for Rival Firm",
      "{company} Management Reshuffle Signals Internal Turmoil",
    ],
  },
};

const SUMMARY_TEMPLATES = {
  positive: [
    "Positive developments suggest strong momentum ahead",
    "Market conditions favor continued growth trajectory",
    "Analysts see this as a bullish signal for the stock",
  ],
  negative: [
    "Concerns mount over near-term outlook",
    "Market watchers warn of potential downside risks",
    "Investors cautious as headwinds intensify",
  ],
};

const BULLET_TEMPLATES = {
  positive: [
    "Revenue growth exceeds industry average",
    "Strong cash flow supports future investments",
    "Market position strengthened by recent developments",
    "Expanding addressable market drives optimism",
    "Cost efficiency improvements boost margins",
  ],
  negative: [
    "Margin pressure from rising input costs",
    "Competitive threats increasing in core markets",
    "Regulatory uncertainty clouds near-term outlook",
    "Consumer demand showing signs of weakness",
    "Supply chain disruptions impact operations",
  ],
};

const companyNames: Record<string, string> = {
  AAPL: "Apple",
  MSFT: "Microsoft",
  GOOGL: "Google",
  META: "Meta",
  AMZN: "Amazon",
  NVDA: "NVIDIA",
  TSLA: "Tesla",
  AMD: "AMD",
  TSM: "TSMC",
  AVGO: "Broadcom",
  CRM: "Salesforce",
  ORCL: "Oracle",
  IBM: "IBM",
  INTC: "Intel",
  ARM: "ARM",
  ASML: "ASML",
  AI: "C3.ai",
  SOUN: "SoundHound",
  CRWD: "CrowdStrike",
  ANET: "Arista",
  RIVN: "Rivian",
  NIO: "NIO",
  LI: "Li Auto",
  F: "Ford",
  GM: "GM",
  CSCO: "Cisco",
  NOW: "ServiceNow",
  SNOW: "Snowflake",
  DELL: "Dell",
  ADBE: "Adobe",
  QCOM: "Qualcomm",
  // China A-shares
  "600519.SS": "Kweichow Moutai",
  "000858.SZ": "Wuliangye",
  "601318.SS": "Ping An Insurance",
  "600036.SS": "China Merchants Bank",
  "000001.SZ": "Ping An Bank",
  "600900.SS": "CYPC",
  "601012.SS": "LONGi Green Energy",
  "300750.SZ": "CATL",
  "002594.SZ": "BYD",
  "600030.SS": "CITIC Securities",
  // Hong Kong
  "0700.HK": "Tencent",
  "9988.HK": "Alibaba",
  "3690.HK": "Meituan",
  "9888.HK": "Baidu",
  "1810.HK": "Xiaomi",
  "9618.HK": "JD.com",
  // Commodities
  "GC=F": "Gold",
  GLD: "Gold ETF",
  "SI=F": "Silver",
  "CL=F": "Crude Oil",
};

export function generateNewsData(
  symbol: string,
  candles: StockCandle[]
): NewsItem[] {
  const rand = seededRandom(
    symbol.split("").reduce((a, c) => a + c.charCodeAt(0), 0) * 251
  );
  const company = companyNames[symbol] || symbol;
  const categories: NewsCategory[] = [
    "market",
    "policy",
    "earnings",
    "product",
    "competition",
    "management",
  ];
  const sources = [
    "benzinga.com",
    "reuters.com",
    "bloomberg.com",
    "cnbc.com",
    "seekingalpha.com",
    "marketwatch.com",
    "wsj.com",
    "fool.com",
  ];

  const news: NewsItem[] = [];
  let id = 0;

  for (const candle of candles) {
    const numNews = Math.floor(rand() * 4);
    for (let j = 0; j < numNews; j++) {
      const cat = categories[Math.floor(rand() * categories.length)];
      const priceChange =
        candle.close - candle.open;
      // Bias sentiment toward price direction but not always
      const sentimentRoll = rand();
      let sentiment: NewsSentiment;
      if (priceChange > 0) {
        sentiment =
          sentimentRoll < 0.6
            ? "positive"
            : sentimentRoll < 0.85
              ? "negative"
              : "neutral";
      } else {
        sentiment =
          sentimentRoll < 0.6
            ? "negative"
            : sentimentRoll < 0.85
              ? "positive"
              : "neutral";
      }

      const sentKey =
        sentiment === "neutral"
          ? rand() > 0.5
            ? "positive"
            : "negative"
          : sentiment;
      const templates = NEWS_TEMPLATES[cat][sentKey];
      const title = templates[Math.floor(rand() * templates.length)].replace(
        "{company}",
        company
      );
      const summaryTemplates = SUMMARY_TEMPLATES[sentKey];
      const summary =
        summaryTemplates[Math.floor(rand() * summaryTemplates.length)];
      const bulletTemplates = BULLET_TEMPLATES[sentKey];
      const numBullets = 2 + Math.floor(rand() * 2);
      const bullets: string[] = [];
      const usedIdx = new Set<number>();
      for (let b = 0; b < numBullets; b++) {
        let idx = Math.floor(rand() * bulletTemplates.length);
        while (usedIdx.has(idx)) idx = (idx + 1) % bulletTemplates.length;
        usedIdx.add(idx);
        bullets.push(bulletTemplates[idx]);
      }

      const t1 = +((rand() - 0.5) * 10).toFixed(2);
      const t5 = +((rand() - 0.5) * 15).toFixed(2);

      news.push({
        id: `${symbol}-${id++}`,
        date: candle.time,
        title,
        summary,
        bullets,
        category: cat,
        sentiment,
        source: sources[Math.floor(rand() * sources.length)],
        returnT1: t1,
        returnT5: t5,
      });
    }
  }

  return news;
}
