import math

def calculate_mg1(lambda_val, mean_service, var_service):
    """
    Interface para API - calcula métricas M/G/1

    Argumentos:
    lambda_val (float): Taxa de chegada (λ)
    mean_service (float): Tempo médio de serviço (E[S])
    var_service (float): Variância do tempo de serviço (σ²)

    Retorna:
    dict: Métricas calculadas

    Lança:
    ValueError: Se o sistema for instável (ρ >= 1)
    """
    return calcular_metricas_mg1(lambda_val, mean_service, var_service)

def calcular_metricas_mg1(lambda_taxa, tempo_medio_servico, variancia):
    """
    Calcula as métricas de efetividade para um sistema de filas M/G/1
    com base nas fórmulas fornecidas (Lq, Wq, L, W, P0).

    Argumentos:
    lambda_taxa (float): Taxa de chegada (λ)
    tempo_medio_servico (float): Tempo médio de serviço (E[S] = 1/μ)
    variancia (float): Variância do tempo de serviço (σ²)

    Retorna:
    dict: Um dicionário com as métricas calculadas ou None se o sistema for instável.
    """

    # --- 1. Calcular μ (taxa de serviço) a partir do tempo médio ---
    mu_taxa = 1.0 / tempo_medio_servico

    # --- 2. Calcular Rho (ρ) ---
    rho = lambda_taxa / mu_taxa

    # --- 3. Verificar estabilidade ---
    if rho >= 1:
        raise ValueError(f"Sistema instável. Taxa de utilização (ρ) é {rho:.4f} (deve ser < 1).")

    # --- 4. Calcular P0 (Probabilidade de 0 clientes) ---
    P0 = 1 - rho

    # --- 5. Calcular Lq (Número médio de clientes na fila) ---
    # Fórmula de Pollaczek-Khinchin
    numerador_Lq = (lambda_taxa**2 * variancia) + (rho**2)
    denominador_Lq = 2 * (1 - rho)
    Lq = numerador_Lq / denominador_Lq

    # --- 6. Calcular Wq (Tempo médio de espera na fila) ---
    Wq = Lq / lambda_taxa

    # --- 7. Calcular L (Número médio de clientes no sistema) ---
    L = rho + Lq

    # --- 8. Calcular W (Tempo médio de espera no sistema) ---
    W = Wq + tempo_medio_servico

    # --- 9. Retornar os resultados ---
    metricas = {
        "rho": rho,
        "P0": P0,
        "Lq": Lq,
        "Wq": Wq,
        "L": L,
        "W": W
    }
    
    return metricas

def obter_entrada_float(prompt):
    """
    Pede ao usuário um valor float e trata erros de entrada.
    """
    while True:
        try:
            valor_str = input(prompt)
            valor_float = float(valor_str)
            return valor_float
        except ValueError:
            print("Entrada inválida. Por favor, digite um número (ex: 4 ou 5.5).")

# --- Função Principal (Main) ---
if __name__ == "__main__":
    print("---  calculadora M/G/1 ---")
    print("Por favor, insira os valores do sistema:")

    # --- ENTRADAS DO USUÁRIO ---
    lambda_entrada = obter_entrada_float("Digite a Taxa de Chegada (λ): ")
    tempo_medio_entrada = obter_entrada_float("Digite o Tempo Médio de Serviço E[S] (em horas): ")

    # Perguntar se o usuário quer que o programa calcule σ automaticamente
    print("\nComo deseja informar a variância?")
    print("1 - Tempo EXPONENCIAL (M/M/1): Var[S] = (E[S])²")
    print("2 - Tempo CONSTANTE (M/D/1): Var[S] = 0")
    print("3 - Informar a variância manualmente")

    while True:
        escolha = input("Escolha (1/2/3): ").strip()
        if escolha in ("1", "2", "3"):
            break
        print("Entrada inválida. Digite '1', '2' ou '3'.")

    if escolha == "1":
        # Distribuição exponencial: Var[S] = (E[S])²
        variancia_entrada = tempo_medio_entrada ** 2
        print(f"(Info) Variância para tempo exponencial: σ² = (E[S])² = ({tempo_medio_entrada:.6g})² = {variancia_entrada:.6g}")
    elif escolha == "2":
        # Tempo constante: Var[S] = 0
        variancia_entrada = 0
        print(f"(Info) Variância para tempo constante: σ² = 0")
    else:
        # Variância manual
        variancia_entrada = obter_entrada_float("Digite a Variância do tempo de serviço (σ²): ")
        print(f"(Info) Variância informada: σ² = {variancia_entrada:.6g}")

    print("-" * 30)

    # Chamar a função com as entradas CORRETAS
    resultados = calcular_metricas_mg1(lambda_entrada, tempo_medio_entrada, variancia_entrada)

    # Imprimir os resultados formatados
    if resultados:
        print("--- Resultados ---")
        print(f"Taxa de Utilização (ρ): {resultados['rho']:.3f}")
        print(f"P0 (Prob. 0 clientes):  {resultados['P0']:.3f}")
        print(f"Lq (Clientes na fila):  {resultados['Lq']:.3f} clientes")
        print(f"Wq (Tempo na fila):     {resultados['Wq']:.3f} (unidade de tempo)")
        print(f"L (Clientes no sistema): {resultados['L']:.3f} clientes")
        print(f"W (Tempo no sistema):    {resultados['W']:.3f} (unidade de tempo)")
        print("-" * 30)
