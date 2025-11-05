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
}

export interface MM1Result extends BaseQueueResult {
  rho: number;    // Utilização do sistema
  L: number;      // Número médio de clientes no sistema
  Lq: number;     // Número médio de clientes na fila
  W: number;      // Tempo médio no sistema
  Wq: number;     // Tempo médio na fila
  P0: number;     // Probabilidade de 0 clientes
}

// ==========================================
// M/M/s>1 - Modelo com múltiplos servidores
// ==========================================
export interface MMsInput {
  lambda: number; // Taxa de chegada
  mu: number;     // Taxa de atendimento
  s: number;      // Número de servidores
}

export interface MMsResult extends BaseQueueResult {
  // TODO: Seus parceiros devem definir os campos de resultado aqui
  // Exemplo: rho, L, Lq, W, Wq, P0, etc
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
