"""
Modelo M/G/1 - Fila com distribuição geral de atendimento

Usa a fórmula de Pollaczek-Khinchin.
Requer média e variância do tempo de atendimento.
"""

def calculate_mg1(lambda_: float, mean_service: float, var_service: float) -> dict:
    """
    Calcula métricas do modelo M/G/1

    Args:
        lambda_ (float): Taxa de chegada
        mean_service (float): Tempo médio de atendimento (E[S])
        var_service (float): Variância do tempo de atendimento (Var[S])

    Returns:
        dict: Métricas calculadas

    Fórmula de Pollaczek-Khinchin para Lq:
    Lq = (λ² * Var[S] + (λ * E[S])²) / (2 * (1 - λ * E[S]))
    """

    # TODO: Implementar fórmulas do M/G/1
    # Use a fórmula de Pollaczek-Khinchin

    raise NotImplementedError("Modelo M/G/1 ainda não foi implementado.")
