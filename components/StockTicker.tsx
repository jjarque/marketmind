'use client'

import { useState, useEffect } from 'react'

interface TickerStock {
  symbol: string
  price: number
  change: number
  percent_change: number
  company_name: string
}

function getLogoUrl(symbol: string): string {
  const token = process.env.NEXT_PUBLIC_LOGO_DEV_TOKEN;

  if (!token) {
    return `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20"><text x="50%" y="50%" text-anchor="middle" dy=".3em" fill="white" font-family="system-ui" font-size="8" font-weight="600">${symbol.charAt(0)}</text></svg>`;
  }

  return `https://img.logo.dev/ticker/${symbol}?token=${token}&format=png&retina=true`;
}

export default function StockTicker() {
  const [tickerData, setTickerData] = useState<TickerStock[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchTickerData = async () => {
      try {
        setIsLoading(true)

        const mockData: TickerStock[] = [
          { symbol: 'AAPL', company_name: 'Apple', price: 175.43, change: 2.15, percent_change: 1.24 },
          { symbol: 'GOOGL', company_name: 'Google', price: 2847.52, change: -15.30, percent_change: -0.53 },
          { symbol: 'MSFT', company_name: 'Microsoft', price: 378.85, change: 4.12, percent_change: 1.10 },
          { symbol: 'AMZN', company_name: 'Amazon', price: 3342.88, change: -8.75, percent_change: -0.26 },
          { symbol: 'TSLA', company_name: 'Tesla', price: 248.50, change: 12.30, percent_change: 5.20 },
          { symbol: 'META', company_name: 'Meta', price: 331.25, change: 6.80, percent_change: 2.10 },
          { symbol: 'NVDA', company_name: 'NVIDIA', price: 875.28, change: 18.45, percent_change: 2.15 },
          { symbol: 'NFLX', company_name: 'Netflix', price: 485.73, change: -3.22, percent_change: -0.66 },
          { symbol: 'AMD', company_name: 'AMD', price: 142.18, change: 2.85, percent_change: 2.05 },
          { symbol: 'INTC', company_name: 'Intel', price: 43.67, change: -0.45, percent_change: -1.02 },
          { symbol: 'CRM', company_name: 'Salesforce', price: 267.34, change: 5.12, percent_change: 1.95 },
          { symbol: 'ORCL', company_name: 'Oracle', price: 118.92, change: 1.88, percent_change: 1.61 },
          { symbol: 'IBM', company_name: 'IBM', price: 165.45, change: -1.23, percent_change: -0.74 },
          { symbol: 'UBER', company_name: 'Uber', price: 62.18, change: 1.45, percent_change: 2.39 },
          { symbol: 'SPOT', company_name: 'Spotify', price: 178.92, change: 3.67, percent_change: 2.09 },
          { symbol: 'PYPL', company_name: 'PayPal', price: 58.34, change: -0.89, percent_change: -1.50 },
          { symbol: 'ADBE', company_name: 'Adobe', price: 567.23, change: 8.45, percent_change: 1.51 },
          { symbol: 'SHOP', company_name: 'Shopify', price: 67.89, change: 2.34, percent_change: 3.57 }
        ]

        setTickerData(mockData)

      } catch (error) {
        console.error('Error fetching ticker data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchTickerData()
    const interval = setInterval(fetchTickerData, 60000)

    return () => clearInterval(interval)
  }, [])

  if (isLoading) {
    return (
      <div className="w-full bg-white border-b border-gray-200 overflow-hidden">
        <div className="flex animate-pulse py-3">
          <div className="flex items-center mx-8 text-sm">
            <div className="w-16 h-4 bg-gray-300 rounded mr-2"></div>
            <div className="w-12 h-4 bg-gray-300 rounded mr-2"></div>
            <div className="w-20 h-4 bg-gray-300 rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  if (tickerData.length === 0) return null

  return (
    <div className="w-full bg-white border-b border-gray-200 overflow-hidden relative shadow-sm">
      <div className="flex animate-scroll whitespace-nowrap py-3">
        {[...tickerData, ...tickerData, ...tickerData].map((stock, index) => (
          <div key={`${stock.symbol}-${index}`} className="flex items-center mx-4 text-sm hover:bg-gray-50 px-4 py-3 rounded-lg transition-all duration-200 cursor-pointer min-w-fit">
            <img
              src={getLogoUrl(stock.symbol)}
              alt={`${stock.symbol} logo`}
              className="w-4 h-4 mr-2 object-contain flex-shrink-0"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16"><rect width="16" height="16" rx="2" fill="%23374151"/><text x="50%" y="50%" text-anchor="middle" dy=".3em" fill="white" font-family="system-ui" font-size="8" font-weight="600">${stock.symbol.charAt(0)}</text></svg>`;
              }}
            />

            <span className="font-bold text-gray-900 mr-2 min-w-[45px] flex-shrink-0">{stock.symbol}</span>
            <span className="text-gray-600 mr-2 min-w-[65px] text-sm flex-shrink-0">{stock.company_name}</span>
            <span className="text-gray-900 font-semibold mr-2 min-w-[65px] text-right flex-shrink-0">${stock.price.toFixed(2)}</span>

            <span className={`font-semibold min-w-[85px] text-right flex-shrink-0 ${stock.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {stock.change >= 0 ? '+' : ''}{stock.change.toFixed(2)} ({stock.percent_change.toFixed(2)}%)
            </span>
          </div>
        ))}
      </div>

      <div className="absolute left-0 top-0 w-20 h-full bg-gradient-to-r from-white to-transparent pointer-events-none"></div>
      <div className="absolute right-0 top-0 w-20 h-full bg-gradient-to-l from-white to-transparent pointer-events-none"></div>
    </div>
  )
}
