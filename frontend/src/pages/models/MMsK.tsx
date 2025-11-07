import React, { useState } from 'react';
import { Input, Button, ResultDisplay } from '../../components/common';
import type { MMsKInput, MMsKResult } from '../../types/models';
import { SiPython } from 'react-icons/si';
import { HiCheckCircle, HiLightBulb } from 'react-icons/hi';
// import { calculateMMsK } from '../../services/api'; // Descomentar quando backend estiver pronto

export const MMsK: React.FC = () => {
  const [inputs, setInputs] = useState<MMsKInput>({
    lambda: 0,
    mu: 0,
    s: 2,
    K: 10,
    n: undefined,
  });

  const [results, setResults] = useState<MMsKResult | null>(null);
  const [error, setError] = useState<string>('');

  const handleInputChange = (field: keyof MMsKInput) => (
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

    if (!inputs.s || inputs.s < 2) {
      setError('Número de servidores (s) deve ser maior ou igual a 2');
      return;
    }

    if (!inputs.K || inputs.K < inputs.s) {
      setError(`K (capacidade) deve ser maior ou igual a s (${inputs.s})`);
      return;
    }

    // ==========================================
    // Backend necessário
    // ==========================================
    // try {
    //   const result = await calculateMMsK(inputs);
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
          label: 'ρ (Taxa de Ocupação)',
          value: results.rho,
          description: 'λ/(s×μ) - Utilização por servidor',
        },
        {
          label: 'P₀ (Sistema Ocioso)',
          value: results.P0,
          description: 'Probabilidade de não haver clientes',
        },
        {
          label: `P(K=${inputs.K}) - Sistema Cheio`,
          value: results.PK,
          description: 'Probabilidade de bloqueio (sistema com K clientes)',
        },
        {
          label: 'λ efetivo (Taxa Efetiva)',
          value: results.lambdaEfetivo,
          description: 'λ(1-P_K) - Taxa real de entrada',
        },
        {
          label: 'L (Clientes no Sistema)',
          value: results.L,
          description: 'Número médio de clientes no sistema',
        },
        {
          label: 'Lq (Clientes na Fila)',
          value: results.Lq,
          description: 'Número médio de clientes aguardando',
        },
        {
          label: 'W (Tempo no Sistema)',
          value: results.W,
          description: 'Tempo médio total no sistema',
        },
        {
          label: 'Wq (Tempo na Fila)',
          value: results.Wq,
          description: 'Tempo médio de espera na fila',
        },
        ...(results.Pn !== undefined
          ? [
              {
                label: `P(n=${results.n})`,
                value: results.Pn,
                description: `Probabilidade de exatamente ${results.n} clientes`,
              },
            ]
          : []),
      ]
    : [];

  return (
    <div className="max-w-6xl mx-auto">
      {/* Cabeçalho */}
      <div className="mb-6">
        <h2 className="text-4xl font-display font-bold text-dark-950 mb-2">Modelo M/M/s/K</h2>
        <p className="text-dark-600 text-lg">
          1 Fila • Múltiplos Servidores (s≥2) • Capacidade Finita (K)
        </p>
      </div>

      {/* Quando usar - bem direto */}
      <div className="mb-6 bg-gradient-to-r from-blue-50 to-blue-100 border-2 border-blue-400 rounded-xl p-5 shadow-lg">
        <div className="flex items-start gap-3">
          <HiLightBulb className="text-3xl text-blue-600 flex-shrink-0" />
          <div>
            <h3 className="font-bold text-blue-900 text-xl mb-2">Quando usar M/M/s/K?</h3>
            <div className="text-blue-900">
              <p className="mb-2">✅ Use quando o exercício tiver:</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                <div className="bg-blue-50 p-2 rounded">
                  <strong>✓ 2 ou mais servidores</strong>
                </div>
                <div className="bg-blue-50 p-2 rounded">
                  <strong>✓ Capacidade MÁXIMA de K clientes</strong>
                </div>
                <div className="bg-blue-50 p-2 rounded">
                  <strong>✓ 1 única fila</strong>
                </div>
                <div className="bg-blue-50 p-2 rounded">
                  <strong>✓ Clientes bloqueados quando cheio</strong>
                </div>
              </div>
              <div className="mt-3 bg-red-100 border border-red-400 p-2 rounded text-sm">
                <strong>⚠️ IMPORTANTE:</strong> K ≥ s (capacidade deve ser pelo menos igual ao número de servidores)
              </div>
              <div className="mt-2 bg-blue-200 p-2 rounded text-sm">
                <strong>💡 Exemplos:</strong> SAC com vários atendentes e fila limitada,
                estação de inspeção com boxes limitados, posto com múltiplas cabines e área de espera pequena
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Input
                    label="λ (lambda) = Taxa de Chegada"
                    value={inputs.lambda || ''}
                    onChange={handleInputChange('lambda')}
                    placeholder="Ex: 5"
                    required
                    min={0}
                    step="any"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Clientes que tentam entrar por tempo
                  </p>
                </div>
                <div>
                  <Input
                    label="μ (mu) = Taxa de Atendimento"
                    value={inputs.mu || ''}
                    onChange={handleInputChange('mu')}
                    placeholder="Ex: 7"
                    required
                    min={0}
                    step="any"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Clientes que CADA servidor atende por tempo
                  </p>
                </div>
                <div>
                  <Input
                    label="s = Número de Servidores"
                    value={inputs.s || ''}
                    onChange={handleInputChange('s')}
                    placeholder="Ex: 2"
                    required
                    min={2}
                    step="1"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Quantos atendentes/boxes/caixas
                  </p>
                </div>
                <div>
                  <Input
                    label="K = Capacidade Máxima"
                    value={inputs.K || ''}
                    onChange={handleInputChange('K')}
                    placeholder="Ex: 5"
                    required
                    min={inputs.s || 2}
                    step="1"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Máximo de clientes no sistema (K ≥ s)
                  </p>
                </div>
              </div>
              <div className="mt-3 bg-yellow-50 border border-yellow-300 p-3 rounded text-sm">
                <p><strong>📊 Capacidade total:</strong> {inputs.s && inputs.mu ? `s×μ = ${inputs.s}×${inputs.mu} = ${inputs.s * inputs.mu} clientes/tempo` : 'Preencha s e μ'}</p>
                <p className="mt-1"><strong>🔢 ρ = λ/(s×μ):</strong> {inputs.lambda && inputs.s && inputs.mu ? `${inputs.lambda}/(${inputs.s}×${inputs.mu}) = ${(inputs.lambda / (inputs.s * inputs.mu)).toFixed(3)}` : 'Preencha λ, s e μ'}</p>
                <p className="mt-1"><strong>🚫 Bloqueio:</strong> Se sistema tiver K={inputs.K} clientes, próximo é REJEITADO</p>
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
                    label="n = Número de clientes"
                    value={inputs.n !== undefined ? inputs.n : ''}
                    onChange={handleInputChange('n')}
                    placeholder="Ex: 5"
                    min={0}
                    max={inputs.K || undefined}
                    step="1"
                  />
                  <p className="text-xs text-gray-600 mt-1">
                    Para calcular <strong>P(n)</strong> (0 ≤ n ≤ K)
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
          <h4 className="font-bold text-purple-900 text-lg mb-3">📝 Exemplo 1: SAC (Call Center)</h4>
          <div className="space-y-2 text-sm text-purple-900">
            <div className="bg-white p-3 rounded">
              <p className="font-semibold mb-1">Situação:</p>
              <p>SAC com ligações em espera limitadas. Investigar 1 vs 2 atendentes.</p>
            </div>
            <div className="bg-white p-3 rounded">
              <p className="font-semibold mb-1">Dados (1 atendente):</p>
              <p>• λ = <strong>5 chamadas/hora</strong></p>
              <p>• μ = <strong>7 chamadas/hora</strong></p>
              <p>• s = <strong>1 atendente</strong></p>
              <p>• K = <strong>5 ligações</strong> (1 em atendimento + 4 em espera)</p>
            </div>
            <div className="bg-purple-200 p-2 rounded text-xs">
              <strong>💡 Comparação:</strong> Calcular com s=1 e depois s=2 para ver a melhoria
            </div>
          </div>
        </div>

        {/* Exemplo 2 */}
        <div className="bg-gradient-to-br from-green-50 to-green-100 border-2 border-green-400 rounded-xl p-5 shadow-lg">
          <h4 className="font-bold text-green-900 text-lg mb-3">📝 Exemplo 2: Estação de Inspeção</h4>
          <div className="space-y-2 text-sm text-green-900">
            <div className="bg-white p-3 rounded">
              <p className="font-semibold mb-1">Dados:</p>
              <p>• λ = 1 carro/min</p>
              <p>• Tempo serviço = 6 min → μ = 1/6 carro/min</p>
              <p>• s = <strong>3 boxes</strong></p>
              <p>• K = <strong>7 carros</strong> (3 em serviço + 4 esperando)</p>
            </div>
            <div className="bg-white p-3 rounded">
              <p className="font-semibold mb-1">Análise:</p>
              <p>• Capacidade: s×μ = 3×(1/6) = 0,5 carros/min</p>
              <p>• λ = 1 {'>'} 0,5 → Sistema saturado!</p>
              <p>• Limite K evita sobrecarga</p>
            </div>
          </div>
        </div>
      </div>

      {/* Respostas das questões típicas */}
      <div className="bg-gradient-to-r from-orange-50 to-orange-100 border-2 border-orange-400 rounded-xl p-6 shadow-lg mb-6">
        <h3 className="font-bold text-orange-900 text-xl mb-4">❓ Perguntas Típicas e Como Responder</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="bg-white p-4 rounded-lg">
            <p className="font-semibold text-orange-900 mb-2">a) Prob. sistema vazio?</p>
            <p className="text-gray-700">→ Resposta: <strong>P₀</strong></p>
          </div>
          <div className="bg-white p-4 rounded-lg">
            <p className="font-semibold text-orange-900 mb-2">b) Número médio no sistema?</p>
            <p className="text-gray-700">→ Resposta: <strong>L</strong></p>
          </div>
          <div className="bg-white p-4 rounded-lg">
            <p className="font-semibold text-orange-900 mb-2">c) Número médio na fila?</p>
            <p className="text-gray-700">→ Resposta: <strong>Lq</strong></p>
          </div>
          <div className="bg-white p-4 rounded-lg">
            <p className="font-semibold text-orange-900 mb-2">d) Tempo médio no sistema?</p>
            <p className="text-gray-700">→ Resposta: <strong>W</strong></p>
          </div>
          <div className="bg-white p-4 rounded-lg">
            <p className="font-semibold text-orange-900 mb-2">e) Tempo médio na fila?</p>
            <p className="text-gray-700">→ Resposta: <strong>Wq</strong></p>
          </div>
          <div className="bg-white p-4 rounded-lg">
            <p className="font-semibold text-orange-900 mb-2">f) Clientes/hora bloqueados?</p>
            <p className="text-gray-700">→ Calcule: <strong>λ × P(K)</strong></p>
          </div>
          <div className="bg-white p-4 rounded-lg">
            <p className="font-semibold text-orange-900 mb-2">g) Prob. de haver 5 clientes?</p>
            <p className="text-gray-700">→ Coloque <strong>n=5</strong> e use <strong>P(n)</strong></p>
          </div>
          <div className="bg-white p-4 rounded-lg">
            <p className="font-semibold text-orange-900 mb-2">h) Taxa efetiva?</p>
            <p className="text-gray-700">→ Resposta: <strong>λ efetivo</strong></p>
          </div>
        </div>
      </div>

      {/* Tabela de Comparação dos Modelos */}
      <div className="bg-gradient-to-r from-indigo-50 to-indigo-100 border-2 border-indigo-400 rounded-xl p-5 shadow-lg mb-6">
        <h3 className="font-bold text-indigo-900 text-xl mb-3">🔄 Qual Modelo Usar?</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-indigo-200">
                <th className="border border-indigo-300 p-2 text-left">Modelo</th>
                <th className="border border-indigo-300 p-2 text-left">Servidores</th>
                <th className="border border-indigo-300 p-2 text-left">Capacidade</th>
                <th className="border border-indigo-300 p-2 text-left">Condição</th>
              </tr>
            </thead>
            <tbody className="bg-white">
              <tr>
                <td className="border border-indigo-300 p-2 font-semibold">M/M/1</td>
                <td className="border border-indigo-300 p-2">s = 1</td>
                <td className="border border-indigo-300 p-2">Infinita</td>
                <td className="border border-indigo-300 p-2">λ &lt; μ</td>
              </tr>
              <tr className="bg-indigo-50">
                <td className="border border-indigo-300 p-2 font-semibold">M/M/s</td>
                <td className="border border-indigo-300 p-2">s ≥ 2</td>
                <td className="border border-indigo-300 p-2">Infinita</td>
                <td className="border border-indigo-300 p-2">λ &lt; s×μ</td>
              </tr>
              <tr>
                <td className="border border-indigo-300 p-2 font-semibold">M/M/1/K</td>
                <td className="border border-indigo-300 p-2">s = 1</td>
                <td className="border border-indigo-300 p-2">Finita (K)</td>
                <td className="border border-indigo-300 p-2">Sem restrição</td>
              </tr>
              <tr className="bg-indigo-50">
                <td className="border border-indigo-300 p-2 font-semibold text-purple-700">M/M/s/K</td>
                <td className="border border-indigo-300 p-2 text-purple-700">s ≥ 2</td>
                <td className="border border-indigo-300 p-2 text-purple-700">Finita (K≥s)</td>
                <td className="border border-indigo-300 p-2 text-purple-700">Sem restrição</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="mt-4 bg-indigo-200 p-3 rounded">
          <p className="text-indigo-900 text-sm">
            <strong>🔑 Dica:</strong> M/M/s/K combina múltiplos servidores (s) com capacidade limitada (K).
            Use quando houver vários atendentes E limite físico de espaço/buffer.
          </p>
        </div>
      </div>

      {/* Conceitos importantes */}
      <div className="bg-gradient-to-r from-red-50 to-red-100 border-2 border-red-400 rounded-xl p-5 shadow-lg mb-6">
        <h3 className="font-bold text-red-900 text-xl mb-3">⚠️ Conceitos Importantes do M/M/s/K</h3>
        <div className="space-y-3 text-sm text-red-900">
          <div className="bg-white p-3 rounded">
            <p className="font-semibold mb-1">🚫 Bloqueio quando cheio:</p>
            <p>Sistema com K clientes → Novos clientes são BLOQUEADOS (não entram)</p>
          </div>
          <div className="bg-white p-3 rounded">
            <p className="font-semibold mb-1">📊 Taxa Efetiva:</p>
            <p>λ efetivo = λ(1 - P_K) → Menor que λ devido ao bloqueio</p>
          </div>
          <div className="bg-white p-3 rounded">
            <p className="font-semibold mb-1">✅ Sempre estável:</p>
            <p>Não precisa λ &lt; s×μ! O limite K garante estabilidade</p>
          </div>
          <div className="bg-white p-3 rounded">
            <p className="font-semibold mb-1">🔢 Cálculo de bloqueios por hora:</p>
            <p>Clientes bloqueados/hora = λ × P(K)</p>
          </div>
          <div className="bg-white p-3 rounded">
            <p className="font-semibold mb-1">📏 Restrição importante:</p>
            <p>K deve ser ≥ s (capacidade mínima = número de servidores)</p>
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
                <span>Implementar fórmulas do M/M/s/K em Python</span>
              </li>
              <li className="flex items-start gap-2">
                <HiCheckCircle className="text-wine-600 flex-shrink-0 mt-0.5" />
                <span>Criar endpoint POST /api/calculate/mmsk</span>
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
