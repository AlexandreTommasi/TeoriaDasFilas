"""
Modelo M/M/s/N - Múltiplos servidores com população finita
"""
import math

def calculate_mmsn(lambda_: float, mu: float, s: int, N: int, n: int = None) -> dict:
    """
    Calcula métricas do modelo M/M/s/N

    Args:
        lambda_ (float): Taxa de chegada por cliente (quando fora do sistema)
        mu (float): Taxa de atendimento por servidor
        s (int): Número de servidores (s ≥ 2)
        N (int): Tamanho da população (N > s)
        n (int, optional): Número de clientes para calcular P(n) (0 ≤ n ≤ N)

    Returns:
        dict: Métricas calculadas
            - rho: Fator de utilização (N×λ/(s×μ))
            - P0: Probabilidade de sistema vazio
            - L: Número médio de clientes no sistema
            - Lq: Número médio de clientes na fila
            - W: Tempo médio no sistema
            - Wq: Tempo médio na fila
            - lambdaEfetivo: Taxa efetiva de chegada (λ(N-L))
            - numOperacionais: Número médio de clientes operacionais (N-L)
            - PWqIgualZero: Probabilidade de não esperar na fila
            - Pn (opcional): Probabilidade de n clientes
    """
    if not (lambda_ > 0 and mu > 0 and s >= 2 and N > s):
        raise ValueError("λ > 0, μ > 0, s ≥ 2 e N > s são necessários.")

    # ρ = N×λ/(s×μ) - fator de utilização
    rho = (N * lambda_) / (s * mu)
    
    # Cálculo de P0 usando a fórmula do PDF
    # P0 = 1 / [Σ(n=0 até s-1) C(N,n)×(λ/μ)^n + Σ(n=s até N) C(N,n)×(λ/μ)^n×(s^s/s!)/s^n]
    
    # Função auxiliar para calcular combinação C(N,n)
    def combinacao(N, n):
        if n > N or n < 0:
            return 0
        return math.factorial(N) // (math.factorial(n) * math.factorial(N - n))
    
    # Razão λ/μ
    lambda_mu = lambda_ / mu
    
    # Primeira soma: n = 0 até s-1
    sum1 = 0
    for i in range(min(s, N + 1)):
        sum1 += combinacao(N, i) * (lambda_mu ** i)
    
    # Segunda soma: n = s até N
    sum2 = 0
    s_fatorial = math.factorial(s)
    for i in range(s, N + 1):
        # C(N,n) × (λ/μ)^n × s^s / (s! × s^n)
        # = C(N,n) × (λ/μ)^n × s^s / (s! × s^n)
        # = C(N,n) × (λ/μ)^n × s^(s-n) / s!
        term = combinacao(N, i) * (lambda_mu ** i) * (s ** s) / (s_fatorial * (s ** i))
        sum2 += term
    
    P0 = 1 / (sum1 + sum2)
    
    # Cálculo de L - número médio de clientes no sistema
    # L = Σ(n=0 até N) n × P(n)
    L = 0
    for i in range(N + 1):
        if i < s:
            # P(n) = C(N,n) × (λ/μ)^n × P0  para n < s
            Pn = combinacao(N, i) * (lambda_mu ** i) * P0
        else:
            # P(n) = C(N,n) × (λ/μ)^n × s^s / (s! × s^n) × P0  para s ≤ n ≤ N
            Pn = combinacao(N, i) * (lambda_mu ** i) * (s ** s) / (s_fatorial * (s ** i)) * P0
        L += i * Pn
    
    # λ efetivo = λ(N - L)
    lambda_eff = lambda_ * (N - L)
    
    # N - L (número médio de clientes operacionais/fora do sistema)
    num_operacionais = N - L
    
    # W e Wq usando Lei de Little
    W = L / lambda_eff if lambda_eff > 0 else 0
    
    # Lq - número médio de clientes na fila
    # Lq = Σ(n=s até N) (n-s) × P(n)
    Lq = 0
    for i in range(s, N + 1):
        Pn = combinacao(N, i) * (lambda_mu ** i) * (s ** s) / (s_fatorial * (s ** i)) * P0
        Lq += (i - s) * Pn
    
    Wq = Lq / lambda_eff if lambda_eff > 0 else 0
    
    # P(Wq = 0) - Probabilidade de não esperar na fila
    # P(Wq = 0) = Σ(n=0 até s-1) P(n) (todos os clientes que chegam e não precisam esperar)
    PWqIgualZero = 0
    for i in range(min(s, N + 1)):
        Pn = combinacao(N, i) * (lambda_mu ** i) * P0
        PWqIgualZero += Pn
    
    # Construir resultado com métricas básicas
    result = {
        'rho': rho,
        'P0': P0,
        'L': L,
        'Lq': Lq,
        'W': W,
        'Wq': Wq,
        'lambdaEfetivo': lambda_eff,
        'numOperacionais': num_operacionais,
        'PWqIgualZero': PWqIgualZero,
    }
    
    # Cálculo opcional de P(n)
    if n is not None:
        if n < 0 or n > N:
            raise ValueError(f"O número de clientes (n) deve estar entre 0 e N={N}.")
        
        if n < s:
            # P(n) = C(N,n) × (λ/μ)^n × P0  para n < s
            Pn = combinacao(N, n) * (lambda_mu ** n) * P0
        else:
            # P(n) = C(N,n) × (λ/μ)^n × s^s / (s! × s^n) × P0  para s ≤ n ≤ N
            Pn = combinacao(N, n) * (lambda_mu ** n) * (s ** s) / (s_fatorial * (s ** n)) * P0
        
        result['Pn'] = Pn
        result['n'] = n
    
    return result
