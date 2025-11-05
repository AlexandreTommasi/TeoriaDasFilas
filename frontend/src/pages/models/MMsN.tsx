import React, { useState } from 'react';
import { Input, Button } from '../../components/common';
import type { MMsNInput } from '../../types/models';
// import { calculateMMsN } from '../../services/api'; // Descomentar quando backend estiver pronto

export const MMsN: React.FC = () => {
  const [inputs, setInputs] = useState<MMsNInput>({
    lambda: 0,
    mu: 0,
    s: 2,
    N: 20,
  });

  const [error, setError] = useState<string>('');

  const handleInputChange = (field: keyof MMsNInput) => (
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
    //   const result = await calculateMMsN(inputs);
    //   setResults(result);
    // } catch (err) {
    //   setError(err instanceof Error ? err.message : 'Erro ao calcular');
    // }

    setError('⚠️ Backend Flask ainda não implementou este modelo. As fórmulas devem ser implementadas em: backend/app/models/mmsn.py');
  };

  return (
    <div className="max-w-4xl">
      <h2 className="text-4xl font-display font-bold text-dark-950 mb-3">Modelo M/M/s{'>'} 1/N</h2>
      <p className="text-gray-600 mb-6">
        Múltiplos servidores com população finita.
      </p>

      <div className="bg-white rounded-lg shadow-md p-6">
        <form onSubmit={handleCalculate}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="λ (Lambda) - Taxa de Chegada por Cliente"
              value={inputs.lambda}
              onChange={handleInputChange('lambda')}
              required
              min={0}
            />
            <Input
              label="μ (Mu) - Taxa de Atendimento"
              value={inputs.mu}
              onChange={handleInputChange('mu')}
              required
              min={0}
            />
            <Input
              label="s - Número de Servidores"
              value={inputs.s}
              onChange={handleInputChange('s')}
              required
              min={2}
              step={1}
            />
            <Input
              label="N - Tamanho da População"
              value={inputs.N}
              onChange={handleInputChange('N')}
              required
              min={1}
              step={1}
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

      <div className="mt-6 bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
        <h4 className="font-bold text-blue-800 mb-2">🐍 Backend Flask Necessário</h4>
        <p className="text-blue-700 text-sm mb-2">
          Este frontend está pronto para se conectar com o backend Flask.
        </p>
        <p className="text-blue-700 text-sm">
          <strong>Próximos passos:</strong>
        </p>
        <ul className="list-disc list-inside text-blue-700 text-sm mt-1 ml-2">
          <li>Implemente as fórmulas do M/M/s/N no backend Python (pasta /backend)</li>
          <li>Arquivo: backend/app/models/mmsn.py</li>
          <li>Crie o endpoint POST /api/calculate/mmsn</li>
          <li>Descomente a chamada de API no código deste componente</li>
        </ul>
      </div>
    </div>
  );
};
