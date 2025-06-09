'use client'

import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { Line, Bar } from 'react-chartjs-2'
import StockTicker from '../components/StockTicker'
import ScrollFadeIn from '../components/ScrollFadeIn'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
)

interface StockData {
  success: boolean
  symbol: string
  company_name: string
  current_data: {
    price: number
    change: number
    percent_change: number
    trend: 'up' | 'down'
    high: number
    low: number
    volume: number
    date: string
  }
  market_data: {
    market_cap: string | number
    pe_ratio: string | number
    dividend_yield: string | number
    beta: string | number
    '52_week_high': string | number
    '52_week_low': string | number
  }
  technical_indicators: {
    sma_20: number | null
    sma_50: number | null
    volatility: number
    rsi: number | null
  }
  historical_data: Array<{
    date: string
    open: number
    high: number
    low: number
    close: number
    volume: number
  }>
}

interface MarketOverview {
  success: boolean
  market_data: Array<{
    symbol: string
    name: string
    price: number
    change: number
    percent_change: number
    trend: 'up' | 'down'
  }>
}

interface SearchResult {
  symbol: string
  name: string
  exchange: string
  type: string
}

function getLogoUrl(symbol: string): string {
  const token = process.env.NEXT_PUBLIC_LOGO_DEV_TOKEN;

  // Logo específico para Apple en blanco
  if (symbol === 'AAPL') {
    return 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="white"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/></svg>';
  }

  if (!token) {
    return `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><text x="50%" y="50%" text-anchor="middle" dy=".3em" fill="white" font-family="system-ui" font-size="12" font-weight="600">${symbol.charAt(0)}</text></svg>`;
  }

  return `https://img.logo.dev/ticker/${symbol}?token=${token}&format=png&retina=true`;
}

export default function Home() {
  const [isLoaded, setIsLoaded] = useState(false)
  const [stockData, setStockData] = useState<StockData | null>(null)
  const [marketData, setMarketData] = useState<MarketOverview | null>(null)
  const [searchResults, setSearchResults] = useState<SearchResult[]>([])
  const [symbol, setSymbol] = useState('AAPL')
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showSearch, setShowSearch] = useState(false)
  const [filterType, setFilterType] = useState<'all' | 'stock' | 'etf'>('all')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const timer = setTimeout(() => {
      setIsLoaded(true)
    }, 300)

    fetchMarketOverview()
    fetchStockData('AAPL')

    return () => clearTimeout(timer)
  }, [])

  const fetchStockData = async (stockSymbol: string) => {
    setLoading(true)
    setError('')
    setShowSearch(false)

    try {
      const response = await fetch(`/api/stock-data?symbol=${stockSymbol}&period=3mo`)
      const data = await response.json()

      if (data.success) {
        setStockData(data)
        setSymbol(stockSymbol)
      } else {
        setError(data.error || 'Failed to fetch stock data')
      }
    } catch (err) {
      setError('Network error. Please try again.')
      console.error('Error:', err)
    }

    setLoading(false)
  }

  const fetchMarketOverview = async () => {
    try {
      const response = await fetch('/api/market-overview')
      const data = await response.json()

      if (data.success) {
        setMarketData(data)
      }
    } catch (err) {
      console.error('Error fetching market data:', err)
    }
  }

  const searchStocks = async (query: string) => {
    if (query.length < 1) {
      setSearchResults([])
      return
    }

    try {
      const response = await fetch(`/api/stock-search?q=${query}`)
      const data = await response.json()

      if (data.success) {
        setSearchResults(data.results)
      }
    } catch (err) {
      console.error('Error searching stocks:', err)
    }
  }

  const handleSearchInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value
    setSearchQuery(query)
    setShowSearch(true)
    searchStocks(query)
  }

  const selectStock = (selectedSymbol: string) => {
    fetchStockData(selectedSymbol)
    setSearchQuery('')
    setSearchResults([])
    setShowSearch(false)
  }

  const filteredResults = searchResults.filter(result => {
    if (filterType === 'all') return true
    return result.type === filterType
  })

  const priceChartData = stockData ? {
    labels: stockData.historical_data.slice(-30).map(d =>
      new Date(d.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    ),
    datasets: [
      {
        label: 'Close Price',
        data: stockData.historical_data.slice(-30).map(d => d.close),
        borderColor: '#ffffff',
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 3,
        fill: true,
        tension: 0.4,
        pointBackgroundColor: '#ffffff',
        pointBorderColor: '#000000',
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
      }
    ]
  } : null

  const volumeChartData = stockData ? {
    labels: stockData.historical_data.slice(-15).map(d =>
      new Date(d.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    ),
    datasets: [
      {
        label: 'Volume',
        data: stockData.historical_data.slice(-15).map(d => d.volume),
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        borderColor: '#ffffff',
        borderWidth: 2,
        borderRadius: 4,
      }
    ]
  } : null

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.9)',
        titleColor: '#ffffff',
        bodyColor: '#ffffff',
        borderColor: 'rgba(255, 255, 255, 0.3)',
        borderWidth: 1,
        cornerRadius: 8,
      },
    },
    scales: {
      x: {
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
        ticks: {
          color: 'rgba(255, 255, 255, 0.8)',
        },
      },
      y: {
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
        ticks: {
          color: 'rgba(255, 255, 255, 0.8)',
        },
      },
    },
  }

  // PORTAL COMPONENT PARA EL DROPDOWN - SIN SCROLL BARS
  const SearchDropdown = () => {
    if (!mounted || !showSearch || filteredResults.length === 0) return null

    return createPortal(
      <div
        className="fixed rounded-lg shadow-2xl border border-white/20"
        style={{
          zIndex: 999999,
          top: '70px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '400px',
          maxHeight: '240px',
          backgroundColor: 'rgba(0, 0, 0, 0.98)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.3)',
          overflow: 'hidden'
        }}
      >
        <div
          style={{
            maxHeight: '240px',
            overflowY: 'auto',
            scrollbarWidth: 'none',
            msOverflowStyle: 'none'
          }}
          className="[&::-webkit-scrollbar]:hidden"
        >
          {filteredResults.slice(0, 5).map((result, index) => (
            <div
              key={index}
              onClick={() => selectStock(result.symbol)}
              className="p-3 hover:bg-white/10 cursor-pointer border-b border-white/10 last:border-b-0 flex items-center transition-all duration-200"
            >
              <img
                src={getLogoUrl(result.symbol)}
                alt={`${result.symbol} logo`}
                className="w-6 h-6 mr-3 object-contain"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><rect width="24" height="24" rx="4" fill="%23374151"/><text x="50%" y="50%" text-anchor="middle" dy=".3em" fill="white" font-family="system-ui" font-size="10" font-weight="600">${result.symbol.charAt(0)}</text></svg>`;
                }}
              />
              <div className="flex-1">
                <div className="font-bold text-white text-sm">{result.symbol}</div>
                <div className="text-xs text-gray-300 truncate">{result.name}</div>
              </div>
            </div>
          ))}
        </div>
      </div>,
      document.body
    )
  }

  return (
    <main className="min-h-screen bg-black text-white">
      {/* Navigation Header */}
      <nav className={`glass-dark transition-all duration-1000 ${
        isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
      }`}>
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Left Section */}
            <div className="flex items-center space-x-4 flex-1">
              <h1 className="text-2xl font-bold text-white tracking-tight">
                🧠 MarketMind
              </h1>
              <span className="text-sm text-gray-300 glass px-3 py-1 rounded-full font-medium">
                AI-Powered Analytics
              </span>
            </div>

            {/* Center Section - BUSCADOR LIMPIO */}
            <div className="flex-1 max-w-md mx-8">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={handleSearchInput}
                  onFocus={() => setShowSearch(true)}
                  onBlur={() => setTimeout(() => setShowSearch(false), 200)}
                  placeholder="Search stocks..."
                  className="w-full px-4 py-2 rounded-lg bg-white/10 text-white placeholder-gray-400 border border-white/20 focus:ring-2 focus:ring-white/30 focus:border-white/40 transition-all duration-300 font-medium text-sm"
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Right Section */}
            <div className="flex items-center text-sm text-gray-300 font-medium flex-1 justify-end">
              <span className="inline-block w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></span>
              Live Market Data • Real-time Analysis
            </div>
          </div>
        </div>
      </nav>

      {/* DROPDOWN RENDERIZADO CON PORTAL - SIN SCROLL BARS */}
      <SearchDropdown />

      {/* Stock Ticker con animación */}
      <ScrollFadeIn direction="down">
        <StockTicker />
      </ScrollFadeIn>

      <div className="container mx-auto px-6 py-8">
        {/* Market Overview Cards */}
        {marketData && (
          <div className="mb-8">
            <ScrollFadeIn direction="left" delay={200}>
              <h2 className="text-2xl font-bold text-white mb-6 tracking-tight">
                Market Overview
              </h2>
            </ScrollFadeIn>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {marketData.market_data.map((index, i) => (
                <ScrollFadeIn key={index.symbol} direction="up" delay={300 + i * 100}>
                  <div className="glass rounded-2xl p-6 hover-lift">
                    <div className="flex items-center justify-between mb-3">
                      <div className="text-sm font-medium text-gray-300">{index.name}</div>
                      <div className={`text-xs px-3 py-1 rounded-full font-medium ${
                        index.trend === 'up' 
                          ? 'bg-green-500/20 text-green-300 border border-green-500/30' 
                          : 'bg-red-500/20 text-red-300 border border-red-500/30'
                      }`}>
                        {index.trend === 'up' ? '↗' : '↘'}
                      </div>
                    </div>
                    <div className="text-2xl font-bold text-white mb-2 tracking-tight">
                      {index.price.toLocaleString()}
                    </div>
                    <div className={`text-sm font-medium ${index.trend === 'up' ? 'text-green-300' : 'text-red-300'}`}>
                      {index.change > 0 ? '+' : ''}{index.change} ({index.percent_change.toFixed(2)}%)
                    </div>
                  </div>
                </ScrollFadeIn>
              ))}
            </div>
          </div>
        )}

        {/* Main Dashboard */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-1 space-y-6">
            {/* Popular Stocks */}
            <ScrollFadeIn direction="left" delay={400}>
              <div className="glass rounded-2xl p-6 hover-lift">
                <h3 className="text-xl font-bold text-white mb-6 tracking-tight">Popular Stocks</h3>
                <div className="grid grid-cols-2 gap-3">
                  {['AAPL', 'GOOGL', 'MSFT', 'TSLA', 'AMZN', 'META'].map((stock, i) => (
                    <button
                      key={stock}
                      onClick={() => fetchStockData(stock)}
                      className={`p-3 rounded-xl text-sm font-bold transition-all duration-300 flex items-center justify-center hover:scale-105 ${
                        symbol === stock
                          ? 'bg-white text-black shadow-lg'
                          : 'glass text-white hover:bg-white/10'
                      }`}
                    >
                      <img
                        src={getLogoUrl(stock)}
                        alt={`${stock} logo`}
                        className="w-4 h-4 mr-2 object-contain"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16"><rect width="16" height="16" rx="2" fill="%23374151"/><text x="50%" y="50%" text-anchor="middle" dy=".3em" fill="white" font-family="system-ui" font-size="8" font-weight="600">${stock.charAt(0)}</text></svg>`;
                        }}
                      />
                      {stock}
                    </button>
                  ))}
                </div>
              </div>
            </ScrollFadeIn>

            {/* Technical Indicators */}
            {stockData && (
              <ScrollFadeIn direction="left" delay={500}>
                <div className="glass rounded-2xl p-6 hover-lift">
                  <h3 className="text-xl font-bold text-white mb-6 tracking-tight">Technical Analysis</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center hover:bg-white/5 p-3 rounded-xl transition-all duration-200">
                      <span className="text-gray-300 font-medium">RSI (14)</span>
                      <span className={`font-bold ${
                        stockData.technical_indicators.rsi 
                          ? stockData.technical_indicators.rsi > 70 
                            ? 'text-red-400' 
                            : stockData.technical_indicators.rsi < 30 
                              ? 'text-green-400' 
                              : 'text-white'
                          : 'text-gray-500'
                      }`}>
                        {stockData.technical_indicators.rsi?.toFixed(1) || 'N/A'}
                      </span>
                    </div>
                    <div className="flex justify-between items-center hover:bg-white/5 p-3 rounded-xl transition-all duration-200">
                      <span className="text-gray-300 font-medium">SMA 20</span>
                      <span className="text-white font-bold">
                        {stockData.technical_indicators.sma_20 ? `$${stockData.technical_indicators.sma_20}` : 'N/A'}
                      </span>
                    </div>
                    <div className="flex justify-between items-center hover:bg-white/5 p-3 rounded-xl transition-all duration-200">
                      <span className="text-gray-300 font-medium">Volatility</span>
                      <span className="text-white font-bold">
                        {stockData.technical_indicators.volatility.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                </div>
              </ScrollFadeIn>
            )}
          </div>

          {/* Right Column */}
          <div className="lg:col-span-2 space-y-6">
            {error && (
              <div className="glass rounded-2xl p-4 border-l-4 border-red-500 animate-fade-in-up">
                <p className="text-red-300 font-medium">{error}</p>
              </div>
            )}

            {loading && (
              <div className="glass rounded-2xl p-12 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
                <p className="text-gray-300 font-medium">Loading stock data...</p>
              </div>
            )}

            {stockData && (
              <>
                {/* Stock Header */}
                <ScrollFadeIn direction="right" delay={400}>
                  <div className="glass rounded-2xl p-8 hover-lift">
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center">
                        <img
                          src={getLogoUrl(stockData.symbol)}
                          alt={`${stockData.symbol} logo`}
                          className="w-16 h-16 mr-6 object-contain hover:scale-110 transition-transform duration-300"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64"><rect width="64" height="64" rx="12" fill="%23374151"/><text x="50%" y="50%" text-anchor="middle" dy=".3em" fill="white" font-family="system-ui" font-size="24" font-weight="600">${stockData.symbol.charAt(0)}</text></svg>`;
                          }}
                        />
                        <div>
                          <div className="flex items-center">
                            <h2 className="text-4xl font-bold text-white tracking-tight mr-3">{stockData.symbol}</h2>
                            <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                          </div>
                          <p className="text-gray-300 font-medium text-lg">{stockData.company_name}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-4xl font-bold text-white tracking-tight">
                          ${stockData.current_data.price}
                        </div>
                        <div className={`text-xl flex items-center justify-end font-bold ${
                          stockData.current_data.trend === 'up' ? 'text-green-400' : 'text-red-400'
                        }`}>
                          <span className="mr-2">
                            {stockData.current_data.trend === 'up' ? '↗' : '↘'}
                          </span>
                          {stockData.current_data.change > 0 ? '+' : ''}{stockData.current_data.change}
                          ({stockData.current_data.percent_change.toFixed(2)}%)
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-4 gap-4">
                      {[
                        { label: 'High', value: `$${stockData.current_data.high}` },
                        { label: 'Low', value: `$${stockData.current_data.low}` },
                        { label: 'Volume', value: `${(stockData.current_data.volume / 1000000).toFixed(1)}M` },
                        { label: 'P/E Ratio', value: typeof stockData.market_data.pe_ratio === 'number' ? stockData.market_data.pe_ratio.toFixed(2) : 'N/A' }
                      ].map((item, i) => (
                        <div key={item.label} className="text-center hover:bg-white/5 p-4 rounded-xl transition-all duration-300 hover:scale-105 glass">
                          <div className="text-sm text-gray-300 font-medium">{item.label}</div>
                          <div className="text-xl font-bold text-white tracking-tight">{item.value}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </ScrollFadeIn>

                {/* Price Chart */}
                {priceChartData && (
                  <ScrollFadeIn direction="up" delay={500}>
                    <div className="glass rounded-2xl p-8 hover-lift">
                      <h3 className="text-xl font-bold text-white mb-6 tracking-tight">Price Trend (30 Days)</h3>
                      <div className="h-80">
                        <Line data={priceChartData} options={chartOptions} />
                      </div>
                    </div>
                  </ScrollFadeIn>
                )}

                {/* Volume Chart */}
                {volumeChartData && (
                  <ScrollFadeIn direction="up" delay={600}>
                    <div className="glass rounded-2xl p-8 hover-lift">
                      <h3 className="text-xl font-bold text-white mb-6 tracking-tight">Volume Analysis (15 Days)</h3>
                      <div className="h-64">
                        <Bar data={volumeChartData} options={chartOptions} />
                      </div>
                    </div>
                  </ScrollFadeIn>
                )}

                {/* AI Prediction */}
                <ScrollFadeIn direction="up" delay={700}>
                  <div className="glass rounded-2xl p-8 hover-lift border border-white/20">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-2xl font-bold text-white tracking-tight">🤖 AI Predictions</h3>
                      <span className="text-sm glass text-white px-4 py-2 rounded-full font-medium animate-pulse">
                        Coming Soon
                      </span>
                    </div>
                    <p className="text-gray-300 mb-6 font-medium">
                      Advanced LSTM neural network predictions for {stockData.symbol} will be available soon.
                    </p>
                    <div className="grid grid-cols-3 gap-4">
                      {['1 Day', '1 Week', '1 Month'].map((period, i) => (
                        <div key={period} className="glass rounded-xl p-4 text-center hover:bg-white/5 transition-all duration-300 hover:scale-105">
                          <div className="text-sm text-gray-300 font-medium">{period}</div>
                          <div className="text-2xl font-bold text-white tracking-tight">--</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </ScrollFadeIn>
              </>
            )}
          </div>
        </div>
      </div>

      {/* FOOTER MINIMALISTA */}
      <ScrollFadeIn direction="up" delay={800}>
        <footer className="glass-dark border-t border-white/10 mt-16">
          <div className="container mx-auto px-6 py-8">
            <div className="text-center">
              <p className="text-gray-400 text-sm font-medium">
                © 2025 • Made by <span className="text-white font-semibold">Jaime</span>
              </p>
            </div>
          </div>
        </footer>
      </ScrollFadeIn>
    </main>
  )
}
