import React from 'react';

interface ResultItem {
  label: string;
  value: number | string;
  description?: string;
}

interface ResultDisplayProps {
  results: ResultItem[];
  title?: string;
}

export const ResultDisplay: React.FC<ResultDisplayProps> = ({ results, title = 'Resultados' }) => {
  return (
    <div className="mt-6 bg-gray-50 rounded-lg p-6 border border-gray-200">
      <h3 className="text-xl font-bold text-gray-800 mb-4">{title}</h3>
      <div className="space-y-3">
        {results.map((result, index) => (
          <div key={index} className="bg-white p-4 rounded shadow-sm">
            <div className="flex justify-between items-center">
              <span className="font-semibold text-gray-700">{result.label}:</span>
              <span className="text-blue-600 font-bold text-lg">
                {typeof result.value === 'number' ? result.value.toFixed(4) : result.value}
              </span>
            </div>
            {result.description && (
              <p className="text-sm text-gray-500 mt-1">{result.description}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
