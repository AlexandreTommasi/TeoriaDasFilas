import React, { useState } from 'react';
import { Input, Button } from '../../components/common';
import { ResultDisplay } from '../../components/common/ResultDisplay';
import type { MMsNInput, MMsNResult } from '../../types/models';
import { SiPython } from 'react-icons/si';
import { HiCheckCircle, HiLightningBolt, HiUserGroup } from 'react-icons/hi';
// import { calculateMMsN } from '../../services/api'; // Descomentar quando backend estiver pronto

export const MMsN: React.FC = () => {
  const [inputs, setInputs] = useState<MMsNInput>({
    lambda: 0,
    mu: 0,
    s: 2,
    N: 10,
    n: undefined,
  });

  const [results, setResults] = useState<MMsNResult | null>(null);
  const [error, setError] = useState<string>('');

  const handleInputChange = (field: keyof MMsNInput) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value === '' ? undefined : parseFloat(e.target.value);
    setInputs({
      ...inputs,
      [field]: value,
    });
  };

  const handleCalculate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setResults(null);

    // Validações
    if (inputs.lambda <= 0 || inputs.mu <= 0) {
      setError('⚠️ λ e μ devem ser maiores que zero');
      return;
    }

    if (inputs.s < 2) {
      setError('⚠️ Número de servidores (s) deve ser ≥ 2. Para s=1, use M/M/1/N');
      return;
    }

    if (inputs.N < inputs.s) {
      setError('⚠️ População (N) deve ser maior que número de servidores (s)');
      return;
    }

    if (inputs.n !== undefined && (inputs.n < 0 || inputs.n > inputs.N)) {
      setError('⚠️ n deve estar entre 0 e N');
      return;
    }

    // TODO: Descomentar quando backend estiver pronto
    // try {
    //   const result = await calculateMMsN(inputs);
    //   setResults(result);
    // } catch (err) {
    //   setError(err instanceof Error ? err.message : 'Erro ao calcular');
    // }

    setError('⚠️ Backend ainda não implementado. Seus colegas devem implementar: backend/app/models/mmsn.py');
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-3">
          <div className="p-3 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-xl">
            <HiUserGroup className="text-3xl text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-display font-bold text-dark-950">
              M/M/s&gt;1/N
            </h1>
            <p className="text-gray-600 text-lg">
              Múltiplos Servidores + População Finita
            </p>
          </div>
        </div>
      </div>

      {/* ========== CALCULADORA (ELEMENTO PRINCIPAL) ========== */}
      <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-2xl shadow-xl border-2 border-yellow-400 p-8">
        <div className="flex items-center gap-3 mb-6">
          <HiLightningBolt className="text-4xl text-yellow-600" />
          <h2 className="text-3xl font-display font-bold text-yellow-900">
            Calculadora M/M/s/N
          </h2>
        </div>

        <form onSubmit={handleCalculate} className="space-y-6">
          {/* Parâmetros Obrigatórios */}
          <div className="bg-white/70 rounded-xl p-6 border border-yellow-300">
            <h3 className="font-bold text-lg text-yellow-900 mb-4">📋 Parâmetros Obrigatórios</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="λ (Lambda) - Taxa de chegada POR CLIENTE (quando fora do sistema)"
                value={inputs.lambda || ''}
                onChange={handleInputChange('lambda')}
                required
                min={0}
                step="any"
                placeholder="Ex: 0.0167 (1/60 clientes/min)"
              />
              <Input
                label="μ (Mu) - Taxa de atendimento POR SERVIDOR"
                value={inputs.mu || ''}
                onChange={handleInputChange('mu')}
                required
                min={0}
                step="any"
                placeholder="Ex: 0.125 (1/8 clientes/min)"
              />
              <Input
                label="s - Número de Servidores (≥ 2)"
                value={inputs.s || ''}
                onChange={handleInputChange('s')}
                required
                min={2}
                step={1}
                placeholder="Ex: 2"
              />
              <Input
                label="N - Tamanho da População Finita"
                value={inputs.N || ''}
                onChange={handleInputChange('N')}
                required
                min={1}
                step={1}
                placeholder="Ex: 10 máquinas"
              />
            </div>
          </div>

          {/* Parâmetros Opcionais */}
          <div className="bg-white/70 rounded-xl p-6 border border-orange-300">
            <h3 className="font-bold text-lg text-orange-900 mb-4">⚙️ Parâmetros Opcionais (para cálculos específicos)</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Input
                  label="n - Número específico de clientes (opcional, para P(n))"
                  value={inputs.n ?? ''}
                  onChange={handleInputChange('n')}
                  min={0}
                  step={1}
                  placeholder="Deixe vazio se não precisar"
                />
                <p className="text-sm text-gray-600 mt-1">
                  Preencha apenas se a questão pedir P(n) ou P(n clientes no sistema)
                </p>
              </div>
            </div>
          </div>

          {error && (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <Button type="submit" fullWidth className="!py-4 !text-xl">
            🧮 Calcular Tudo
          </Button>
        </form>

        {/* Resultados */}
        {results && (
          <div className="mt-8">
            <ResultDisplay results={results} modelType="M/M/s/N" />
          </div>
        )}
      </div>

      {/* ========== 1. QUANDO USAR? ========== */}
      <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-2xl shadow-lg p-8 border border-yellow-300">
        <h2 className="text-2xl font-display font-bold text-yellow-900 mb-4 flex items-center gap-2">
          <span className="bg-yellow-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-lg">1</span>
          Quando usar M/M/s/N?
        </h2>
        <div className="space-y-3 text-gray-800">
          <p className="flex items-start gap-2">
            <span className="text-yellow-600 font-bold mt-1">✓</span>
            <span><strong>Múltiplos servidores (s ≥ 2)</strong> - Várias estações de atendimento paralelas</span>
          </p>
          <p className="flex items-start gap-2">
            <span className="text-yellow-600 font-bold mt-1">✓</span>
            <span><strong>População finita (N clientes)</strong> - Conjunto limitado de "clientes" que alternam entre OPERANDO ↔ SISTEMA</span>
          </p>
          <p className="flex items-start gap-2">
            <span className="text-yellow-600 font-bold mt-1">✓</span>
            <span><strong>Taxa de chegada variável:</strong> λ_efetivo = λ(N-L) - quanto mais no sistema, menos chegam</span>
          </p>
          <p className="flex items-start gap-2">
            <span className="text-yellow-600 font-bold mt-1">✓</span>
            <span><strong>Exemplos:</strong> Máquinas com vários técnicos, robôs com múltiplos operadores, terminais com vários reparadores</span>
          </p>
          <p className="flex items-start gap-2">
            <span className="text-green-600 font-bold mt-1">✓</span>
            <span className="font-semibold text-green-700">Sistema sempre estável (não precisa validar ρ &lt; 1)</span>
          </p>
        </div>
      </div>

      {/* ========== 2. EXEMPLOS COM SOLUÇÃO ========== */}
      <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl shadow-lg p-8 border border-blue-300">
        <h2 className="text-2xl font-display font-bold text-blue-900 mb-6 flex items-center gap-2">
          <span className="bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-lg">2</span>
          Exemplos Resolvidos
        </h2>

        {/* Exemplo 1 */}
        <div className="bg-white rounded-xl p-6 mb-6 border-l-4 border-blue-500">
          <h3 className="font-bold text-lg text-blue-900 mb-3">📝 Exemplo 1: 10 Máquinas com 2 Técnicos</h3>
          <div className="space-y-2 text-gray-800 mb-4">
            <p>• <strong>Enunciado:</strong> 10 máquinas operando, quebram a cada 60 min (média), e são consertadas por 2 técnicos em 8 min (média)</p>
            <p className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
              💡 <strong>Interpretação:</strong> N=10 máquinas, s=2 técnicos, tempo operação=60 min → λ=1/60, tempo reparo=8 min → μ=1/8
            </p>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg font-mono text-sm space-y-1">
            <p><strong>ENTRADA:</strong></p>
            <p>λ = 1/60 = 0.0167 máquinas/min</p>
            <p>μ = 1/8 = 0.125 máquinas/min (por técnico)</p>
            <p>s = 2 técnicos</p>
            <p>N = 10 máquinas</p>
          </div>
          <p className="mt-3 text-sm text-gray-600">
            → <strong>Resultados:</strong> Calculadora retorna L, Lq, W, Wq, P0, λ_efetivo, N-L (máquinas operacionais)
          </p>
        </div>

        {/* Exemplo 2 */}
        <div className="bg-white rounded-xl p-6 border-l-4 border-blue-500">
          <h3 className="font-bold text-lg text-blue-900 mb-3">📝 Exemplo 2: 5 Robôs com 2 Técnicos</h3>
          <div className="space-y-2 text-gray-800 mb-4">
            <p>• <strong>Enunciado:</strong> 5 robôs industriais, cada um opera 2 horas (média) antes de precisar manutenção de 30 min (média). Há 2 técnicos disponíveis.</p>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg font-mono text-sm space-y-1">
            <p><strong>ENTRADA:</strong></p>
            <p>λ = 1/120 = 0.0083 robôs/min (tempo operação = 120 min)</p>
            <p>μ = 1/30 = 0.0333 robôs/min (tempo manutenção = 30 min, por técnico)</p>
            <p>s = 2 técnicos</p>
            <p>N = 5 robôs</p>
          </div>
        </div>
      </div>

      {/* ========== 3. PERGUNTAS TÍPICAS DE PROVA ========== */}
      <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl shadow-lg p-8 border border-purple-300">
        <h2 className="text-2xl font-display font-bold text-purple-900 mb-6 flex items-center gap-2">
          <span className="bg-purple-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-lg">3</span>
          Perguntas Típicas → Onde Encontrar a Resposta
        </h2>

        <div className="space-y-4">
          <div className="bg-white rounded-lg p-4 border-l-4 border-purple-500">
            <p className="font-semibold text-purple-900 mb-2">❓ Quantas máquinas estão operando em média?</p>
            <p className="text-gray-700">→ <strong className="text-purple-700">numOperacionais (N-L)</strong></p>
          </div>

          <div className="bg-white rounded-lg p-4 border-l-4 border-purple-500">
            <p className="font-semibold text-purple-900 mb-2">❓ Quantas máquinas estão em reparo ou aguardando (em média)?</p>
            <p className="text-gray-700">→ <strong className="text-purple-700">L</strong></p>
          </div>

          <div className="bg-white rounded-lg p-4 border-l-4 border-purple-500">
            <p className="font-semibold text-purple-900 mb-2">❓ Quantas máquinas aguardam na fila?</p>
            <p className="text-gray-700">→ <strong className="text-purple-700">Lq</strong></p>
          </div>

          <div className="bg-white rounded-lg p-4 border-l-4 border-purple-500">
            <p className="font-semibold text-purple-900 mb-2">❓ Tempo médio de reparo (espera + atendimento)?</p>
            <p className="text-gray-700">→ <strong className="text-purple-700">W</strong></p>
          </div>

          <div className="bg-white rounded-lg p-4 border-l-4 border-purple-500">
            <p className="font-semibold text-purple-900 mb-2">❓ Tempo médio aguardando na fila?</p>
            <p className="text-gray-700">→ <strong className="text-purple-700">Wq</strong></p>
          </div>

          <div className="bg-white rounded-lg p-4 border-l-4 border-purple-500">
            <p className="font-semibold text-purple-900 mb-2">❓ Probabilidade de todas máquinas operando (nenhuma em reparo)?</p>
            <p className="text-gray-700">→ <strong className="text-purple-700">P0</strong></p>
          </div>

          <div className="bg-white rounded-lg p-4 border-l-4 border-purple-500">
            <p className="font-semibold text-purple-900 mb-2">❓ Probabilidade de exatamente n máquinas no sistema de reparo?</p>
            <p className="text-gray-700">→ Preencha <strong className="text-purple-700">n</strong> no formulário → obtém <strong className="text-purple-700">Pn</strong></p>
          </div>

          <div className="bg-white rounded-lg p-4 border-l-4 border-purple-500">
            <p className="font-semibold text-purple-900 mb-2">❓ Taxa efetiva de chegadas ao sistema?</p>
            <p className="text-gray-700">→ <strong className="text-purple-700">λ_efetivo = λ(N-L)</strong></p>
          </div>

          <div className="bg-white rounded-lg p-4 border-l-4 border-purple-500">
            <p className="font-semibold text-purple-900 mb-2">❓ Probabilidade de não esperar na fila (ir direto para técnico)?</p>
            <p className="text-gray-700">→ <strong className="text-purple-700">PWqIgualZero</strong></p>
          </div>
        </div>
      </div>

      {/* ========== 4. COMPARAÇÃO COM OUTROS MODELOS ========== */}
      <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl shadow-lg p-8 border border-green-300">
        <h2 className="text-2xl font-display font-bold text-green-900 mb-6 flex items-center gap-2">
          <span className="bg-green-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-lg">4</span>
          M/M/s/N vs Outros Modelos
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full bg-white rounded-lg overflow-hidden">
            <thead className="bg-green-600 text-white">
              <tr>
                <th className="px-4 py-3 text-left">Modelo</th>
                <th className="px-4 py-3 text-left">Servidores</th>
                <th className="px-4 py-3 text-left">População</th>
                <th className="px-4 py-3 text-left">Características</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              <tr className="bg-green-50 font-semibold">
                <td className="px-4 py-3">M/M/s/N</td>
                <td className="px-4 py-3">s ≥ 2</td>
                <td className="px-4 py-3">N finito</td>
                <td className="px-4 py-3">População finita + vários servidores. λ_efetivo = λ(N-L)</td>
              </tr>
              <tr>
                <td className="px-4 py-3">M/M/1/N</td>
                <td className="px-4 py-3">1</td>
                <td className="px-4 py-3">N finito</td>
                <td className="px-4 py-3">População finita + 1 servidor. Use quando s=1</td>
              </tr>
              <tr>
                <td className="px-4 py-3">M/M/s</td>
                <td className="px-4 py-3">s ≥ 2</td>
                <td className="px-4 py-3">∞ infinita</td>
                <td className="px-4 py-3">População infinita + vários servidores. λ constante</td>
              </tr>
              <tr>
                <td className="px-4 py-3">M/M/1</td>
                <td className="px-4 py-3">1</td>
                <td className="px-4 py-3">∞ infinita</td>
                <td className="px-4 py-3">Modelo mais simples. λ constante, 1 servidor</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="mt-6 bg-white rounded-lg p-4 border-l-4 border-green-500">
          <p className="font-semibold text-green-900 mb-2">🎯 Como escolher?</p>
          <ul className="space-y-2 text-gray-800">
            <li>• <strong>População finita (N) + vários servidores (s≥2)?</strong> → M/M/s/N</li>
            <li>• <strong>População finita (N) + 1 servidor?</strong> → M/M/1/N</li>
            <li>• <strong>População infinita + vários servidores?</strong> → M/M/s</li>
            <li>• <strong>População infinita + 1 servidor?</strong> → M/M/1</li>
          </ul>
        </div>
      </div>

      {/* ========== 5. CONCEITOS IMPORTANTES ========== */}
      <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl shadow-lg p-8 border border-orange-300">
        <h2 className="text-2xl font-display font-bold text-orange-900 mb-6 flex items-center gap-2">
          <span className="bg-orange-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-lg">5</span>
          Conceitos Essenciais do M/M/s/N
        </h2>

        <div className="space-y-4">
          <div className="bg-white rounded-lg p-5 border-l-4 border-orange-500">
            <h3 className="font-bold text-orange-900 mb-2">🔄 População Finita com Múltiplos Servidores</h3>
            <p className="text-gray-800">
              N clientes TOTAIS que alternam entre <strong>OPERANDO</strong> (fora do sistema) e <strong>NO SISTEMA</strong> (fila + atendimento com s servidores).
            </p>
          </div>

          <div className="bg-white rounded-lg p-5 border-l-4 border-orange-500">
            <h3 className="font-bold text-orange-900 mb-2">📉 Taxa de Chegada Variável</h3>
            <p className="text-gray-800 mb-2">
              <strong>λ_efetivo = λ(N-L)</strong> - A taxa real de chegadas depende de quantos estão operando.
            </p>
            <p className="text-gray-700 text-sm">
              Se L aumenta → menos máquinas operando → menos falhas chegando ao sistema
            </p>
          </div>

          <div className="bg-white rounded-lg p-5 border-l-4 border-orange-500">
            <h3 className="font-bold text-orange-900 mb-2">👥 Múltiplos Servidores (s)</h3>
            <p className="text-gray-800 mb-2">
              Capacidade de atendimento total = <strong>s × μ</strong>
            </p>
            <p className="text-gray-700 text-sm">
              Com s=2 técnicos e μ=0.125, capacidade total = 2×0.125 = 0.25 máquinas/min
            </p>
          </div>

          <div className="bg-white rounded-lg p-5 border-l-4 border-orange-500">
            <h3 className="font-bold text-orange-900 mb-2">✅ Sempre Estável</h3>
            <p className="text-gray-800">
              Como N é finito, o sistema SEMPRE atinge equilíbrio. Não precisa verificar ρ &lt; 1.
            </p>
          </div>

          <div className="bg-white rounded-lg p-5 border-l-4 border-orange-500">
            <h3 className="font-bold text-orange-900 mb-2">🎯 N - L = Clientes Operacionais</h3>
            <p className="text-gray-800">
              <strong>numOperacionais = N - L</strong> mostra quantos estão produzindo/funcionando (fora do sistema de reparo)
            </p>
          </div>

          <div className="bg-white rounded-lg p-5 border-l-4 border-orange-500">
            <h3 className="font-bold text-orange-900 mb-2">⚡ P(Wq=0) - Probabilidade de Atendimento Imediato</h3>
            <p className="text-gray-800">
              Probabilidade de encontrar um técnico livre e não esperar na fila
            </p>
          </div>
        </div>
      </div>

      {/* ========== 6. CONVERSÕES ÚTEIS PARA PROVA ========== */}
      <div className="bg-gradient-to-br from-pink-50 to-pink-100 rounded-2xl shadow-lg p-8 border border-pink-300">
        <h2 className="text-2xl font-display font-bold text-pink-900 mb-6 flex items-center gap-2">
          <span className="bg-pink-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-lg">6</span>
          Conversões Rápidas
        </h2>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-white rounded-lg p-5 border-l-4 border-pink-500">
            <h3 className="font-bold text-pink-900 mb-3">⏱️ Tempo → Taxa</h3>
            <div className="space-y-2 text-gray-800 font-mono text-sm">
              <p>Tempo operação = 60 min → <strong>λ = 1/60</strong></p>
              <p>Tempo reparo = 8 min → <strong>μ = 1/8</strong></p>
              <p>Tempo = 2 horas = 120 min → <strong>λ = 1/120</strong></p>
            </div>
          </div>

          <div className="bg-white rounded-lg p-5 border-l-4 border-pink-500">
            <h3 className="font-bold text-pink-900 mb-3">🔢 Taxa → Tempo</h3>
            <div className="space-y-2 text-gray-800 font-mono text-sm">
              <p>λ = 0.0167 → Tempo = <strong>1/0.0167 ≈ 60 min</strong></p>
              <p>μ = 0.125 → Tempo = <strong>1/0.125 = 8 min</strong></p>
            </div>
          </div>

          <div className="bg-white rounded-lg p-5 border-l-4 border-pink-500">
            <h3 className="font-bold text-pink-900 mb-3">📊 Capacidade Total</h3>
            <div className="space-y-2 text-gray-800 text-sm">
              <p>s=2 técnicos, μ=0.125/min cada</p>
              <p>→ Capacidade = <strong>2 × 0.125 = 0.25 máquinas/min</strong></p>
            </div>
          </div>

          <div className="bg-white rounded-lg p-5 border-l-4 border-pink-500">
            <h3 className="font-bold text-pink-900 mb-3">🎯 Validação N vs s</h3>
            <div className="space-y-2 text-gray-800 text-sm">
              <p><strong>Sempre: N &gt; s</strong></p>
              <p>Se N=10 → precisa s &lt; 10</p>
              <p>Não faz sentido ter mais técnicos que máquinas!</p>
            </div>
          </div>
        </div>
      </div>

      {/* ========== AVISO BACKEND ========== */}
      <div className="bg-wine-50 border-l-4 border-wine-600 p-6 rounded-r-lg">
        <div className="flex items-start gap-3">
          <SiPython className="text-3xl text-wine-700 flex-shrink-0 mt-1" />
          <div className="flex-1">
            <h4 className="font-display font-bold text-wine-900 text-lg mb-2">Backend Flask Necessário</h4>
            <p className="text-wine-800 mb-3">
              Este frontend está 100% pronto. Agora seus colegas devem implementar o backend Python.
            </p>
            <p className="text-wine-900 font-semibold mb-2">Próximos passos:</p>
            <ul className="space-y-2">
              <li className="flex items-start gap-2 text-wine-800">
                <HiCheckCircle className="text-wine-600 flex-shrink-0 mt-0.5" />
                <span>Implementar fórmulas do M/M/s/N em: <code className="bg-wine-100 px-1 rounded">backend/app/models/mmsn.py</code></span>
              </li>
              <li className="flex items-start gap-2 text-wine-800">
                <HiCheckCircle className="text-wine-600 flex-shrink-0 mt-0.5" />
                <span>Criar endpoint: <code className="bg-wine-100 px-1 rounded">POST /api/calculate/mmsn</code></span>
              </li>
              <li className="flex items-start gap-2 text-wine-800">
                <HiCheckCircle className="text-wine-600 flex-shrink-0 mt-0.5" />
                <span>Descomentar chamada de API neste componente (linha 6 e 54-57)</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
