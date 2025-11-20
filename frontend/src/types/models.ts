// ==========================================
// TIPOS BASE PARA TODOS OS MODELOS
// ==========================================

export interface BaseQueueResult {
  [key: string]: number | string | undefined;
}

// ==========================================
// M/M/1 - Modelo básico com 1 servidor
// ==========================================
export interface MM1Input {
  lambda: number | string; // Taxa de chegada
  mu: number | string;     // Taxa de atendimento
  n?: number | string;     // Número específico de clientes (opcional, para P(n))
  r?: number | string;     // Valor limite (opcional, para P(n>r))
  t?: number | string;     // Valor de tempo (opcional, para P(W>t) e P(Wq>t))
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
  lambda: number | string; // Taxa de chegada
  mu: number | string;     // Taxa de atendimento por servidor
  s: number | string;      // Número de servidores
  n?: number | string;     // Número específico de clientes (opcional, para P(n))
  r?: number | string;     // Valor limite (opcional, para P(n>r))
  t?: number | string;     // Valor de tempo (opcional, para P(W>t) e P(Wq>t))
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
  lambda: number | string; // Taxa de chegada
  mu: number | string;     // Taxa de atendimento
  K: number | string;      // Capacidade máxima do sistema
  n?: number | string;     // Número específico de clientes (opcional, para P(n))
}

export interface MM1KResult extends BaseQueueResult {
  // Medidas básicas
  rho: number;           // λ/μ (pode ser > 1, pois K limita o sistema)
  P0: number;            // Probabilidade de 0 clientes
  L: number;             // Número médio de clientes no sistema
  Lq: number;            // Número médio de clientes na fila
  W: number;             // Tempo médio no sistema
  Wq: number;            // Tempo médio na fila
  lambdaEfetivo: number; // Taxa efetiva de entrada = λ(1-P_K)
  PK: number;            // Probabilidade de K clientes (sistema cheio/bloqueio)

  // Probabilidades condicionais
  Pn?: number;           // P(n) - Probabilidade de n clientes

  // Valores dos parâmetros usados (para exibição)
  n?: number;
}

// ==========================================
// M/M/s>1/K - Múltiplos servidores + capacidade finita
// ==========================================
export interface MMsKInput {
  lambda: number | string;  // Taxa de chegada
  mu: number | string;      // Taxa de atendimento por servidor
  s: number | string;       // Número de servidores
  K: number | string;       // Capacidade máxima do sistema
  n?: number | string;      // Número específico de clientes (opcional, para P(n))
}

export interface MMsKResult extends BaseQueueResult {
  // Medidas básicas
  rho: number;           // Taxa de ocupação = λ/(s×μ)
  P0: number;            // Probabilidade de 0 clientes
  L: number;             // Número médio de clientes no sistema
  Lq: number;            // Número médio de clientes na fila
  W: number;             // Tempo médio no sistema
  Wq: number;            // Tempo médio na fila
  lambdaEfetivo: number; // Taxa efetiva de entrada = λ(1-P_K)
  PK: number;            // Probabilidade de K clientes (bloqueio)

  // Probabilidades condicionais
  Pn?: number;           // P(n) - Probabilidade de n clientes

  // Valores dos parâmetros usados (para exibição)
  n?: number;
}

// ==========================================
// M/M/1/N - População finita
// ==========================================
export interface MM1NInput {
  lambda: number | string; // Taxa de chegada por cliente (quando fora do sistema)
  mu: number | string;     // Taxa de atendimento
  N: number | string;      // Tamanho da população
  n?: number | string;     // Número específico de clientes (opcional, para P(n))
}

export interface MM1NResult extends BaseQueueResult {
  // Medidas básicas
  rho: number;             // N×λ/μ (fator de utilização)
  P0: number;              // Probabilidade de 0 clientes no sistema
  L: number;               // Número médio de clientes no sistema
  Lq: number;              // Número médio de clientes na fila
  W: number;               // Tempo médio no sistema
  Wq: number;              // Tempo médio na fila
  lambdaEfetivo: number;   // Taxa efetiva = λ(N-L)
  numOperacionais: number; // N - L (média de clientes operacionais/fora do sistema)

  // Probabilidades condicionais
  Pn?: number;             // P(n) - Probabilidade de n clientes

  // Valores dos parâmetros usados (para exibição)
  n?: number;
}

// ==========================================
// M/M/s>1/N - Múltiplos servidores + população finita
// ==========================================
export interface MMsNInput {
  lambda: number | string; // Taxa de chegada por cliente (quando fora do sistema)
  mu: number | string;     // Taxa de atendimento por servidor
  s: number | string;      // Número de servidores
  N: number | string;      // Tamanho da população
  n?: number | string;     // Número específico de clientes (opcional, para P(n))
}

export interface MMsNResult extends BaseQueueResult {
  // Medidas básicas
  rho: number;             // N×λ/(s×μ) (fator de utilização)
  P0: number;              // Probabilidade de 0 clientes no sistema
  L: number;               // Número médio de clientes no sistema
  Lq: number;              // Número médio de clientes na fila
  W: number;               // Tempo médio no sistema
  Wq: number;              // Tempo médio na fila
  lambdaEfetivo: number;   // Taxa efetiva = λ(N-L)
  numOperacionais: number; // N - L (média de clientes operacionais/fora do sistema)

  // Probabilidades condicionais
  Pn?: number;             // P(n) - Probabilidade de n clientes
  PWqIgualZero?: number;   // P(Wq=0) - Probabilidade de não esperar na fila

  // Valores dos parâmetros usados (para exibição)
  n?: number;
}

// ==========================================
// M/G/1 - Distribuição geral de atendimento
// ==========================================
export interface MG1Input {
  lambda: number | string;      // Taxa de chegada
  mu: number | string;          // Taxa de atendimento
  varService?: number | string; // Variância do tempo de atendimento (opcional)
}

export interface MG1Result extends BaseQueueResult {
  rho: number;    // Taxa de utilização (λ/μ)
  P0: number;     // Probabilidade de 0 clientes no sistema
  Lq: number;     // Número médio de clientes na fila (Pollaczek-Khinchin)
  Wq: number;     // Tempo médio de espera na fila
  L: number;      // Número médio de clientes no sistema
  W: number;      // Tempo médio de espera no sistema
}

// ==========================================
// MODELOS COM PRIORIDADES
// ==========================================

// Priority Model 1
export interface Priority1Input {
  // TODO: Definir inputs específicos do modelo de prioridade 1
  [key: string]: number | string;
}

export interface Priority1Result extends BaseQueueResult {
  // TODO: Definir resultados específicos
}

// Priority Model 2
export interface Priority2Input {
  // TODO: Definir inputs específicos do modelo de prioridade 2
  [key: string]: number | string;
}

export interface Priority2Result extends BaseQueueResult {
  // TODO: Definir resultados específicos
}

// Priority Model 3
export interface Priority3Input {
  // TODO: Definir inputs específicos do modelo de prioridade 3
  [key: string]: number | string;
}

export interface Priority3Result extends BaseQueueResult {
  // TODO: Definir resultados específicos
}

// Priority Model 4
export interface Priority4Input {
  // TODO: Definir inputs específicos do modelo de prioridade 4
  [key: string]: number | string;
}

export interface Priority4Result extends BaseQueueResult {
  // TODO: Definir resultados específicos
}
