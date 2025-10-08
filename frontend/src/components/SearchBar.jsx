import { useState, useEffect, useRef } from 'react'
import { Search } from 'lucide-react'
import { searchSymbols } from '../services/api'

function SearchBar({ onSymbolSelect, currentSymbol }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const delaySearch = setTimeout(() => {
      if (query.length > 0) {
        handleSearch();
      } else {
        setResults([]);
      }
    }, 300);

    return () => clearTimeout(delaySearch);
  }, [query]);

  const handleSearch = async () => {
    setLoading(true);
    try {
      const data = await searchSymbols(query);
      setResults(data);
      setIsOpen(true);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (symbol) => {
    onSymbolSelect(symbol);
    setQuery('');
    setIsOpen(false);
    setResults([]);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query && setIsOpen(true)}
          placeholder="Buscar símbolo (ej: AAPL, MSFT, TSLA...)"
          className="w-full bg-dark-800 border border-dark-600 rounded-lg py-3 pl-10 pr-4 text-white placeholder-gray-500 focus:outline-none focus:border-accent-blue focus:ring-2 focus:ring-accent-blue/20 transition-all"
        />
        {currentSymbol && !query && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <span className="bg-accent-blue/20 text-accent-blue px-3 py-1 rounded text-sm font-semibold">
              {currentSymbol}
            </span>
          </div>
        )}
      </div>

      {isOpen && results.length > 0 && (
        <div className="absolute z-50 w-full mt-2 bg-dark-800 border border-dark-600 rounded-lg shadow-2xl max-h-96 overflow-y-auto">
          {results.map((result, index) => (
            <button
              key={index}
              onClick={() => handleSelect(result.symbol)}
              className="w-full px-4 py-3 text-left hover:bg-dark-700 transition-colors border-b border-dark-600 last:border-b-0"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-white font-semibold">{result.symbol}</p>
                  <p className="text-sm text-gray-400 truncate">{result.description}</p>
                </div>
                <span className="text-xs text-accent-blue bg-accent-blue/10 px-2 py-1 rounded ml-2">
                  {result.type}
                </span>
              </div>
            </button>
          ))}
        </div>
      )}

      {loading && (
        <div className="absolute z-50 w-full mt-2 bg-dark-800 border border-dark-600 rounded-lg p-4 text-center">
          <p className="text-gray-400">Buscando...</p>
        </div>
      )}
    </div>
  )
}

export default SearchBar

