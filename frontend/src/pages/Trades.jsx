import { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Clock, DollarSign, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import TradeAnalysis from '../components/TradeAnalysis';

function Trades({ closedTrades = [] }) {
  const [trades, setTrades] = useState(closedTrades);
  
  
  // Actualizar cuando cambien los trades cerrados
  useEffect(() => {
    setTrades(closedTrades);
  }, [closedTrades]);
  const [selectedTrade, setSelectedTrade] = useState(null);
  const [filter, setFilter] = useState('all'); // all, profit, loss

  const calculateProfitLoss = (trade) => {
    const revenue = trade.exitPrice * trade.quantity;
    const cost = trade.entryPrice * trade.quantity;
    const profitLoss = revenue - cost - trade.commission;
    const percentage = ((profitLoss / cost) * 100);
    return { profitLoss, percentage };
  };

  const calculateDuration = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const diffHours = Math.ceil((diffTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (diffDays > 0) {
      return `${diffDays}d ${diffHours}h`;
    }
    return `${diffHours}h`;
  };

  const filteredTrades = trades.filter(trade => {
    if (filter === 'all') return true;
    const { profitLoss } = calculateProfitLoss(trade);
    if (filter === 'profit') return profitLoss > 0;
    if (filter === 'loss') return profitLoss < 0;
    return true;
  });

  const totalStats = {
    total: trades.length,
    profitable: trades.filter(t => calculateProfitLoss(t).profitLoss > 0).length,
    losses: trades.filter(t => calculateProfitLoss(t).profitLoss < 0).length,
    totalPL: trades.reduce((acc, t) => acc + calculateProfitLoss(t).profitLoss, 0)
  };

  if (selectedTrade) {
    return <TradeAnalysis trade={selectedTrade} onBack={() => setSelectedTrade(null)} />;
  }

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-white mb-2">Historial de Trades</h1>
        <p className="text-gray-400">Analiza tus trades cerrados y aprende de ellos</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-dark-800 border border-dark-600 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm mb-1">Total Trades</p>
              <p className="text-2xl font-bold text-white">{totalStats.total}</p>
            </div>
            <div className="bg-accent-blue/20 p-3 rounded-lg">
              <TrendingUp className="w-6 h-6 text-accent-blue" />
            </div>
          </div>
        </div>

        <div className="bg-dark-800 border border-dark-600 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm mb-1">Trades Ganadores</p>
              <p className="text-2xl font-bold text-accent-green">{totalStats.profitable}</p>
            </div>
            <div className="bg-accent-green/20 p-3 rounded-lg">
              <TrendingUp className="w-6 h-6 text-accent-green" />
            </div>
          </div>
        </div>

        <div className="bg-dark-800 border border-dark-600 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm mb-1">Trades Perdedores</p>
              <p className="text-2xl font-bold text-accent-red">{totalStats.losses}</p>
            </div>
            <div className="bg-accent-red/20 p-3 rounded-lg">
              <TrendingDown className="w-6 h-6 text-accent-red" />
            </div>
          </div>
        </div>

        <div className="bg-dark-800 border border-dark-600 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm mb-1">P&L Total</p>
              <p className={`text-2xl font-bold ${totalStats.totalPL >= 0 ? 'text-accent-green' : 'text-accent-red'}`}>
                ${totalStats.totalPL.toFixed(2)}
              </p>
            </div>
            <div className="bg-accent-purple/20 p-3 rounded-lg">
              <DollarSign className="w-6 h-6 text-accent-purple" />
            </div>
          </div>
        </div>
      </div>

      {/* Filter Buttons */}
      <div className="flex space-x-2 mb-6">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            filter === 'all'
              ? 'bg-accent-blue text-white'
              : 'bg-dark-800 text-gray-400 hover:bg-dark-700'
          }`}
        >
          Todos
        </button>
        <button
          onClick={() => setFilter('profit')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            filter === 'profit'
              ? 'bg-accent-green text-white'
              : 'bg-dark-800 text-gray-400 hover:bg-dark-700'
          }`}
        >
          Ganancias
        </button>
        <button
          onClick={() => setFilter('loss')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            filter === 'loss'
              ? 'bg-accent-red text-white'
              : 'bg-dark-800 text-gray-400 hover:bg-dark-700'
          }`}
        >
          Pérdidas
        </button>
      </div>

      {/* Trades List */}
      <div className="space-y-3">
        {filteredTrades.map(trade => {
          const { profitLoss, percentage } = calculateProfitLoss(trade);
          const duration = calculateDuration(trade.entryDate, trade.exitDate);
          const isProfit = profitLoss > 0;

          return (
            <div
              key={trade.id}
              onClick={() => setSelectedTrade(trade)}
              className="bg-dark-800 border border-dark-600 rounded-lg p-4 hover:border-accent-blue transition-all cursor-pointer group"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4 flex-1">
                  {/* Symbol */}
                  <div className="bg-dark-700 px-4 py-2 rounded-lg">
                    <p className="text-white font-bold text-lg">{trade.symbol}</p>
                  </div>

                  {/* Trade Info */}
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="text-gray-400 text-sm flex items-center">
                        <Clock className="w-3 h-3 mr-1" />
                        {duration}
                      </span>
                    </div>
                    <div className="flex items-center space-x-4 text-sm">
                      <span className="text-gray-400">
                        Entrada: <span className="text-white font-semibold">${trade.entryPrice.toFixed(2)}</span>
                      </span>
                      <ArrowRight className="w-4 h-4 text-gray-600" />
                      <span className="text-gray-400">
                        Salida: <span className="text-white font-semibold">${trade.exitPrice.toFixed(2)}</span>
                      </span>
                      <span className="text-gray-400">
                        Cantidad: <span className="text-white font-semibold">{trade.quantity}</span>
                      </span>
                    </div>
                  </div>

                  {/* P&L */}
                  <div className="text-right">
                    <p className={`text-2xl font-bold ${isProfit ? 'text-accent-green' : 'text-accent-red'}`}>
                      {isProfit ? '+' : ''}{profitLoss.toFixed(2)} USD
                    </p>
                    <p className={`text-sm ${isProfit ? 'text-accent-green' : 'text-accent-red'}`}>
                      {isProfit ? '+' : ''}{percentage.toFixed(2)}%
                    </p>
                  </div>

                  {/* Arrow */}
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <ArrowRight className="w-6 h-6 text-accent-blue" />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredTrades.length === 0 && (
        <div className="text-center py-12">
          <div className="bg-dark-800 border border-dark-600 rounded-lg p-8 max-w-md mx-auto">
            <div className="text-6xl mb-4">📊</div>
            <p className="text-gray-400 text-lg mb-2">
              {filter !== 'all' 
                ? 'No hay trades para mostrar con este filtro' 
                : 'Aún no has cerrado ningún trade'}
            </p>
            {filter === 'all' && (
              <p className="text-gray-500 text-sm">
                Vende una posición de tu portafolio para generar tu primer análisis
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Trades;

