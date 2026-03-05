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
      { symbol: "NOW", name: "ServiceNow", sector: "AI SOFTWARE" },
      { symbol: "SNOW", name: "Snowflake", sector: "AI SOFTWARE" },
      { symbol: "DELL", name: "Dell", sector: "AI SOFTWARE" },
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
  {
    name: "CHINA A-SHARES",
    stocks: [
      { symbol: "600519.SS", name: "Kweichow Moutai", sector: "CHINA A-SHARES" },
      { symbol: "000858.SZ", name: "Wuliangye", sector: "CHINA A-SHARES" },
      { symbol: "601318.SS", name: "Ping An Insurance", sector: "CHINA A-SHARES" },
      { symbol: "600036.SS", name: "China Merchants Bank", sector: "CHINA A-SHARES" },
      { symbol: "000001.SZ", name: "Ping An Bank", sector: "CHINA A-SHARES" },
      { symbol: "600900.SS", name: "CYPC (Yangtze Power)", sector: "CHINA A-SHARES" },
      { symbol: "601012.SS", name: "LONGi Green Energy", sector: "CHINA A-SHARES" },
      { symbol: "300750.SZ", name: "CATL", sector: "CHINA A-SHARES" },
      { symbol: "002594.SZ", name: "BYD", sector: "CHINA A-SHARES" },
      { symbol: "600030.SS", name: "CITIC Securities", sector: "CHINA A-SHARES" },
    ],
  },
  {
    name: "HONG KONG",
    stocks: [
      { symbol: "0700.HK", name: "Tencent", sector: "HONG KONG" },
      { symbol: "9988.HK", name: "Alibaba", sector: "HONG KONG" },
      { symbol: "3690.HK", name: "Meituan", sector: "HONG KONG" },
      { symbol: "9888.HK", name: "Baidu", sector: "HONG KONG" },
      { symbol: "1810.HK", name: "Xiaomi", sector: "HONG KONG" },
      { symbol: "9618.HK", name: "JD.com", sector: "HONG KONG" },
    ],
  },
  {
    name: "GOLD / COMMODITY",
    stocks: [
      { symbol: "GC=F", name: "Gold Futures", sector: "GOLD / COMMODITY" },
      { symbol: "GLD", name: "SPDR Gold ETF", sector: "GOLD / COMMODITY" },
      { symbol: "SI=F", name: "Silver Futures", sector: "GOLD / COMMODITY" },
      { symbol: "CL=F", name: "Crude Oil Futures", sector: "GOLD / COMMODITY" },
    ],
  },
];

export function getAllStocks(): StockInfo[] {
  return STOCK_SECTORS.flatMap((s) => s.stocks);
}
