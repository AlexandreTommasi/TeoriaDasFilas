import React from 'react';
import { Link } from 'react-router-dom';
import { HiArrowRight } from 'react-icons/hi';

interface CardProps {
  title: string;
  description: string;
  link: string;
  icon?: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({ title, description, link, icon }) => {
  return (
    <Link to={link}>
      <div className="bg-white rounded-xl shadow-md hover:shadow-2xl transition-all duration-300 p-6 cursor-pointer border border-gray-200 hover:border-wine-500 hover:-translate-y-1 group">
        {icon && (
          <div className="mb-4 group-hover:scale-110 transition-transform duration-300">
            {icon}
          </div>
        )}
        <h3 className="text-xl font-display font-bold text-dark-900 mb-2 group-hover:text-wine-700 transition-colors">
          {title}
        </h3>
        <p className="text-dark-600 text-sm mb-4">{description}</p>
        <div className="flex items-center gap-2 text-wine-600 font-medium text-sm group-hover:gap-3 transition-all">
          <span>Acessar</span>
          <HiArrowRight className="group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
    </Link>
  );
};
