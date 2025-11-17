import math

def calcular_metricas_mg1(lambda_taxa, mu_taxa, variancia):
    """
    Calcula as métricas de efetividade para um sistema de filas M/G/1
    com base nas fórmulas fornecidas (Lq, Wq, L, W, P0).

    Argumentos:
    lambda_taxa (float): Taxa de chegada (λ)
    mu_taxa (float): Taxa de serviço (μ)
    variancia (float): Variância do tempo de serviço (σ²)
    
    Retorna:
    dict: Um dicionário com as métricas calculadas ou None se o sistema for instável.
    """

    # --- 1. Calcular Rho (ρ) ---
    rho = lambda_taxa / mu_taxa

    # --- 2. Verificar estabilidade ---(nao sei se e necessario)
    if rho >= 1:
        print(f"ERRO: Sistema instável. Taxa de utilização (ρ) é {rho:.4f} (deve ser < 1).")
        return None

    # --- 3. Calcular P0 (Probabilidade de 0 clientes) ---
    P0 = 1 - rho

    # --- 4. Calcular Lq (Número médio de clientes na fila) ---
    numerador_Lq = (lambda_taxa**2 * variancia) + (rho**2)
    denominador_Lq = 2 * (1 - rho)
    Lq = numerador_Lq / denominador_Lq

    # --- 5. Calcular Wq (Tempo médio de espera na fila) ---
    Wq = Lq / lambda_taxa

    # --- 6. Calcular L (Número médio de clientes no sistema) ---
    L = rho + Lq

    # --- 7. Calcular W (Tempo médio de espera no sistema) ---
    W = Wq + (1 / mu_taxa)

    # --- 8. Retornar os resultados ---
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
    mu_entrada = obter_entrada_float("Digite a Taxa de Serviço (μ): ")

    # Perguntar se o usuário quer que o programa calcule σ automaticamente a partir de 1/μ
    while True:
        escolha = input("Deseja que eu calcule automaticamente o desvio-padrão a partir de 1/μ? (s/n): ").strip().lower()
        if escolha in ("s", "n"):
            break
        print("Entrada inválida. Digite 's' para sim ou 'n' para não.")

    if escolha == "s":
        # Usar a fórmula solicitada: σ = 1/μ (nota: isso é assumir desvio igual ao tempo médio de serviço)
        desvio_padrao_entrada = 1.0 / mu_entrada
        print(f"(Info) Desvio-padrão calculado automaticamente: σ = 1/μ = {desvio_padrao_entrada:.6g}")
    else:
        # Perguntar ao usuário o desvio-padrão manualmente
        desvio_padrao_entrada = obter_entrada_float("Digite o Desvio-Padrão do tempo de serviço (σ): ")

    variancia_entrada = desvio_padrao_entrada ** 2

    print("-" * 30)
    print(f"(Info) Variância usada: σ² = {desvio_padrao_entrada:.6g}² = {variancia_entrada:.6g}")

    # Chamar a função com as entradas
    resultados = calcular_metricas_mg1(lambda_entrada, mu_entrada, variancia_entrada)

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
