import React, { useState } from 'react';
import { Input, Button } from '../../components/common';
import type { MG1Input } from '../../types/models';
import { SiPython } from 'react-icons/si';
import { HiCheckCircle } from 'react-icons/hi2';
// import { calculateMG1 } from '../../services/api'; // Descomentar quando backend estiver pronto

export const MG1: React.FC = () => {
  const [inputs, setInputs] = useState<MG1Input>({
    lambda: 0,
    meanService: 0,
    varService: 0,
  });

  const [error, setError] = useState<string>('');

  const handleInputChange = (field: keyof MG1Input) => (
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

    // TODO: Descomentar quando backend estiver pronto
    // try {
    //   const result = await calculateMG1(inputs);
    //   setResults(result);
    // } catch (err) {
    //   setError(err instanceof Error ? err.message : 'Erro ao calcular');
    // }

    setError('⚠️ Backend Flask ainda não implementou este modelo. As fórmulas devem ser implementadas em: backend/app/models/mg1.py');
  };

  return (
    <div className="max-w-4xl">
      <h2 className="text-4xl font-display font-bold text-dark-950 mb-3">Modelo M/G/1</h2>
      <p className="text-gray-600 mb-6">
        Modelo com distribuição geral de atendimento (usa fórmula de Pollaczek-Khinchin).
      </p>

      <div className="bg-white rounded-lg shadow-md p-6">
        <form onSubmit={handleCalculate}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input
              label="λ (Lambda) - Taxa de Chegada"
              value={inputs.lambda}
              onChange={handleInputChange('lambda')}
              required
              min={0}
            />
            <Input
              label="E[S] - Tempo Médio de Atendimento"
              value={inputs.meanService}
              onChange={handleInputChange('meanService')}
              required
              min={0}
            />
            <Input
              label="Var[S] - Variância do Atendimento"
              value={inputs.varService}
              onChange={handleInputChange('varService')}
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
      </div>

      <div className="mt-6 bg-wine-50 border-l-4 border-wine-600 p-4 rounded-r-lg">
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
                <span>Implemente as fórmulas do M/G/1 no backend Python (pasta /backend)</span>
              </li>
              <li className="flex items-start gap-2 text-wine-800">
                <HiCheckCircle className="text-wine-600 flex-shrink-0 mt-0.5" />
                <span>Arquivo: backend/app/models/mg1.py</span>
              </li>
              <li className="flex items-start gap-2 text-wine-800">
                <HiCheckCircle className="text-wine-600 flex-shrink-0 mt-0.5" />
                <span>Crie o endpoint POST /api/calculate/mg1</span>
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
