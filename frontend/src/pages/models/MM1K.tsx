import React, { useState } from 'react';
import { Input, Button, ResultDisplay } from '../../components/common';
import type { MM1KInput, MM1KResult } from '../../types/models';
import { SiPython } from 'react-icons/si';
import { HiCheckCircle, HiLightBulb } from 'react-icons/hi';
// import { calculateMM1K } from '../../services/api'; // Descomentar quando backend estiver pronto

export const MM1K: React.FC = () => {
  const [inputs, setInputs] = useState<MM1KInput>({
    lambda: 0,
    mu: 0,
    K: 10,
    n: undefined,
  });

  const [results, setResults] = useState<MM1KResult | null>(null);
  const [error, setError] = useState<string>('');

  const handleInputChange = (field: keyof MM1KInput) => (
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

    if (!inputs.K || inputs.K < 1) {
      setError('K (capacidade) deve ser maior ou igual a 1');
      return;
    }

    // ==========================================
    // Backend necessário
    // ==========================================
    // try {
    //   const result = await calculateMM1K(inputs);
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
          label: 'ρ (Rho = λ/μ)',
          value: results.rho,
          description: 'Razão λ/μ (pode ser > 1, pois K limita o sistema)',
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
          description: 'λ(1-P_K) - Taxa real de entrada (alguns clientes são bloqueados)',
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
        <h2 className="text-4xl font-display font-bold text-dark-950 mb-2">Modelo M/M/1/K</h2>
        <p className="text-dark-600 text-lg">
          1 Fila • 1 Servidor • Capacidade Finita (K clientes máximo)
        </p>
      </div>

      {/* Quando usar - bem direto */}
      <div className="mb-6 bg-gradient-to-r from-blue-50 to-blue-100 border-2 border-blue-400 rounded-xl p-5 shadow-lg">
        <div className="flex items-start gap-3">
          <HiLightBulb className="text-3xl text-blue-600 flex-shrink-0" />
          <div>
            <h3 className="font-bold text-blue-900 text-xl mb-2">Quando usar M/M/1/K?</h3>
            <div className="text-blue-900">
              <p className="mb-2">✅ Use quando o exercício tiver:</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                <div className="bg-blue-50 p-2 rounded">
                  <strong>✓ 1 atendente/servidor</strong>
                </div>
                <div className="bg-blue-50 p-2 rounded">
                  <strong>✓ Capacidade MÁXIMA de K clientes</strong>
                </div>
                <div className="bg-blue-50 p-2 rounded">
                  <strong>✓ Clientes bloqueados quando cheio</strong>
                </div>
                <div className="bg-blue-50 p-2 rounded">
                  <strong>✓ Sistema tem limite físico</strong>
                </div>
              </div>
              <div className="mt-3 bg-green-100 border border-green-400 p-2 rounded text-sm">
                <strong>✅ DIFERENÇA DO M/M/1:</strong> Aqui λ PODE ser maior que μ! O sistema é limitado por K.
              </div>
              <div className="mt-2 bg-blue-200 p-2 rounded text-sm">
                <strong>💡 Exemplos:</strong> Estacionamento com vagas limitadas, sala de espera pequena,
                sistema com buffer limitado, agência bancária pequena
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
                    placeholder="Ex: 0.3"
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
                    placeholder="Ex: 0.5"
                    required
                    min={0}
                    step="any"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Clientes atendidos por tempo
                  </p>
                </div>
                <div>
                  <Input
                    label="K = Capacidade Máxima"
                    value={inputs.K || ''}
                    onChange={handleInputChange('K')}
                    placeholder="Ex: 2"
                    required
                    min={1}
                    step="1"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Máximo de clientes no sistema
                  </p>
                </div>
              </div>
              <div className="mt-3 bg-yellow-50 border border-yellow-300 p-3 rounded text-sm">
                <p><strong>🔢 ρ = λ/μ:</strong> {inputs.lambda && inputs.mu ? `${inputs.lambda}/${inputs.mu} = ${(inputs.lambda / inputs.mu).toFixed(3)}` : 'Preencha λ e μ'}</p>
                <p className="mt-1"><strong>⚠️ Importante:</strong> Em M/M/1/K, ρ PODE ser {'>'} 1 (diferente do M/M/1)!</p>
                <p className="mt-1"><strong>🚫 Bloqueio:</strong> Se sistema tiver K clientes, próximo cliente é REJEITADO</p>
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
                    placeholder="Ex: 2"
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

      {/* Exemplo prático */}
      <div className="mb-6">
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 border-2 border-purple-400 rounded-xl p-5 shadow-lg">
          <h4 className="font-bold text-purple-900 text-lg mb-3">📝 Exemplo: Agência Bancária Pequena</h4>
          <div className="space-y-2 text-sm text-purple-900">
            <div className="bg-white p-3 rounded">
              <p className="font-semibold mb-1">Enunciado:</p>
              <p>Agência bancária pequena com 1 servidor. Clientes chegam com taxa λ = 0,3/min.
              Atendimento tem média 2 min (μ = 1/2 = 0,5/min). Sistema tem capacidade K = 2.</p>
            </div>
            <div className="bg-white p-3 rounded">
              <p className="font-semibold mb-1">Dados:</p>
              <p>• λ = <strong>0,3 clientes/min</strong></p>
              <p>• Tempo médio = 2 min → μ = <strong>0,5 clientes/min</strong></p>
              <p>• K = <strong>2 clientes</strong> (máximo no sistema)</p>
            </div>
            <div className="bg-white p-3 rounded">
              <p className="font-semibold mb-1">Análise:</p>
              <p>• ρ = λ/μ = 0,3/0,5 = 0,6 &lt; 1 ✓</p>
              <p>• Sistema tem capacidade K=2</p>
              <p>• Se 2 clientes no sistema, próximo é bloqueado</p>
            </div>
            <div className="bg-purple-200 p-2 rounded text-xs">
              <strong>💡 Perguntas típicas:</strong> P₀, L, Lq, P(K), W, Wq, λ efetivo
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
            <p className="font-semibold text-orange-900 mb-2">d) Prob. de haver 2 clientes?</p>
            <p className="text-gray-700">→ Coloque <strong>n=2</strong> e use <strong>P(n)</strong></p>
          </div>
          <div className="bg-white p-4 rounded-lg">
            <p className="font-semibold text-orange-900 mb-2">e) Tempo médio na fila?</p>
            <p className="text-gray-700">→ Resposta: <strong>Wq</strong></p>
          </div>
          <div className="bg-white p-4 rounded-lg">
            <p className="font-semibold text-orange-900 mb-2">f) Tempo médio no sistema?</p>
            <p className="text-gray-700">→ Resposta: <strong>W</strong></p>
          </div>
          <div className="bg-white p-4 rounded-lg">
            <p className="font-semibold text-orange-900 mb-2">g) Prob. de bloqueio?</p>
            <p className="text-gray-700">→ Resposta: <strong>P(K)</strong> (sistema cheio)</p>
          </div>
          <div className="bg-white p-4 rounded-lg">
            <p className="font-semibold text-orange-900 mb-2">h) Taxa efetiva de entrada?</p>
            <p className="text-gray-700">→ Resposta: <strong>λ efetivo</strong></p>
          </div>
        </div>
      </div>

      {/* Diferenças M/M/1 vs M/M/1/K */}
      <div className="bg-gradient-to-r from-indigo-50 to-indigo-100 border-2 border-indigo-400 rounded-xl p-5 shadow-lg mb-6">
        <h3 className="font-bold text-indigo-900 text-xl mb-3">🔄 M/M/1 vs M/M/1/K - Qual usar?</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="bg-white p-4 rounded-lg border-2 border-indigo-300">
            <h4 className="font-bold text-indigo-900 mb-2">Use M/M/1 se:</h4>
            <ul className="space-y-1 text-indigo-800">
              <li>✓ <strong>SEM limite</strong> de capacidade</li>
              <li>✓ Fila pode crescer infinitamente</li>
              <li>✓ OBRIGATÓRIO: λ &lt; μ</li>
              <li>✓ Nenhum cliente é rejeitado</li>
            </ul>
          </div>
          <div className="bg-white p-4 rounded-lg border-2 border-purple-300">
            <h4 className="font-bold text-purple-900 mb-2">Use M/M/1/K se:</h4>
            <ul className="space-y-1 text-purple-800">
              <li>✓ <strong>COM limite K</strong> de capacidade</li>
              <li>✓ Máximo K clientes no sistema</li>
              <li>✓ λ pode ser &gt; μ (sistema limitado)</li>
              <li>✓ Clientes bloqueados quando cheio</li>
            </ul>
          </div>
        </div>
        <div className="mt-4 bg-indigo-200 p-3 rounded">
          <p className="text-indigo-900 text-sm">
            <strong>🔑 Dica chave:</strong> Se o exercício menciona "capacidade máxima", "vagas limitadas",
            "sala pequena", "buffer de tamanho K" → use <strong>M/M/1/K</strong>!
          </p>
        </div>
      </div>

      {/* Conceitos importantes */}
      <div className="bg-gradient-to-r from-red-50 to-red-100 border-2 border-red-400 rounded-xl p-5 shadow-lg mb-6">
        <h3 className="font-bold text-red-900 text-xl mb-3">⚠️ Conceitos Importantes do M/M/1/K</h3>
        <div className="space-y-3 text-sm text-red-900">
          <div className="bg-white p-3 rounded">
            <p className="font-semibold mb-1">🚫 Bloqueio de Clientes:</p>
            <p>Quando o sistema está com K clientes, novos clientes NÃO entram (são bloqueados/perdidos)</p>
          </div>
          <div className="bg-white p-3 rounded">
            <p className="font-semibold mb-1">📊 Taxa Efetiva (λ efetivo):</p>
            <p>λ efetivo = λ(1 - P_K) → É menor que λ porque alguns clientes são bloqueados</p>
          </div>
          <div className="bg-white p-3 rounded">
            <p className="font-semibold mb-1">✅ Sistema Sempre Estável:</p>
            <p>Não precisa da condição λ &lt; μ! O limite K garante estabilidade</p>
          </div>
          <div className="bg-white p-3 rounded">
            <p className="font-semibold mb-1">🔢 Fórmula de Little Modificada:</p>
            <p>Use λ efetivo (não λ) nas fórmulas: L = λ_efetivo × W</p>
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
                <span>Implementar fórmulas do M/M/1/K em Python</span>
              </li>
              <li className="flex items-start gap-2">
                <HiCheckCircle className="text-wine-600 flex-shrink-0 mt-0.5" />
                <span>Criar endpoint POST /api/calculate/mm1k</span>
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
