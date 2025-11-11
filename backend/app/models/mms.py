import math

def calculate_mms(lambda_: float, mu: float, s: int, n: int = None, r: int = None, t: float = None) -> dict:
    """
    Calcula métricas do modelo M/M/s

    Args:
        lambda_ (float): Taxa de chegada
        mu (float): Taxa de atendimento por servidor
        s (int): Número de servidores
        n (int, optional): Número de clientes para calcular P(n)
        r (int, optional): Limite para calcular P(n>r)
        t (float, optional): Tempo para calcular P(W>t) e P(Wq>t)

    Returns:
        dict: Métricas calculadas
            - rho: Taxa de ocupação por servidor
            - L: Número médio de clientes no sistema
            - Lq: Número médio de clientes na fila
            - W: Tempo médio no sistema
            - Wq: Tempo médio na fila
            - P0: Probabilidade de sistema vazio
            - PWqIgualZero (opcional): Probabilidade de não esperar
            - Pn (opcional): Probabilidade de n clientes
            - PnMaiorQueR (opcional): Probabilidade de mais de r clientes
            - PWMaiorQueT (opcional): Probabilidade de W > t
            - PWqMaiorQueT (opcional): Probabilidade de Wq > t

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

    # Construir resultado com métricas básicas
    result = {
        'rho': rho,
        'L': L,
        'Lq': Lq,
        'W': W,
        'Wq': Wq,
        'P0': P0,
        's': s
    }

    # Calcular C (Probabilidade de Erlang C - todos servidores ocupados)
    # C é útil para vários cálculos opcionais
    C = P0 * ((s * rho) ** s) / (math.factorial(s) * (1 - rho))

    # Probabilidade de não esperar na fila (atendimento imediato)
    # Sempre calculamos isso para M/M/s
    result['PWqIgualZero'] = 1 - C

    # Função auxiliar para calcular P(n)
    def calculate_Pn(n_val):
        if n_val < s:
            # n < s: P(n) = P0 * (λ/μ)^n / n!
            return P0 * ((lambda_ / mu) ** n_val) / math.factorial(n_val)
        else:
            # n >= s: P(n) = P0 * (λ/μ)^n / (s! * s^(n-s))
            return P0 * ((lambda_ / mu) ** n_val) / (math.factorial(s) * (s ** (n_val - s)))

    # Cálculos opcionais
    if n is not None:
        if n < 0:
            raise ValueError("O número de clientes (n) deve ser não-negativo.")
        result['Pn'] = calculate_Pn(n)
        result['n'] = n

    if r is not None:
        if r < 0:
            raise ValueError("O limite (r) deve ser não-negativo.")
        # P(n>r) - Probabilidade de mais de r clientes
        if r >= s:
            # Quando r >= s, usar fórmula: P(n>r) = P(r) * ρ/(1-ρ)
            Pr = calculate_Pn(r)
            result['PnMaiorQueR'] = Pr * rho / (1 - rho)
        else:
            # Para r < s, calcular soma das probabilidades
            # P(n>r) = 1 - sum(P(i) for i=0 to r)
            sum_prob = sum(calculate_Pn(i) for i in range(r + 1))
            result['PnMaiorQueR'] = 1 - sum_prob
        result['r'] = r

    if t is not None:
        if t < 0:
            raise ValueError("O tempo (t) deve ser não-negativo.")
        # P(Wq>t) = C * e^(-s*μ*(1-ρ)*t)
        result['PWqMaiorQueT'] = C * math.exp(-s * mu * (1 - rho) * t)

        # P(W>t) - Probabilidade de tempo no sistema > t
        # Aproximação: P(W>t) ≈ C * e^(-s*μ*(1-ρ)*(t - 1/μ)) se t > 1/μ, senão 1.0
        if t > 1 / mu:
            result['PWMaiorQueT'] = C * math.exp(-s * mu * (1 - rho) * (t - 1 / mu))
        else:
            result['PWMaiorQueT'] = 1.0
        result['t'] = t

    return result
