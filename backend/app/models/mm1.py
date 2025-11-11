"""
Modelo M/M/1 - Fila com 1 servidor

Este módulo implementa todas as fórmulas do modelo M/M/1.

Referência das fórmulas:
- ρ (rho) = λ/μ (utilização do servidor)
- L = ρ/(1-ρ) (número médio de clientes no sistema)
- Lq = ρ²/(1-ρ) (número médio de clientes na fila)
- W = 1/(μ-λ) (tempo médio no sistema)
- Wq = λ/(μ(μ-λ)) (tempo médio na fila)
- P0 = 1-ρ (probabilidade de sistema vazio)
- P(n) = P0 * ρ^n (probabilidade de n clientes)
- P(n>r) = ρ^(r+1) (probabilidade de mais de r clientes)
- P(W>t) = e^(-(μ-λ)t) (probabilidade de tempo no sistema > t)
- P(Wq>t) = ρ * e^(-(μ-λ)t) (probabilidade de tempo na fila > t)
"""

import math

def calculate_mm1(lambda_: float, mu: float, n: int = None, r: int = None, t: float = None) -> dict:
    """
    Calcula métricas do modelo M/M/1

    Args:
        lambda_ (float): Taxa de chegada (clientes por unidade de tempo)
        mu (float): Taxa de atendimento (clientes por unidade de tempo)
        n (int, optional): Número de clientes para calcular P(n)
        r (int, optional): Limite para calcular P(n>r)
        t (float, optional): Tempo para calcular P(W>t) e P(Wq>t)

    Returns:
        dict: Dicionário com as métricas calculadas:
            - rho: Utilização do servidor
            - L: Número médio de clientes no sistema
            - Lq: Número médio de clientes na fila
            - W: Tempo médio no sistema
            - Wq: Tempo médio na fila
            - P0: Probabilidade de sistema vazio
            - Pn (opcional): Probabilidade de n clientes
            - PnMaiorQueR (opcional): Probabilidade de mais de r clientes
            - PWMaiorQueT (opcional): Probabilidade de W > t
            - PWqMaiorQueT (opcional): Probabilidade de Wq > t

    Raises:
        ValueError: Se lambda >= mu (sistema instável) ou valores inválidos

    Exemplo:
        >>> calculate_mm1(3, 5, n=2, r=3, t=1)
        {
            'rho': 0.6,
            'L': 1.5,
            'Lq': 0.9,
            'W': 0.5,
            'Wq': 0.3,
            'P0': 0.4,
            'Pn': 0.144,
            'PnMaiorQueR': 0.1296,
            'PWMaiorQueT': 0.1353,
            'PWqMaiorQueT': 0.0812
        }
    """

    if not (lambda_ > 0 and mu > 0):
        raise ValueError("As taxas de chegada (λ) e atendimento (μ) devem ser positivas.")

    if lambda_ >= mu:
        raise ValueError("Sistema instável: a taxa de chegada (λ) deve ser menor que a taxa de atendimento (μ).")

    rho = lambda_ / mu
    L = rho / (1 - rho)
    Lq = rho**2 / (1 - rho)
    W = 1 / (mu - lambda_)
    Wq = lambda_ / (mu * (mu - lambda_))
    P0 = 1 - rho

    # Construir resultado com métricas básicas
    result = {
        'rho': rho,
        'L': L,
        'Lq': Lq,
        'W': W,
        'Wq': Wq,
        'P0': P0
    }

    # Cálculos opcionais
    if n is not None:
        if n < 0:
            raise ValueError("O número de clientes (n) deve ser não-negativo.")
        # P(n) = P0 * ρ^n
        result['Pn'] = P0 * (rho ** n)
        result['n'] = n

    if r is not None:
        if r < 0:
            raise ValueError("O limite (r) deve ser não-negativo.")
        # P(n>r) = ρ^(r+1)
        result['PnMaiorQueR'] = rho ** (r + 1)
        result['r'] = r

    if t is not None:
        if t < 0:
            raise ValueError("O tempo (t) deve ser não-negativo.")
        # P(W>t) = e^(-(μ-λ)t)
        result['PWMaiorQueT'] = math.exp(-(mu - lambda_) * t)
        # P(Wq>t) = ρ * e^(-(μ-λ)t)
        result['PWqMaiorQueT'] = rho * math.exp(-(mu - lambda_) * t)
        result['t'] = t

    return result
