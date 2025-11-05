"""
Modelo M/M/1/N - Fila com população finita

Neste modelo, há N clientes no total que podem estar na fila ou em serviço.
"""

def calculate_mm1n(lambda_: float, mu: float, N: int) -> dict:
    """
    Calcula métricas do modelo M/M/1/N

    Args:
        lambda_ (float): Taxa de chegada por cliente
        mu (float): Taxa de atendimento
        N (int): Tamanho da população

    Returns:
        dict: Métricas calculadas
    """

    # TODO: Implementar fórmulas do M/M/1/N
    # Note que a taxa efetiva de chegada muda com o número de clientes no sistema

    raise NotImplementedError("Modelo M/M/1/N ainda não foi implementado.")
