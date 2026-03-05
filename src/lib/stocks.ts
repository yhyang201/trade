import { StockInfo } from "@/types";

export const STOCK_SECTORS: { name: string; stocks: StockInfo[] }[] = [
  {
    name: "TECH",
    stocks: [
      { symbol: "AAPL", name: "Apple", sector: "TECH" },
      { symbol: "MSFT", name: "Microsoft", sector: "TECH" },
      { symbol: "GOOGL", name: "Alphabet", sector: "TECH" },
      { symbol: "META", name: "Meta", sector: "TECH" },
      { symbol: "AMZN", name: "Amazon", sector: "TECH" },
      { symbol: "CRM", name: "Salesforce", sector: "TECH" },
      { symbol: "ORCL", name: "Oracle", sector: "TECH" },
      { symbol: "IBM", name: "IBM", sector: "TECH" },
      { symbol: "CSCO", name: "Cisco", sector: "TECH" },
      { symbol: "NOW", name: "ServiceNow", sector: "TECH" },
      { symbol: "SNOW", name: "Snowflake", sector: "TECH" },
      { symbol: "DELL", name: "Dell", sector: "TECH" },
      { symbol: "ADBE", name: "Adobe", sector: "TECH" },
    ],
  },
  {
    name: "AI / CHIP",
    stocks: [
      { symbol: "NVDA", name: "NVIDIA", sector: "AI / CHIP" },
      { symbol: "AMD", name: "AMD", sector: "AI / CHIP" },
      { symbol: "TSM", name: "TSMC", sector: "AI / CHIP" },
      { symbol: "AVGO", name: "Broadcom", sector: "AI / CHIP" },
      { symbol: "INTC", name: "Intel", sector: "AI / CHIP" },
      { symbol: "QCOM", name: "Qualcomm", sector: "AI / CHIP" },
      { symbol: "ARM", name: "ARM", sector: "AI / CHIP" },
      { symbol: "ASML", name: "ASML", sector: "AI / CHIP" },
    ],
  },
  {
    name: "AI SOFTWARE",
    stocks: [
      { symbol: "AI", name: "C3.ai", sector: "AI SOFTWARE" },
      { symbol: "SOUN", name: "SoundHound", sector: "AI SOFTWARE" },
      { symbol: "CRWD", name: "CrowdStrike", sector: "AI SOFTWARE" },
      { symbol: "ANET", name: "Arista", sector: "AI SOFTWARE" },
    ],
  },
  {
    name: "EV / AUTO",
    stocks: [
      { symbol: "TSLA", name: "Tesla", sector: "EV / AUTO" },
      { symbol: "RIVN", name: "Rivian", sector: "EV / AUTO" },
      { symbol: "NIO", name: "NIO", sector: "EV / AUTO" },
      { symbol: "LI", name: "Li Auto", sector: "EV / AUTO" },
      { symbol: "F", name: "Ford", sector: "EV / AUTO" },
      { symbol: "GM", name: "GM", sector: "EV / AUTO" },
    ],
  },
];

export function getAllStocks(): StockInfo[] {
  return STOCK_SECTORS.flatMap((s) => s.stocks);
}
