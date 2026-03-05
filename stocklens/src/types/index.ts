export interface StockCandle {
  time: string; // YYYY-MM-DD
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export type NewsCategory =
  | "market"
  | "policy"
  | "earnings"
  | "product"
  | "competition"
  | "management";

export type NewsSentiment = "positive" | "negative" | "neutral";

export interface NewsItem {
  id: string;
  date: string;
  title: string;
  summary: string;
  bullets: string[];
  category: NewsCategory;
  sentiment: NewsSentiment;
  source: string;
  url?: string;
  imageUrl?: string;
  returnT1: number;
  returnT5: number;
}

export interface CategoryCount {
  category: NewsCategory;
  label: string;
  icon: string;
  count: number;
}

export interface ForecastResult {
  direction: "up" | "down";
  confidence: number;
  label: string;
  analysis: string;
  t1: { direction: "up" | "down"; confidence: number };
  t3: { direction: "up" | "down"; confidence: number };
  t5: { direction: "up" | "down"; confidence: number };
  keyTopics: string[];
}

export interface RangeAnalysis {
  dateRange: string;
  percentChange: number;
  summary: string;
  keyEvents: string[];
  bullishFactors: string[];
  bearishFactors: string[];
}

export interface SimilarDay {
  date: string;
  similarity: number;
  newsCount: number;
  returnT1: number;
  returnT5: number;
}

export interface StockInfo {
  symbol: string;
  name: string;
  sector: string;
}
