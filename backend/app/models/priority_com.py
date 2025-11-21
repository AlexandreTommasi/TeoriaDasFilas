import math

def calculate_priority_com(s, mu, lambdas):
    """
    Interface para API - calcula métricas M/M/S com Prioridade COM Interrupção (Preemptive)

    Argumentos:
    s (int): Número de servidores
    mu (float): Taxa de atendimento por servidor
    lambdas (list[float]): Lista com taxas de chegada de cada classe (ordem: maior prioridade primeiro)

    Retorna:
    dict: Métricas calculadas por classe

    Lança:
    ValueError: Se o sistema for instável (ρ >= 1)
    """
    return calcular_prioridade_mms_com_interrupcao_api(s, mu, lambdas)

def calcular_prioridade_mms_com_interrupcao_api(s, mu, lambdas):
    """
    Calcula métricas de sistema M/M/S com prioridade COM interrupção (Preemptive)

    Fórmula (página 10 do PDF):
    W_k = (1/μ) / [(1 - Σ_{i=1}^{k-1} λᵢ/(sμ)) × (1 - Σ_{i=1}^k λᵢ/(sμ))]

    Retorna um dicionário com os resultados por classe
    """
    num_classes = len(lambdas)

    # --- Cálculos Preliminares ---
    lambda_total = sum(lambdas)

    # Rho do sistema (para verificar estabilidade)
    rho_sistema = lambda_total / (s * mu)

    if rho_sistema >= 1:
        raise ValueError(f"Sistema instável. Taxa de utilização (ρ) é {rho_sistema:.4f} (deve ser < 1).")

    # --- Cálculo por Classe (k) ---
    classes_results = []

    # Sigma acumulado até classe anterior
    sigma_acumulado = 0.0

    for k in range(num_classes):
        lambda_k = lambdas[k]

        # Sigma até classe k-1 (antes de adicionar lambda_k)
        sigma_k_menos_1 = sigma_acumulado

        # Adicionar lambda_k ao acumulado
        sigma_acumulado += lambda_k / (s * mu)
        sigma_k = sigma_acumulado

        # Fórmula de W (tempo no sistema) - COM INTERRUPÇÃO
        # W_k = (1/μ) / [(1 - σ_{k-1}) × (1 - σ_k)]
        denominador_W = (1 - sigma_k_menos_1) * (1 - sigma_k)
        W_k = (1 / mu) / denominador_W

        # Outras métricas
        Wq_k = W_k - (1 / mu)
        L_k = lambda_k * W_k
        Lq_k = lambda_k * Wq_k

        classes_results.append({
            "classe": k + 1,
            "L": L_k,
            "Lq": Lq_k,
            "W": W_k,
            "Wq": Wq_k,
            "lambda": lambda_k,
            "sigma": sigma_k
        })

    return {
        "rho": rho_sistema,
        "lambdaTotal": lambda_total,
        "capacidadeTotal": s * mu,
        "classes": classes_results
    }
