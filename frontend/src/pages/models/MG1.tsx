import React, { useState } from 'react';
import { Input, Button, ResultDisplay } from '../../components/common';
import type { MG1Input, MG1Result } from '../../types/models';
import { HiLightBulb } from 'react-icons/hi';
import { calculateMG1 } from '../../services/api';

export const MG1: React.FC = () => {
  const [inputs, setInputs] = useState<MG1Input>({
    lambda: '',
    mu: '',
    varService: '',
  });

  const [results, setResults] = useState<MG1Result | null>(null);
  const [error, setError] = useState<string>('');

  const handleInputChange = (field: keyof MG1Input) => (
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
    const varService = typeof inputs.varService === 'string' ? parseFloat(inputs.varService) : inputs.varService;

    if (!lambda || lambda <= 0 || !mu || mu <= 0) {
      setError('λ e μ devem ser maiores que zero');
      return;
    }

    // varService é opcional - se informado, validar
    if (inputs.varService !== '' && inputs.varService !== undefined) {
      const numericVarService = typeof varService === 'number' ? varService : parseFloat(String(varService));
      if (isNaN(numericVarService) || numericVarService < 0) {
        setError('Variância deve ser maior ou igual a zero');
        return;
      }
    }

    // Verificar estabilidade: ρ = λ/μ < 1
    const rho = lambda / mu;
    if (rho >= 1) {
      setError('⚠️ Erro: λ/μ deve ser menor que 1 (condição de estabilidade)');
      return;
    }

    try {
      const payload = {
        lambda,
        mu,
        varService,
      };
      const result = await calculateMG1(payload);
      setResults(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao calcular');
    }
  };

  const resultItems = results
    ? [
        {
          label: 'ρ (Taxa de Ocupação)',
          value: results.rho,
          description: 'Utilização do sistema (λ × E[S])',
        },
        {
          label: 'P₀ (Sistema Ocioso)',
          value: results.P0,
          description: 'Probabilidade de não haver clientes',
        },
        {
          label: 'Lq (Clientes na Fila)',
          value: results.Lq,
          description: 'Número médio na fila (Fórmula de Pollaczek-Khinchin)',
        },
        {
          label: 'Wq (Tempo na Fila)',
          value: results.Wq,
          description: 'Tempo médio de espera na fila',
        },
        {
          label: 'L (Clientes no Sistema)',
          value: results.L,
          description: 'Número médio total no sistema',
        },
        {
          label: 'W (Tempo no Sistema)',
          value: results.W,
          description: 'Tempo médio total no sistema',
        },
      ]
    : [];

  return (
    <div className="max-w-6xl mx-auto">
      {/* Cabeçalho */}
      <div className="mb-6">
        <h2 className="text-4xl font-display font-bold text-dark-950 mb-2">Modelo M/G/1</h2>
        <p className="text-dark-600 text-lg">
          1 Fila • 1 Servidor • Distribuição Geral de Atendimento
        </p>
      </div>

      {/* Quando usar */}
      <div className="mb-6 bg-gradient-to-r from-blue-50 to-blue-100 border-2 border-blue-400 rounded-xl p-5 shadow-lg">
        <div className="flex items-start gap-3">
          <HiLightBulb className="text-3xl text-blue-600 flex-shrink-0" />
          <div>
            <h3 className="font-bold text-blue-900 text-xl mb-2">Quando usar M/G/1?</h3>
            <div className="text-blue-900">
              <p className="mb-2">✅ Use quando o exercício tiver:</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                <div className="bg-blue-50 p-2 rounded">
                  <strong>✓ 1 atendente/servidor/máquina</strong>
                </div>
                <div className="bg-blue-50 p-2 rounded">
                  <strong>✓ Chegadas aleatórias (Poisson)</strong>
                </div>
                <div className="bg-blue-50 p-2 rounded">
                  <strong>✓ Tempo de atendimento QUALQUER distribuição</strong>
                </div>
                <div className="bg-blue-50 p-2 rounded">
                  <strong>✓ Te dão média E[S] e variância σ²</strong>
                </div>
              </div>
              <div className="mt-3 bg-yellow-100 border border-yellow-500 p-3 rounded text-sm">
                <strong>🎯 DIFERENÇA DO M/M/1:</strong> Aqui o atendimento NÃO precisa ser exponencial!
                Pode ser constante, normal, uniforme, ou qualquer distribuição.
              </div>
              <div className="mt-2 bg-red-100 border border-red-400 p-2 rounded text-sm">
                <strong>⚠️ OBRIGATÓRIO: λ × E[S] &lt; 1</strong> (condição de estabilidade)
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CALCULADORA PRINCIPAL */}
      <div className="bg-gradient-to-br from-wine-500 to-wine-700 rounded-2xl shadow-2xl p-1 mb-6">
        <div className="bg-white rounded-xl p-6">
          <h3 className="font-display font-bold text-wine-900 text-2xl mb-1">
            🧮 Calculadora M/G/1
          </h3>
          <p className="text-gray-600 mb-6 text-sm">
            Usa a fórmula de Pollaczek-Khinchin para distribuição geral
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
                    value={inputs.lambda}
                    onChange={handleInputChange('lambda')}
                    placeholder="Ex: 4"
                    required
                    min={0}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Chegadas por unidade de tempo
                  </p>
                </div>
                <div>
                  <Input
                    label="μ (mu) = Taxa de Atendimento"
                    value={inputs.mu}
                    onChange={handleInputChange('mu')}
                    placeholder="Ex: 6"
                    required
                    min={0}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Atendimentos por unidade de tempo
                  </p>
                </div>
                <div>
                  <Input
                    label="Var[S] = Variância do Atendimento (Opcional)"
                    value={inputs.varService !== undefined ? inputs.varService : ''}
                    onChange={handleInputChange('varService')}
                    placeholder="Ex: 0.0278 (deixe vazio para calcular automaticamente)"
                    min={0}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Se vazio, usa σ = 1/μ automaticamente
                  </p>
                </div>
              </div>
            </div>

            {/* Dicas de cálculo */}
            <div className="bg-yellow-50 rounded-lg p-5 border-2 border-yellow-300">
              <h4 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                <span className="bg-yellow-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm">💡</span>
                Dicas para Calcular a Variância
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-gray-800">
                <div className="bg-white p-3 rounded">
                  <p className="font-semibold mb-1">📌 Tempo CONSTANTE (M/D/1):</p>
                  <p>Var[S] = <strong>0</strong></p>
                  <p className="text-xs text-gray-600 mt-1">Ex: sempre 10 minutos exatos</p>
                </div>
                <div className="bg-white p-3 rounded">
                  <p className="font-semibold mb-1">📌 Tempo EXPONENCIAL (M/M/1):</p>
                  <p>Var[S] = <strong>(E[S])²</strong></p>
                  <p className="text-xs text-gray-600 mt-1">Se E[S]=0.1667, então Var=0.0278</p>
                </div>
                <div className="bg-white p-3 rounded">
                  <p className="font-semibold mb-1">📌 Te deram desvio-padrão σ:</p>
                  <p>Var[S] = <strong>σ²</strong></p>
                  <p className="text-xs text-gray-600 mt-1">Eleve ao quadrado</p>
                </div>
                <div className="bg-white p-3 rounded">
                  <p className="font-semibold mb-1">📌 Te deram μ (taxa):</p>
                  <p>E[S] = <strong>1/μ</strong></p>
                  <p className="text-xs text-gray-600 mt-1">Primeiro converte, depois calcula Var</p>
                </div>
              </div>
            </div>

            {error && (
              <div className="bg-red-100 border-2 border-red-400 text-red-800 px-4 py-3 rounded-lg font-semibold">
                {error}
              </div>
            )}

            <Button type="submit" fullWidth>
              🚀 CALCULAR COM POLLACZEK-KHINCHIN
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
          <h4 className="font-bold text-purple-900 text-lg mb-3">📝 Exemplo 1: Lava-rápido (M/M/1)</h4>
          <div className="space-y-2 text-sm text-purple-900">
            <div className="bg-white p-3 rounded">
              <p className="font-semibold mb-1">Dados:</p>
              <p>• λ = 4 carros/hora</p>
              <p>• Tempo médio = 10 min = 1/6 hora</p>
              <p>• Tempo é exponencial</p>
            </div>
            <div className="bg-white p-3 rounded">
              <p className="font-semibold mb-1">Conversão:</p>
              <p>• λ = <strong>4</strong></p>
              <p>• E[S] = 10/60 = <strong>0.1667</strong></p>
              <p>• Var[S] = (0.1667)² = <strong>0.0278</strong></p>
            </div>
            <div className="bg-purple-200 p-2 rounded text-xs">
              <strong>✅ Resultados esperados:</strong> Lq=1.333, L=2.000, W=0.500
            </div>
          </div>
        </div>

        {/* Exemplo 2 */}
        <div className="bg-gradient-to-br from-green-50 to-green-100 border-2 border-green-400 rounded-xl p-5 shadow-lg">
          <h4 className="font-bold text-green-900 text-lg mb-3">📝 Exemplo 2: Café Expresso (M/M/1)</h4>
          <div className="space-y-2 text-sm text-green-900">
            <div className="bg-white p-3 rounded">
              <p className="font-semibold mb-1">Dados:</p>
              <p>• λ = 25 clientes/hora</p>
              <p>• Tempo = 90 segundos = 0.025 h</p>
              <p>• Distribuição exponencial</p>
            </div>
            <div className="bg-white p-3 rounded">
              <p className="font-semibold mb-1">Valores:</p>
              <p>• λ = <strong>25</strong></p>
              <p>• E[S] = <strong>0.025</strong></p>
              <p>• Var[S] = (0.025)² = <strong>0.000625</strong></p>
            </div>
            <div className="bg-green-200 p-2 rounded text-xs">
              <strong>✅ Resultados:</strong> Lq=1.042, L=1.667, Wq=0.042
            </div>
          </div>
        </div>
      </div>

      {/* Exemplo com tempo constante */}
      <div className="bg-gradient-to-r from-cyan-50 to-cyan-100 border-2 border-cyan-400 rounded-xl p-5 shadow-lg mb-6">
        <h4 className="font-bold text-cyan-900 text-lg mb-3">🎯 Comparação M/M/1 vs M/D/1 (Tempo Constante)</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="bg-white p-4 rounded-lg">
            <p className="font-semibold text-cyan-900 mb-2">Lava-rápido com tempo VARIÁVEL:</p>
            <p className="text-gray-700 mb-2">• λ=4, E[S]=0.1667, Var=0.0278</p>
            <p className="text-cyan-800 font-bold">→ Lq = 1.333 clientes</p>
          </div>
          <div className="bg-white p-4 rounded-lg">
            <p className="font-semibold text-cyan-900 mb-2">Lava-rápido com tempo FIXO:</p>
            <p className="text-gray-700 mb-2">• λ=4, E[S]=0.1667, Var=<strong>0</strong></p>
            <p className="text-cyan-800 font-bold">→ Lq = 0.667 clientes</p>
          </div>
        </div>
        <div className="mt-3 bg-cyan-200 p-3 rounded">
          <p className="text-cyan-900 font-semibold">
            💡 Observe: Tempo constante <strong>reduz pela metade</strong> a fila! (Razão = 0.5)
          </p>
        </div>
      </div>

      {/* Respostas típicas */}
      <div className="bg-gradient-to-r from-orange-50 to-orange-100 border-2 border-orange-400 rounded-xl p-6 shadow-lg mb-6">
        <h3 className="font-bold text-orange-900 text-xl mb-4">❓ Perguntas Típicas para M/G/1</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="bg-white p-4 rounded-lg">
            <p className="font-semibold text-orange-900 mb-2">a) Como sei se é M/G/1?</p>
            <p className="text-gray-700">→ Te dão <strong>média E[S] e variância σ²</strong> do atendimento</p>
          </div>
          <div className="bg-white p-4 rounded-lg">
            <p className="font-semibold text-orange-900 mb-2">b) E se o tempo for constante?</p>
            <p className="text-gray-700">→ É M/D/1! Use <strong>Var[S] = 0</strong></p>
          </div>
          <div className="bg-white p-4 rounded-lg">
            <p className="font-semibold text-orange-900 mb-2">c) E se for exponencial?</p>
            <p className="text-gray-700">→ É M/M/1! Use <strong>Var[S] = (E[S])²</strong></p>
          </div>
          <div className="bg-white p-4 rounded-lg">
            <p className="font-semibold text-orange-900 mb-2">d) Me deram μ, não E[S]!</p>
            <p className="text-gray-700">→ Converta: <strong>E[S] = 1/μ</strong></p>
          </div>
          <div className="bg-white p-4 rounded-lg">
            <p className="font-semibold text-orange-900 mb-2">e) Qual a vantagem do M/G/1?</p>
            <p className="text-gray-700">→ Funciona para <strong>qualquer distribuição</strong> de atendimento!</p>
          </div>
          <div className="bg-white p-4 rounded-lg">
            <p className="font-semibold text-orange-900 mb-2">f) Fórmula principal?</p>
            <p className="text-gray-700">→ <strong>Pollaczek-Khinchin</strong> para Lq</p>
          </div>
        </div>
      </div>

      {/* Fórmulas */}
      <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 border-2 border-indigo-400 rounded-xl p-5 shadow-lg">
        <h4 className="font-bold text-indigo-900 text-xl mb-4">📐 Fórmulas do M/G/1</h4>
        <div className="bg-white rounded-lg p-5 space-y-3 text-sm">
          <div className="border-b pb-2">
            <p className="font-mono text-indigo-900"><strong>ρ = λ × E[S]</strong></p>
            <p className="text-xs text-gray-600">Taxa de utilização (deve ser &lt; 1)</p>
          </div>
          <div className="border-b pb-2">
            <p className="font-mono text-indigo-900"><strong>P₀ = 1 - ρ</strong></p>
            <p className="text-xs text-gray-600">Probabilidade de sistema vazio</p>
          </div>
          <div className="border-b pb-2 bg-yellow-50 p-2 rounded">
            <p className="font-mono text-indigo-900"><strong>Lq = (λ²×Var[S] + ρ²) / (2×(1-ρ))</strong></p>
            <p className="text-xs text-gray-600">⭐ Fórmula de Pollaczek-Khinchin (a mais importante!)</p>
          </div>
          <div className="border-b pb-2">
            <p className="font-mono text-indigo-900"><strong>Wq = Lq / λ</strong></p>
            <p className="text-xs text-gray-600">Tempo médio na fila</p>
          </div>
          <div className="border-b pb-2">
            <p className="font-mono text-indigo-900"><strong>L = ρ + Lq</strong></p>
            <p className="text-xs text-gray-600">Clientes no sistema</p>
          </div>
          <div>
            <p className="font-mono text-indigo-900"><strong>W = Wq + E[S]</strong></p>
            <p className="text-xs text-gray-600">Tempo total no sistema</p>
          </div>
        </div>
      </div>
    </div>
  );
};
