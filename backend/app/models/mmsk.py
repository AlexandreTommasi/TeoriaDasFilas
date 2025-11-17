"""
Modelo M/M/s/K - Múltiplos servidores com capacidade máxima
"""
import math

def calculate_mmsk(lambda_: float, mu: float, s: int, K: int, n: int = None) -> dict:
    """
    Calcula métricas do modelo M/M/s/K

    Args:
        lambda_ (float): Taxa de chegada
        mu (float): Taxa de atendimento por servidor
        s (int): Número de servidores (s ≥ 2)
        K (int): Capacidade máxima do sistema (K ≥ s)
        n (int, optional): Número de clientes para calcular P(n) (0 ≤ n ≤ K)

    Returns:
        dict: Métricas calculadas
            - rho: Taxa de ocupação por servidor (λ/(s×μ))
            - P0: Probabilidade de sistema vazio
            - PK: Probabilidade de sistema cheio (bloqueio)
            - lambdaEfetivo: Taxa efetiva de entrada
            - L: Número médio de clientes no sistema
            - Lq: Número médio de clientes na fila
            - W: Tempo médio no sistema
            - Wq: Tempo médio na fila
            - Pn (opcional): Probabilidade de n clientes
    """
    if not (lambda_ > 0 and mu > 0 and s >= 2 and K >= s):
        raise ValueError("λ > 0, μ > 0, s ≥ 2 e K ≥ s são necessários.")

    # ρ = λ/(s×μ)
    rho = lambda_ / (s * mu)
    
    # Cálculo de P0 usando a fórmula do PDF
    # P0 = 1 / [Σ(n=0 até s-1) (s×ρ)^n/n! + (s×ρ)^s/s! × Σ(n=s até K) ρ^(n-s)]
    
    # Primeira soma: n = 0 até s-1
    sum1 = 0
    s_rho = s * rho
    for i in range(s):
        sum1 += (s_rho ** i) / math.factorial(i)
    
    # Segunda soma: n = s até K
    # Σ(n=s até K) ρ^(n-s) = Σ(j=0 até K-s) ρ^j (onde j = n-s)
    if rho == 1:
        sum2 = K - s + 1  # quando ρ=1, a soma é simplesmente o número de termos
    else:
        sum2 = (1 - rho**(K - s + 1)) / (1 - rho)
    
    # P0 = 1 / [sum1 + (s×ρ)^s/s! × sum2]
    P0 = 1 / (sum1 + ((s_rho ** s) / math.factorial(s)) * sum2)
    
    # P(K) - Probabilidade de sistema cheio
    if K < s:
        # Se K < s (não deveria acontecer pela validação, mas por garantia)
        PK = P0 * ((s_rho ** K) / math.factorial(K))
    else:
        # K ≥ s: P(K) = P0 × (s×ρ)^s/s! × ρ^(K-s)
        PK = P0 * ((s_rho ** s) / math.factorial(s)) * (rho ** (K - s))
    
    # λ efetivo
    lambda_eff = lambda_ * (1 - PK)
    
    # Lq - Número médio de clientes na fila
    # Lq = P0 × (s×ρ)^s × ρ / s! × [1 - ρ^(K-s) - (K-s)×(1-ρ)×ρ^(K-s)] / (1-ρ)²
    if rho == 1:
        # Caso especial quando ρ = 1
        Lq = P0 * ((s_rho ** s) / math.factorial(s)) * ((K - s) * (K - s + 1) / 2)
    else:
        numerator = 1 - (rho ** (K - s)) - (K - s) * (1 - rho) * (rho ** (K - s))
        denominator = (1 - rho) ** 2
        Lq = P0 * ((s_rho ** s) * rho / math.factorial(s)) * (numerator / denominator)
    
    # L - Número médio de clientes no sistema
    # L = Lq + s - s×P0 - Σ(n=1 até s-1) (s-n)×P(n)
    # Ou alternativamente: L = Lq + λ_eff/μ (número médio em serviço)
    sum_busy = 0
    for i in range(1, s):
        # P(n) para n < s: P(n) = P0 × (s×ρ)^n / n!
        Pn_i = P0 * ((s_rho ** i) / math.factorial(i))
        sum_busy += (s - i) * Pn_i
    
    L = Lq + s - s * P0 - sum_busy
    
    # W e Wq usando Lei de Little
    W = L / lambda_eff if lambda_eff > 0 else 0
    Wq = Lq / lambda_eff if lambda_eff > 0 else 0
    
    # Construir resultado com métricas básicas
    result = {
        'rho': rho,
        'P0': P0,
        'PK': PK,
        'lambdaEfetivo': lambda_eff,
        'L': L,
        'Lq': Lq,
        'W': W,
        'Wq': Wq,
    }
    
    # Cálculo opcional de P(n)
    if n is not None:
        if n < 0 or n > K:
            raise ValueError(f"O número de clientes (n) deve estar entre 0 e K={K}.")
        
        if n < s:
            # P(n) = P0 × (s×ρ)^n / n!  para n < s
            Pn = P0 * ((s_rho ** n) / math.factorial(n))
        else:
            # P(n) = P0 × (s×ρ)^s / s! × ρ^(n-s)  para s ≤ n ≤ K
            Pn = P0 * ((s_rho ** s) / math.factorial(s)) * (rho ** (n - s))
        
        result['Pn'] = Pn
        result['n'] = n
    
    return result
