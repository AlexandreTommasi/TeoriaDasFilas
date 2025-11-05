import React from 'react';
import { Card } from '../components/common';
import {
  HiChartBar,
  HiUsers,
  HiLockClosed,
  HiUserGroup,
  HiChartSquareBar,
  HiStar,
  HiInformationCircle
} from 'react-icons/hi';
import { MdSpeed } from 'react-icons/md';

interface ModelCard {
  title: string;
  description: string;
  link: string;
  icon: React.ReactNode;
}

const models: ModelCard[] = [
  {
    title: 'M/M/1',
    description: 'Modelo básico com 1 servidor, chegadas Poisson e atendimento exponencial',
    link: '/mm1',
    icon: <HiChartBar className="text-3xl text-wine-600" />,
  },
  {
    title: 'M/M/s>1',
    description: 'Modelo com múltiplos servidores em paralelo',
    link: '/mms',
    icon: <HiUsers className="text-3xl text-wine-600" />,
  },
  {
    title: 'M/M/1/K',
    description: 'Modelo com 1 servidor e capacidade máxima do sistema',
    link: '/mm1k',
    icon: <HiLockClosed className="text-3xl text-wine-600" />,
  },
  {
    title: 'M/M/s>1/K',
    description: 'Múltiplos servidores com capacidade máxima limitada',
    link: '/mmsk',
    icon: <HiUserGroup className="text-3xl text-wine-600" />,
  },
  {
    title: 'M/M/1/N',
    description: 'Modelo com 1 servidor e população finita',
    link: '/mm1n',
    icon: <HiChartSquareBar className="text-3xl text-wine-600" />,
  },
  {
    title: 'M/M/s>1/N',
    description: 'Múltiplos servidores com população finita',
    link: '/mmsn',
    icon: <HiUserGroup className="text-3xl text-wine-600" />,
  },
  {
    title: 'M/G/1',
    description: 'Modelo com distribuição geral de atendimento',
    link: '/mg1',
    icon: <MdSpeed className="text-3xl text-wine-600" />,
  },
  {
    title: 'Prioridade - Modelo 1',
    description: 'Sistema de filas com prioridades - Variação 1',
    link: '/priority/1',
    icon: <HiStar className="text-3xl text-wine-600" />,
  },
  {
    title: 'Prioridade - Modelo 2',
    description: 'Sistema de filas com prioridades - Variação 2',
    link: '/priority/2',
    icon: <HiStar className="text-3xl text-wine-600" />,
  },
  {
    title: 'Prioridade - Modelo 3',
    description: 'Sistema de filas com prioridades - Variação 3',
    link: '/priority/3',
    icon: <HiStar className="text-3xl text-wine-600" />,
  },
  {
    title: 'Prioridade - Modelo 4',
    description: 'Sistema de filas com prioridades - Variação 4',
    link: '/priority/4',
    icon: <HiStar className="text-3xl text-wine-600" />,
  },
];

export const Home: React.FC = () => {
  return (
    <div>
      <div className="mb-8">
        <h2 className="text-4xl font-display font-bold text-dark-950 mb-3">
          Calculadora de Teoria das Filas
        </h2>
        <p className="text-dark-600 text-lg">
          Selecione um modelo abaixo para começar a calcular os parâmetros da sua fila
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {models.map((model) => (
          <Card
            key={model.link}
            title={model.title}
            description={model.description}
            link={model.link}
            icon={model.icon}
          />
        ))}
      </div>

      <div className="mt-12 bg-wine-50 border-l-4 border-wine-600 p-6 rounded-lg shadow-sm">
        <div className="flex items-start gap-3">
          <HiInformationCircle className="text-2xl text-wine-700 flex-shrink-0 mt-1" />
          <div>
            <h3 className="text-xl font-display font-bold text-wine-900 mb-3">
              Como usar esta ferramenta
            </h3>
            <ul className="space-y-2 text-wine-800">
              <li className="flex items-start gap-2">
                <span className="text-wine-600 mt-1">•</span>
                <span>Escolha o modelo de fila apropriado para seu problema</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-wine-600 mt-1">•</span>
                <span>Preencha os parâmetros solicitados (taxas de chegada, atendimento, etc)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-wine-600 mt-1">•</span>
                <span>Clique em "Calcular" para obter os resultados</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-wine-600 mt-1">•</span>
                <span>Os resultados incluem métricas como tempo de espera, tamanho da fila, utilização, etc</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
