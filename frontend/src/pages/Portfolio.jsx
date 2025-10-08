import { useNavigate } from 'react-router-dom';
import { TrendingUp, TrendingDown, DollarSign, ArrowRight } from 'lucide-react';

function Portfolio({ balance, holdings, onSelectSymbol }) {
  const navigate = useNavigate();

  const totalValue = holdings.reduce((sum, holding) => {
    return sum + (holding.quantity * holding.currentPrice);
  }, 0);

  const totalPnL = holdings.reduce((sum, holding) => {
    const invested = holding.quantity * holding.avgPrice;
    const current = holding.quantity * holding.currentPrice;
    return sum + (current - invested);
  }, 0);

  const totalPortfolioValue = balance + totalValue;

  const handleSelectSymbol = (symbol) => {
    onSelectSymbol(symbol);
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-dark-900 py-6">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-white mb-6">Mi Portafolio</h1>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-dark-800 border border-dark-600 rounded-lg p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-400 text-sm">Balance Disponible</span>
              <DollarSign className="w-5 h-5 text-accent-blue" />
            </div>
            <p className="text-2xl font-bold text-white">${balance.toFixed(2)}</p>
          </div>

          <div className="bg-dark-800 border border-dark-600 rounded-lg p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-400 text-sm">Valor en Posiciones</span>
              <TrendingUp className="w-5 h-5 text-accent-green" />
            </div>
            <p className="text-2xl font-bold text-white">${totalValue.toFixed(2)}</p>
          </div>

          <div className="bg-dark-800 border border-dark-600 rounded-lg p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-400 text-sm">Valor Total</span>
              <DollarSign className="w-5 h-5 text-white" />
            </div>
            <p className="text-2xl font-bold text-white">${totalPortfolioValue.toFixed(2)}</p>
          </div>

          <div className="bg-dark-800 border border-dark-600 rounded-lg p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-400 text-sm">P&L Total</span>
              {totalPnL >= 0 ? (
                <TrendingUp className="w-5 h-5 text-accent-green" />
              ) : (
                <TrendingDown className="w-5 h-5 text-accent-red" />
              )}
            </div>
            <p className={`text-2xl font-bold ${totalPnL >= 0 ? 'text-accent-green' : 'text-accent-red'}`}>
              {totalPnL >= 0 ? '+' : ''}{totalPnL.toFixed(2)} USD
            </p>
            <p className={`text-sm ${totalPnL >= 0 ? 'text-accent-green' : 'text-accent-red'}`}>
              {totalPnL >= 0 ? '+' : ''}{((totalPnL / (totalPortfolioValue - totalPnL)) * 100).toFixed(2)}%
            </p>
          </div>
        </div>

        {/* Holdings Table */}
        <div className="bg-dark-800 border border-dark-600 rounded-lg overflow-hidden">
          <div className="p-6 border-b border-dark-600">
            <h2 className="text-xl font-bold text-white">Posiciones Abiertas</h2>
          </div>

          {holdings.length === 0 ? (
            <div className="p-12 text-center">
              <p className="text-gray-400 text-lg mb-4">No tienes posiciones abiertas</p>
              <button
                onClick={() => navigate('/')}
                className="px-6 py-3 bg-accent-blue text-white rounded-lg hover:bg-accent-blue/80 transition-colors"
              >
                Ir a Trading
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-dark-700">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Símbolo</th>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-gray-300">Cantidad</th>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-gray-300">Precio Promedio</th>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-gray-300">Precio Actual</th>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-gray-300">Valor Total</th>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-gray-300">P&L</th>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-gray-300">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-dark-600">
                  {holdings.map((holding, index) => {
                    const invested = holding.quantity * holding.avgPrice;
                    const currentValue = holding.quantity * holding.currentPrice;
                    const pnl = currentValue - invested;
                    const pnlPercent = ((pnl / invested) * 100);

                    return (
                      <tr key={index} className="hover:bg-dark-700 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-accent-blue/20 rounded-full flex items-center justify-center">
                              <span className="text-accent-blue font-bold text-sm">
                                {holding.symbol.substring(0, 2)}
                              </span>
                            </div>
                            <div>
                              <p className="text-white font-semibold">{holding.symbol}</p>
                              <p className="text-gray-400 text-sm">
                                {holding.symbol === 'BTC' ? 'Bitcoin' :
                                 holding.symbol === 'ETH' ? 'Ethereum' :
                                 holding.symbol === 'TSLA' ? 'Tesla Inc.' :
                                 holding.symbol === 'AAPL' ? 'Apple Inc.' :
                                 holding.symbol}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right text-white font-mono">
                          {holding.quantity.toFixed(4)}
                        </td>
                        <td className="px-6 py-4 text-right text-white font-mono">
                          ${holding.avgPrice.toFixed(2)}
                        </td>
                        <td className="px-6 py-4 text-right text-white font-mono">
                          ${holding.currentPrice.toFixed(2)}
                        </td>
                        <td className="px-6 py-4 text-right text-white font-mono font-semibold">
                          ${currentValue.toFixed(2)}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className={`font-mono font-semibold ${pnl >= 0 ? 'text-accent-green' : 'text-accent-red'}`}>
                            {pnl >= 0 ? '+' : ''}{pnl.toFixed(2)} USD
                          </div>
                          <div className={`text-sm ${pnl >= 0 ? 'text-accent-green' : 'text-accent-red'}`}>
                            {pnl >= 0 ? '+' : ''}{pnlPercent.toFixed(2)}%
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button
                            onClick={() => handleSelectSymbol(holding.symbol)}
                            className="inline-flex items-center space-x-2 px-4 py-2 bg-accent-blue hover:bg-accent-blue/80 text-white rounded-lg transition-colors text-sm font-semibold"
                          >
                            <span>Operar</span>
                            <ArrowRight className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Performance Chart Placeholder */}
        <div className="mt-8 bg-dark-800 border border-dark-600 rounded-lg p-6">
          <h2 className="text-xl font-bold text-white mb-4">Rendimiento del Portafolio</h2>
          <div className="h-64 flex items-center justify-center border border-dashed border-dark-600 rounded-lg">
            <p className="text-gray-500">Gráfico de rendimiento disponible próximamente</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Portfolio;

