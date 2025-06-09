# api/mock_data.py
from datetime import datetime, timedelta
import random


# Función para obtener nombres de empresa más amigables
def get_company_display_name(symbol):
    display_names = {
        'AAPL': 'Apple',
        'GOOGL': 'Google',  # En lugar de Alphabet
        'MSFT': 'Microsoft',
        'AMZN': 'Amazon',
        'TSLA': 'Tesla',
        'META': 'Meta',  # En lugar de Meta Platforms Inc.
        'NVDA': 'NVIDIA',
        'NFLX': 'Netflix',
        'AMD': 'AMD',
        'INTC': 'Intel',
        'CRM': 'Salesforce',
        'ORCL': 'Oracle',
        'IBM': 'IBM',
        'UBER': 'Uber',
        'SPOT': 'Spotify',
        'PYPL': 'PayPal',
        'ADBE': 'Adobe',
        'SHOP': 'Shopify'
    }

    return display_names.get(symbol, symbol)


# Datos simulados para la demo con nombres corregidos
MOCK_STOCK_DATA = {
    "AAPL": {
        "symbol": "AAPL",
        "company_name": "Apple Inc.",
        "display_name": "Apple",
        "sector": "Technology",
        "industry": "Consumer Electronics",
        "current_data": {
            "price": 175.43,
            "change": 2.15,
            "percent_change": 1.24,
            "trend": "up",
            "high": 177.00,
            "low": 173.50,
            "volume": 75000000,
            "date": "2025-06-09 15:30:00"
        },
        "market_data": {
            "market_cap": 2700000000000,
            "pe_ratio": 28.5,
            "dividend_yield": 0.52,
            "beta": 1.2,
            "52_week_high": 199.62,
            "52_week_low": 164.08
        },
        "technical_indicators": {
            "sma_20": 172.85,
            "sma_50": 168.90,
            "volatility": 22.5,
            "rsi": 65.2
        }
    },
    "GOOGL": {
        "symbol": "GOOGL",
        "company_name": "Alphabet Inc.",
        "display_name": "Google",
        "sector": "Technology",
        "industry": "Internet Content & Information",
        "current_data": {
            "price": 2847.52,
            "change": -15.30,
            "percent_change": -0.53,
            "trend": "down",
            "high": 2865.00,
            "low": 2840.00,
            "volume": 1200000,
            "date": "2025-06-09 15:30:00"
        },
        "market_data": {
            "market_cap": 1800000000000,
            "pe_ratio": 25.8,
            "dividend_yield": 0.0,
            "beta": 1.1,
            "52_week_high": 3030.93,
            "52_week_low": 2193.62
        },
        "technical_indicators": {
            "sma_20": 2820.45,
            "sma_50": 2750.30,
            "volatility": 28.3,
            "rsi": 45.8
        }
    },
    "MSFT": {
        "symbol": "MSFT",
        "company_name": "Microsoft Corporation",
        "display_name": "Microsoft",
        "sector": "Technology",
        "industry": "Software—Infrastructure",
        "current_data": {
            "price": 378.85,
            "change": 4.12,
            "percent_change": 1.10,
            "trend": "up",
            "high": 380.50,
            "low": 375.20,
            "volume": 25000000,
            "date": "2025-06-09 15:30:00"
        },
        "market_data": {
            "market_cap": 2800000000000,
            "pe_ratio": 32.1,
            "dividend_yield": 0.72,
            "beta": 0.9,
            "52_week_high": 384.30,
            "52_week_low": 309.45
        },
        "technical_indicators": {
            "sma_20": 375.60,
            "sma_50": 365.80,
            "volatility": 24.7,
            "rsi": 58.9
        }
    },
    "TSLA": {
        "symbol": "TSLA",
        "company_name": "Tesla Inc.",
        "display_name": "Tesla",
        "sector": "Consumer Cyclical",
        "industry": "Auto Manufacturers",
        "current_data": {
            "price": 248.50,
            "change": 12.30,
            "percent_change": 5.20,
            "trend": "up",
            "high": 250.00,
            "low": 240.00,
            "volume": 50000000,
            "date": "2025-06-09 15:30:00"
        },
        "market_data": {
            "market_cap": 790000000000,
            "pe_ratio": 65.4,
            "dividend_yield": 0.0,
            "beta": 2.1,
            "52_week_high": 299.29,
            "52_week_low": 138.80
        },
        "technical_indicators": {
            "sma_20": 235.75,
            "sma_50": 220.40,
            "volatility": 45.2,
            "rsi": 72.3
        }
    },
    "AMZN": {
        "symbol": "AMZN",
        "company_name": "Amazon.com Inc.",
        "display_name": "Amazon",
        "sector": "Consumer Cyclical",
        "industry": "Internet Retail",
        "current_data": {
            "price": 3342.88,
            "change": -8.75,
            "percent_change": -0.26,
            "trend": "down",
            "high": 3355.00,
            "low": 3330.00,
            "volume": 3500000,
            "date": "2025-06-09 15:30:00"
        },
        "market_data": {
            "market_cap": 1700000000000,
            "pe_ratio": 42.8,
            "dividend_yield": 0.0,
            "beta": 1.3,
            "52_week_high": 3552.25,
            "52_week_low": 2671.45
        },
        "technical_indicators": {
            "sma_20": 3320.90,
            "sma_50": 3280.15,
            "volatility": 32.1,
            "rsi": 48.7
        }
    },
    "META": {
        "symbol": "META",
        "company_name": "Meta Platforms Inc.",
        "display_name": "Meta",
        "sector": "Communication Services",
        "industry": "Internet Content & Information",
        "current_data": {
            "price": 331.25,
            "change": 6.80,
            "percent_change": 2.10,
            "trend": "up",
            "high": 335.00,
            "low": 325.50,
            "volume": 18000000,
            "date": "2025-06-09 15:30:00"
        },
        "market_data": {
            "market_cap": 840000000000,
            "pe_ratio": 24.7,
            "dividend_yield": 0.37,
            "beta": 1.4,
            "52_week_high": 384.33,
            "52_week_low": 274.39
        },
        "technical_indicators": {
            "sma_20": 325.40,
            "sma_50": 315.80,
            "volatility": 38.9,
            "rsi": 61.5
        }
    }
}

# Datos de índices del mercado
MOCK_MARKET_DATA = [
    {
        "symbol": "^GSPC",
        "name": "S&P 500",
        "price": 4567.89,
        "change": 12.45,
        "percent_change": 0.27,
        "trend": "up"
    },
    {
        "symbol": "^DJI",
        "name": "Dow Jones",
        "price": 34567.12,
        "change": -45.67,
        "percent_change": -0.13,
        "trend": "down"
    },
    {
        "symbol": "^IXIC",
        "name": "NASDAQ",
        "price": 14234.56,
        "change": 89.34,
        "percent_change": 0.63,
        "trend": "up"
    },
    {
        "symbol": "^VIX",
        "name": "VIX",
        "price": 18.45,
        "change": -1.23,
        "percent_change": -6.25,
        "trend": "down"
    }
]

# Datos de búsqueda simulados con nombres corregidos
MOCK_SEARCH_DATA = [
    {"symbol": "AAPL", "name": "Apple Inc.", "exchange": "NASDAQ", "type": "stock"},
    {"symbol": "GOOGL", "name": "Google (Alphabet Inc.)", "exchange": "NASDAQ", "type": "stock"},
    {"symbol": "MSFT", "name": "Microsoft Corporation", "exchange": "NASDAQ", "type": "stock"},
    {"symbol": "TSLA", "name": "Tesla Inc.", "exchange": "NASDAQ", "type": "stock"},
    {"symbol": "AMZN", "name": "Amazon.com Inc.", "exchange": "NASDAQ", "type": "stock"},
    {"symbol": "META", "name": "Meta Platforms Inc.", "exchange": "NASDAQ", "type": "stock"}
]


def generate_historical_data(symbol, days=30):
    """Generar datos históricos simulados para una acción"""
    base_price = MOCK_STOCK_DATA.get(symbol, {}).get('current_data', {}).get('price', 100)
    historical = []

    for i in range(days, 0, -1):
        date = (datetime.now() - timedelta(days=i)).strftime('%Y-%m-%d')

        # Simular variación de precio más realista
        variation = random.uniform(-0.03, 0.03)  # ±3% variación diaria
        trend_factor = 1 + (variation * (i / days))
        price = base_price * trend_factor

        # Añadir algo de volatilidad
        daily_volatility = random.uniform(0.98, 1.02)
        price *= daily_volatility

        historical.append({
            'date': date,
            'open': round(price * random.uniform(0.995, 1.005), 2),
            'high': round(price * random.uniform(1.005, 1.025), 2),
            'low': round(price * random.uniform(0.975, 0.995), 2),
            'close': round(price, 2),
            'volume': random.randint(1000000, 100000000)
        })

    return historical


def get_mock_stock_data(symbol):
    """Obtener datos simulados de una acción específica"""
    if symbol not in MOCK_STOCK_DATA:
        return None

    data = MOCK_STOCK_DATA[symbol].copy()
    data['historical_data'] = generate_historical_data(symbol)
    data['records_count'] = len(data['historical_data'])
    data['period'] = '1mo'

    return data


def search_mock_stocks(query):
    """Buscar acciones en los datos simulados"""
    query_upper = query.upper()
    results = []

    for stock in MOCK_SEARCH_DATA:
        if (query_upper in stock['symbol'] or
                query_upper in stock['name'].upper()):
            results.append(stock)

    return results[:10]
