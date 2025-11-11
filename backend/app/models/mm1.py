"""
Modelo M/M/1 - Fila com 1 servidor

Este módulo deve implementar todas as fórmulas do modelo M/M/1.

Referência das fórmulas:
- ρ (rho) = λ/μ (utilização do servidor)
- L = ρ/(1-ρ) (número médio de clientes no sistema)
- Lq = ρ²/(1-ρ) (número médio de clientes na fila)
- W = 1/(μ-λ) (tempo médio no sistema)
- Wq = λ/(μ(μ-λ)) (tempo médio na fila)
- P0 = 1-ρ (probabilidade de sistema vazio)
"""

def calculate_mm1(lambda_: float, mu: float) -> dict:
    """
    Calcula métricas do modelo M/M/1

    Args:
        lambda_ (float): Taxa de chegada (clientes por unidade de tempo)
        mu (float): Taxa de atendimento (clientes por unidade de tempo)

    Returns:
        dict: Dicionário com as métricas calculadas:
            - rho: Utilização do servidor
            - L: Número médio de clientes no sistema
            - Lq: Número médio de clientes na fila
            - W: Tempo médio no sistema
            - Wq: Tempo médio na fila
            - P0: Probabilidade de sistema vazio

    Raises:
        ValueError: Se lambda >= mu (sistema instável) ou valores inválidos

    Exemplo:
        >>> calculate_mm1(3, 5)
        {
            'rho': 0.6,
            'L': 1.5,
            'Lq': 0.9,
            'W': 0.5,
            'Wq': 0.3,
            'P0': 0.4
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

    return {
        'rho': rho,
        'L': L,
        'Lq': Lq,
        'W': W,
        'Wq': Wq,
        'P0': P0
    }
