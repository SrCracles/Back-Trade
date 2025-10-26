import { TrendingUp, ShoppingCart, TrendingDown, Wallet, LayoutDashboard, Star, Brain, Users, Bell, Target, BarChart3 } from 'lucide-react'
import { NavLink } from 'react-router-dom'

function Header({ onOpenBuy, onOpenSell, balance }) {
  return (
    <header className="bg-dark-800 border-b border-dark-600 shadow-lg">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-br from-accent-blue to-accent-purple p-2 rounded-lg">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Trading Sinérgico</h1>
                <p className="text-xs text-gray-400">Trading Analytics Platform</p>
              </div>
            </div>

            {/* Navigation */}
            <nav className="hidden md:flex items-center space-x-1">
              <NavLink
                to="/"
                className={({ isActive }) =>
                  `flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-accent-blue text-white'
                      : 'text-gray-400 hover:text-white hover:bg-dark-700'
                  }`
                }
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>Trading</span>
              </NavLink>

              <NavLink
                to="/watchlist"
                className={({ isActive }) =>
                  `flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-accent-blue text-white'
                      : 'text-gray-400 hover:text-white hover:bg-dark-700'
                  }`
                }
              >
                <Star className="w-4 h-4" />
                <span>Seguimiento</span>
              </NavLink>

              <NavLink
                to="/portfolio"
                className={({ isActive }) =>
                  `flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-accent-blue text-white'
                      : 'text-gray-400 hover:text-white hover:bg-dark-700'
                  }`
                }
              >
                <Wallet className="w-4 h-4" />
                <span>Portafolio</span>
              </NavLink>

              <NavLink
                to="/trades"
                className={({ isActive }) =>
                  `flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-accent-purple text-white'
                      : 'text-gray-400 hover:text-white hover:bg-dark-700'
                  }`
                }
              >
                <BarChart3 className="w-4 h-4" />
                <span>Trades</span>
              </NavLink>

              <NavLink
                to="/report"
                className={({ isActive }) =>
                  `flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-accent-purple text-white'
                      : 'text-gray-400 hover:text-white hover:bg-dark-700'
                  }`
                }
              >
                <Brain className="w-4 h-4" />
                <span>Informe</span>
              </NavLink>

              <NavLink
                to="/groups"
                className={({ isActive }) =>
                  `flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-accent-orange text-white'
                      : 'text-gray-400 hover:text-white hover:bg-dark-700'
                  }`
                }
              >
                <Users className="w-4 h-4" />
                <span>Grupos</span>
              </NavLink>

              <NavLink
                to="/alerts"
                className={({ isActive }) =>
                  `flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-accent-red text-white'
                      : 'text-gray-400 hover:text-white hover:bg-dark-700'
                  }`
                }
              >
                <Bell className="w-4 h-4" />
                <span>Alertas</span>
              </NavLink>

              <NavLink
                to="/funding"
                className={({ isActive }) =>
                  `flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-accent-yellow text-white'
                      : 'text-gray-400 hover:text-white hover:bg-dark-700'
                  }`
                }
              >
                <Target className="w-4 h-4" />
                <span>Fondeos</span>
              </NavLink>
            </nav>
          </div>
          
          <div className="flex items-center space-x-3">
            {/* Balance Display */}
            <div className="hidden lg:flex items-center space-x-2 px-4 py-2 bg-dark-700 rounded-lg border border-dark-600">
              <Wallet className="w-4 h-4 text-accent-green" />
              <span className="text-gray-400 text-sm">Balance:</span>
              <span className="text-white font-semibold">${balance.toFixed(2)}</span>
            </div>

            <button
              onClick={onOpenBuy}
              className="flex items-center space-x-2 px-4 py-2 bg-accent-green hover:bg-accent-green/80 text-white rounded-lg transition-colors font-semibold"
            >
              <ShoppingCart className="w-4 h-4" />
              <span className="hidden sm:inline">Comprar</span>
            </button>
            
            <button
              onClick={onOpenSell}
              className="flex items-center space-x-2 px-4 py-2 bg-accent-blue hover:bg-accent-blue/80 text-white rounded-lg transition-colors font-semibold"
            >
              <TrendingDown className="w-4 h-4" />
              <span className="hidden sm:inline">Vender</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header

