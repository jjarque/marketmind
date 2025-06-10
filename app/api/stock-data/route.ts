import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const symbol = searchParams.get('symbol') || 'AAPL'

  try {
    // Usar datos mock para la demo
    const mockData = {
      success: true,
      symbol: symbol,
      company_name: symbol === 'AAPL' ? 'Apple Inc.' : `${symbol} Corporation`,
      current_data: {
        price: Math.random() * 200 + 100,
        change: Math.random() * 10 - 5,
        percent_change: Math.random() * 5 - 2.5,
        trend: Math.random() > 0.5 ? 'up' : 'down',
        high: Math.random() * 220 + 110,
        low: Math.random() * 180 + 90,
        volume: Math.floor(Math.random() * 100000000),
        date: new Date().toISOString()
      },
      market_data: {
        market_cap: Math.floor(Math.random() * 1000000000000),
        pe_ratio: Math.random() * 30 + 10,
        dividend_yield: Math.random() * 3,
        beta: Math.random() * 2,
        '52_week_high': Math.random() * 250 + 150,
        '52_week_low': Math.random() * 150 + 50
      },
      technical_indicators: {
        sma_20: Math.random() * 200 + 100,
        sma_50: Math.random() * 200 + 100,
        volatility: Math.random() * 50 + 10,
        rsi: Math.random() * 100
      },
      historical_data: Array.from({ length: 30 }, (_, i) => ({
        date: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        open: Math.random() * 200 + 100,
        high: Math.random() * 220 + 110,
        low: Math.random() * 180 + 90,
        close: Math.random() * 200 + 100,
        volume: Math.floor(Math.random() * 100000000)
      })).reverse()
    }

    return NextResponse.json(mockData)
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to fetch data' }, { status: 500 })
  }
}
