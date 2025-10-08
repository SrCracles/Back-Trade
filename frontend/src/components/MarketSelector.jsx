import { Globe } from 'lucide-react'

const MARKETS = [
  { value: 'us-stocks', label: 'Acciones EE.UU.' },
  { value: 'colombia-stocks', label: 'Acciones Colombia' },
  { value: 'crypto', label: 'Criptomonedas' },
  { value: 'forex', label: 'Divisas (Forex)' }
];

function MarketSelector({ selected, onSelect }) {
  return (
    <div className="bg-dark-800 border border-dark-600 rounded-lg p-2 flex items-center space-x-2">
      <Globe className="w-5 h-5 text-gray-400 ml-2" />
      <select
        value={selected}
        onChange={(e) => onSelect(e.target.value)}
        className="bg-transparent text-white font-medium px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-accent-blue cursor-pointer"
      >
        {MARKETS.map((market) => (
          <option 
            key={market.value} 
            value={market.value}
            className="bg-dark-800 text-white"
          >
            {market.label}
          </option>
        ))}
      </select>
    </div>
  )
}

export default MarketSelector

