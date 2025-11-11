def calculate_mm1k(lambda_: float, mu: float, K: int, n: int = None) -> dict:
    """
    Calcula métricas do modelo M/M/1/K

    Args:
        lambda_ (float): Taxa de chegada
        mu (float): Taxa de atendimento
        K (int): Capacidade máxima do sistema
        n (int, optional): Número de clientes para calcular P(n) (0 ≤ n ≤ K)

    Returns:
        dict: Métricas calculadas
            - rho: λ/μ (pode ser > 1)
            - L: Número médio de clientes no sistema
            - Lq: Número médio de clientes na fila
            - W: Tempo médio no sistema
            - Wq: Tempo médio na fila
            - P0: Probabilidade de sistema vazio
            - PK: Probabilidade de sistema cheio (bloqueio)
            - lambdaEfetivo: Taxa efetiva de entrada
            - K: Capacidade do sistema
            - Pn (opcional): Probabilidade de n clientes
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

    # Construir resultado com métricas básicas
    result = {
        'rho': rho,
        'L': L,
        'Lq': Lq,
        'W': W,
        'Wq': Wq,
        'P0': P0,
        'PK': PK,
        'lambdaEfetivo': lambda_eff,
        'K': K
    }

    # Cálculos opcionais
    if n is not None:
        if n < 0 or n > K:
            raise ValueError(f"O número de clientes (n) deve estar entre 0 e K={K}.")

        # P(n) = P0 * ρ^n (para 0 ≤ n ≤ K)
        result['Pn'] = P0 * (rho ** n)
        result['n'] = n

    return result
