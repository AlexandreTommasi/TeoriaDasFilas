// ==========================================
// TIPOS BASE PARA TODOS OS MODELOS
// ==========================================

export interface BaseQueueResult {
  [key: string]: number | string;
}

// ==========================================
// M/M/1 - Modelo básico com 1 servidor
// ==========================================
export interface MM1Input {
  lambda: number; // Taxa de chegada
  mu: number;     // Taxa de atendimento
  n?: number;     // Número específico de clientes (opcional, para P(n))
  r?: number;     // Valor limite (opcional, para P(n>r))
  t?: number;     // Valor de tempo (opcional, para P(W>t) e P(Wq>t))
}

export interface MM1Result extends BaseQueueResult {
  // Medidas básicas
  rho: number;    // Taxa de ocupação (λ/μ) - também é P(n>0)
  P0: number;     // Probabilidade de 0 clientes (sistema ocioso)
  L: number;      // Número médio de clientes no sistema
  Lq: number;     // Número médio de clientes na fila
  W: number;      // Tempo médio no sistema
  Wq: number;     // Tempo médio na fila

  // Probabilidades condicionais (opcionais, dependem dos inputs)
  Pn?: number;           // P(n) - Probabilidade de n clientes
  PnMaiorQueR?: number;  // P(n>r) - Probabilidade de mais de r clientes
  PWMaiorQueT?: number;  // P(W>t) - Probabilidade tempo no sistema > t
  PWqMaiorQueT?: number; // P(Wq>t) - Probabilidade tempo na fila > t

  // Valores dos parâmetros usados (para exibição)
  n?: number;
  r?: number;
  t?: number;
}

// ==========================================
// M/M/s>1 - Modelo com múltiplos servidores
// ==========================================
export interface MMsInput {
  lambda: number; // Taxa de chegada
  mu: number;     // Taxa de atendimento por servidor
  s: number;      // Número de servidores
  n?: number;     // Número específico de clientes (opcional, para P(n))
  r?: number;     // Valor limite (opcional, para P(n>r))
  t?: number;     // Valor de tempo (opcional, para P(W>t) e P(Wq>t))
}

export interface MMsResult extends BaseQueueResult {
  // Medidas básicas
  rho: number;    // Taxa de ocupação por servidor (λ/(s×μ))
  P0: number;     // Probabilidade de 0 clientes (sistema ocioso)
  L: number;      // Número médio de clientes no sistema
  Lq: number;     // Número médio de clientes na fila
  W: number;      // Tempo médio no sistema
  Wq: number;     // Tempo médio na fila

  // Probabilidades condicionais (opcionais, dependem dos inputs)
  Pn?: number;           // P(n) - Probabilidade de n clientes
  PnMaiorQueR?: number;  // P(n>r) - Probabilidade de mais de r clientes
  PWMaiorQueT?: number;  // P(W>t) - Probabilidade tempo no sistema > t
  PWqMaiorQueT?: number; // P(Wq>t) - Probabilidade tempo na fila > t
  PWqIgualZero?: number; // P(Wq=0) - Probabilidade de não esperar na fila

  // Valores dos parâmetros usados (para exibição)
  n?: number;
  r?: number;
  t?: number;
}

// ==========================================
// M/M/1/K - Capacidade finita do sistema
// ==========================================
export interface MM1KInput {
  lambda: number; // Taxa de chegada
  mu: number;     // Taxa de atendimento
  K: number;      // Capacidade máxima do sistema
}

export interface MM1KResult extends BaseQueueResult {
  // TODO: Seus parceiros devem definir os campos de resultado aqui
}

// ==========================================
// M/M/s>1/K - Múltiplos servidores + capacidade finita
// ==========================================
export interface MMsKInput {
  lambda: number;
  mu: number;
  s: number;
  K: number;
}

export interface MMsKResult extends BaseQueueResult {
  // TODO: Seus parceiros devem definir os campos de resultado aqui
}

// ==========================================
// M/M/1/N - População finita
// ==========================================
export interface MM1NInput {
  lambda: number; // Taxa de chegada por cliente
  mu: number;     // Taxa de atendimento
  N: number;      // Tamanho da população
}

export interface MM1NResult extends BaseQueueResult {
  // TODO: Seus parceiros devem definir os campos de resultado aqui
}

// ==========================================
// M/M/s>1/N - Múltiplos servidores + população finita
// ==========================================
export interface MMsNInput {
  lambda: number;
  mu: number;
  s: number;
  N: number;
}

export interface MMsNResult extends BaseQueueResult {
  // TODO: Seus parceiros devem definir os campos de resultado aqui
}

// ==========================================
// M/G/1 - Distribuição geral de atendimento
// ==========================================
export interface MG1Input {
  lambda: number;     // Taxa de chegada
  meanService: number; // Tempo médio de atendimento
  varService: number;  // Variância do tempo de atendimento
}

export interface MG1Result extends BaseQueueResult {
  // TODO: Seus parceiros devem definir os campos de resultado aqui
}

// ==========================================
// MODELOS COM PRIORIDADES
// ==========================================

// Priority Model 1
export interface Priority1Input {
  // TODO: Definir inputs específicos do modelo de prioridade 1
  [key: string]: number;
}

export interface Priority1Result extends BaseQueueResult {
  // TODO: Definir resultados específicos
}

// Priority Model 2
export interface Priority2Input {
  // TODO: Definir inputs específicos do modelo de prioridade 2
  [key: string]: number;
}

export interface Priority2Result extends BaseQueueResult {
  // TODO: Definir resultados específicos
}

// Priority Model 3
export interface Priority3Input {
  // TODO: Definir inputs específicos do modelo de prioridade 3
  [key: string]: number;
}

export interface Priority3Result extends BaseQueueResult {
  // TODO: Definir resultados específicos
}

// Priority Model 4
export interface Priority4Input {
  // TODO: Definir inputs específicos do modelo de prioridade 4
  [key: string]: number;
}

export interface Priority4Result extends BaseQueueResult {
  // TODO: Definir resultados específicos
}
