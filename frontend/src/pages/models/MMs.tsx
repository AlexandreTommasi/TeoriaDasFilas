import React, { useState } from 'react';
import { Input, Button, ResultDisplay } from '../../components/common';
import type { MMsInput, MMsResult } from '../../types/models';
import { HiLightBulb } from 'react-icons/hi';
import { calculateMMs } from '../../services/api';

export const MMs: React.FC = () => {
  const [inputs, setInputs] = useState<MMsInput>({
    lambda: 0,
    mu: 0,
    s: 2,
    n: undefined,
    r: undefined,
    t: undefined,
  });

  const [results, setResults] = useState<MMsResult | null>(null);
  const [error, setError] = useState<string>('');

  const handleInputChange = (field: keyof MMsInput) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value;

    // Permitir valores vazios
    if (value === '') {
      setInputs({ ...inputs, [field]: '' as any });
      return;
    }

    // Permitir digitação de decimais e zeros
    if (value.endsWith('.') || value === '.' || value === '-' || value === '-.' || value === '0' || value.startsWith('0.')) {
      setInputs({ ...inputs, [field]: value as any });
      return;
    }

    // Converter para número
    const numValue = parseFloat(value);
    setInputs({
      ...inputs,
      [field]: isNaN(numValue) ? '' : numValue,
    });
  };

  const handleCalculate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setResults(null);

    // Converter valores para número
    const lambda = typeof inputs.lambda === 'string' ? parseFloat(inputs.lambda) : inputs.lambda;
    const mu = typeof inputs.mu === 'string' ? parseFloat(inputs.mu) : inputs.mu;
    const s = typeof inputs.s === 'string' ? parseInt(inputs.s) : inputs.s;
    const n = inputs.n !== undefined && inputs.n !== '' ? (typeof inputs.n === 'string' ? parseInt(inputs.n) : inputs.n) : undefined;
    const r = inputs.r !== undefined && inputs.r !== '' ? (typeof inputs.r === 'string' ? parseInt(inputs.r) : inputs.r) : undefined;
    const t = inputs.t !== undefined && inputs.t !== '' ? (typeof inputs.t === 'string' ? parseFloat(inputs.t) : inputs.t) : undefined;

    if (!lambda || lambda <= 0 || !mu || mu <= 0) {
      setError('λ e μ devem ser maiores que zero');
      return;
    }

    if (!s || s < 2) {
      setError('Número de servidores (s) deve ser maior ou igual a 2');
      return;
    }

    // Validação da condição de estabilidade: λ < s×μ
    if (lambda >= s * mu) {
      setError(`⚠️ Erro: λ deve ser menor que s×μ (${lambda} < ${s}×${mu} = ${s * mu})`);
      return;
    }

    try {
      const payload = { lambda, mu, s, n, r, t };
      const result = await calculateMMs(payload);
      setResults(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao calcular');
    }
  };

  const resultItems = results
    ? [
        {
          label: 'ρ (Taxa de Ocupação por Servidor)',
          value: results.rho,
          description: 'Utilização de cada servidor = λ/(s×μ)',
        },
        {
          label: 'P₀ (Sistema Ocioso)',
          value: results.P0,
          description: 'Probabilidade de não haver clientes',
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
        ...(results.PWqIgualZero !== undefined
          ? [
              {
                label: 'P(Wq=0) - Prob. de não esperar',
                value: results.PWqIgualZero,
                description: 'Probabilidade de ser atendido imediatamente',
              },
            ]
          : []),
        ...(results.Pn !== undefined
          ? [
              {
                label: `P(n=${results.n})`,
                value: results.Pn,
                description: `Probabilidade de exatamente ${results.n} clientes`,
              },
            ]
          : []),
        ...(results.PnMaiorQueR !== undefined
          ? [
              {
                label: `P(n>${results.r})`,
                value: results.PnMaiorQueR,
                description: `Probabilidade de mais de ${results.r} clientes`,
              },
            ]
          : []),
        ...(results.PWMaiorQueT !== undefined
          ? [
              {
                label: `P(W>${results.t})`,
                value: results.PWMaiorQueT,
                description: `Prob. tempo no sistema maior que ${results.t}`,
              },
            ]
          : []),
        ...(results.PWqMaiorQueT !== undefined
          ? [
              {
                label: `P(Wq>${results.t})`,
                value: results.PWqMaiorQueT,
                description: `Prob. tempo na fila maior que ${results.t}`,
              },
            ]
          : []),
      ]
    : [];

  return (
    <div className="max-w-6xl mx-auto">
      {/* Cabeçalho */}
      <div className="mb-6">
        <h2 className="text-4xl font-display font-bold text-dark-950 mb-2">Modelo M/M/s (s&gt;1)</h2>
        <p className="text-dark-600 text-lg">
          1 Fila • Múltiplos Servidores (s≥2) • População Infinita
        </p>
      </div>

      {/* Quando usar - bem direto */}
      <div className="mb-6 bg-gradient-to-r from-blue-50 to-blue-100 border-2 border-blue-400 rounded-xl p-5 shadow-lg">
        <div className="flex items-start gap-3">
          <HiLightBulb className="text-3xl text-blue-600 flex-shrink-0" />
          <div>
            <h3 className="font-bold text-blue-900 text-xl mb-2">Quando usar M/M/s?</h3>
            <div className="text-blue-900">
              <p className="mb-2">✅ Use quando o exercício tiver:</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                <div className="bg-blue-50 p-2 rounded">
                  <strong>✓ 2 ou mais atendentes/servidores</strong>
                </div>
                <div className="bg-blue-50 p-2 rounded">
                  <strong>✓ 1 única fila de espera</strong>
                </div>
                <div className="bg-blue-50 p-2 rounded">
                  <strong>✓ Chegadas aleatórias (Poisson)</strong>
                </div>
                <div className="bg-blue-50 p-2 rounded">
                  <strong>✓ Atendimento com tempo médio</strong>
                </div>
              </div>
              <div className="mt-3 bg-red-100 border border-red-400 p-2 rounded text-sm">
                <strong>⚠️ OBRIGATÓRIO: λ &lt; s×μ</strong> ou <strong>ρ = λ/(s×μ) &lt; 1</strong>
              </div>
              <div className="mt-2 bg-blue-200 p-2 rounded text-sm">
                <strong>💡 Exemplos:</strong> Banco com vários caixas, call center com vários atendentes,
                posto com múltiplas cabines de pedágio
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
                    placeholder="Ex: 30"
                    required
                    min={0}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Clientes que chegam por unidade de tempo
                  </p>
                </div>
                <div>
                  <Input
                    label="μ (mu) = Taxa de Atendimento"
                    value={inputs.mu || ''}
                    onChange={handleInputChange('mu')}
                    placeholder="Ex: 20"
                    required
                    min={0}
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
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Quantos atendentes/caixas/servidores
                  </p>
                </div>
              </div>
              <div className="mt-3 bg-yellow-50 border border-yellow-300 p-3 rounded text-sm">
                <p><strong>📊 Capacidade total do sistema:</strong> {inputs.s && inputs.mu ? `s×μ = ${inputs.s}×${inputs.mu} = ${Number(inputs.s) * Number(inputs.mu)} clientes/tempo` : 'Preencha s e μ'}</p>
                <p className="mt-1"><strong>🎯 Para estabilidade:</strong> λ deve ser menor que {inputs.s && inputs.mu ? (Number(inputs.s) * Number(inputs.mu)) : 's×μ'}</p>
              </div>
            </div>

            {/* Parâmetros opcionais */}
            <div className="bg-yellow-50 rounded-lg p-5 border-2 border-yellow-300">
              <h4 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                <span className="bg-yellow-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm">2</span>
                Cálculos Extras (Opcional - só se a questão pedir)
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Input
                    label="n = Número de clientes"
                    value={inputs.n !== undefined ? inputs.n : ''}
                    onChange={handleInputChange('n')}
                    placeholder="Ex: 3"
                    min={0}
                  />
                  <p className="text-xs text-gray-600 mt-1">
                    Para calcular <strong>P(n)</strong>
                  </p>
                </div>
                <div>
                  <Input
                    label="r = Limite de clientes"
                    value={inputs.r !== undefined ? inputs.r : ''}
                    onChange={handleInputChange('r')}
                    placeholder="Ex: 5"
                    min={0}
                  />
                  <p className="text-xs text-gray-600 mt-1">
                    Para calcular <strong>P(n&gt;r)</strong>
                  </p>
                </div>
                <div>
                  <Input
                    label="t = Tempo limite"
                    value={inputs.t !== undefined ? inputs.t : ''}
                    onChange={handleInputChange('t')}
                    placeholder="Ex: 3"
                    min={0}
                  />
                  <p className="text-xs text-gray-600 mt-1">
                    Para <strong>P(W&gt;t)</strong> e <strong>P(Wq&gt;t)</strong>
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
          <h4 className="font-bold text-purple-900 text-lg mb-3">📝 Exemplo 1: Sistema Sobrecarregado</h4>
          <div className="space-y-2 text-sm text-purple-900">
            <div className="bg-white p-3 rounded">
              <p className="font-semibold mb-1">Situação:</p>
              <p>• 1 canal sobrecarregado (λ=30, μ=20)</p>
              <p>• Solução: criar 2ª seção → s=2</p>
            </div>
            <div className="bg-white p-3 rounded">
              <p className="font-semibold mb-1">Dados:</p>
              <p>• λ = <strong>30 clientes/hora</strong></p>
              <p>• μ = <strong>20 clientes/hora</strong></p>
              <p>• s = <strong>2 servidores</strong></p>
            </div>
            <div className="bg-white p-3 rounded">
              <p className="font-semibold mb-1">Verificar:</p>
              <p>• λ &lt; s×μ? → 30 &lt; 2×20 = 40 ✓</p>
              <p>• ρ = 30/(2×20) = 0,75 &lt; 1 ✓</p>
            </div>
          </div>
        </div>

        {/* Exemplo 2 */}
        <div className="bg-gradient-to-br from-green-50 to-green-100 border-2 border-green-400 rounded-xl p-5 shadow-lg">
          <h4 className="font-bold text-green-900 text-lg mb-3">📝 Exemplo 2: Banco</h4>
          <div className="space-y-2 text-sm text-green-900">
            <div className="bg-white p-3 rounded">
              <p className="font-semibold mb-1">Dados:</p>
              <p>• λ = 0,60 clientes/min</p>
              <p>• μ = 0,25 clientes/min</p>
              <p>• s = 3 caixas</p>
            </div>
            <div className="bg-white p-3 rounded">
              <p className="font-semibold mb-1">Conversão (se necessário):</p>
              <p>Se μ = 4 min/cliente:</p>
              <p>→ μ = 1/4 = 0,25 clientes/min ✓</p>
            </div>
            <div className="bg-green-200 p-2 rounded text-xs">
              <strong>💡 Dica:</strong> Sempre converta para TAXA (clientes/tempo)!
            </div>
          </div>
        </div>
      </div>

      {/* Respostas das questões típicas */}
      <div className="bg-gradient-to-r from-orange-50 to-orange-100 border-2 border-orange-400 rounded-xl p-6 shadow-lg mb-6">
        <h3 className="font-bold text-orange-900 text-xl mb-4">❓ Perguntas Típicas e Como Responder</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="bg-white p-4 rounded-lg">
            <p className="font-semibold text-orange-900 mb-2">a) Taxa de ocupação do sistema?</p>
            <p className="text-gray-700">→ Resposta: <strong>ρ</strong> (por servidor)</p>
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
            <p className="font-semibold text-orange-900 mb-2">d) Prob. sistema vazio?</p>
            <p className="text-gray-700">→ Resposta: <strong>P₀</strong></p>
          </div>
          <div className="bg-white p-4 rounded-lg">
            <p className="font-semibold text-orange-900 mb-2">e) Prob. de mais de 5 clientes?</p>
            <p className="text-gray-700">→ Coloque <strong>r=5</strong> e use <strong>P(n&gt;r)</strong></p>
          </div>
          <div className="bg-white p-4 rounded-lg">
            <p className="font-semibold text-orange-900 mb-2">f) Tempo médio na fila?</p>
            <p className="text-gray-700">→ Resposta: <strong>Wq</strong></p>
          </div>
          <div className="bg-white p-4 rounded-lg">
            <p className="font-semibold text-orange-900 mb-2">g) Tempo médio no sistema?</p>
            <p className="text-gray-700">→ Resposta: <strong>W</strong></p>
          </div>
          <div className="bg-white p-4 rounded-lg">
            <p className="font-semibold text-orange-900 mb-2">h) Prob. W&gt;3 min?</p>
            <p className="text-gray-700">→ Coloque <strong>t=3</strong> e use <strong>P(W&gt;t)</strong></p>
          </div>
          <div className="bg-white p-4 rounded-lg">
            <p className="font-semibold text-orange-900 mb-2">i) Prob. Wq&gt;2 min?</p>
            <p className="text-gray-700">→ Coloque <strong>t=2</strong> e use <strong>P(Wq&gt;t)</strong></p>
          </div>
          <div className="bg-white p-4 rounded-lg">
            <p className="font-semibold text-orange-900 mb-2">j) Prob. de haver 3 clientes?</p>
            <p className="text-gray-700">→ Coloque <strong>n=3</strong> e use <strong>P(n)</strong></p>
          </div>
        </div>
      </div>

      {/* Diferenças entre M/M/1 e M/M/s */}
      <div className="bg-gradient-to-r from-indigo-50 to-indigo-100 border-2 border-indigo-400 rounded-xl p-5 shadow-lg mb-6">
        <h3 className="font-bold text-indigo-900 text-xl mb-3">🔄 M/M/1 vs M/M/s - Qual usar?</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="bg-white p-4 rounded-lg border-2 border-indigo-300">
            <h4 className="font-bold text-indigo-900 mb-2">Use M/M/1 se:</h4>
            <ul className="space-y-1 text-indigo-800">
              <li>✓ <strong>1 servidor</strong> apenas</li>
              <li>✓ Condição: λ &lt; μ</li>
              <li>✓ Ex: 1 barbeiro, 1 caixa, 1 técnico</li>
            </ul>
          </div>
          <div className="bg-white p-4 rounded-lg border-2 border-purple-300">
            <h4 className="font-bold text-purple-900 mb-2">Use M/M/s se:</h4>
            <ul className="space-y-1 text-purple-800">
              <li>✓ <strong>2 ou mais servidores</strong></li>
              <li>✓ Condição: λ &lt; s×μ</li>
              <li>✓ Ex: 3 caixas de banco, 2 atendentes</li>
            </ul>
          </div>
        </div>
      </div>

    </div>
  );
};
