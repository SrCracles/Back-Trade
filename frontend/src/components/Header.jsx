import { TrendingUp } from 'lucide-react'

function Header() {
  return (
    <header className="bg-dark-800 border-b border-dark-600 shadow-lg">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-br from-accent-blue to-accent-purple p-2 rounded-lg">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">BackTrade</h1>
              <p className="text-xs text-gray-400">Trading Analytics Platform</p>
            </div>
          </div>
          
          <div className="hidden md:flex items-center space-x-4">
            <div className="text-right">
              <p className="text-xs text-gray-400">Prototipo MVP</p>
              <p className="text-sm font-semibold text-accent-blue">Dashboard de Mercado</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header

