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

    # ==========================================
    # TODO: IMPLEMENTAR VALIDAÇÕES
    # ==========================================
    # Validar se lambda > 0 e mu > 0
    # Validar se lambda < mu (condição de estabilidade)
    # Se inválido, raise ValueError("mensagem de erro")

    # ==========================================
    # TODO: IMPLEMENTAR FÓRMULAS
    # ==========================================
    # rho = ?
    # L = ?
    # Lq = ?
    # W = ?
    # Wq = ?
    # P0 = ?

    # ==========================================
    # TODO: RETORNAR RESULTADOS
    # ==========================================
    # return {
    #     'rho': rho,
    #     'L': L,
    #     'Lq': Lq,
    #     'W': W,
    #     'Wq': Wq,
    #     'P0': P0
    # }

    raise NotImplementedError("Modelo M/M/1 ainda não foi implementado. Adicione as fórmulas acima.")
