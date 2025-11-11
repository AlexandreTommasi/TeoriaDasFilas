import math

def calculate_mms(lambda_: float, mu: float, s: int) -> dict:
    """
    Calcula métricas do modelo M/M/s

    Args:
        lambda_ (float): Taxa de chegada
        mu (float): Taxa de atendimento por servidor
        s (int): Número de servidores

    Returns:
        dict: Métricas calculadas

    Raises:
        ValueError: Se lambda >= s*mu (sistema instável) ou valores inválidos
    """
    if not (lambda_ > 0 and mu > 0 and s > 0):
        raise ValueError("As taxas de chegada (λ), atendimento (μ) e o número de servidores (s) devem ser positivos.")

    if lambda_ >= s * mu:
        raise ValueError("Sistema instável: a taxa de chegada (λ) deve ser menor que a capacidade total de atendimento (s * μ).")

    rho = lambda_ / (s * mu)
    
    # Cálculo de P0
    sum_part = sum([(s * rho)**n / math.factorial(n) for n in range(s)])
    last_part = (s * rho)**s / (math.factorial(s) * (1 - rho))
    P0 = 1 / (sum_part + last_part)

    # Cálculo de Lq (Erlang C)
    Lq = (P0 * (s * rho)**s * rho) / (math.factorial(s) * (1 - rho)**2)
    
    # Outras métricas
    L = Lq + lambda_ / mu
    Wq = Lq / lambda_
    W = Wq + 1 / mu

    return {
        'rho': rho,
        'L': L,
        'Lq': Lq,
        'W': W,
        'Wq': Wq,
        'P0': P0,
        's': s
    }
