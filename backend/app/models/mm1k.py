def calculate_mm1k(lambda_: float, mu: float, K: int) -> dict:
    """
    Calcula métricas do modelo M/M/1/K

    Args:
        lambda_ (float): Taxa de chegada
        mu (float): Taxa de atendimento
        K (int): Capacidade máxima do sistema

    Returns:
        dict: Métricas calculadas
    """
    if not (lambda_ > 0 and mu > 0 and K > 0):
        raise ValueError("As taxas de chegada (λ), atendimento (μ) e a capacidade (K) devem ser positivas.")

    rho = lambda_ / mu
    
    if rho == 1:
        P0 = 1 / (K + 1)
        L = K / 2
    else:
        P0 = (1 - rho) / (1 - rho**(K + 1))
        L_num = rho * (1 - (K + 1) * rho**K + K * rho**(K + 1))
        L_den = (1 - rho) * (1 - rho**(K + 1))
        L = L_num / L_den

    PK = P0 * (rho**K)
    lambda_eff = lambda_ * (1 - PK)
    
    W = L / lambda_eff
    Lq = L - (1 - P0)
    Wq = Lq / lambda_eff
    
    return {
        'rho': rho,
        'L': L,
        'Lq': Lq,
        'W': W,
        'Wq': Wq,
        'P0': P0,
        'PK': PK,
        'lambda_eff': lambda_eff,
        'K': K
    }
