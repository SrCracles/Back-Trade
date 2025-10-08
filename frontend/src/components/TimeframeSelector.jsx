import { Clock } from 'lucide-react'

const TIMEFRAMES = [
  { value: '1m', label: '1m' },
  { value: '5m', label: '5m' },
  { value: '15m', label: '15m' },
  { value: '1h', label: '1h' },
  { value: '1d', label: '1D' },
  { value: '1w', label: '1W' },
];

function TimeframeSelector({ selected, onSelect }) {
  return (
    <div className="bg-dark-800 border border-dark-600 rounded-lg p-2 flex items-center space-x-2">
      <Clock className="w-5 h-5 text-gray-400 ml-2" />
      <div className="flex space-x-1">
        {TIMEFRAMES.map((tf) => (
          <button
            key={tf.value}
            onClick={() => onSelect(tf.value)}
            className={`px-4 py-2 rounded-md font-medium transition-all ${
              selected === tf.value
                ? 'bg-accent-blue text-white shadow-lg'
                : 'text-gray-400 hover:text-white hover:bg-dark-700'
            }`}
          >
            {tf.label}
          </button>
        ))}
      </div>
    </div>
  )
}

export default TimeframeSelector

