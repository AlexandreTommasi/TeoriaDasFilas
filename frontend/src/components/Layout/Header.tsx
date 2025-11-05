import React from 'react';
import { Link } from 'react-router-dom';
import { HiCalculator } from 'react-icons/hi';

export const Header: React.FC = () => {
  return (
    <header className="bg-wine-800 text-white shadow-lg border-b-2 border-wine-900">
      <div className="container mx-auto px-6 py-5">
        <Link to="/" className="flex items-center gap-3 hover:opacity-90 transition-opacity">
          <HiCalculator className="text-3xl" />
          <div>
            <h1 className="text-2xl font-display font-bold tracking-tight">Teoria das Filas</h1>
            <p className="text-wine-100 text-sm mt-0.5 font-light">
              Sistema de cálculo para modelos de fila
            </p>
          </div>
        </Link>
      </div>
    </header>
  );
};
