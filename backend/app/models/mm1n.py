"""
Modelo M/M/1/N - Fila com população finita

Neste modelo, há N clientes no total que podem estar na fila ou em serviço.
"""
import math

def calculate_mm1n(lambda_: float, mu: float, N: int, n: int = None) -> dict:
    """
    Calcula métricas do modelo M/M/1/N

    Args:
        lambda_ (float): Taxa de chegada por cliente (quando fora do sistema)
        mu (float): Taxa de atendimento
        N (int): Tamanho da população (N ≥ 1)
        n (int, optional): Número de clientes para calcular P(n) (0 ≤ n ≤ N)

    Returns:
        dict: Métricas calculadas
            - rho: Fator de utilização (N×λ/μ)
            - P0: Probabilidade de sistema vazio
            - L: Número médio de clientes no sistema
            - Lq: Número médio de clientes na fila
            - W: Tempo médio no sistema
            - Wq: Tempo médio na fila
            - lambdaEfetivo: Taxa efetiva de chegada (λ(N-L))
            - numOperacionais: Número médio de clientes operacionais (N-L)
            - Pn (opcional): Probabilidade de n clientes
    """
    if not (lambda_ > 0 and mu > 0 and N >= 1):
        raise ValueError("λ > 0, μ > 0 e N ≥ 1 são necessários.")

    # ρ = N×λ/μ - fator de utilização
    rho = (N * lambda_) / mu
    
    # Razão λ/μ
    lambda_mu = lambda_ / mu
    
    # Função auxiliar para calcular combinação C(N,n)
    def combinacao(N, n):
        if n > N or n < 0:
            return 0
        return math.factorial(N) // (math.factorial(n) * math.factorial(N - n))
    
    # Cálculo de P0 usando a fórmula do modelo M/M/1/N
    # P0 = 1 / [Σ(n=0 até N) C(N,n)×(λ/μ)^n]
    soma = 0
    for i in range(N + 1):
        soma += combinacao(N, i) * (lambda_mu ** i)
    
    P0 = 1 / soma
    
    # Cálculo de L - número médio de clientes no sistema
    # L = Σ(n=0 até N) n × P(n)
    L = 0
    for i in range(N + 1):
        # P(n) = C(N,n) × (λ/μ)^n × P0  para n = 0 até N
        Pn = combinacao(N, i) * (lambda_mu ** i) * P0
        L += i * Pn
    
    # λ efetivo = λ(N - L)
    lambda_eff = lambda_ * (N - L)
    
    # N - L (número médio de clientes operacionais/fora do sistema)
    num_operacionais = N - L
    
    # W usando Lei de Little
    W = L / lambda_eff if lambda_eff > 0 else 0
    
    # Lq - número médio de clientes na fila
    # Lq = Σ(n=1 até N) (n-1) × P(n)
    # Ou Lq = L - (1 - P0) (clientes no sistema menos os em serviço)
    Lq = 0
    for i in range(1, N + 1):
        Pn = combinacao(N, i) * (lambda_mu ** i) * P0
        Lq += (i - 1) * Pn
    
    # Wq usando Lei de Little
    Wq = Lq / lambda_eff if lambda_eff > 0 else 0
    
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
    }
    
    # Cálculo opcional de P(n)
    if n is not None:
        if n < 0 or n > N:
            raise ValueError(f"O número de clientes (n) deve estar entre 0 e N={N}.")
        
        # P(n) = C(N,n) × (λ/μ)^n × P0  para n = 0 até N
        Pn = combinacao(N, n) * (lambda_mu ** n) * P0
        
        result['Pn'] = Pn
        result['n'] = n
    
    return result
