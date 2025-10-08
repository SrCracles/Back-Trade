import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Star, Plus, Trash2, TrendingUp, TrendingDown, X, Search } from 'lucide-react';
import { getQuote } from '../services/api';

const MAX_WATCHLIST_ITEMS = 50;

const CATEGORIES = [
  { id: 'all', name: 'Todos' },
  { id: 'us-stocks', name: 'Acciones EE.UU.' },
  { id: 'colombia-stocks', name: 'Acciones Colombia' },
  { id: 'crypto', name: 'Criptomonedas' },
  { id: 'forex', name: 'Forex' }
];

function Watchlist({ watchlist, setWatchlist, onSelectSymbol }) {
  const navigate = useNavigate();
  const [quotes, setQuotes] = useState({});
  const [activeCategory, setActiveCategory] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadQuotes();
  }, [watchlist]);

  const loadQuotes = async () => {
    setLoading(true);
    const newQuotes = {};
    
    for (const item of watchlist) {
      try {
        const quote = await getQuote(item.symbol);
        newQuotes[item.symbol] = quote;
      } catch (error) {
        console.error(`Error loading quote for ${item.symbol}:`, error);
      }
    }
    
    setQuotes(newQuotes);
    setLoading(false);
  };

  const handleAddToWatchlist = (symbol, category) => {
    if (watchlist.length >= MAX_WATCHLIST_ITEMS) {
      alert(`Has alcanzado el límite de ${MAX_WATCHLIST_ITEMS} activos`);
      return;
    }

    if (watchlist.some(item => item.symbol === symbol)) {
      alert('Este activo ya está en tu lista de seguimiento');
      return;
    }

    setWatchlist([...watchlist, { symbol, category }]);
    setShowAddModal(false);
    setSearchQuery('');
  };

  const handleRemoveFromWatchlist = (symbol) => {
    setWatchlist(watchlist.filter(item => item.symbol !== symbol));
  };

  const handleSelectAsset = (symbol) => {
    onSelectSymbol(symbol);
    navigate('/');
  };

  const filteredWatchlist = activeCategory === 'all' 
    ? watchlist 
    : watchlist.filter(item => item.category === activeCategory);

  return (
    <div className="min-h-screen bg-dark-900 py-6">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Lista de Seguimiento</h1>
            <p className="text-gray-400">
              Monitorea tus activos favoritos en un solo lugar
            </p>
          </div>
          
          <button
            onClick={() => setShowAddModal(true)}
            disabled={watchlist.length >= MAX_WATCHLIST_ITEMS}
            className="flex items-center space-x-2 px-4 py-2 bg-accent-blue hover:bg-accent-blue/80 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg transition-colors font-semibold"
          >
            <Plus className="w-5 h-5" />
            <span>Agregar Activo</span>
          </button>
        </div>

        {/* Counter */}
        <div className="bg-dark-800 border border-dark-600 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Star className="w-5 h-5 text-yellow-400" />
              <span className="text-white font-semibold">
                {watchlist.length}/{MAX_WATCHLIST_ITEMS} activos en seguimiento
              </span>
            </div>
            <span className={`text-sm ${
              watchlist.length >= MAX_WATCHLIST_ITEMS 
                ? 'text-accent-red' 
                : 'text-gray-400'
            }`}>
              {watchlist.length >= MAX_WATCHLIST_ITEMS 
                ? 'Límite alcanzado' 
                : `${MAX_WATCHLIST_ITEMS - watchlist.length} espacios disponibles`}
            </span>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap gap-2 mb-6">
          {CATEGORIES.map(category => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`px-4 py-2 rounded-lg transition-colors font-semibold ${
                activeCategory === category.id
                  ? 'bg-accent-blue text-white'
                  : 'bg-dark-800 text-gray-400 hover:text-white hover:bg-dark-700 border border-dark-600'
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>

        {/* Watchlist Table */}
        <div className="bg-dark-800 border border-dark-600 rounded-lg overflow-hidden">
          {loading ? (
            <div className="p-12 text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-accent-blue mb-4"></div>
              <p className="text-gray-400">Cargando datos...</p>
            </div>
          ) : filteredWatchlist.length === 0 ? (
            <div className="p-12 text-center">
              <Star className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400 text-lg mb-4">
                {activeCategory === 'all' 
                  ? 'No tienes activos en tu lista de seguimiento' 
                  : 'No hay activos en esta categoría'}
              </p>
              <button
                onClick={() => setShowAddModal(true)}
                className="px-6 py-3 bg-accent-blue text-white rounded-lg hover:bg-accent-blue/80 transition-colors"
              >
                Agregar Activo
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-dark-700">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Activo</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Categoría</th>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-gray-300">Precio</th>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-gray-300">Cambio 24h</th>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-gray-300">% Cambio</th>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-gray-300">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-dark-600">
                  {filteredWatchlist.map((item) => {
                    const quote = quotes[item.symbol];
                    const categoryName = CATEGORIES.find(c => c.id === item.category)?.name || item.category;

                    return (
                      <tr 
                        key={item.symbol} 
                        className="hover:bg-dark-700 transition-colors cursor-pointer"
                        onClick={() => handleSelectAsset(item.symbol)}
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-3">
                            <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                            <div>
                              <p className="text-white font-semibold text-lg">{item.symbol}</p>
                              <p className="text-gray-400 text-sm">
                                {quote?.description || item.symbol}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="px-3 py-1 bg-dark-600 text-gray-300 rounded-full text-xs font-semibold">
                            {categoryName}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right text-white font-mono font-semibold text-lg">
                          ${quote?.price?.toFixed(2) || '---'}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className={`flex items-center justify-end space-x-1 font-mono font-semibold ${
                            (quote?.change || 0) >= 0 ? 'text-accent-green' : 'text-accent-red'
                          }`}>
                            {(quote?.change || 0) >= 0 ? (
                              <TrendingUp className="w-4 h-4" />
                            ) : (
                              <TrendingDown className="w-4 h-4" />
                            )}
                            <span>
                              {(quote?.change || 0) >= 0 ? '+' : ''}{quote?.change?.toFixed(2) || '0.00'}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <span className={`font-mono font-bold text-lg ${
                            (quote?.changePercent || 0) >= 0 ? 'text-accent-green' : 'text-accent-red'
                          }`}>
                            {(quote?.changePercent || 0) >= 0 ? '+' : ''}{quote?.changePercent?.toFixed(2) || '0.00'}%
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRemoveFromWatchlist(item.symbol);
                            }}
                            className="p-2 text-gray-400 hover:text-accent-red hover:bg-accent-red/10 rounded-lg transition-colors"
                            title="Eliminar de la lista"
                          >
                            <Trash2 className="w-5 h-5" />
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
      </div>

      {/* Add Asset Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-dark-800 border border-dark-600 rounded-lg max-w-2xl w-full max-h-[80vh] overflow-hidden">
            <div className="p-6 border-b border-dark-600 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white">Agregar Activo a Seguimiento</h2>
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setSearchQuery('');
                }}
                className="p-2 text-gray-400 hover:text-white hover:bg-dark-700 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6">
              <div className="mb-6">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Buscar activo (ej: AAPL, BTC, EURUSD)..."
                    className="w-full bg-dark-700 border border-dark-600 rounded-lg py-3 pl-10 pr-4 text-white placeholder-gray-500 focus:outline-none focus:border-accent-blue focus:ring-2 focus:ring-accent-blue/20 transition-all"
                    autoFocus
                  />
                </div>
              </div>

              <div className="space-y-4 max-h-96 overflow-y-auto">
                <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wide">Activos Sugeridos</h3>
                
                {/* US Stocks */}
                <div>
                  <p className="text-xs text-gray-500 mb-2">Acciones EE.UU.</p>
                  <div className="grid grid-cols-2 gap-2">
                    {['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'TSLA', 'NVDA'].map(symbol => (
                      <button
                        key={symbol}
                        onClick={() => handleAddToWatchlist(symbol, 'us-stocks')}
                        disabled={watchlist.some(item => item.symbol === symbol)}
                        className="px-4 py-3 bg-dark-700 hover:bg-dark-600 disabled:bg-dark-700/50 disabled:cursor-not-allowed text-white rounded-lg transition-colors text-left border border-dark-600"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-semibold">{symbol}</span>
                          {watchlist.some(item => item.symbol === symbol) && (
                            <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Crypto */}
                <div>
                  <p className="text-xs text-gray-500 mb-2">Criptomonedas</p>
                  <div className="grid grid-cols-2 gap-2">
                    {['BTC', 'ETH', 'BNB', 'SOL', 'ADA', 'XRP'].map(symbol => (
                      <button
                        key={symbol}
                        onClick={() => handleAddToWatchlist(symbol, 'crypto')}
                        disabled={watchlist.some(item => item.symbol === symbol)}
                        className="px-4 py-3 bg-dark-700 hover:bg-dark-600 disabled:bg-dark-700/50 disabled:cursor-not-allowed text-white rounded-lg transition-colors text-left border border-dark-600"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-semibold">{symbol}</span>
                          {watchlist.some(item => item.symbol === symbol) && (
                            <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Forex */}
                <div>
                  <p className="text-xs text-gray-500 mb-2">Forex</p>
                  <div className="grid grid-cols-2 gap-2">
                    {['EURUSD', 'GBPUSD', 'USDJPY', 'AUDUSD'].map(symbol => (
                      <button
                        key={symbol}
                        onClick={() => handleAddToWatchlist(symbol, 'forex')}
                        disabled={watchlist.some(item => item.symbol === symbol)}
                        className="px-4 py-3 bg-dark-700 hover:bg-dark-600 disabled:bg-dark-700/50 disabled:cursor-not-allowed text-white rounded-lg transition-colors text-left border border-dark-600"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-semibold">{symbol}</span>
                          {watchlist.some(item => item.symbol === symbol) && (
                            <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Colombia Stocks */}
                <div>
                  <p className="text-xs text-gray-500 mb-2">Acciones Colombia</p>
                  <div className="grid grid-cols-2 gap-2">
                    {['ECOPETROL', 'BANCOLOMBIA', 'GRUPOSURA', 'ISA'].map(symbol => (
                      <button
                        key={symbol}
                        onClick={() => handleAddToWatchlist(symbol, 'colombia-stocks')}
                        disabled={watchlist.some(item => item.symbol === symbol)}
                        className="px-4 py-3 bg-dark-700 hover:bg-dark-600 disabled:bg-dark-700/50 disabled:cursor-not-allowed text-white rounded-lg transition-colors text-left border border-dark-600"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-semibold">{symbol}</span>
                          {watchlist.some(item => item.symbol === symbol) && (
                            <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Watchlist;

