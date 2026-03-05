import { NextRequest, NextResponse } from "next/server";
import { fetchStockData } from "@/lib/yahoo";
import { generateStockData } from "@/lib/mockData";

export async function GET(req: NextRequest) {
  const symbol = req.nextUrl.searchParams.get("symbol") || "AAPL";

  try {
    const data = await fetchStockData(symbol);
    return NextResponse.json(data);
  } catch (e) {
    console.warn(`Yahoo Finance failed for ${symbol}, using mock data:`, e);
    const data = generateStockData(symbol);
    return NextResponse.json(data);
  }
}
