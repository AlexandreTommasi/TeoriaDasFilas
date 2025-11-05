import React, { useState } from 'react';
import { Button } from '../../../components/common';
// import { calculatePriority1 } from '../../../services/api'; // Descomentar quando backend estiver pronto

export const Priority1: React.FC = () => {
  const [error, setError] = useState<string>('');

  const handleCalculate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // TODO: Descomentar quando backend estiver pronto
    // const inputs = { /* definir inputs */ };
    // try {
    //   const result = await calculatePriority1(inputs);
    //   setResults(result);
    // } catch (err) {
    //   setError(err instanceof Error ? err.message : 'Erro ao calcular');
    // }

    setError('⚠️ Backend Flask ainda não implementou este modelo. As fórmulas devem ser implementadas em: backend/app/models/priority.py');
  };

  return (
    <div className="max-w-4xl">
      <h2 className="text-3xl font-bold text-gray-800 mb-4">
        Modelo com Prioridades - Variação 1
      </h2>
      <p className="text-gray-600 mb-6">
        Sistema de filas com diferentes níveis de prioridade - Modelo 1.
      </p>

      <div className="bg-white rounded-lg shadow-md p-6">
        <form onSubmit={handleCalculate}>
          {/* TODO: Adicionar inputs específicos do modelo */}
          <div className="text-gray-500 text-center py-8">
            Inputs precisam ser definidos conforme especificação do modelo
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
          <li>Implemente as fórmulas do Modelo Prioridade 1 no backend Python (pasta /backend)</li>
          <li>Arquivo: backend/app/models/priority.py (função calculate_priority1)</li>
          <li>Defina os inputs necessários em types/models.ts</li>
          <li>Crie o endpoint POST /api/calculate/priority1</li>
          <li>Descomente a chamada de API no código deste componente</li>
        </ul>
      </div>
    </div>
  );
};
