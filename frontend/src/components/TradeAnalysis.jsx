import { useState, useEffect } from 'react';
import { ArrowLeft, TrendingUp, TrendingDown, DollarSign, Clock } from 'lucide-react';
import AlternativeScenarios from './AlternativeScenarios';

function TradeAnalysis({ trade, onBack }) {
  const [analysis, setAnalysis] = useState(null);

  useEffect(() => {
    calculateAnalysis();
  }, [trade]);

  const calculateAnalysis = () => {
    // Cálculos principales del trade
    const entryValue = trade.entryPrice * trade.quantity;
    const exitValue = trade.exitPrice * trade.quantity;
    const grossPL = exitValue - entryValue;
    const netPL = grossPL - trade.commission;
    const plPercentage = (netPL / entryValue) * 100;
    
    // Duración
    const entryDate = new Date(trade.entryDate);
    const exitDate = new Date(trade.exitDate);
    const durationMs = exitDate - entryDate;
    const durationDays = Math.floor(durationMs / (1000 * 60 * 60 * 24));
    const durationHours = Math.floor((durationMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    // Benchmark simulado (S&P 500 promedio: ~0.05% diario)
    const benchmarkDailyReturn = 0.0005;
    const benchmarkReturn = entryValue * benchmarkDailyReturn * (durationDays + durationHours / 24);
    const benchmarkPercentage = (benchmarkReturn / entryValue) * 100;
    const vsVsBenchmark = netPL - benchmarkReturn;
    
    // Métricas de riesgo
    const maxDrawdown = Math.abs(Math.min(0, grossPL)); // Simulado
    const riskRewardRatio = Math.abs(netPL / (trade.commission + maxDrawdown));
    
    setAnalysis({
      entryValue,
      exitValue,
      grossPL,
      netPL,
      plPercentage,
      durationDays,
      durationHours,
      benchmarkReturn,
      benchmarkPercentage,
      vsVsBenchmark,
      maxDrawdown,
      riskRewardRatio
    });
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!analysis) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="text-center text-white">Cargando análisis...</div>
      </div>
    );
  }

  const isProfit = analysis.netPL > 0;
  const isBetterThanBenchmark = analysis.vsVsBenchmark > 0;

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={onBack}
          className="flex items-center space-x-2 text-accent-blue hover:text-accent-blue/80 transition-colors mb-4"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Volver a Trades</span>
        </button>
        <h1 className="text-3xl font-bold text-white mb-2">Análisis del Trade: {trade.symbol}</h1>
        <p className="text-gray-400">Análisis detallado y escenarios alternativos</p>
      </div>

      {/* Main Trade Info Card */}
      <div className="bg-dark-800 border border-dark-600 rounded-lg p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-white mb-3">Información del Trade</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Símbolo:</span>
                  <span className="text-white font-bold text-xl">{trade.symbol}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Cantidad:</span>
                  <span className="text-white font-semibold">{trade.quantity} unidades</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Precio Entrada:</span>
                  <span className="text-white font-semibold">${trade.entryPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Precio Salida:</span>
                  <span className="text-white font-semibold">${trade.exitPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Valor Entrada:</span>
                  <span className="text-white font-semibold">${analysis.entryValue.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Valor Salida:</span>
                  <span className="text-white font-semibold">${analysis.exitValue.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-white mb-3">Resultados</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">P&L Bruto:</span>
                  <span className={`font-bold text-lg ${analysis.grossPL >= 0 ? 'text-accent-green' : 'text-accent-red'}`}>
                    {analysis.grossPL >= 0 ? '+' : ''}{analysis.grossPL.toFixed(2)} USD
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Comisiones:</span>
                  <span className="text-accent-red font-semibold">-${trade.commission.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-dark-600">
                  <span className="text-gray-400 font-semibold">P&L Neto:</span>
                  <span className={`font-bold text-2xl ${isProfit ? 'text-accent-green' : 'text-accent-red'}`}>
                    {isProfit ? '+' : ''}{analysis.netPL.toFixed(2)} USD
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Rendimiento:</span>
                  <span className={`font-bold text-xl ${isProfit ? 'text-accent-green' : 'text-accent-red'}`}>
                    {isProfit ? '+' : ''}{analysis.plPercentage.toFixed(2)}%
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Duración:</span>
                  <span className="text-white font-semibold">
                    {analysis.durationDays}d {analysis.durationHours}h
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Entrada:</span>
                  <span className="text-white text-sm">{formatDate(trade.entryDate)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Salida:</span>
                  <span className="text-white text-sm">{formatDate(trade.exitDate)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-dark-800 border border-dark-600 rounded-lg p-4">
          <div className="flex items-center space-x-3 mb-2">
            <div className={`p-2 rounded-lg ${isProfit ? 'bg-accent-green/20' : 'bg-accent-red/20'}`}>
              {isProfit ? (
                <TrendingUp className="w-5 h-5 text-accent-green" />
              ) : (
                <TrendingDown className="w-5 h-5 text-accent-red" />
              )}
            </div>
            <p className="text-gray-400 text-sm">Rendimiento</p>
          </div>
          <p className={`text-2xl font-bold ${isProfit ? 'text-accent-green' : 'text-accent-red'}`}>
            {isProfit ? '+' : ''}{analysis.plPercentage.toFixed(2)}%
          </p>
          <p className="text-gray-500 text-xs mt-2">
            Ganancia o pérdida porcentual respecto a tu inversión inicial
          </p>
        </div>

        <div className="bg-dark-800 border border-dark-600 rounded-lg p-4">
          <div className="flex items-center space-x-3 mb-2">
            <div className="p-2 rounded-lg bg-accent-orange/20">
              <DollarSign className="w-5 h-5 text-accent-orange" />
            </div>
            <p className="text-gray-400 text-sm">Riesgo/Recompensa</p>
          </div>
          <p className="text-2xl font-bold text-white">
            {analysis.riskRewardRatio.toFixed(2)}
          </p>
          <p className="text-gray-500 text-xs mt-2">
            Relación entre lo que ganaste/perdiste vs. el riesgo asumido
          </p>
        </div>
      </div>

      {/* Alternative Scenarios */}
      <AlternativeScenarios trade={trade} originalAnalysis={analysis} />
    </div>
  );
}

export default TradeAnalysis;

