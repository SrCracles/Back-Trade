import { useState } from 'react'
import { Bell, Settings, TrendingUp, TrendingDown, DollarSign, AlertTriangle, Target, Zap, Shield, Activity } from 'lucide-react'

const ALERT_TYPES = [
  {
    id: 1,
    name: 'Precio Alcanza Objetivo',
    description: 'Notifica cuando el precio alcanza un nivel objetivo específico',
    icon: Target,
    example: 'BTC alcanza $50,000',
    category: 'Precio'
  },
  {
    id: 2,
    name: 'Caída de Precio',
    description: 'Alerta cuando el precio cae un porcentaje específico',
    icon: TrendingDown,
    example: 'AAPL cae 5% en 1 hora',
    category: 'Precio'
  },
  {
    id: 3,
    name: 'Subida de Precio',
    description: 'Notifica cuando el precio sube un porcentaje específico',
    icon: TrendingUp,
    example: 'ETH sube 10% en 24 horas',
    category: 'Precio'
  },
  {
    id: 4,
    name: 'Volumen Alto',
    description: 'Alerta cuando el volumen de trading es inusualmente alto',
    icon: Activity,
    example: 'Volumen de TSLA 300% superior al promedio',
    category: 'Volumen'
  },
  {
    id: 5,
    name: 'Breakout de Resistencia',
    description: 'Notifica cuando el precio rompe una resistencia clave',
    icon: Zap,
    example: 'EURUSD rompe resistencia en 1.0850',
    category: 'Técnico'
  },
  {
    id: 6,
    name: 'Breakdown de Soporte',
    description: 'Alerta cuando el precio rompe un soporte importante',
    icon: AlertTriangle,
    example: 'GBPUSD rompe soporte en 1.2500',
    category: 'Técnico'
  },
  {
    id: 7,
    name: 'Pérdida de Capital',
    description: 'Notifica cuando las pérdidas alcanzan un límite',
    icon: Shield,
    example: 'Pérdida diaria supera $500',
    category: 'Riesgo'
  },
  {
    id: 8,
    name: 'Ganancia Objetivo',
    description: 'Alerta cuando se alcanza una ganancia objetivo',
    icon: DollarSign,
    example: 'Ganancia diaria alcanza $1,000',
    category: 'Riesgo'
  },
  {
    id: 9,
    name: 'Noticias Importantes',
    description: 'Notifica sobre noticias relevantes del mercado',
    icon: Bell,
    example: 'Fed anuncia cambios en tasas de interés',
    category: 'Noticias'
  },
  {
    id: 10,
    name: 'Indicador Técnico',
    description: 'Alerta basada en señales de indicadores técnicos',
    icon: Settings,
    example: 'RSI de BTC supera 70 (sobrecompra)',
    category: 'Técnico'
  }
]

function Alerts() {
  const [enabledAlerts, setEnabledAlerts] = useState(new Set([1, 3, 5, 7, 9]))
  const [selectedCategory, setSelectedCategory] = useState('Todos')
  const [showSettings, setShowSettings] = useState(false)

  const categories = ['Todos', ...new Set(ALERT_TYPES.map(alert => alert.category))]

  const filteredAlerts = selectedCategory === 'Todos' 
    ? ALERT_TYPES 
    : ALERT_TYPES.filter(alert => alert.category === selectedCategory)

  const handleToggleAlert = (alertId) => {
    setEnabledAlerts(prev => {
      const newSet = new Set(prev)
      if (newSet.has(alertId)) {
        newSet.delete(alertId)
      } else {
        newSet.add(alertId)
      }
      return newSet
    })
  }

  const getCategoryColor = (category) => {
    switch (category) {
      case 'Precio': return 'bg-blue-500/20 text-blue-400 border-blue-500/30'
      case 'Volumen': return 'bg-green-500/20 text-green-400 border-green-500/30'
      case 'Técnico': return 'bg-purple-500/20 text-purple-400 border-purple-500/30'
      case 'Riesgo': return 'bg-red-500/20 text-red-400 border-red-500/30'
      case 'Noticias': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30'
    }
  }

  return (
    <div className="min-h-screen bg-dark-900 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Configuración de Alertas</h1>
            <p className="text-gray-400">Personaliza las notificaciones de trading según tus necesidades</p>
          </div>
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="flex items-center space-x-2 px-4 py-2 bg-accent-blue hover:bg-accent-blue/80 text-white rounded-lg transition-colors"
          >
            <Settings className="w-4 h-4" />
            <span>Configuración</span>
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-dark-800 border border-dark-600 rounded-xl p-6">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-accent-blue/20 rounded-lg">
                <Bell className="w-6 h-6 text-accent-blue" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white">{enabledAlerts.size}</h3>
                <p className="text-gray-400">Alertas Activas</p>
              </div>
            </div>
          </div>

          <div className="bg-dark-800 border border-dark-600 rounded-xl p-6">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-accent-green/20 rounded-lg">
                <Activity className="w-6 h-6 text-accent-green" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white">24</h3>
                <p className="text-gray-400">Alertas Hoy</p>
              </div>
            </div>
          </div>

          <div className="bg-dark-800 border border-dark-600 rounded-xl p-6">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-accent-purple/20 rounded-lg">
                <Target className="w-6 h-6 text-accent-purple" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white">87%</h3>
                <p className="text-gray-400">Precisión</p>
              </div>
            </div>
          </div>
        </div>

        {/* Category Filter */}
        <div className="mb-6">
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  selectedCategory === category
                    ? 'bg-accent-blue text-white'
                    : 'bg-dark-800 text-gray-400 hover:text-white hover:bg-dark-700'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Alerts List */}
        <div className="space-y-4">
          {filteredAlerts.map((alert) => {
            const IconComponent = alert.icon
            const isEnabled = enabledAlerts.has(alert.id)
            
            return (
              <div
                key={alert.id}
                className="bg-dark-800 border border-dark-600 rounded-xl p-6 hover:border-accent-blue/50 transition-all duration-300"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4 flex-1">
                    <div className={`p-3 rounded-lg ${getCategoryColor(alert.category)}`}>
                      <IconComponent className="w-6 h-6" />
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-semibold text-white">{alert.name}</h3>
                        <span className={`px-2 py-1 text-xs rounded-full border ${getCategoryColor(alert.category)}`}>
                          {alert.category}
                        </span>
                      </div>
                      
                      <p className="text-gray-300 mb-3">{alert.description}</p>
                      
                      <div className="bg-dark-700 p-3 rounded-lg">
                        <p className="text-sm text-gray-400 mb-1">Ejemplo:</p>
                        <p className="text-accent-blue font-medium">{alert.example}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4 ml-4">
                    <div className="text-right">
                      <p className="text-sm text-gray-400">Estado</p>
                      <p className={`text-sm font-medium ${isEnabled ? 'text-green-400' : 'text-gray-500'}`}>
                        {isEnabled ? 'Activa' : 'Inactiva'}
                      </p>
                    </div>
                    
                    <button
                      onClick={() => handleToggleAlert(alert.id)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        isEnabled ? 'bg-accent-blue' : 'bg-gray-600'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          isEnabled ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Settings Modal */}
        {showSettings && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-dark-800 rounded-xl p-6 max-w-md w-full">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-white">Configuración de Alertas</h2>
                <button
                  onClick={() => setShowSettings(false)}
                  className="text-gray-400 hover:text-white"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Frecuencia de Notificaciones
                  </label>
                  <select className="w-full p-3 bg-dark-700 border border-dark-600 rounded-lg text-white">
                    <option>Inmediata</option>
                    <option>5 minutos</option>
                    <option>15 minutos</option>
                    <option>1 hora</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Método de Notificación
                  </label>
                  <div className="space-y-2">
                    <label className="flex items-center space-x-2">
                      <input type="checkbox" defaultChecked className="rounded" />
                      <span className="text-gray-300">Push Notifications</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input type="checkbox" defaultChecked className="rounded" />
                      <span className="text-gray-300">Email</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input type="checkbox" className="rounded" />
                      <span className="text-gray-300">SMS</span>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Horario de Alertas
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs text-gray-400">Desde</label>
                      <input type="time" defaultValue="09:00" className="w-full p-2 bg-dark-700 border border-dark-600 rounded text-white" />
                    </div>
                    <div>
                      <label className="text-xs text-gray-400">Hasta</label>
                      <input type="time" defaultValue="18:00" className="w-full p-2 bg-dark-700 border border-dark-600 rounded text-white" />
                    </div>
                  </div>
                </div>

                <div className="flex space-x-3 pt-4">
                  <button
                    onClick={() => setShowSettings(false)}
                    className="flex-1 px-4 py-2 bg-dark-700 hover:bg-dark-600 text-white rounded-lg transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={() => setShowSettings(false)}
                    className="flex-1 px-4 py-2 bg-accent-blue hover:bg-accent-blue/80 text-white rounded-lg transition-colors"
                  >
                    Guardar
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Alerts
