import { useState, useEffect } from 'react';
import { Clock, Target, TrendingDown, DollarSign, Sliders } from 'lucide-react';

function AlternativeScenarios({ trade, originalAnalysis }) {
  const [scenarios, setScenarios] = useState([]);
  const [selectedScenario, setSelectedScenario] = useState(null);

  useEffect(() => {
    generateScenarios();
  }, [trade]);

  const generateScenarios = () => {
    const entryValue = trade.entryPrice * trade.quantity;
    
    // Escenario 1: Mantener más tiempo (+2 días)
    // Simulamos un aumento adicional del 1.5%
    const longerHoldPrice = trade.exitPrice * 1.015;
    const longerHoldExitValue = longerHoldPrice * trade.quantity;
    const longerHoldPL = longerHoldExitValue - entryValue - trade.commission;
    const longerHoldPercentage = (longerHoldPL / entryValue) * 100;

    // Escenario 2: Stop-loss más estricto (-2%)
    const stricterStopLossPrice = trade.entryPrice * 0.98;
    const stricterStopLossExitValue = stricterStopLossPrice * trade.quantity;
    const stricterStopLossPL = stricterStopLossExitValue - entryValue - trade.commission;
    const stricterStopLossPercentage = (stricterStopLossPL / entryValue) * 100;

    // Escenario 3: Take-profit más alto (+3%)
    const higherTakeProfitPrice = trade.entryPrice * 1.03;
    const higherTakeProfitExitValue = higherTakeProfitPrice * trade.quantity;
    const higherTakeProfitPL = higherTakeProfitExitValue - entryValue - trade.commission;
    const higherTakeProfitPercentage = (higherTakeProfitPL / entryValue) * 100;

    // Escenario 4: Posición más pequeña (50%)
    const smallerQuantity = trade.quantity * 0.5;
    const smallerEntryValue = trade.entryPrice * smallerQuantity;
    const smallerExitValue = trade.exitPrice * smallerQuantity;
    const smallerCommission = trade.commission * 0.5;
    const smallerPL = smallerExitValue - smallerEntryValue - smallerCommission;
    const smallerPercentage = (smallerPL / smallerEntryValue) * 100;

    // Escenario 5: Posición más grande (150%)
    const largerQuantity = trade.quantity * 1.5;
    const largerEntryValue = trade.entryPrice * largerQuantity;
    const largerExitValue = trade.exitPrice * largerQuantity;
    const largerCommission = trade.commission * 1.5;
    const largerPL = largerExitValue - largerEntryValue - largerCommission;
    const largerPercentage = (largerPL / largerEntryValue) * 100;

    // Escenario 6: Stop-loss más amplio (-5%)
    const widerStopLossPrice = trade.entryPrice * 0.95;
    const widerStopLossExitValue = widerStopLossPrice * trade.quantity;
    const widerStopLossPL = widerStopLossExitValue - entryValue - trade.commission;
    const widerStopLossPercentage = (widerStopLossPL / entryValue) * 100;

    setScenarios([
      {
        id: 1,
        name: 'Mantener Posición +2 días',
        description: 'Si hubieras mantenido la posición 2 días más',
        icon: Clock,
        color: 'blue',
        params: {
          exitPrice: longerHoldPrice,
          quantity: trade.quantity,
          duration: 'extra 2d'
        },
        results: {
          pl: longerHoldPL,
          percentage: longerHoldPercentage,
          exitValue: longerHoldExitValue
        }
      },
      {
        id: 2,
        name: 'Stop-Loss Estricto (-2%)',
        description: 'Con un stop-loss más conservador en -2%',
        icon: TrendingDown,
        color: 'red',
        params: {
          exitPrice: stricterStopLossPrice,
          quantity: trade.quantity,
          stopLoss: '-2%'
        },
        results: {
          pl: stricterStopLossPL,
          percentage: stricterStopLossPercentage,
          exitValue: stricterStopLossExitValue
        }
      },
      {
        id: 3,
        name: 'Take-Profit Mayor (+3%)',
        description: 'Con un objetivo de ganancia más ambicioso',
        icon: Target,
        color: 'green',
        params: {
          exitPrice: higherTakeProfitPrice,
          quantity: trade.quantity,
          takeProfit: '+3%'
        },
        results: {
          pl: higherTakeProfitPL,
          percentage: higherTakeProfitPercentage,
          exitValue: higherTakeProfitExitValue
        }
      },
      {
        id: 4,
        name: 'Posición Reducida (50%)',
        description: 'Con la mitad del tamaño de posición',
        icon: Sliders,
        color: 'purple',
        params: {
          exitPrice: trade.exitPrice,
          quantity: smallerQuantity,
          size: '50% del original'
        },
        results: {
          pl: smallerPL,
          percentage: smallerPercentage,
          exitValue: smallerExitValue
        }
      },
      {
        id: 5,
        name: 'Posición Aumentada (150%)',
        description: 'Con 50% más de tamaño de posición',
        icon: DollarSign,
        color: 'orange',
        params: {
          exitPrice: trade.exitPrice,
          quantity: largerQuantity,
          size: '150% del original'
        },
        results: {
          pl: largerPL,
          percentage: largerPercentage,
          exitValue: largerExitValue
        }
      },
      {
        id: 6,
        name: 'Stop-Loss Amplio (-5%)',
        description: 'Con un stop-loss más permisivo en -5%',
        icon: TrendingDown,
        color: 'yellow',
        params: {
          exitPrice: widerStopLossPrice,
          quantity: trade.quantity,
          stopLoss: '-5%'
        },
        results: {
          pl: widerStopLossPL,
          percentage: widerStopLossPercentage,
          exitValue: widerStopLossExitValue
        }
      }
    ]);
  };

  const getColorClasses = (color) => {
    const colors = {
      blue: 'bg-accent-blue/20 text-accent-blue border-accent-blue',
      red: 'bg-accent-red/20 text-accent-red border-accent-red',
      green: 'bg-accent-green/20 text-accent-green border-accent-green',
      purple: 'bg-accent-purple/20 text-accent-purple border-accent-purple',
      orange: 'bg-accent-orange/20 text-accent-orange border-accent-orange',
      yellow: 'bg-accent-yellow/20 text-accent-yellow border-accent-yellow'
    };
    return colors[color] || colors.blue;
  };

  const compareWithOriginal = (scenarioPL, scenarioPercentage) => {
    const diff = scenarioPL - originalAnalysis.netPL;
    const percentDiff = scenarioPercentage - originalAnalysis.plPercentage;
    const isBetter = diff > 0;

    return {
      diff,
      percentDiff,
      isBetter
    };
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">Escenarios Alternativos</h2>
        <p className="text-gray-400">
          Explora cómo habría resultado tu trade bajo diferentes condiciones
        </p>
      </div>

      {/* Scenarios Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {scenarios.map(scenario => {
          const comparison = compareWithOriginal(scenario.results.pl, scenario.results.percentage);
          const Icon = scenario.icon;
          const isProfit = scenario.results.pl > 0;

          return (
            <div
              key={scenario.id}
              onClick={() => setSelectedScenario(scenario)}
              className={`bg-dark-800 border-2 rounded-lg p-5 cursor-pointer transition-all hover:scale-105 ${
                selectedScenario?.id === scenario.id
                  ? getColorClasses(scenario.color)
                  : 'border-dark-600 hover:border-dark-500'
              }`}
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className={`p-2 rounded-lg ${getColorClasses(scenario.color)}`}>
                  <Icon className="w-5 h-5" />
                </div>
                {comparison.isBetter ? (
                  <span className="px-2 py-1 bg-accent-green/20 text-accent-green text-xs font-semibold rounded">
                    Mejor
                  </span>
                ) : (
                  <span className="px-2 py-1 bg-accent-red/20 text-accent-red text-xs font-semibold rounded">
                    Peor
                  </span>
                )}
              </div>

              {/* Title */}
              <h3 className="text-white font-bold mb-2">{scenario.name}</h3>
              <p className="text-gray-400 text-sm mb-4">{scenario.description}</p>

              {/* Results */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 text-sm">P&L:</span>
                  <span className={`font-bold ${isProfit ? 'text-accent-green' : 'text-accent-red'}`}>
                    {isProfit ? '+' : ''}{scenario.results.pl.toFixed(2)} USD
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 text-sm">Rendimiento:</span>
                  <span className={`font-bold ${isProfit ? 'text-accent-green' : 'text-accent-red'}`}>
                    {isProfit ? '+' : ''}{scenario.results.percentage.toFixed(2)}%
                  </span>
                </div>
                <div className="pt-2 border-t border-dark-600">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400 text-sm">vs Original:</span>
                    <span className={`font-semibold text-sm ${comparison.isBetter ? 'text-accent-green' : 'text-accent-red'}`}>
                      {comparison.isBetter ? '+' : ''}{comparison.diff.toFixed(2)} USD
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400 text-xs">Diferencia %:</span>
                    <span className={`font-semibold text-xs ${comparison.isBetter ? 'text-accent-green' : 'text-accent-red'}`}>
                      {comparison.isBetter ? '+' : ''}{comparison.percentDiff.toFixed(2)}%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Detailed Comparison */}
      {selectedScenario && (
        <div className="bg-dark-800 border border-accent-blue rounded-lg p-6">
          <h3 className="text-xl font-bold text-white mb-4">
            Comparación Detallada: {selectedScenario.name}
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Original */}
            <div className="bg-dark-700 rounded-lg p-4">
              <h4 className="text-white font-semibold mb-3 flex items-center">
                <span className="w-3 h-3 bg-accent-purple rounded-full mr-2"></span>
                Trade Original
              </h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Precio Salida:</span>
                  <span className="text-white font-semibold">${trade.exitPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Cantidad:</span>
                  <span className="text-white font-semibold">{trade.quantity}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">P&L Neto:</span>
                  <span className={`font-bold ${originalAnalysis.netPL >= 0 ? 'text-accent-green' : 'text-accent-red'}`}>
                    {originalAnalysis.netPL >= 0 ? '+' : ''}{originalAnalysis.netPL.toFixed(2)} USD
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Rendimiento:</span>
                  <span className={`font-bold ${originalAnalysis.netPL >= 0 ? 'text-accent-green' : 'text-accent-red'}`}>
                    {originalAnalysis.netPL >= 0 ? '+' : ''}{originalAnalysis.plPercentage.toFixed(2)}%
                  </span>
                </div>
              </div>
            </div>

            {/* Scenario */}
            <div className={`rounded-lg p-4 border-2 ${getColorClasses(selectedScenario.color)}`}>
              <h4 className="text-white font-semibold mb-3 flex items-center">
                <span className={`w-3 h-3 rounded-full mr-2 ${getColorClasses(selectedScenario.color)}`}></span>
                Escenario Alternativo
              </h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Precio Salida:</span>
                  <span className="text-white font-semibold">${selectedScenario.params.exitPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Cantidad:</span>
                  <span className="text-white font-semibold">{selectedScenario.params.quantity}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">P&L Neto:</span>
                  <span className={`font-bold ${selectedScenario.results.pl >= 0 ? 'text-accent-green' : 'text-accent-red'}`}>
                    {selectedScenario.results.pl >= 0 ? '+' : ''}{selectedScenario.results.pl.toFixed(2)} USD
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Rendimiento:</span>
                  <span className={`font-bold ${selectedScenario.results.pl >= 0 ? 'text-accent-green' : 'text-accent-red'}`}>
                    {selectedScenario.results.pl >= 0 ? '+' : ''}{selectedScenario.results.percentage.toFixed(2)}%
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Insights */}
          <div className="mt-4 p-4 bg-dark-700 rounded-lg">
            <h5 className="text-white font-semibold mb-2">💡 Insights</h5>
            <ul className="space-y-2 text-sm text-gray-300">
              {selectedScenario.id === 1 && (
                <li>• Mantener la posición más tiempo puede aumentar ganancias, pero también expone a más riesgo de reversión.</li>
              )}
              {selectedScenario.id === 2 && (
                <li>• Un stop-loss más estricto reduce pérdidas potenciales pero puede sacarte prematuramente de trades ganadores.</li>
              )}
              {selectedScenario.id === 3 && (
                <li>• Un take-profit más alto maximiza ganancias pero reduce la probabilidad de ejecución.</li>
              )}
              {selectedScenario.id === 4 && (
                <li>• Una posición más pequeña reduce tanto el riesgo como las ganancias potenciales - ideal para trades más inciertos.</li>
              )}
              {selectedScenario.id === 5 && (
                <li>• Una posición más grande amplifica tanto ganancias como pérdidas - requiere alta convicción y buena gestión de riesgo.</li>
              )}
              {selectedScenario.id === 6 && (
                <li>• Un stop-loss más amplio da más espacio para que el trade se desarrolle, pero aumenta el riesgo de pérdida.</li>
              )}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

export default AlternativeScenarios;

