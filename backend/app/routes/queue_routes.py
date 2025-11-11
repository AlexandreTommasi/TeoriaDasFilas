from flask import Blueprint, request, jsonify
from app.models.mm1 import calculate_mm1
from app.models.mms import calculate_mms
from app.models.mm1k import calculate_mm1k

queue_bp = Blueprint('queue', __name__)

@queue_bp.route('/calculate/mm1', methods=['POST'])
def api_calculate_mm1():
    try:
        data = request.get_json()
        if not data or 'lambda' not in data or 'mu' not in data:
            return jsonify({'error': 'Campos obrigatórios: lambda, mu'}), 400

        lambda_ = float(data['lambda'])
        mu = float(data['mu'])

        # Parâmetros opcionais
        n = int(data['n']) if 'n' in data and data['n'] is not None and data['n'] != '' else None
        r = int(data['r']) if 'r' in data and data['r'] is not None and data['r'] != '' else None
        t = float(data['t']) if 't' in data and data['t'] is not None and data['t'] != '' else None

        result = calculate_mm1(lambda_, mu, n=n, r=r, t=t)
        return jsonify(result), 200
    except ValueError as e:
        return jsonify({'error': str(e)}), 400
    except Exception as e:
        return jsonify({'error': f'Erro interno: {str(e)}'}), 500

@queue_bp.route('/calculate/mms', methods=['POST'])
def api_calculate_mms():
    try:
        data = request.get_json()
        if not data or 'lambda' not in data or 'mu' not in data or 's' not in data:
            return jsonify({'error': 'Campos obrigatórios: lambda, mu, s'}), 400

        lambda_ = float(data['lambda'])
        mu = float(data['mu'])
        s = int(data['s'])

        # Parâmetros opcionais
        n = int(data['n']) if 'n' in data and data['n'] is not None and data['n'] != '' else None
        r = int(data['r']) if 'r' in data and data['r'] is not None and data['r'] != '' else None
        t = float(data['t']) if 't' in data and data['t'] is not None and data['t'] != '' else None

        result = calculate_mms(lambda_, mu, s, n=n, r=r, t=t)
        return jsonify(result), 200
    except ValueError as e:
        return jsonify({'error': str(e)}), 400
    except Exception as e:
        return jsonify({'error': f'Erro interno: {str(e)}'}), 500

@queue_bp.route('/calculate/mm1k', methods=['POST'])
def api_calculate_mm1k():
    try:
        data = request.get_json()
        if not data or 'lambda' not in data or 'mu' not in data or 'K' not in data:
            return jsonify({'error': 'Campos obrigatórios: lambda, mu, K'}), 400

        lambda_ = float(data['lambda'])
        mu = float(data['mu'])
        K = int(data['K'])

        # Parâmetros opcionais
        n = int(data['n']) if 'n' in data and data['n'] is not None and data['n'] != '' else None

        result = calculate_mm1k(lambda_, mu, K, n=n)
        return jsonify(result), 200
    except ValueError as e:
        return jsonify({'error': str(e)}), 400
    except Exception as e:
        return jsonify({'error': f'Erro interno: {str(e)}'}), 500

