import { useState } from 'react'
import { TrendingUp, ShoppingCart, TrendingDown, Wallet, LayoutDashboard, Star, Brain, Users, Bell, Target, Menu, X,  BarChart3 } from 'lucide-react'
import { NavLink } from 'react-router-dom'

function Header({ onOpenBuy, onOpenSell, balance }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const navLinks = [
    { to: '/', icon: LayoutDashboard, label: 'Trading', activeClass: 'bg-accent-blue' },
    { to: '/watchlist', icon: Star, label: 'Seguimiento', activeClass: 'bg-accent-blue' },
    { to: '/portfolio', icon: Wallet, label: 'Portafolio', activeClass: 'bg-accent-blue' },
    { to: '/report', icon: Brain, label: 'Informe', activeClass: 'bg-accent-purple' },
    { to: '/chat', icon: null, label: 'Chat', emoji: '💬', activeClass: 'bg-accent-green' },
    { to: '/groups', icon: Users, label: 'Grupos', activeClass: 'bg-accent-orange' },
    { to: '/alerts', icon: Bell, label: 'Alertas', activeClass: 'bg-accent-red' },
    { to: '/funding', icon: Target, label: 'Fondeos', activeClass: 'bg-accent-yellow' },
    { to: '/faq', icon: null, label: 'FAQ', emoji: '❓', activeClass: 'bg-accent-purple' },
  ]

  const NavLinkItem = ({ link, isMobile = false }) => {
    const Icon = link.icon
    const baseClasses = isMobile
      ? 'flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors w-full'
      : 'flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors'
    
    return (
      <NavLink
        to={link.to}
        onClick={() => isMobile && setMobileMenuOpen(false)}
        className={({ isActive }) =>
          `${baseClasses} ${
            isActive
              ? `${link.activeClass} text-white`
              : 'text-gray-400 hover:text-white hover:bg-dark-700'
          }`
        }
      >
        {link.icon ? (
          <Icon className="w-4 h-4" />
        ) : (
          <span role="img" aria-label={link.label.toLowerCase()}>{link.emoji}</span>
        )}
        <span>{link.label}</span>
      </NavLink>
    )
  }

  return (
    <header className="bg-dark-800 border-b border-dark-600 shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo and Title */}
          <div className="flex items-center space-x-3 min-w-0 flex-shrink-0">
            <div className="bg-gradient-to-br from-accent-blue to-accent-purple p-2 rounded-lg flex-shrink-0">
              <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <div className="min-w-0">
              <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-white truncate">Trading Sinérgico</h1>
              <p className="text-xs text-gray-400 hidden sm:block">Trading Analytics Platform</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1 flex-wrap">
            {navLinks.map((link) => (
              <NavLinkItem key={link.to} link={link} />
            ))}
          </nav>
          
          {/* Right Side - Actions */}
          <div className="flex items-center space-x-2 flex-shrink-0">
            {/* Balance Display */}
            <div className="hidden md:flex items-center space-x-2 px-3 py-2 bg-dark-700 rounded-lg border border-dark-600">
              <Wallet className="w-4 h-4 text-accent-green flex-shrink-0" />
              <span className="text-gray-400 text-sm hidden lg:inline">Balance:</span>
              <span className="text-white font-semibold whitespace-nowrap">${balance.toFixed(2)}</span>
            </div>

            {/* Trading Buttons */}
            <div className="flex items-center space-x-1">
            <button
              onClick={onOpenBuy}
                className="flex items-center space-x-1 sm:space-x-2 px-2 sm:px-4 py-2 bg-accent-green hover:bg-accent-green/80 text-white rounded-lg transition-colors font-semibold"
                aria-label="Comprar"
            >
              <ShoppingCart className="w-4 h-4" />
              <span className="hidden sm:inline">Comprar</span>
            </button>
            
            <button
              onClick={onOpenSell}
                className="flex items-center space-x-1 sm:space-x-2 px-2 sm:px-4 py-2 bg-accent-blue hover:bg-accent-blue/80 text-white rounded-lg transition-colors font-semibold"
                aria-label="Vender"
            >
              <TrendingDown className="w-4 h-4" />
              <span className="hidden sm:inline">Vender</span>
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-gray-400 hover:text-white hover:bg-dark-700 rounded-lg transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden mt-4 pb-4 border-t border-dark-600 pt-4">
            {/* Mobile Balance */}
            <div className="flex items-center justify-between px-4 py-3 mb-3 bg-dark-700 rounded-lg border border-dark-600">
              <div className="flex items-center space-x-2">
                <Wallet className="w-4 h-4 text-accent-green" />
                <span className="text-gray-400 text-sm">Balance:</span>
              </div>
              <span className="text-white font-semibold">${balance.toFixed(2)}</span>
            </div>

            {/* Mobile Navigation */}
            <nav className="space-y-1">
              {navLinks.map((link) => (
                <NavLinkItem key={link.to} link={link} isMobile={true} />
              ))}
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}

export default Header

