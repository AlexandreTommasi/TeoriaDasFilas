import math

def calculate_priority_sem(s, mu, lambdas):
    """
    Interface para API - calcula métricas M/M/S com Prioridade Sem Interrupção

    Argumentos:
    s (int): Número de servidores
    mu (float): Taxa de atendimento por servidor
    lambdas (list[float]): Lista com taxas de chegada de cada classe (ordem: maior prioridade primeiro)

    Retorna:
    dict: Métricas calculadas por classe

    Lança:
    ValueError: Se o sistema for instável (ρ >= 1)
    """
    return calcular_prioridade_mms_sem_interrupcao_api(s, mu, lambdas)

def calcular_prioridade_mms_sem_interrupcao_api(s, mu, lambdas):
    """
    Calcula métricas de sistema M/M/S com prioridade sem interrupção

    Retorna um dicionário com os resultados por classe
    """
    num_classes = len(lambdas)

    # --- 2. Cálculos Preliminares ---
    lambda_total = sum(lambdas)

    # r = taxa total / mu
    r = lambda_total / mu

    # Rho do sistema (para verificar estabilidade)
    rho_sistema = lambda_total / (s * mu)

    if rho_sistema >= 1:
        raise ValueError(f"Sistema instável. Taxa de utilização (ρ) é {rho_sistema:.4f} (deve ser < 1).")

    # --- 3. Cálculo do Termo Constante 'A' ---
    # Somatório: sum_{j=0}^{s-1} (r^j / j!)
    somatorio = 0
    for j in range(s):
        term = (r**j) / math.factorial(j)
        somatorio += term

    numerador_termo = math.factorial(s) * ((s * mu) - lambda_total)
    denominador_termo = r**s

    # Termo A que aparece multiplicando os sigmas no denominador final
    termo_A = ((numerador_termo / denominador_termo) * somatorio) + (s * mu)

    # --- 4. Cálculo por Classe (k) ---
    classes_results = []

    # Sigma anterior (sigma_{k-1}) começa com 0 para a primeira classe
    sigma_anterior = 0.0

    # Sigma atual acumulado
    sigma_atual_acumulado = 0.0

    for k in range(num_classes):
        lambda_k = lambdas[k]

        # Calcular Sigma_k
        sigma_atual_acumulado += lambda_k / (s * mu)
        sigma_k = sigma_atual_acumulado

        # Fórmula de W (tempo no sistema)
        denominador_W = termo_A * (1 - sigma_anterior) * (1 - sigma_k)
        W_k = (1 / denominador_W) + (1 / mu)

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

        # Atualiza o sigma anterior para a próxima iteração
        sigma_anterior = sigma_k

    return {
        "rho": rho_sistema,
        "lambdaTotal": lambda_total,
        "capacidadeTotal": s * mu,
        "termoA": termo_A,
        "classes": classes_results
    }

def calcular_prioridade_mms_sem_interrupcao():
    print("=== Sistema de Filas com Prioridade M/M/S (Sem Interrupção) ===")
    print("Nota: As classes devem ser inseridas da maior prioridade (1) para a menor.")
    
    # --- 1. Entrada de Dados ---
    try:
        s = int(input("Digite o número de servidores (S): "))
        mu = float(input("Digite a taxa de serviço por servidor (μ): "))
        
        num_classes = int(input("Quantas classes de prioridade existem? "))
        
        lambdas = []
        for k in range(num_classes):
            l = float(input(f"Digite a taxa de chegada (λ) para a Classe {k+1}: "))
            lambdas.append(l)
            
    except ValueError:
        print("Erro: Por favor, insira apenas números válidos.")
        return

    # --- 2. Cálculos Preliminares ---
    lambda_total = sum(lambdas)
    
    # r = taxa total / mu (atenção: não é rho ainda)
    r = lambda_total / mu
    
    # Rho do sistema (para verificar estabilidade)
    rho_sistema = lambda_total / (s * mu)
    
    print("-" * 40)
    print(f"Lambda Total (λ): {lambda_total:.4f}")
    print(f"Capacidade Total (s*μ): {s*mu:.4f}")
    print(f"Utilização do Sistema (ρ): {rho_sistema:.4f}")
    
    if rho_sistema >= 1:
        print("ERRO: O sistema é instável (ρ >= 1). A fila crescerá infinitamente.")
        return

    # --- 3. Cálculo do Termo Constante 'A' (Parte Grande da Fórmula) ---
    # A fórmula tem um denominador complexo que se repete.
    # Vamos chamar o termo dentro dos colchetes grandes de 'Denominador Base' antes de multiplicar pelos sigmas.
    # A fórmula é: [ ( s! * (s*mu - lambda_total) / r^s ) * SOMATORIO + s*mu ]
    
    # Somatório: sum_{j=0}^{s-1} (r^j / j!)
    somatorio = 0
    for j in range(s):
        term = (r**j) / math.factorial(j)
        somatorio += term
        

    numerador_termo = math.factorial(s) * ((s * mu) - lambda_total)
    

    denominador_termo = r**s
    
    # Montando o termo A (que aparece multiplicando os sigmas no denominador final)
    # A = [Esquerda * Somatorio + Direita]
    termo_A = ((numerador_termo / denominador_termo) * somatorio) + (s * mu)
    
    # --- 4. Cálculo por Classe (k) ---
    print("-" * 40)
    print(f"{'Classe':<8} | {'L':<10} | {'Lq':<10} | {'W':<10} | {'Wq':<10}")
    print("-" * 40)
    
    # Sigma anterior (sigma_{k-1}) começa com 0 para a primeira classe
    sigma_anterior = 0.0 
    
    # Sigma atual acumulado
    sigma_atual_acumulado = 0.0
    
    for k in range(num_classes):
        lambda_k = lambdas[k]
        
        # Calcular Sigma_k (Soma dos lambdas até k / s*mu)
        # Na formula da imagem: Sum(lambda_i) / s*mu
        sigma_atual_acumulado += lambda_k / (s * mu)
        sigma_k = sigma_atual_acumulado
        
        # --- APLICAÇÃO DA FÓRMULA DE W (TEMPO NO SISTEMA) ---
        # W = 1 / [ A * (1 - sigma_{k-1}) * (1 - sigma_k) ] + 1/mu
        
        denominador_W = termo_A * (1 - sigma_anterior) * (1 - sigma_k)
        
        W_k = (1 / denominador_W) + (1 / mu)
        
        # --- Outras Métricas ---
        # Wq = W - 1/mu
        Wq_k = W_k - (1 / mu)
        
        # L = lambda * W
        L_k = lambda_k * W_k
        
        # Lq = L - lambda/mu (ou lambda * Wq)
        Lq_k = lambda_k * Wq_k
        
        # Imprimir resultados da classe
        print(f"{k+1:<8} | {L_k:<10.4f} | {Lq_k:<10.4f} | {W_k:<10.4f} | {Wq_k:<10.4f}")
        
        # Atualiza o sigma anterior para a próxima iteração
        sigma_anterior = sigma_k

    print("-" * 40)

if __name__ == "__main__":
    calcular_prioridade_mms_sem_interrupcao()