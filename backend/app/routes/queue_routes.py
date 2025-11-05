"""
Rotas da API para cálculo de modelos de fila

Este arquivo define todos os endpoints da API REST.
Cada modelo tem seu próprio endpoint POST.
"""

from flask import Blueprint, request, jsonify

# Criar blueprint para as rotas
queue_bp = Blueprint('queue', __name__)


# ==========================================
# TODO: Importar funções dos modelos
# ==========================================
# from app.models.mm1 import calculate_mm1
# from app.models.mms import calculate_mms
# from app.models.mm1k import calculate_mm1k
# from app.models.mmsk import calculate_mmsk
# from app.models.mm1n import calculate_mm1n
# from app.models.mmsn import calculate_mmsn
# from app.models.mg1 import calculate_mg1
# from app.models.priority import (
#     calculate_priority1,
#     calculate_priority2,
#     calculate_priority3,
#     calculate_priority4
# )


# ==========================================
# EXEMPLO DE ENDPOINT - M/M/1
# ==========================================
@queue_bp.route('/calculate/mm1', methods=['POST'])
def api_calculate_mm1():
    """
    Endpoint para calcular modelo M/M/1

    Espera JSON: { "lambda": float, "mu": float }
    Retorna JSON: { "rho": float, "L": float, ... }
    """
    try:
        # Pegar dados do request
        data = request.get_json()

        # Validar se os campos existem
        if not data or 'lambda' not in data or 'mu' not in data:
            return jsonify({
                'error': 'Campos obrigatórios: lambda, mu'
            }), 400

        lambda_ = float(data['lambda'])
        mu = float(data['mu'])

        # ==========================================
        # TODO: Descomentar quando implementar a função
        # ==========================================
        # result = calculate_mm1(lambda_, mu)
        # return jsonify(result), 200

        # Temporário - remover depois
        return jsonify({
            'error': 'Modelo M/M/1 ainda não implementado no backend'
        }), 501

    except ValueError as e:
        return jsonify({'error': str(e)}), 400
    except Exception as e:
        return jsonify({'error': f'Erro interno: {str(e)}'}), 500


# ==========================================
# TODO: Criar endpoints para outros modelos
# ==========================================

# @queue_bp.route('/calculate/mms', methods=['POST'])
# def api_calculate_mms():
#     """Endpoint para M/M/s"""
#     try:
#         data = request.get_json()
#         lambda_ = float(data['lambda'])
#         mu = float(data['mu'])
#         s = int(data['s'])
#
#         result = calculate_mms(lambda_, mu, s)
#         return jsonify(result), 200
#     except ValueError as e:
#         return jsonify({'error': str(e)}), 400
#     except Exception as e:
#         return jsonify({'error': str(e)}), 500


# @queue_bp.route('/calculate/mm1k', methods=['POST'])
# def api_calculate_mm1k():
#     """Endpoint para M/M/1/K"""
#     # TODO: Implementar
#     pass


# @queue_bp.route('/calculate/mmsk', methods=['POST'])
# def api_calculate_mmsk():
#     """Endpoint para M/M/s/K"""
#     # TODO: Implementar
#     pass


# @queue_bp.route('/calculate/mm1n', methods=['POST'])
# def api_calculate_mm1n():
#     """Endpoint para M/M/1/N"""
#     # TODO: Implementar
#     pass


# @queue_bp.route('/calculate/mmsn', methods=['POST'])
# def api_calculate_mmsn():
#     """Endpoint para M/M/s/N"""
#     # TODO: Implementar
#     pass


# @queue_bp.route('/calculate/mg1', methods=['POST'])
# def api_calculate_mg1():
#     """Endpoint para M/G/1"""
#     # TODO: Implementar
#     pass


# @queue_bp.route('/calculate/priority1', methods=['POST'])
# def api_calculate_priority1():
#     """Endpoint para Priority Model 1"""
#     # TODO: Implementar
#     pass


# @queue_bp.route('/calculate/priority2', methods=['POST'])
# def api_calculate_priority2():
#     """Endpoint para Priority Model 2"""
#     # TODO: Implementar
#     pass


# @queue_bp.route('/calculate/priority3', methods=['POST'])
# def api_calculate_priority3():
#     """Endpoint para Priority Model 3"""
#     # TODO: Implementar
#     pass


# @queue_bp.route('/calculate/priority4', methods=['POST'])
# def api_calculate_priority4():
#     """Endpoint para Priority Model 4"""
#     # TODO: Implementar
#     pass
