import { TrendingUp, TrendingDown, Star } from 'lucide-react'

function QuotePanel({ quote, isInWatchlist, onToggleWatchlist }) {
  const isPositive = quote.change >= 0;
  const changeColor = isPositive ? 'text-accent-green' : 'text-accent-red';
  const TrendIcon = isPositive ? TrendingUp : TrendingDown;

  return (
    <div className="bg-dark-800 border border-dark-600 rounded-lg p-6 shadow-lg">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-3">
            <h2 className="text-3xl font-bold text-white">{quote.symbol}</h2>
            <button
              onClick={onToggleWatchlist}
              className={`p-2 rounded-lg transition-all ${
                isInWatchlist
                  ? 'text-yellow-400 hover:bg-yellow-500/20'
                  : 'text-gray-500 hover:text-yellow-400 hover:bg-yellow-500/10'
              }`}
              title={isInWatchlist ? 'Quitar de favoritos' : 'Agregar a favoritos'}
            >
              <Star className={`w-6 h-6 ${isInWatchlist ? 'fill-yellow-400' : ''}`} />
            </button>
          </div>
          {quote.description && (
            <p className="text-sm text-gray-400 mt-1">{quote.description}</p>
          )}
          <p className="text-4xl font-bold text-white mt-2">
            ${quote.price?.toFixed(2) || '---'}
          </p>
        </div>

        <div className={`flex items-center space-x-2 ${changeColor}`}>
          <div className="text-right">
            <div className="flex items-center space-x-2">
              <TrendIcon className="w-6 h-6" />
              <span className="text-2xl font-bold">
                {isPositive ? '+' : ''}{quote.change?.toFixed(2) || '0.00'}
              </span>
            </div>
            <p className="text-lg font-semibold mt-1">
              ({isPositive ? '+' : ''}{quote.changePercent?.toFixed(2) || '0.00'}%)
            </p>
          </div>
        </div>

        <div className="text-sm text-gray-400 space-y-1 hidden md:block">
          <div className="flex justify-between space-x-4">
            <span>Apertura:</span>
            <span className="text-white font-semibold">${quote.open?.toFixed(2) || '---'}</span>
          </div>
          <div className="flex justify-between space-x-4">
            <span>Máximo:</span>
            <span className="text-accent-green font-semibold">${quote.high?.toFixed(2) || '---'}</span>
          </div>
          <div className="flex justify-between space-x-4">
            <span>Mínimo:</span>
            <span className="text-accent-red font-semibold">${quote.low?.toFixed(2) || '---'}</span>
          </div>
          <div className="flex justify-between space-x-4">
            <span>Cierre Anterior:</span>
            <span className="text-white font-semibold">${quote.previousClose?.toFixed(2) || '---'}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default QuotePanel

