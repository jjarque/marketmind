import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const mockData = {
      success: true,
      market_data: [
        {
          symbol: '^GSPC',
          name: 'S&P 500',
          price: 4567.89,
          change: 12.45,
          percent_change: 0.27,
          trend: 'up'
        },
        {
          symbol: '^DJI',
          name: 'Dow Jones',
          price: 34567.12,
          change: -45.67,
          percent_change: -0.13,
          trend: 'down'
        },
        {
          symbol: '^IXIC',
          name: 'NASDAQ',
          price: 14234.56,
          change: 89.34,
          percent_change: 0.63,
          trend: 'up'
        },
        {
          symbol: '^VIX',
          name: 'VIX',
          price: 18.45,
          change: -1.23,
          percent_change: -6.25,
          trend: 'down'
        }
      ]
    }

    return NextResponse.json(mockData)
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to fetch market data' }, { status: 500 })
  }
}
