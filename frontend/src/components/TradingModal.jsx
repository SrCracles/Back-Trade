import { useState, useEffect } from 'react'
import { X, ShoppingCart, TrendingUp, DollarSign } from 'lucide-react'
import { getQuote } from '../services/api'
import { usePsychologicalTracking } from '../contexts/PsychologicalTrackingContext'

function TradingModal({ isOpen, onClose, mode, currentSymbol, balance, holdings, onTrade }) {
  const { registerTrade } = usePsychologicalTracking()
  const [amountUSD, setAmountUSD] = useState(100);
  const [quote, setQuote] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && currentSymbol) {
      loadQuote();
    }
  }, [isOpen, currentSymbol]);

  useEffect(() => {
    if (!isOpen) {
      setAmountUSD(100);
    }
  }, [isOpen]);

  const loadQuote = async () => {
    setLoading(true);
    try {
      const data = await getQuote(currentSymbol);
      setQuote(data);
    } catch (error) {
      console.error('Error loading quote:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAmountChange = (value) => {
    const numValue = parseFloat(value) || 0;
    setAmountUSD(Math.max(0, Math.min(numValue, mode === 'buy' ? balance : getMaxSellValue())));
  };

  const getMaxSellValue = () => {
    const holding = holdings.find(h => h.symbol === currentSymbol);
    if (!holding || !quote) return 0;
    return holding.quantity * quote.price;
  };

  const getQuantity = () => {
    if (!quote || !quote.price) return 0;
    return amountUSD / quote.price;
  };

  const handleTrade = () => {
    if (!quote) return;
    
    const quantity = getQuantity();
    const totalCost = amountUSD;
    
    const tradeData = {
      mode,
      symbol: currentSymbol,
      quantity,
      price: quote.price,
      totalCost
    };
    
    // Register trade in psychological tracking
    registerTrade(tradeData);
    
    // Execute trade in parent
    onTrade(tradeData);
    
    onClose();
  };

  if (!isOpen || !currentSymbol) return null;

  const quantity = getQuantity();
  const maxAmount = mode === 'buy' ? balance : getMaxSellValue();
  const canTrade = amountUSD > 0 && amountUSD <= maxAmount && quote;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-dark-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-dark-600">
        {/* Header */}
        <div className="sticky top-0 bg-dark-800 border-b border-dark-600 p-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {mode === 'buy' ? (
              <ShoppingCart className="w-6 h-6 text-accent-green" />
            ) : (
              <TrendingUp className="w-6 h-6 text-accent-blue" />
            )}
            <h2 className="text-xl font-bold text-white">
              {mode === 'buy' ? 'Comprar' : 'Vender'} {currentSymbol}
            </h2>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6">
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-blue mx-auto"></div>
              <p className="text-gray-400 mt-4">Cargando cotización...</p>
            </div>
          ) : quote ? (
            <div>
              {/* Symbol Info */}
              <div className="bg-dark-700 rounded-lg p-4 mb-6 border border-dark-600">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <p className="text-2xl font-bold text-white">{currentSymbol}</p>
                    <p className="text-sm text-gray-400">Precio actual</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-white">${quote.price.toFixed(2)}</p>
                    <p className={`text-sm font-semibold ${quote.change >= 0 ? 'text-accent-green' : 'text-accent-red'}`}>
                      {quote.change >= 0 ? '+' : ''}{quote.changePercent.toFixed(2)}%
                    </p>
                  </div>
                </div>
              </div>

              {/* Balance Info */}
              <div className="bg-dark-700 rounded-lg p-4 mb-6 border border-dark-600">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-400">
                      {mode === 'buy' ? 'Efectivo disponible' : 'Valor para vender'}
                    </p>
                    <p className="text-lg font-bold text-white">
                      ${maxAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </p>
                  </div>
                  {mode === 'sell' && (
                    <div className="text-right">
                      <p className="text-sm text-gray-400">Unidades disponibles</p>
                      <p className="text-lg font-bold text-white">
                        {(maxAmount / quote.price).toFixed(4)}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Amount Selector */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-white mb-3">
                  Cantidad a {mode === 'buy' ? 'comprar' : 'vender'} (USD)
                </label>
                
                {/* Slider */}
                <div className="mb-4">
                  <input
                    type="range"
                    min="0"
                    max={maxAmount}
                    step="10"
                    value={amountUSD}
                    onChange={(e) => handleAmountChange(e.target.value)}
                    className="w-full h-2 bg-dark-700 rounded-lg appearance-none cursor-pointer accent-accent-blue"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>$0</span>
                    <span>${maxAmount.toFixed(0)}</span>
                  </div>
                </div>

                {/* Manual Input */}
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="number"
                    value={amountUSD}
                    onChange={(e) => handleAmountChange(e.target.value)}
                    min="0"
                    max={maxAmount}
                    step="10"
                    className="w-full bg-dark-700 border border-dark-600 rounded-lg py-3 pl-10 pr-4 text-white text-lg font-semibold focus:outline-none focus:border-accent-blue focus:ring-2 focus:ring-accent-blue/20"
                  />
                </div>

                {/* Quick buttons */}
                <div className="grid grid-cols-4 gap-2 mt-3">
                  <button
                    onClick={() => handleAmountChange(maxAmount * 0.25)}
                    className="py-2 bg-dark-700 hover:bg-dark-600 text-white rounded-lg text-sm transition-colors"
                  >
                    25%
                  </button>
                  <button
                    onClick={() => handleAmountChange(maxAmount * 0.50)}
                    className="py-2 bg-dark-700 hover:bg-dark-600 text-white rounded-lg text-sm transition-colors"
                  >
                    50%
                  </button>
                  <button
                    onClick={() => handleAmountChange(maxAmount * 0.75)}
                    className="py-2 bg-dark-700 hover:bg-dark-600 text-white rounded-lg text-sm transition-colors"
                  >
                    75%
                  </button>
                  <button
                    onClick={() => handleAmountChange(maxAmount)}
                    className="py-2 bg-dark-700 hover:bg-dark-600 text-white rounded-lg text-sm transition-colors"
                  >
                    100%
                  </button>
                </div>
              </div>

              {/* Summary */}
              <div className="bg-dark-700 rounded-lg p-4 mb-6 border border-dark-600">
                <h4 className="text-sm font-semibold text-white mb-3">Resumen de la operación</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Cantidad (USD)</span>
                    <span className="text-white font-semibold">${amountUSD.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Precio unitario</span>
                    <span className="text-white font-semibold">${quote.price.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-dark-600">
                    <span className="text-gray-400">Unidades a {mode === 'buy' ? 'comprar' : 'vender'}</span>
                    <span className="text-white font-bold">{quantity.toFixed(4)} {currentSymbol}</span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex space-x-3">
                <button
                  onClick={onClose}
                  className="flex-1 py-3 bg-dark-700 text-white rounded-lg hover:bg-dark-600 transition-colors font-semibold"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleTrade}
                  disabled={!canTrade}
                  className={`flex-1 py-3 rounded-lg transition-colors font-semibold ${
                    canTrade
                      ? mode === 'buy'
                        ? 'bg-accent-green hover:bg-accent-green/80 text-white'
                        : 'bg-accent-blue hover:bg-accent-blue/80 text-white'
                      : 'bg-dark-600 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  {mode === 'buy' ? 'Comprar' : 'Vender'} {currentSymbol}
                </button>
              </div>

              {!canTrade && amountUSD > maxAmount && (
                <p className="text-accent-red text-sm mt-3 text-center">
                  Fondos insuficientes
                </p>
              )}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-400">Error al cargar cotización</p>
              <button
                onClick={loadQuote}
                className="mt-4 px-4 py-2 bg-accent-blue text-white rounded-lg hover:bg-accent-blue/80"
              >
                Reintentar
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default TradingModal
