# api/index.py
from flask import Flask, jsonify, request
from datetime import datetime
from mock_data import (
    get_mock_stock_data,
    search_mock_stocks,
    MOCK_MARKET_DATA,
    MOCK_STOCK_DATA
)

app = Flask(__name__)


@app.route('/api/python')
def hello_world():
    return jsonify({
        'message': 'Hello from MarketMind Flask API!',
        'status': 'success',
        'version': '2.0.0 (Demo Mode)',
        'mode': 'demo'
    })


@app.route('/api/stock-data')
def get_stock_data():
    """Get stock data usando datos simulados locales"""
    symbol = request.args.get('symbol', 'AAPL').upper()
    period = request.args.get('period', '1mo')

    try:
        # Obtener datos simulados
        stock_data = get_mock_stock_data(symbol)

        if not stock_data:
            return jsonify({
                'success': False,
                'error': f'No data found for symbol {symbol}'
            }), 404

        return jsonify({
            'success': True,
            'symbol': stock_data['symbol'],
            'company_name': stock_data['company_name'],
            'sector': stock_data['sector'],
            'industry': stock_data['industry'],
            'current_data': stock_data['current_data'],
            'market_data': stock_data['market_data'],
            'technical_indicators': stock_data['technical_indicators'],
            'historical_data': stock_data['historical_data'][-30:],  # Últimos 30 días
            'records_count': stock_data['records_count'],
            'period': period,
            'data_source': 'Mock Data (Demo Mode)'
        })

    except Exception as e:
        return jsonify({
            'success': False,
            'error': f'Error fetching data for {symbol}: {str(e)}'
        }), 500


@app.route('/api/stock-search')
def search_stocks():
    """Search stocks usando datos simulados"""
    query = request.args.get('q', '').strip()

    if not query or len(query) < 1:
        return jsonify({
            'success': False,
            'error': 'Query parameter required'
        }), 400

    try:
        results = search_mock_stocks(query)

        return jsonify({
            'success': True,
            'results': results,
            'query': query,
            'source': 'mock_data'
        })

    except Exception as e:
        return jsonify({
            'success': False,
            'error': f'Error searching stocks: {str(e)}'
        }), 500


@app.route('/api/market-overview')
def market_overview():
    """Get market overview usando datos simulados"""
    try:
        return jsonify({
            'success': True,
            'market_data': MOCK_MARKET_DATA,
            'timestamp': datetime.now().isoformat(),
            'data_source': 'Mock Data (Demo Mode)'
        })

    except Exception as e:
        return jsonify({
            'success': False,
            'error': f'Error fetching market data: {str(e)}'
        }), 500


@app.route('/api/health')
def health_check():
    return jsonify({
        'status': 'healthy',
        'service': 'MarketMind API',
        'timestamp': datetime.now().isoformat(),
        'version': '2.0.0',
        'mode': 'demo',
        'data_sources': ['Mock Data'],
        'available_symbols': list(MOCK_STOCK_DATA.keys())
    })


# Error handlers
@app.errorhandler(404)
def not_found(error):
    return jsonify({
        'success': False,
        'error': 'Endpoint not found'
    }), 404


@app.errorhandler(500)
def internal_error(error):
    return jsonify({
        'success': False,
        'error': 'Internal server error'
    }), 500
