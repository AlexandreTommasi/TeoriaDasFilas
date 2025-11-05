"""
Modelo M/M/1/K - Fila com 1 servidor e capacidade máxima K

Fórmulas consideram que o sistema pode rejeitar clientes quando está cheio (K clientes).
"""

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

    # TODO: Implementar fórmulas do M/M/1/K
    # Neste modelo, o sistema pode rejeitar clientes

    raise NotImplementedError("Modelo M/M/1/K ainda não foi implementado.")
