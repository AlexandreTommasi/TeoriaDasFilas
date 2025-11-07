import React, { useState } from 'react';
import { Input, Button, ResultDisplay } from '../../components/common';
import type { MM1NInput, MM1NResult } from '../../types/models';
import { SiPython } from 'react-icons/si';
import { HiCheckCircle, HiLightBulb } from 'react-icons/hi';
// import { calculateMM1N } from '../../services/api'; // Descomentar quando backend estiver pronto

export const MM1N: React.FC = () => {
  const [inputs, setInputs] = useState<MM1NInput>({
    lambda: 0,
    mu: 0,
    N: 10,
    n: undefined,
  });

  const [results, setResults] = useState<MM1NResult | null>(null);
  const [error, setError] = useState<string>('');

  const handleInputChange = (field: keyof MM1NInput) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value;
    setInputs({
      ...inputs,
      [field]: value === '' ? undefined : parseFloat(value),
    });
  };

  const handleCalculate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setResults(null);

    if (!inputs.lambda || inputs.lambda <= 0 || !inputs.mu || inputs.mu <= 0) {
      setError('λ e μ devem ser maiores que zero');
      return;
    }

    if (!inputs.N || inputs.N < 1) {
      setError('N (população) deve ser maior ou igual a 1');
      return;
    }

    // ==========================================
    // Backend necessário
    // ==========================================
    // try {
    //   const result = await calculateMM1N(inputs);
    //   setResults(result);
    // } catch (err) {
    //   setError(err instanceof Error ? err.message : 'Erro ao calcular');
    // }
    // ==========================================

    setError('⚠️ Backend Flask ainda não está rodando.');
  };

  const resultItems = results
    ? [
        {
          label: 'ρ (Fator de Utilização)',
          value: results.rho,
          description: 'N×λ/μ - Intensidade do tráfego',
        },
        {
          label: 'P₀ (Sistema Ocioso)',
          value: results.P0,
          description: 'Probabilidade de todos os clientes estarem operacionais',
        },
        {
          label: 'L (Clientes no Sistema)',
          value: results.L,
          description: 'Número médio de clientes no sistema (quebrados/em reparo)',
        },
        {
          label: 'Lq (Clientes na Fila)',
          value: results.Lq,
          description: 'Número médio de clientes aguardando reparo',
        },
        {
          label: 'W (Tempo no Sistema)',
          value: results.W,
          description: 'Tempo médio total no sistema (tempo parado)',
        },
        {
          label: 'Wq (Tempo na Fila)',
          value: results.Wq,
          description: 'Tempo médio de espera na fila',
        },
        {
          label: 'λ efetivo (Taxa Efetiva)',
          value: results.lambdaEfetivo,
          description: 'λ(N-L) - Taxa real de chegadas',
        },
        {
          label: `Clientes Operacionais (${inputs.N} - L)`,
          value: results.numOperacionais,
          description: 'Número médio de clientes operando/trabalhando',
        },
        ...(results.Pn !== undefined
          ? [
              {
                label: `P(n=${results.n})`,
                value: results.Pn,
                description: `Probabilidade de ${results.n} clientes no sistema`,
              },
            ]
          : []),
      ]
    : [];

  return (
    <div className="max-w-6xl mx-auto">
      {/* Cabeçalho */}
      <div className="mb-6">
        <h2 className="text-4xl font-display font-bold text-dark-950 mb-2">Modelo M/M/1/N</h2>
        <p className="text-dark-600 text-lg">
          1 Fila • 1 Servidor • População Finita (N clientes)
        </p>
      </div>

      {/* Quando usar - bem direto */}
      <div className="mb-6 bg-gradient-to-r from-blue-50 to-blue-100 border-2 border-blue-400 rounded-xl p-5 shadow-lg">
        <div className="flex items-start gap-3">
          <HiLightBulb className="text-3xl text-blue-600 flex-shrink-0" />
          <div>
            <h3 className="font-bold text-blue-900 text-xl mb-2">Quando usar M/M/1/N?</h3>
            <div className="text-blue-900">
              <p className="mb-2">✅ Use quando o exercício tiver:</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                <div className="bg-blue-50 p-2 rounded">
                  <strong>✓ 1 servidor/técnico</strong>
                </div>
                <div className="bg-blue-50 p-2 rounded">
                  <strong>✓ População FINITA de N clientes</strong>
                </div>
                <div className="bg-blue-50 p-2 rounded">
                  <strong>✓ Clientes alternando: operando ↔ sistema</strong>
                </div>
                <div className="bg-blue-50 p-2 rounded">
                  <strong>✓ Taxa de chegada depende de N-L</strong>
                </div>
              </div>
              <div className="mt-3 bg-green-100 border border-green-400 p-2 rounded text-sm">
                <strong>✅ DIFERENÇA:</strong> Taxa efetiva = λ(N-L). Quanto mais clientes no sistema, MENOS chegam!
              </div>
              <div className="mt-2 bg-blue-200 p-2 rounded text-sm">
                <strong>💡 Exemplos:</strong> Máquinas que quebram e são reparadas,
                robôs que param para manutenção, equipamentos com população limitada
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CALCULADORA PRINCIPAL */}
      <div className="bg-gradient-to-br from-wine-500 to-wine-700 rounded-2xl shadow-2xl p-1 mb-6">
        <div className="bg-white rounded-xl p-6">
          <h3 className="font-display font-bold text-wine-900 text-2xl mb-1">
            🧮 Calculadora
          </h3>
          <p className="text-gray-600 mb-6 text-sm">
            Preencha os dados e obtenha todos os resultados
          </p>

          <form onSubmit={handleCalculate} className="space-y-5">
            {/* Parâmetros principais */}
            <div className="bg-gray-50 rounded-lg p-5 border-2 border-gray-200">
              <h4 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                <span className="bg-wine-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm">1</span>
                Dados Obrigatórios
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Input
                    label="λ (lambda) = Taxa de Chegada"
                    value={inputs.lambda || ''}
                    onChange={handleInputChange('lambda')}
                    placeholder="Ex: 0.01"
                    required
                    min={0}
                    step="any"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Taxa por cliente QUANDO está operando
                  </p>
                </div>
                <div>
                  <Input
                    label="μ (mu) = Taxa de Atendimento"
                    value={inputs.mu || ''}
                    onChange={handleInputChange('mu')}
                    placeholder="Ex: 0.125"
                    required
                    min={0}
                    step="any"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Taxa de reparo/atendimento
                  </p>
                </div>
                <div>
                  <Input
                    label="N = Tamanho da População"
                    value={inputs.N || ''}
                    onChange={handleInputChange('N')}
                    placeholder="Ex: 10"
                    required
                    min={1}
                    step="1"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Total de clientes/máquinas/robôs
                  </p>
                </div>
              </div>
              <div className="mt-3 bg-yellow-50 border border-yellow-300 p-3 rounded text-sm">
                <p><strong>📊 Interpretação:</strong></p>
                <p className="mt-1">• N clientes alternando entre OPERANDO e NO SISTEMA (quebrado/em reparo)</p>
                <p className="mt-1">• λ = taxa de quebra/chegada POR cliente quando está operando</p>
                <p className="mt-1">• <strong>Taxa total de chegadas:</strong> λ_efetivo = λ × (N - L)</p>
                <p className="mt-1 text-red-700"><strong>⚠️ NÃO precisa λ &lt; μ!</strong> Sistema sempre estável com N finito</p>
              </div>
            </div>

            {/* Parâmetros opcionais */}
            <div className="bg-yellow-50 rounded-lg p-5 border-2 border-yellow-300">
              <h4 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                <span className="bg-yellow-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm">2</span>
                Cálculos Extras (Opcional)
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Input
                    label="n = Número de clientes no sistema"
                    value={inputs.n !== undefined ? inputs.n : ''}
                    onChange={handleInputChange('n')}
                    placeholder="Ex: 3"
                    min={0}
                    max={inputs.N || undefined}
                    step="1"
                  />
                  <p className="text-xs text-gray-600 mt-1">
                    Para calcular <strong>P(n)</strong> (0 ≤ n ≤ N)
                  </p>
                </div>
              </div>
            </div>

            {error && (
              <div className="bg-red-100 border-2 border-red-400 text-red-800 px-4 py-3 rounded-lg font-semibold">
                {error}
              </div>
            )}

            <Button type="submit" fullWidth>
              🚀 CALCULAR TUDO
            </Button>
          </form>

          {results && (
            <div className="mt-8">
              <h4 className="font-bold text-gray-800 mb-4 text-lg">📊 Resultados:</h4>
              <ResultDisplay results={resultItems} />
            </div>
          )}
        </div>
      </div>

      {/* Exemplos práticos */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Exemplo 1 */}
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 border-2 border-purple-400 rounded-xl p-5 shadow-lg">
          <h4 className="font-bold text-purple-900 text-lg mb-3">📝 Exemplo 1: Máquinas de Tecidos</h4>
          <div className="space-y-2 text-sm text-purple-900">
            <div className="bg-white p-3 rounded">
              <p className="font-semibold mb-1">Situação:</p>
              <p>10 máquinas que quebram e precisam de reparo</p>
            </div>
            <div className="bg-white p-3 rounded">
              <p className="font-semibold mb-1">Dados:</p>
              <p>• N = <strong>10 máquinas</strong></p>
              <p>• λ = <strong>0,01 quebras/hora</strong> por máquina</p>
              <p>• Tempo reparo = 8h → μ = <strong>1/8 = 0,125 máq/hora</strong></p>
            </div>
            <div className="bg-white p-3 rounded">
              <p className="font-semibold mb-1">Interpretação:</p>
              <p>• Cada máquina quebra a 0,01/h quando operando</p>
              <p>• Total quebras/h = λ(N-L) = 0,01×(10-L)</p>
              <p>• Técnico repara a 0,125 máquinas/h</p>
            </div>
          </div>
        </div>

        {/* Exemplo 2 */}
        <div className="bg-gradient-to-br from-green-50 to-green-100 border-2 border-green-400 rounded-xl p-5 shadow-lg">
          <h4 className="font-bold text-green-900 text-lg mb-3">📝 Exemplo 2: Robôs de Fabricação</h4>
          <div className="space-y-2 text-sm text-green-900">
            <div className="bg-white p-3 rounded">
              <p className="font-semibold mb-1">Dados:</p>
              <p>• N = <strong>5 robôs</strong></p>
              <p>• Tempo até quebra = 30h → λ = <strong>1/30 rob/h</strong></p>
              <p>• Tempo reparo = 3h → μ = <strong>1/3 rob/h</strong></p>
            </div>
            <div className="bg-white p-3 rounded">
              <p className="font-semibold mb-1">Perguntas típicas:</p>
              <p>• a) Robôs operacionais = <strong>N - L</strong></p>
              <p>• b) Tempo parado por robô = <strong>W</strong></p>
              <p>• c) % tempo ocioso técnico = <strong>P₀</strong></p>
            </div>
          </div>
        </div>
      </div>

      {/* Respostas das questões típicas */}
      <div className="bg-gradient-to-r from-orange-50 to-orange-100 border-2 border-orange-400 rounded-xl p-6 shadow-lg mb-6">
        <h3 className="font-bold text-orange-900 text-xl mb-4">❓ Perguntas Típicas e Como Responder</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="bg-white p-4 rounded-lg">
            <p className="font-semibold text-orange-900 mb-2">a) Número de clientes operacionais?</p>
            <p className="text-gray-700">→ Resposta: <strong>N - L</strong></p>
          </div>
          <div className="bg-white p-4 rounded-lg">
            <p className="font-semibold text-orange-900 mb-2">b) Tempo parado por cliente?</p>
            <p className="text-gray-700">→ Resposta: <strong>W</strong></p>
          </div>
          <div className="bg-white p-4 rounded-lg">
            <p className="font-semibold text-orange-900 mb-2">c) % tempo ocioso do técnico?</p>
            <p className="text-gray-700">→ Resposta: <strong>P₀</strong></p>
          </div>
          <div className="bg-white p-4 rounded-lg">
            <p className="font-semibold text-orange-900 mb-2">d) Número médio no sistema?</p>
            <p className="text-gray-700">→ Resposta: <strong>L</strong></p>
          </div>
          <div className="bg-white p-4 rounded-lg">
            <p className="font-semibold text-orange-900 mb-2">e) Número médio na fila?</p>
            <p className="text-gray-700">→ Resposta: <strong>Lq</strong></p>
          </div>
          <div className="bg-white p-4 rounded-lg">
            <p className="font-semibold text-orange-900 mb-2">f) Tempo médio na fila?</p>
            <p className="text-gray-700">→ Resposta: <strong>Wq</strong></p>
          </div>
          <div className="bg-white p-4 rounded-lg">
            <p className="font-semibold text-orange-900 mb-2">g) Taxa efetiva de chegadas?</p>
            <p className="text-gray-700">→ Resposta: <strong>λ efetivo = λ(N-L)</strong></p>
          </div>
          <div className="bg-white p-4 rounded-lg">
            <p className="font-semibold text-orange-900 mb-2">h) Prob. de n clientes no sistema?</p>
            <p className="text-gray-700">→ Coloque <strong>n</strong> e use <strong>P(n)</strong></p>
          </div>
        </div>
      </div>

      {/* Diferenças M/M/1 vs M/M/1/N */}
      <div className="bg-gradient-to-r from-indigo-50 to-indigo-100 border-2 border-indigo-400 rounded-xl p-5 shadow-lg mb-6">
        <h3 className="font-bold text-indigo-900 text-xl mb-3">🔄 M/M/1 vs M/M/1/N - Qual usar?</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="bg-white p-4 rounded-lg border-2 border-indigo-300">
            <h4 className="font-bold text-indigo-900 mb-2">Use M/M/1 se:</h4>
            <ul className="space-y-1 text-indigo-800">
              <li>✓ <strong>População infinita</strong></li>
              <li>✓ Taxa de chegada CONSTANTE (λ)</li>
              <li>✓ Chegadas independentes</li>
              <li>✓ OBRIGATÓRIO: λ &lt; μ</li>
            </ul>
          </div>
          <div className="bg-white p-4 rounded-lg border-2 border-purple-300">
            <h4 className="font-bold text-purple-900 mb-2">Use M/M/1/N se:</h4>
            <ul className="space-y-1 text-purple-800">
              <li>✓ <strong>População finita</strong> (N clientes)</li>
              <li>✓ Taxa VARIÁVEL: λ(N-L)</li>
              <li>✓ Clientes alternando: operando ↔ sistema</li>
              <li>✓ NÃO precisa λ &lt; μ (sempre estável)</li>
            </ul>
          </div>
        </div>
        <div className="mt-4 bg-indigo-200 p-3 rounded">
          <p className="text-indigo-900 text-sm">
            <strong>🔑 Dica chave:</strong> Se o exercício fala "N máquinas", "5 robôs", "10 equipamentos"
            → População finita → use <strong>M/M/1/N</strong>!
          </p>
        </div>
      </div>

      {/* Conceitos importantes */}
      <div className="bg-gradient-to-r from-red-50 to-red-100 border-2 border-red-400 rounded-xl p-5 shadow-lg mb-6">
        <h3 className="font-bold text-red-900 text-xl mb-3">⚠️ Conceitos Importantes do M/M/1/N</h3>
        <div className="space-y-3 text-sm text-red-900">
          <div className="bg-white p-3 rounded">
            <p className="font-semibold mb-1">🔄 Ciclo dos Clientes:</p>
            <p>Operando → Quebra (chegada) → Fila → Reparo → Operando novamente</p>
          </div>
          <div className="bg-white p-3 rounded">
            <p className="font-semibold mb-1">📊 Taxa Efetiva Variável:</p>
            <p>λ_efetivo = λ(N - L) → Depende de quantos estão operando!</p>
          </div>
          <div className="bg-white p-3 rounded">
            <p className="font-semibold mb-1">✅ Sempre Estável:</p>
            <p>Não precisa λ &lt; μ! População finita garante estabilidade</p>
          </div>
          <div className="bg-white p-3 rounded">
            <p className="font-semibold mb-1">🔢 Interpretação de L:</p>
            <p>L = número médio de clientes QUEBRADOS (no sistema)</p>
            <p>N - L = número médio de clientes OPERACIONAIS</p>
          </div>
          <div className="bg-white p-3 rounded">
            <p className="font-semibold mb-1">⏱️ Interpretação de W:</p>
            <p>W = tempo médio que um cliente fica PARADO (tempo total no sistema)</p>
          </div>
        </div>
      </div>

      {/* Conversões úteis */}
      <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 border-2 border-yellow-400 rounded-xl p-5 shadow-lg mb-6">
        <h3 className="font-bold text-yellow-900 text-xl mb-3">📐 Conversões Úteis</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-yellow-900">
          <div className="bg-white p-4 rounded">
            <p className="font-semibold mb-2">Se te dão TEMPO até quebra:</p>
            <p>• Tempo = 30 horas</p>
            <p>• λ = 1/30 quebras/hora ✓</p>
          </div>
          <div className="bg-white p-4 rounded">
            <p className="font-semibold mb-2">Se te dão TEMPO de reparo:</p>
            <p>• Tempo = 8 horas</p>
            <p>• μ = 1/8 reparos/hora ✓</p>
          </div>
          <div className="bg-white p-4 rounded">
            <p className="font-semibold mb-2">Se te dão TAXA de quebra:</p>
            <p>• 0,01 quebras/hora por máquina</p>
            <p>• λ = 0,01 ✓</p>
          </div>
          <div className="bg-white p-4 rounded">
            <p className="font-semibold mb-2">Lembre-se:</p>
            <p>• λ é POR CLIENTE quando operando</p>
            <p>• Taxa total = λ × (N-L)</p>
          </div>
        </div>
      </div>

      {/* Info do backend */}
      <div className="bg-wine-50 border-l-4 border-wine-600 p-5 rounded-lg">
        <div className="flex items-start gap-3">
          <SiPython className="text-2xl text-wine-700 flex-shrink-0 mt-1" />
          <div className="text-sm">
            <h4 className="font-bold text-wine-900 mb-2">Backend Necessário</h4>
            <p className="text-wine-800 mb-2">
              Esta interface está pronta. Seus colegas de back-end devem:
            </p>
            <ul className="space-y-1 text-wine-800">
              <li className="flex items-start gap-2">
                <HiCheckCircle className="text-wine-600 flex-shrink-0 mt-0.5" />
                <span>Implementar fórmulas do M/M/1/N em Python</span>
              </li>
              <li className="flex items-start gap-2">
                <HiCheckCircle className="text-wine-600 flex-shrink-0 mt-0.5" />
                <span>Criar endpoint POST /api/calculate/mm1n</span>
              </li>
              <li className="flex items-start gap-2">
                <HiCheckCircle className="text-wine-600 flex-shrink-0 mt-0.5" />
                <span>Retornar todos os resultados calculados</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
