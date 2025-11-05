import React, { useState } from 'react';
import { Input, Button, ResultDisplay } from '../../components/common';
import type { MM1Input, MM1Result } from '../../types/models';
import { SiPython } from 'react-icons/si';
import { HiCheckCircle } from 'react-icons/hi';
// import { calculateMM1 } from '../../services/api'; // Descomentar quando backend estiver pronto

export const MM1: React.FC = () => {
  const [inputs, setInputs] = useState<MM1Input>({
    lambda: 0,
    mu: 0,
  });

  const [results, setResults] = useState<MM1Result | null>(null);
  const [error, setError] = useState<string>('');

  const handleInputChange = (field: keyof MM1Input) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setInputs({
      ...inputs,
      [field]: parseFloat(e.target.value) || 0,
    });
  };

  const handleCalculate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setResults(null);

    // Validação básica no frontend
    if (inputs.lambda <= 0 || inputs.mu <= 0) {
      setError('Lambda e Mu devem ser maiores que zero');
      return;
    }

    // ==========================================
    // 🔴 ATENÇÃO: BACKEND FLASK NECESSÁRIO
    // ==========================================
    // As fórmulas do modelo M/M/1 devem ser implementadas no backend Python/Flask.
    //
    // Quando o backend estiver rodando, descomente o código abaixo:
    //
    // try {
    //   const result = await calculateMM1(inputs);
    //   setResults(result);
    // } catch (err) {
    //   setError(err instanceof Error ? err.message : 'Erro ao calcular');
    // }
    //
    // O backend deve receber: { lambda, mu }
    // O backend deve retornar: { rho, L, Lq, W, Wq, P0 }
    // ==========================================

    setError('⚠️ Backend Flask ainda não está rodando. Configure o backend na pasta /backend e inicie o servidor Flask.');
  };

  const resultItems = results
    ? [
        {
          label: 'ρ (Utilização)',
          value: results.rho,
          description: 'Taxa de utilização do servidor',
        },
        {
          label: 'L (Clientes no Sistema)',
          value: results.L,
          description: 'Número médio de clientes no sistema',
        },
        {
          label: 'Lq (Clientes na Fila)',
          value: results.Lq,
          description: 'Número médio de clientes esperando na fila',
        },
        {
          label: 'W (Tempo no Sistema)',
          value: results.W,
          description: 'Tempo médio que um cliente passa no sistema',
        },
        {
          label: 'Wq (Tempo na Fila)',
          value: results.Wq,
          description: 'Tempo médio que um cliente passa na fila',
        },
        {
          label: 'P0 (Probabilidade Sistema Vazio)',
          value: results.P0,
          description: 'Probabilidade de não haver clientes no sistema',
        },
      ]
    : [];

  return (
    <div className="max-w-4xl">
      <h2 className="text-4xl font-display font-bold text-dark-950 mb-3">Modelo M/M/1</h2>
      <p className="text-dark-600 text-lg mb-6">
        Modelo básico com 1 servidor, chegadas seguem distribuição de Poisson e
        atendimento segue distribuição exponencial.
      </p>

      <div className="bg-white rounded-lg shadow-md p-6">
        <form onSubmit={handleCalculate}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="λ (Lambda) - Taxa de Chegada"
              value={inputs.lambda}
              onChange={handleInputChange('lambda')}
              placeholder="Ex: 3"
              required
              min={0}
            />
            <Input
              label="μ (Mu) - Taxa de Atendimento"
              value={inputs.mu}
              onChange={handleInputChange('mu')}
              placeholder="Ex: 5"
              required
              min={0}
            />
          </div>

          {error && (
            <div className="mt-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <div className="mt-6">
            <Button type="submit" fullWidth>
              Calcular
            </Button>
          </div>
        </form>

        {results && <ResultDisplay results={resultItems} />}
      </div>

      <div className="mt-6 bg-wine-50 border-l-4 border-wine-600 p-6 rounded-lg shadow-sm">
        <div className="flex items-start gap-3">
          <SiPython className="text-3xl text-wine-700 flex-shrink-0 mt-1" />
          <div className="flex-1">
            <h4 className="font-display font-bold text-wine-900 text-lg mb-2">Backend Flask Necessário</h4>
            <p className="text-wine-800 mb-3">
              Este frontend está pronto para se conectar com o backend Flask.
            </p>
            <p className="text-wine-900 font-semibold mb-2">Próximos passos:</p>
            <ul className="space-y-2">
              <li className="flex items-start gap-2 text-wine-800">
                <HiCheckCircle className="text-wine-600 flex-shrink-0 mt-0.5" />
                <span>Implemente as fórmulas do M/M/1 no backend Python (pasta /backend)</span>
              </li>
              <li className="flex items-start gap-2 text-wine-800">
                <HiCheckCircle className="text-wine-600 flex-shrink-0 mt-0.5" />
                <span>Arquivo: <code className="bg-wine-100 px-1.5 py-0.5 rounded text-sm">backend/app/models/mm1.py</code></span>
              </li>
              <li className="flex items-start gap-2 text-wine-800">
                <HiCheckCircle className="text-wine-600 flex-shrink-0 mt-0.5" />
                <span>Crie o endpoint POST /api/calculate/mm1</span>
              </li>
              <li className="flex items-start gap-2 text-wine-800">
                <HiCheckCircle className="text-wine-600 flex-shrink-0 mt-0.5" />
                <span>Descomente a chamada de API no código deste componente</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
