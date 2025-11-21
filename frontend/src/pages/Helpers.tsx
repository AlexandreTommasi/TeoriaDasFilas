import React, { useState } from 'react';
import { Input, Button } from '../components/common';
import { HiCalculator, HiLightningBolt, HiClock, HiArrowsExpand } from 'react-icons/hi';

export const Helpers: React.FC = () => {
  // Estados para Lambda
  const [tempoEntreChegadas, setTempoEntreChegadas] = useState('');
  const [lambdaResultado, setLambdaResultado] = useState<number | null>(null);

  // Estados para Mu
  const [tempoAtendimento, setTempoAtendimento] = useState('');
  const [muResultado, setMuResultado] = useState<number | null>(null);

  // Estados para descobrir Mu a partir de ρ e λ
  const [rho, setRho] = useState('');
  const [lambdaParaMu, setLambdaParaMu] = useState('');
  const [muDeRho, setMuDeRho] = useState<number | null>(null);

  // Estados para Conversão de Tempo
  const [minutos, setMinutos] = useState('');
  const [horas, setHoras] = useState<number | null>(null);
  const [segundos, setSegundos] = useState('');
  const [horasDeSeg, setHorasDeSeg] = useState<number | null>(null);
  const [horasParaMin, setHorasParaMin] = useState('');
  const [minutosDeHoras, setMinutosDeHoras] = useState<number | null>(null);

  const calcularLambda = () => {
    const tempo = parseFloat(tempoEntreChegadas);
    if (tempo > 0) {
      setLambdaResultado(1 / tempo);
    }
  };

  const calcularMu = () => {
    const tempo = parseFloat(tempoAtendimento);
    if (tempo > 0) {
      setMuResultado(1 / tempo);
    }
  };

  const calcularMuDeRho = () => {
    const rhoVal = parseFloat(rho);
    const lambdaVal = parseFloat(lambdaParaMu);
    if (rhoVal > 0 && lambdaVal > 0) {
      setMuDeRho(lambdaVal / rhoVal);
    }
  };

  const converterMinutosParaHoras = () => {
    const min = parseFloat(minutos);
    if (min >= 0) {
      setHoras(min / 60);
    }
  };

  const converterSegundosParaHoras = () => {
    const seg = parseFloat(segundos);
    if (seg >= 0) {
      setHorasDeSeg(seg / 3600);
    }
  };

  const converterHorasParaMinutos = () => {
    const hrs = parseFloat(horasParaMin);
    if (hrs >= 0) {
      setMinutosDeHoras(hrs * 60);
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Cabeçalho */}
      <div className="mb-6">
        <h2 className="text-4xl font-display font-bold text-dark-950 mb-2">🧮 Calculadoras Auxiliares</h2>
        <p className="text-dark-600 text-lg">
          Ferramentas para calcular λ, μ, variância e converter unidades antes de usar nos modelos
        </p>
      </div>

      {/* Dica importante */}
      <div className="mb-6 bg-gradient-to-r from-yellow-50 to-yellow-100 border-2 border-yellow-400 rounded-xl p-5 shadow-lg">
        <div className="flex items-start gap-3">
          <HiLightningBolt className="text-3xl text-yellow-600 flex-shrink-0" />
          <div>
            <h3 className="font-bold text-yellow-900 text-xl mb-2">💡 Por que usar essas calculadoras?</h3>
            <p className="text-yellow-900">
              Nos exercícios, <strong>λ e μ raramente vêm diretos!</strong> Geralmente você recebe "tempo entre chegadas"
              ou "tempo de atendimento" e precisa converter para taxas. Use estas ferramentas para preparar os dados!
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* CALCULADORA 1: Lambda */}
        <div className="bg-gradient-to-br from-blue-500 to-blue-700 rounded-2xl shadow-2xl p-1">
          <div className="bg-white rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <HiCalculator className="text-3xl text-blue-600" />
              <h3 className="font-display font-bold text-blue-900 text-2xl">Calcular λ (Lambda)</h3>
            </div>
            <p className="text-gray-600 mb-4 text-sm">
              <strong>Quando usar:</strong> O exercício diz "chegam a cada X minutos" ou "tempo entre chegadas = X"
            </p>

            <div className="space-y-4">
              <Input
                label="Tempo entre chegadas (mesma unidade que você quer λ)"
                value={tempoEntreChegadas}
                onChange={(e) => setTempoEntreChegadas(e.target.value)}
                placeholder="Ex: 20 (minutos)"
                type="number"
              />

              <Button onClick={calcularLambda} fullWidth>
                Calcular λ
              </Button>

              {lambdaResultado !== null && (
                <div className="bg-blue-50 border-2 border-blue-400 rounded-lg p-4">
                  <p className="text-sm text-blue-800 mb-2">Resultado:</p>
                  <p className="text-3xl font-bold text-blue-900">λ = {lambdaResultado.toFixed(6)}</p>
                  <p className="text-xs text-blue-700 mt-2">
                    📌 <strong>Fórmula:</strong> λ = 1 / (tempo entre chegadas)
                  </p>
                </div>
              )}

              <div className="bg-gray-50 p-3 rounded text-xs text-gray-700">
                <p className="font-semibold mb-1">Exemplo:</p>
                <p>• Se chegam <strong>a cada 20 minutos</strong></p>
                <p>• λ = 1/20 = <strong>0.05 chegadas/minuto</strong></p>
                <p>• Ou λ = 1/(20/60) = <strong>3 chegadas/hora</strong></p>
              </div>
            </div>
          </div>
        </div>

        {/* CALCULADORA 2: Mu */}
        <div className="bg-gradient-to-br from-green-500 to-green-700 rounded-2xl shadow-2xl p-1">
          <div className="bg-white rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <HiCalculator className="text-3xl text-green-600" />
              <h3 className="font-display font-bold text-green-900 text-2xl">Calcular μ (Mu)</h3>
            </div>
            <p className="text-gray-600 mb-4 text-sm">
              <strong>Quando usar:</strong> O exercício diz "tempo de atendimento = X minutos"
            </p>

            <div className="space-y-4">
              <Input
                label="Tempo médio de atendimento (mesma unidade que você quer μ)"
                value={tempoAtendimento}
                onChange={(e) => setTempoAtendimento(e.target.value)}
                placeholder="Ex: 15 (minutos)"
                type="number"
              />

              <Button onClick={calcularMu} fullWidth>
                Calcular μ
              </Button>

              {muResultado !== null && (
                <div className="bg-green-50 border-2 border-green-400 rounded-lg p-4">
                  <p className="text-sm text-green-800 mb-2">Resultado:</p>
                  <p className="text-3xl font-bold text-green-900">μ = {muResultado.toFixed(6)}</p>
                  <p className="text-xs text-green-700 mt-2">
                    📌 <strong>Fórmula:</strong> μ = 1 / (tempo de atendimento)
                  </p>
                </div>
              )}

              <div className="bg-gray-50 p-3 rounded text-xs text-gray-700">
                <p className="font-semibold mb-1">Exemplo:</p>
                <p>• Se atende em <strong>15 minutos</strong></p>
                <p>• μ = 1/15 = <strong>0.0667 atendimentos/minuto</strong></p>
                <p>• Ou μ = 1/(15/60) = <strong>4 atendimentos/hora</strong></p>
              </div>
            </div>
          </div>
        </div>

        {/* CALCULADORA 3: Descobrir μ a partir de ρ */}
        <div className="bg-gradient-to-br from-purple-500 to-purple-700 rounded-2xl shadow-2xl p-1">
          <div className="bg-white rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <HiCalculator className="text-3xl text-purple-600" />
              <h3 className="font-display font-bold text-purple-900 text-2xl">Descobrir μ do ρ</h3>
            </div>
            <p className="text-gray-600 mb-4 text-sm">
              <strong>Quando usar:</strong> O exercício dá ρ (taxa de ocupação) e λ, e pede para achar μ
            </p>

            <div className="space-y-4">
              <Input
                label="ρ (rho) - Taxa de utilização"
                value={rho}
                onChange={(e) => setRho(e.target.value)}
                placeholder="Ex: 0.88"
                type="number"
              />

              <Input
                label="λ (lambda) - Taxa de chegada"
                value={lambdaParaMu}
                onChange={(e) => setLambdaParaMu(e.target.value)}
                placeholder="Ex: 11"
                type="number"
              />

              <Button onClick={calcularMuDeRho} fullWidth>
                Calcular μ
              </Button>

              {muDeRho !== null && (
                <div className="bg-purple-50 border-2 border-purple-400 rounded-lg p-4">
                  <p className="text-sm text-purple-800 mb-2">Resultado:</p>
                  <p className="text-3xl font-bold text-purple-900">μ = {muDeRho.toFixed(6)}</p>
                  <p className="text-xs text-purple-700 mt-2">
                    📌 <strong>Fórmula:</strong> ρ = λ/μ → μ = λ/ρ
                  </p>
                </div>
              )}

              <div className="bg-gray-50 p-3 rounded text-xs text-gray-700">
                <p className="font-semibold mb-1">Exemplo (do seu material):</p>
                <p>• λ = 11 motores/mês, ρ = 0.88</p>
                <p>• μ = 11/0.88 = <strong>12.5 motores/mês</strong></p>
              </div>
            </div>
          </div>
        </div>

        {/* CALCULADORA 4: Conversão de Tempo - Minutos para Horas */}
        <div className="bg-gradient-to-br from-teal-500 to-teal-700 rounded-2xl shadow-2xl p-1">
          <div className="bg-white rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <HiClock className="text-3xl text-teal-600" />
              <h3 className="font-display font-bold text-teal-900 text-2xl">Converter Minutos → Horas</h3>
            </div>
            <p className="text-gray-600 mb-4 text-sm">
              <strong>Quando usar:</strong> Exercício dá tempos em minutos, mas você quer λ e μ em "por hora"
            </p>

            <div className="space-y-4">
              <Input
                label="Tempo em minutos"
                value={minutos}
                onChange={(e) => setMinutos(e.target.value)}
                placeholder="Ex: 10"
                type="number"
              />

              <Button onClick={converterMinutosParaHoras} fullWidth>
                Converter
              </Button>

              {horas !== null && (
                <div className="bg-teal-50 border-2 border-teal-400 rounded-lg p-4">
                  <p className="text-sm text-teal-800 mb-2">Resultado:</p>
                  <p className="text-3xl font-bold text-teal-900">{horas.toFixed(6)} horas</p>
                  <p className="text-xs text-teal-700 mt-2">
                    📌 {minutos} min = {horas.toFixed(4)} horas
                  </p>
                </div>
              )}

              <div className="bg-gray-50 p-3 rounded text-xs text-gray-700">
                <p className="font-semibold mb-1">Exemplos comuns:</p>
                <p>• 10 min = 10/60 = <strong>0.1667 horas</strong></p>
                <p>• 15 min = 15/60 = <strong>0.25 horas</strong></p>
                <p>• 20 min = 20/60 = <strong>0.3333 horas</strong></p>
              </div>
            </div>
          </div>
        </div>

        {/* CALCULADORA 5: Conversão de Tempo - Segundos para Horas */}
        <div className="bg-gradient-to-br from-indigo-500 to-indigo-700 rounded-2xl shadow-2xl p-1">
          <div className="bg-white rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <HiClock className="text-3xl text-indigo-600" />
              <h3 className="font-display font-bold text-indigo-900 text-2xl">Converter Segundos → Horas</h3>
            </div>
            <p className="text-gray-600 mb-4 text-sm">
              <strong>Quando usar:</strong> Exercício dá tempos em segundos
            </p>

            <div className="space-y-4">
              <Input
                label="Tempo em segundos"
                value={segundos}
                onChange={(e) => setSegundos(e.target.value)}
                placeholder="Ex: 90"
                type="number"
              />

              <Button onClick={converterSegundosParaHoras} fullWidth>
                Converter
              </Button>

              {horasDeSeg !== null && (
                <div className="bg-indigo-50 border-2 border-indigo-400 rounded-lg p-4">
                  <p className="text-sm text-indigo-800 mb-2">Resultado:</p>
                  <p className="text-3xl font-bold text-indigo-900">{horasDeSeg.toFixed(6)} horas</p>
                  <p className="text-xs text-indigo-700 mt-2">
                    📌 {segundos} seg = {horasDeSeg.toFixed(6)} horas
                  </p>
                </div>
              )}

              <div className="bg-gray-50 p-3 rounded text-xs text-gray-700">
                <p className="font-semibold mb-1">Exemplo:</p>
                <p>• 90 segundos = 90/3600 = <strong>0.025 horas</strong></p>
                <p>• Aí μ = 1/0.025 = <strong>40 atendimentos/hora</strong></p>
              </div>
            </div>
          </div>
        </div>

        {/* CALCULADORA 6: Conversão de Tempo - Horas para Minutos */}
        <div className="bg-gradient-to-br from-orange-500 to-orange-700 rounded-2xl shadow-2xl p-1">
          <div className="bg-white rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <HiClock className="text-3xl text-orange-600" />
              <h3 className="font-display font-bold text-orange-900 text-2xl">Converter Horas → Minutos</h3>
            </div>
            <p className="text-gray-600 mb-4 text-sm">
              <strong>Quando usar:</strong> Tem um valor em horas e quer converter para minutos
            </p>

            <div className="space-y-4">
              <Input
                label="Tempo em horas"
                value={horasParaMin}
                onChange={(e) => setHorasParaMin(e.target.value)}
                placeholder="Ex: 0.5"
                type="number"
              />

              <Button onClick={converterHorasParaMinutos} fullWidth>
                Converter
              </Button>

              {minutosDeHoras !== null && (
                <div className="bg-orange-50 border-2 border-orange-400 rounded-lg p-4">
                  <p className="text-sm text-orange-800 mb-2">Resultado:</p>
                  <p className="text-3xl font-bold text-orange-900">{minutosDeHoras.toFixed(2)} minutos</p>
                  <p className="text-xs text-orange-700 mt-2">
                    📌 {horasParaMin} horas = {minutosDeHoras.toFixed(2)} minutos
                  </p>
                </div>
              )}

              <div className="bg-gray-50 p-3 rounded text-xs text-gray-700">
                <p className="font-semibold mb-1">Exemplos:</p>
                <p>• 0.5 horas = 0.5 × 60 = <strong>30 minutos</strong></p>
                <p>• 1.5 horas = 1.5 × 60 = <strong>90 minutos</strong></p>
                <p>• 0.25 horas = 0.25 × 60 = <strong>15 minutos</strong></p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Dica final */}
      <div className="mt-6 bg-gradient-to-r from-wine-50 to-wine-100 border-2 border-wine-400 rounded-xl p-5 shadow-lg">
        <div className="flex items-start gap-3">
          <HiArrowsExpand className="text-3xl text-wine-600 flex-shrink-0" />
          <div>
            <h3 className="font-bold text-wine-900 text-xl mb-2">⚠️ IMPORTANTE: Unidades Consistentes!</h3>
            <p className="text-wine-900 mb-2">
              <strong>λ e μ devem estar na MESMA unidade de tempo!</strong>
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
              <div className="bg-green-100 p-3 rounded">
                <p className="font-semibold text-green-900">✅ CORRETO:</p>
                <p className="text-green-800">λ = 3 clientes/hora</p>
                <p className="text-green-800">μ = 4 clientes/hora</p>
              </div>
              <div className="bg-red-100 p-3 rounded">
                <p className="font-semibold text-red-900">❌ ERRADO:</p>
                <p className="text-red-800">λ = 3 clientes/hora</p>
                <p className="text-red-800">μ = 4 clientes/minuto (misturou!)</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
