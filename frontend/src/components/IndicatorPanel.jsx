import { Activity, BarChart3, TrendingUp } from 'lucide-react'

const INDICATORS = [
  {
    id: 'sma20',
    name: 'SMA 20',
    description: 'Media Móvil Simple (20)',
    icon: TrendingUp,
    color: 'text-blue-400'
  },
  {
    id: 'sma50',
    name: 'SMA 50',
    description: 'Media Móvil Simple (50)',
    icon: TrendingUp,
    color: 'text-purple-400'
  },
  {
    id: 'ema12',
    name: 'EMA 12',
    description: 'Media Móvil Exponencial (12)',
    icon: TrendingUp,
    color: 'text-cyan-400'
  },
  {
    id: 'ema26',
    name: 'EMA 26',
    description: 'Media Móvil Exponencial (26)',
    icon: TrendingUp,
    color: 'text-pink-400'
  },
  {
    id: 'rsi',
    name: 'RSI',
    description: 'Índice de Fuerza Relativa',
    icon: Activity,
    color: 'text-green-400'
  },
  {
    id: 'macd',
    name: 'MACD',
    description: 'Convergencia/Divergencia',
    icon: BarChart3,
    color: 'text-orange-400'
  }
];

function IndicatorPanel({ activeIndicators, onToggle }) {
  return (
    <div className="bg-dark-800 border border-dark-600 rounded-lg p-4 shadow-lg">
      <h3 className="text-lg font-bold text-white mb-4 flex items-center">
        <Activity className="w-5 h-5 mr-2 text-accent-blue" />
        Indicadores Técnicos
      </h3>

      <div className="space-y-2">
        {INDICATORS.map((indicator) => {
          const Icon = indicator.icon;
          const isActive = activeIndicators[indicator.id];

          return (
            <button
              key={indicator.id}
              onClick={() => onToggle(indicator.id)}
              className={`w-full p-3 rounded-lg transition-all ${
                isActive
                  ? 'bg-accent-blue/20 border-2 border-accent-blue'
                  : 'bg-dark-700 border-2 border-transparent hover:border-dark-600'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Icon className={`w-5 h-5 ${isActive ? 'text-accent-blue' : 'text-gray-400'}`} />
                  <div className="text-left">
                    <p className={`font-semibold ${isActive ? 'text-white' : 'text-gray-400'}`}>
                      {indicator.name}
                    </p>
                    <p className="text-xs text-gray-500">{indicator.description}</p>
                  </div>
                </div>
                <div className={`w-4 h-4 rounded-full border-2 ${
                  isActive 
                    ? 'bg-accent-blue border-accent-blue' 
                    : 'border-gray-600'
                }`}>
                  {isActive && (
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    </div>
                  )}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      <div className="mt-6 p-3 bg-dark-700/50 rounded-lg border border-dark-600">
        <p className="text-xs text-gray-400 text-center">
          Activa/desactiva los indicadores para personalizar tu análisis
        </p>
      </div>
    </div>
  )
}

export default IndicatorPanel

