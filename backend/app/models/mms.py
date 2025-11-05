"""
Modelo M/M/s - Fila com múltiplos servidores (s > 1)

Este módulo deve implementar todas as fórmulas do modelo M/M/s.

Referência das fórmulas:
- ρ = λ/(s*μ) (utilização por servidor)
- P0 = cálculo mais complexo (veja literatura)
- Lq = fórmula de Erlang C
- L = Lq + λ/μ
- Wq = Lq/λ
- W = Wq + 1/μ
"""

def calculate_mms(lambda_: float, mu: float, s: int) -> dict:
    """
    Calcula métricas do modelo M/M/s

    Args:
        lambda_ (float): Taxa de chegada
        mu (float): Taxa de atendimento por servidor
        s (int): Número de servidores

    Returns:
        dict: Métricas calculadas (definir campos conforme o modelo)

    Raises:
        ValueError: Se lambda >= s*mu (sistema instável)
    """

    # ==========================================
    # TODO: IMPLEMENTAR VALIDAÇÕES
    # ==========================================

    # ==========================================
    # TODO: IMPLEMENTAR FÓRMULAS DO M/M/s
    # ==========================================
    # Dica: Use numpy para cálculos mais complexos
    # import numpy as np

    raise NotImplementedError("Modelo M/M/s ainda não foi implementado.")
