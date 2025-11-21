import React, { useState } from 'react';
import { Input, Button } from '../../../components/common';
import type { PriorityComInput, PriorityComResult } from '../../../types/models';
import { HiLightBulb } from 'react-icons/hi';
import { calculatePriorityCom } from '../../../services/api';

export const Priority3: React.FC = () => {
  const [inputs, setInputs] = useState<Omit<PriorityComInput, 's'> & { mu: number | string; lambdas: (number | string)[] }>({
    mu: '',
    lambdas: ['', ''],
  });

  const [results, setResults] = useState<PriorityComResult | null>(null);
  const [error, setError] = useState<string>('');

  const handleInputChange = (field: 'mu') => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value;

    if (value === '') {
      setInputs({ ...inputs, [field]: '' as any });
      return;
    }

    if (value.endsWith('.') || value === '.' || value === '-' || value === '-.' || value === '0' || value.startsWith('0.')) {
      setInputs({ ...inputs, [field]: value as any });
      return;
    }

    const numValue = parseFloat(value);
    setInputs({
      ...inputs,
      [field]: isNaN(numValue) ? '' : numValue,
    });
  };

  const handleLambdaChange = (index: number) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value;
    const newLambdas = [...inputs.lambdas];

    if (value === '') {
      newLambdas[index] = '' as any;
      setInputs({ ...inputs, lambdas: newLambdas });
      return;
    }

    if (value.endsWith('.') || value === '.' || value === '-' || value === '-.' || value === '0' || value.startsWith('0.')) {
      newLambdas[index] = value as any;
      setInputs({ ...inputs, lambdas: newLambdas });
      return;
    }

    const numValue = parseFloat(value);
    newLambdas[index] = isNaN(numValue) ? '' : numValue;
    setInputs({ ...inputs, lambdas: newLambdas });
  };

  const addClasse = () => {
    setInputs({
      ...inputs,
      lambdas: [...inputs.lambdas, ''],
    });
  };

  const removeClasse = (index: number) => {
    if (inputs.lambdas.length <= 1) {
      setError('Deve haver pelo menos 1 classe de prioridade');
      return;
    }
    const newLambdas = inputs.lambdas.filter((_, i) => i !== index);
    setInputs({ ...inputs, lambdas: newLambdas });
  };

  const handleCalculate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setResults(null);

    // s = 1 fixo para M/M/1
    const s = 1;
    const mu = typeof inputs.mu === 'string' ? parseFloat(inputs.mu) : inputs.mu;
    const lambdas = inputs.lambdas.map(l =>
      typeof l === 'string' ? parseFloat(l) : l
    );

    // Validações
    if (!mu || mu <= 0) {
      setError('Taxa de atendimento (μ) deve ser maior que zero');
      return;
    }

    if (lambdas.some(l => !l || isNaN(l) || l <= 0)) {
      setError('Todas as taxas de chegada (λ) devem ser maiores que zero');
      return;
    }

    // Verificar estabilidade: λ_total / μ < 1 (para s=1)
    const lambdaTotal = lambdas.reduce((sum, l) => sum + l, 0);
    const rho = lambdaTotal / mu;
    if (rho >= 1) {
      setError(`⚠️ Erro: Sistema instável! ρ = ${rho.toFixed(4)} (deve ser < 1)`);
      return;
    }

    try {
      const payload = { s, mu, lambdas };
      const result = await calculatePriorityCom(payload);
      setResults(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao calcular');
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Cabeçalho */}
      <div className="mb-6">
        <h2 className="text-4xl font-display font-bold text-dark-950 mb-2">
          M/M/1 com Prioridade (COM Interrupção)
        </h2>
        <p className="text-dark-600 text-lg">
          Múltiplas Filas • <strong>1 Servidor</strong> • Prioridade Preemptiva
        </p>
      </div>

      {/* Quando usar */}
      <div className="mb-6 bg-gradient-to-r from-red-50 to-red-100 border-2 border-red-400 rounded-xl p-5 shadow-lg">
        <div className="flex items-start gap-3">
          <HiLightBulb className="text-3xl text-red-600 flex-shrink-0" />
          <div>
            <h3 className="font-bold text-red-900 text-xl mb-2">Quando usar este modelo?</h3>
            <div className="text-red-900">
              <p className="mb-2">✅ Use quando o exercício tiver:</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                <div className="bg-red-50 p-2 rounded">
                  <strong>✓ Apenas 1 servidor (s = 1)</strong>
                </div>
                <div className="bg-red-50 p-2 rounded">
                  <strong>✓ Diferentes classes de prioridade</strong>
                </div>
                <div className="bg-red-50 p-2 rounded">
                  <strong>✓ Atendimento PODE ser interrompido</strong>
                </div>
                <div className="bg-red-50 p-2 rounded">
                  <strong>✓ Chegadas seguem Poisson por classe</strong>
                </div>
              </div>
              <div className="mt-3 bg-yellow-100 border border-yellow-500 p-3 rounded text-sm">
                <strong>📝 IMPORTANTE:</strong> Classes devem ser inseridas da <strong>MAIOR prioridade (1)</strong> para a <strong>MENOR</strong>.
                Cliente de classe 1 INTERROMPE atendimento de classes inferiores se necessário.
              </div>
              <div className="mt-2 bg-red-100 border border-red-400 p-2 rounded text-sm">
                <strong>⚠️ OBRIGATÓRIO: ρ = λ_total/μ &lt; 1</strong> (condição de estabilidade)
              </div>
              <div className="mt-2 bg-blue-100 border border-blue-400 p-2 rounded text-sm">
                <strong>ℹ️ Para 2 ou mais servidores (s≥2):</strong> Use o modelo <strong>Priority4</strong>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CALCULADORA PRINCIPAL */}
      <div className="bg-gradient-to-br from-red-500 to-red-700 rounded-2xl shadow-2xl p-1 mb-6">
        <div className="bg-white rounded-xl p-6">
          <h3 className="font-display font-bold text-red-900 text-2xl mb-1">
            🧮 Calculadora M/M/1 com Prioridade Preemptiva (s = 1)
          </h3>
          <p className="text-gray-600 mb-6 text-sm">
            Sistema com múltiplas classes de prioridade COM interrupção (Preemptive)
          </p>

          <form onSubmit={handleCalculate} className="space-y-5">
            {/* Parâmetros do sistema */}
            <div className="bg-gray-50 rounded-lg p-5 border-2 border-gray-200">
              <h4 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                <span className="bg-red-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm">1</span>
                Parâmetros do Sistema
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg border-2 border-blue-300">
                  <p className="font-bold text-blue-900 mb-1">s = Número de Servidores</p>
                  <p className="text-3xl font-bold text-blue-900">1</p>
                  <p className="text-xs text-gray-600 mt-1">(Fixo para M/M/1)</p>
                </div>
                <div>
                  <Input
                    label="μ (mu) = Taxa de Atendimento"
                    value={inputs.mu}
                    onChange={handleInputChange('mu')}
                    placeholder="Ex: 5"
                    required
                    min={0}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Atendimentos por unidade de tempo (1 servidor)
                  </p>
                </div>
              </div>
            </div>

            {/* Classes de Prioridade */}
            <div className="bg-gradient-to-r from-red-50 to-red-100 rounded-lg p-5 border-2 border-red-300">
              <h4 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                <span className="bg-red-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm">2</span>
                Classes de Prioridade (da maior para a menor)
              </h4>

              {inputs.lambdas.map((lambda, index) => (
                <div key={index} className="mb-3 bg-white p-4 rounded-lg border border-red-300">
                  <div className="flex items-center gap-3">
                    <div className="flex-shrink-0 w-20">
                      <span className="inline-block bg-red-600 text-white px-3 py-1 rounded-full text-sm font-bold">
                        Classe {index + 1}
                      </span>
                    </div>
                    <div className="flex-grow">
                      <Input
                        label={`λ${index + 1} = Taxa de Chegada`}
                        value={lambda}
                        onChange={handleLambdaChange(index)}
                        placeholder="Ex: 2.5"
                        required
                        min={0}
                      />
                    </div>
                    {inputs.lambdas.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeClasse(index)}
                        className="flex-shrink-0 bg-red-500 text-white px-3 py-2 rounded hover:bg-red-600 text-sm"
                      >
                        Remover
                      </button>
                    )}
                  </div>
                </div>
              ))}

              <button
                type="button"
                onClick={addClasse}
                className="w-full bg-red-600 text-white py-2 rounded hover:bg-red-700 font-semibold"
              >
                + Adicionar Classe de Prioridade
              </button>
            </div>

            {/* Informações calculadas */}
            {inputs.mu && inputs.lambdas.every(l => l !== '') && (
              <div className="bg-blue-50 rounded-lg p-4 border-2 border-blue-300">
                <h4 className="font-bold text-blue-900 mb-2">📊 Verificação Preliminar:</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm">
                  <p>
                    <strong>λ total:</strong>{' '}
                    {(inputs.lambdas.reduce<number>((sum, l) => sum + (Number(l) || 0), 0)).toFixed(4)}
                  </p>
                  <p>
                    <strong>Capacidade (μ):</strong>{' '}
                    {(Number(inputs.mu)).toFixed(4)}
                  </p>
                  <p>
                    <strong>ρ (utilização):</strong>{' '}
                    {(((inputs.lambdas.reduce<number>((sum, l) => sum + (Number(l) || 0), 0)) /
                      Number(inputs.mu))).toFixed(4)}
                  </p>
                </div>
              </div>
            )}

            {error && (
              <div className="bg-red-100 border-2 border-red-400 text-red-800 px-4 py-3 rounded-lg font-semibold">
                {error}
              </div>
            )}

            <Button type="submit" fullWidth>
              🚀 CALCULAR COM PRIORIDADE PREEMPTIVA (s = 1)
            </Button>
          </form>

          {/* Resultados */}
          {results && (
            <div className="mt-8">
              <h4 className="font-bold text-gray-800 mb-4 text-lg">📊 Resultados do Sistema:</h4>

              {/* Métricas gerais */}
              <div className="bg-gray-50 rounded-lg p-4 mb-4 border-2 border-gray-300">
                <h5 className="font-bold text-gray-700 mb-3">Métricas Gerais do Sistema</h5>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
                  <div className="bg-white p-3 rounded border">
                    <p className="text-gray-600">Taxa de Utilização</p>
                    <p className="font-bold text-lg">{results.rho.toFixed(4)}</p>
                  </div>
                  <div className="bg-white p-3 rounded border">
                    <p className="text-gray-600">λ Total</p>
                    <p className="font-bold text-lg">{results.lambdaTotal.toFixed(4)}</p>
                  </div>
                  <div className="bg-white p-3 rounded border">
                    <p className="text-gray-600">Capacidade (μ)</p>
                    <p className="font-bold text-lg">{results.capacidadeTotal.toFixed(4)}</p>
                  </div>
                </div>
              </div>

              {/* Resultados por classe */}
              <div className="bg-red-50 rounded-lg p-4 border-2 border-red-300">
                <h5 className="font-bold text-red-900 mb-3">Resultados por Classe de Prioridade (Preemptive)</h5>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-red-200">
                        <th className="p-2 text-left">Classe</th>
                        <th className="p-2 text-right">λ</th>
                        <th className="p-2 text-right">L</th>
                        <th className="p-2 text-right">Lq</th>
                        <th className="p-2 text-right">W</th>
                        <th className="p-2 text-right">Wq</th>
                        <th className="p-2 text-right">σ</th>
                      </tr>
                    </thead>
                    <tbody>
                      {results.classes.map((classe) => (
                        <tr key={classe.classe} className="border-b bg-white hover:bg-red-50">
                          <td className="p-2 font-bold">Classe {classe.classe}</td>
                          <td className="p-2 text-right">{classe.lambda.toFixed(4)}</td>
                          <td className="p-2 text-right">{classe.L.toFixed(4)}</td>
                          <td className="p-2 text-right">{classe.Lq.toFixed(4)}</td>
                          <td className="p-2 text-right">{classe.W.toFixed(4)}</td>
                          <td className="p-2 text-right">{classe.Wq.toFixed(4)}</td>
                          <td className="p-2 text-right">{classe.sigma.toFixed(4)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="mt-3 text-xs text-gray-600">
                  <p><strong>L:</strong> Nº médio clientes no sistema | <strong>Lq:</strong> Nº médio na fila</p>
                  <p><strong>W:</strong> Tempo médio no sistema | <strong>Wq:</strong> Tempo médio na fila</p>
                  <p><strong>σ:</strong> Sigma acumulado (λ₁+...+λₖ)/μ</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Fórmulas */}
      <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 border-2 border-indigo-400 rounded-xl p-5 shadow-lg">
        <h4 className="font-bold text-indigo-900 text-xl mb-4">📐 Fórmulas do Modelo Preemptivo (M/M/1, s=1)</h4>
        <div className="bg-white rounded-lg p-5 space-y-3 text-sm">
          <div className="border-b pb-2">
            <p className="font-mono text-indigo-900"><strong>ρ = λ_total / μ</strong></p>
            <p className="text-xs text-gray-600">Taxa de utilização do sistema (deve ser &lt; 1)</p>
          </div>
          <div className="border-b pb-2">
            <p className="font-mono text-indigo-900"><strong>σₖ = (λ₁+λ₂+...+λₖ) / μ</strong></p>
            <p className="text-xs text-gray-600">Sigma acumulado até a classe k (para s=1)</p>
          </div>
          <div className="border-b pb-2 bg-yellow-50 p-2 rounded">
            <p className="font-mono text-indigo-900"><strong>Wₖ = (1/μ) / [(1-σₖ₋₁) × (1-σₖ)]</strong></p>
            <p className="text-xs text-gray-600">⭐ Fórmula PREEMPTIVA (mais simples que não-preemptiva) - página 10 do PDF</p>
          </div>
          <div className="border-b pb-2">
            <p className="font-mono text-indigo-900"><strong>Wqₖ = Wₖ - 1/μ</strong></p>
            <p className="text-xs text-gray-600">Tempo médio na fila para classe k</p>
          </div>
          <div className="border-b pb-2">
            <p className="font-mono text-indigo-900"><strong>Lₖ = λₖ × Wₖ</strong></p>
            <p className="text-xs text-gray-600">Número médio de clientes no sistema (classe k)</p>
          </div>
          <div>
            <p className="font-mono text-indigo-900"><strong>Lqₖ = λₖ × Wqₖ</strong></p>
            <p className="text-xs text-gray-600">Número médio de clientes na fila (classe k)</p>
          </div>
        </div>
      </div>
    </div>
  );
};
