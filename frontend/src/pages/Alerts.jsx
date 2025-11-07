import { useState, useEffect } from 'react'
import { Bell, Settings, TrendingUp, TrendingDown, DollarSign, AlertTriangle, Target, Zap, Shield, Activity, Plus, Edit, Trash2, X } from 'lucide-react'
import { getAlertsAPI, createAlertAPI, updateAlertAPI, deleteAlertAPI, searchSymbols, triggerAlertAPI } from '../services/api.js'
import AlertNotification from '../components/AlertNotification.jsx'

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
  const [customAlerts, setCustomAlerts] = useState([])
  const [loading, setLoading] = useState(true)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [editingAlert, setEditingAlert] = useState(null)
  const [selectedCategory, setSelectedCategory] = useState('Todos')
  const [showSettings, setShowSettings] = useState(false)
  const [availableSymbols, setAvailableSymbols] = useState([])
  const [loadingSymbols, setLoadingSymbols] = useState(true)
  const [symbolSearchInput, setSymbolSearchInput] = useState('')
  const [showSymbolDropdown, setShowSymbolDropdown] = useState(false)
  const [triggeredAlert, setTriggeredAlert] = useState(null)

  // Form state
  const [formData, setFormData] = useState({
    symbol: '',
    type: 'price',
    condition: 'above',
    value: '',
    description: '',
    enabled: true,
    notificationMethod: 'push'
  })

  // Cargar alertas y símbolos al montar el componente
  useEffect(() => {
    loadAlerts()
    loadAvailableSymbols()
  }, [])

  const loadAlerts = async () => {
    try {
      setLoading(true)
      const response = await getAlertsAPI()
      setCustomAlerts(response.alerts || [])
    } catch (error) {
      console.error('Error loading alerts:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadAvailableSymbols = async () => {
    try {
      setLoadingSymbols(true)
      // Obtener todos los símbolos disponibles sin filtro
      const results = await searchSymbols('', 'all')
      // Ordenar por símbolo
      const sorted = results.sort((a, b) => a.symbol.localeCompare(b.symbol))
      setAvailableSymbols(sorted)
    } catch (error) {
      console.error('Error loading symbols:', error)
    } finally {
      setLoadingSymbols(false)
    }
  }

  const handleCreateAlert = async (e) => {
    e.preventDefault()
    try {
      const alertData = {
        ...formData,
        symbol: formData.symbol.toUpperCase(),
        value: parseFloat(formData.value) || formData.value
      }
      
      // Validar que todos los campos requeridos estén presentes
      if (!alertData.symbol || !alertData.type || !alertData.condition || !alertData.value) {
        alert('Por favor completa todos los campos requeridos')
        return
      }
      
      console.log('Sending alert data:', alertData)
      const response = await createAlertAPI(alertData)
      const newAlert = response.alert
      
      await loadAlerts()
      setShowCreateModal(false)
      resetForm()
      alert('Alerta creada exitosamente')
      
      // Simular que la alerta se dispara después de 5 segundos
      setTimeout(() => {
        handleAlertTrigger(newAlert)
      }, 5000)
    } catch (error) {
      console.error('Error creating alert:', error)
      alert('Error al crear la alerta: ' + (error.response?.data?.message || error.message))
    }
  }

  const handleAlertTrigger = async (alert) => {
    try {
      // Marcar la alerta como disparada en el backend
      await triggerAlertAPI(alert.id)
      
      // Mostrar la notificación
      setTriggeredAlert(alert)
      
      // Recargar alertas para actualizar el estado
      await loadAlerts()
    } catch (error) {
      console.error('Error triggering alert:', error)
      // Aún así mostrar la notificación aunque falle el backend
      setTriggeredAlert(alert)
    }
  }

  const handleDismissNotification = async () => {
    if (triggeredAlert) {
      // Recargar alertas para actualizar el estado
      await loadAlerts()
    }
  }

  const handleCloseNotification = () => {
    setTriggeredAlert(null)
  }

  const handleUpdateAlert = async (e) => {
    e.preventDefault()
    try {
      await updateAlertAPI(editingAlert.id, formData)
      await loadAlerts()
      setShowEditModal(false)
      setEditingAlert(null)
      resetForm()
      alert('Alerta actualizada exitosamente')
    } catch (error) {
      console.error('Error updating alert:', error)
      alert('Error al actualizar la alerta: ' + (error.response?.data?.message || error.message))
    }
  }

  const handleDeleteAlert = async (id) => {
    if (!confirm('¿Estás seguro de que deseas eliminar esta alerta?')) {
      return
    }

    try {
      await deleteAlertAPI(id)
      await loadAlerts()
      alert('Alerta eliminada exitosamente')
    } catch (error) {
      console.error('Error deleting alert:', error)
      alert('Error al eliminar la alerta: ' + (error.response?.data?.message || error.message))
    }
  }

  const handleEditClick = (alert) => {
    setEditingAlert(alert)
    // Buscar la descripción del símbolo para mostrarla en el input
    const symbolInfo = availableSymbols.find(s => s.symbol === alert.symbol)
    const displayText = symbolInfo 
      ? `${alert.symbol} - ${symbolInfo.description}`
      : alert.symbol
    
    setFormData({
      symbol: alert.symbol,
      type: alert.type,
      condition: alert.condition,
      value: alert.value,
      description: alert.description,
      enabled: alert.enabled,
      notificationMethod: alert.notificationMethod || 'push'
    })
    setSymbolSearchInput(displayText)
    setShowEditModal(true)
  }

  const handleToggleEnabled = async (alert) => {
    try {
      await updateAlertAPI(alert.id, { enabled: !alert.enabled })
      await loadAlerts()
    } catch (error) {
      console.error('Error toggling alert:', error)
      alert('Error al actualizar la alerta')
    }
  }

  const resetForm = () => {
    setFormData({
      symbol: '',
      type: 'price',
      condition: 'above',
      value: '',
      description: '',
      enabled: true,
      notificationMethod: 'push'
    })
    setSymbolSearchInput('')
    setShowSymbolDropdown(false)
  }

  // Filtrar símbolos según la búsqueda
  const filteredSymbols = availableSymbols.filter(symbol => {
    if (!symbolSearchInput) return true
    const searchLower = symbolSearchInput.toLowerCase()
    return (
      symbol.symbol.toLowerCase().includes(searchLower) ||
      symbol.description.toLowerCase().includes(searchLower)
    )
  })

  const handleSymbolSelect = (symbol) => {
    setFormData({ ...formData, symbol: symbol.symbol })
    setSymbolSearchInput(`${symbol.symbol} - ${symbol.description}`)
    setShowSymbolDropdown(false)
  }

  const handleSymbolInputChange = (e) => {
    const value = e.target.value
    setSymbolSearchInput(value)
    setShowSymbolDropdown(true)
    
    // Si el usuario borra todo, limpiar el símbolo seleccionado
    if (!value) {
      setFormData({ ...formData, symbol: '' })
    }
  }

  const categories = ['Todos', ...new Set(ALERT_TYPES.map(alert => alert.category))]

  const filteredCustomAlerts = selectedCategory === 'Todos' 
    ? customAlerts 
    : customAlerts.filter(alert => alert.type === selectedCategory.toLowerCase())

  const getCategoryColor = (category) => {
    switch (category) {
      case 'Precio':
      case 'price': return 'bg-blue-500/20 text-blue-400 border-blue-500/30'
      case 'Volumen':
      case 'volume': return 'bg-green-500/20 text-green-400 border-green-500/30'
      case 'Técnico':
      case 'technical': return 'bg-purple-500/20 text-purple-400 border-purple-500/30'
      case 'Riesgo':
      case 'risk': return 'bg-red-500/20 text-red-400 border-red-500/30'
      case 'Noticias':
      case 'news': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30'
    }
  }

  const getConditionLabel = (condition) => {
    switch (condition) {
      case 'above': return 'Supera'
      case 'below': return 'Cae por debajo de'
      case 'equals': return 'Igual a'
      default: return condition
    }
  }

  const getTypeLabel = (type) => {
    switch (type) {
      case 'price': return 'Precio'
      case 'volume': return 'Volumen'
      case 'technical': return 'Técnico'
      case 'risk': return 'Riesgo'
      default: return type
    }
  }

  return (
    <div className="min-h-screen bg-dark-900 p-6">
      {/* Notification Popup */}
      {triggeredAlert && (
        <AlertNotification
          alert={triggeredAlert}
          onClose={handleCloseNotification}
          onDismiss={handleDismissNotification}
        />
      )}
      
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Configuración de Alertas</h1>
            <p className="text-gray-400">Crea y gestiona alertas personalizadas de trading</p>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => {
                resetForm()
                setShowCreateModal(true)
              }}
              className="flex items-center space-x-2 px-4 py-2 bg-accent-blue hover:bg-accent-blue/80 text-white rounded-lg transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Nueva Alerta</span>
            </button>
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="flex items-center space-x-2 px-4 py-2 bg-dark-800 hover:bg-dark-700 text-white rounded-lg transition-colors"
            >
              <Settings className="w-4 h-4" />
              <span>Configuración</span>
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-dark-800 border border-dark-600 rounded-xl p-6">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-accent-blue/20 rounded-lg">
                <Bell className="w-6 h-6 text-accent-blue" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white">
                  {customAlerts.filter(a => a.enabled).length}
                </h3>
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
                <h3 className="text-2xl font-bold text-white">{customAlerts.length}</h3>
                <p className="text-gray-400">Total Alertas</p>
              </div>
            </div>
          </div>

          <div className="bg-dark-800 border border-dark-600 rounded-xl p-6">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-accent-purple/20 rounded-lg">
                <Target className="w-6 h-6 text-accent-purple" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white">
                  {customAlerts.filter(a => a.triggered).length}
                </h3>
                <p className="text-gray-400">Alertas Disparadas</p>
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

        {/* Custom Alerts List */}
        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-400">Cargando alertas...</p>
          </div>
        ) : filteredCustomAlerts.length === 0 ? (
          <div className="text-center py-12 bg-dark-800 border border-dark-600 rounded-xl">
            <Bell className="w-12 h-12 text-gray-500 mx-auto mb-4" />
            <p className="text-gray-400 mb-4">No hay alertas personalizadas</p>
            <button
              onClick={() => {
                resetForm()
                setShowCreateModal(true)
              }}
              className="px-4 py-2 bg-accent-blue hover:bg-accent-blue/80 text-white rounded-lg transition-colors"
            >
              Crear Primera Alerta
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredCustomAlerts.map((alert) => (
              <div
                key={alert.id}
                className={`bg-dark-800 border rounded-xl p-6 hover:border-accent-blue/50 transition-all duration-300 ${
                  alert.triggered ? 'border-accent-green/50 bg-accent-green/5' : 'border-dark-600'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4 flex-1">
                    <div className={`p-3 rounded-lg ${getCategoryColor(alert.type)}`}>
                      <Target className="w-6 h-6" />
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-semibold text-white">{alert.symbol}</h3>
                        <span className={`px-2 py-1 text-xs rounded-full border ${getCategoryColor(alert.type)}`}>
                          {getTypeLabel(alert.type)}
                        </span>
                        {alert.triggered && (
                          <span className="px-2 py-1 text-xs rounded-full bg-accent-green/20 text-accent-green border border-accent-green/30">
                            Disparada
                          </span>
                        )}
                      </div>
                      
                      <p className="text-gray-300 mb-2">
                        {getConditionLabel(alert.condition)} ${parseFloat(alert.value).toFixed(2)}
                      </p>
                      
                      {alert.description && (
                        <p className="text-gray-400 text-sm mb-3">{alert.description}</p>
                      )}
                      
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span>Creada: {new Date(alert.createdAt).toLocaleDateString()}</span>
                        {alert.triggeredAt && (
                          <span>Disparada: {new Date(alert.triggeredAt).toLocaleDateString()}</span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4 ml-4">
                    <div className="text-right">
                      <p className="text-sm text-gray-400">Estado</p>
                      <p className={`text-sm font-medium ${alert.enabled ? 'text-green-400' : 'text-gray-500'}`}>
                        {alert.enabled ? 'Activa' : 'Inactiva'}
                      </p>
                    </div>
                    
                    <button
                      onClick={() => handleToggleEnabled(alert)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        alert.enabled ? 'bg-accent-blue' : 'bg-gray-600'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          alert.enabled ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>

                    <button
                      onClick={() => handleEditClick(alert)}
                      className="p-2 text-gray-400 hover:text-accent-blue transition-colors"
                    >
                      <Edit className="w-5 h-5" />
                    </button>

                    <button
                      onClick={() => handleDeleteAlert(alert.id)}
                      className="p-2 text-gray-400 hover:text-accent-red transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Create Alert Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-dark-800 rounded-xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-white">Nueva Alerta</h2>
                <button
                  onClick={() => {
                    setShowCreateModal(false)
                    resetForm()
                  }}
                  className="text-gray-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateAlert} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Activo *
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={symbolSearchInput}
                      onChange={handleSymbolInputChange}
                      onFocus={() => setShowSymbolDropdown(true)}
                      onBlur={() => {
                        // Delay para permitir el click en el dropdown
                        setTimeout(() => setShowSymbolDropdown(false), 200)
                      }}
                      placeholder="Busca un activo (ej: BTC, AAPL, EURUSD)"
                      className="w-full p-3 bg-dark-700 border border-dark-600 rounded-lg text-white focus:border-accent-blue focus:outline-none"
                      required={!formData.symbol}
                      disabled={loadingSymbols}
                    />
                    {loadingSymbols && (
                      <p className="text-xs text-gray-400 mt-1">Cargando activos...</p>
                    )}
                    {showSymbolDropdown && filteredSymbols.length > 0 && !loadingSymbols && (
                      <div className="absolute z-50 w-full mt-1 bg-dark-700 border border-dark-600 rounded-lg max-h-60 overflow-y-auto shadow-lg">
                        {filteredSymbols.map((symbol) => (
                          <button
                            key={symbol.symbol}
                            type="button"
                            onClick={() => handleSymbolSelect(symbol)}
                            className="w-full text-left px-4 py-3 hover:bg-dark-600 text-white border-b border-dark-600 last:border-b-0 transition-colors"
                          >
                            <div className="font-medium text-accent-blue">{symbol.symbol}</div>
                            <div className="text-sm text-gray-400">{symbol.description}</div>
                          </button>
                        ))}
                        {filteredSymbols.length === 0 && symbolSearchInput && (
                          <div className="px-4 py-3 text-gray-400 text-sm">
                            No se encontraron activos
                          </div>
                        )}
                      </div>
                    )}
                    {formData.symbol && (
                      <input type="hidden" value={formData.symbol} required />
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Tipo de Alerta *
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full p-3 bg-dark-700 border border-dark-600 rounded-lg text-white"
                    required
                  >
                    <option value="price">Precio</option>
                    <option value="volume">Volumen</option>
                    <option value="technical">Técnico</option>
                    <option value="risk">Riesgo</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Condición *
                  </label>
                  <select
                    value={formData.condition}
                    onChange={(e) => setFormData({ ...formData, condition: e.target.value })}
                    className="w-full p-3 bg-dark-700 border border-dark-600 rounded-lg text-white"
                    required
                  >
                    <option value="above">Supera</option>
                    <option value="below">Cae por debajo de</option>
                    <option value="equals">Igual a</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Valor * (Precio objetivo)
                  </label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.value}
                      onChange={(e) => {
                        const value = e.target.value
                        setFormData({ ...formData, value: value === '' ? '' : parseFloat(value) || value })
                      }}
                      placeholder="Ej: 50000"
                      className="w-full p-3 bg-dark-700 border border-dark-600 rounded-lg text-white"
                      required
                    />
                </div>

                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Descripción (opcional)
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Ej: Alerta cuando BTC supera $50,000"
                    className="w-full p-3 bg-dark-700 border border-dark-600 rounded-lg text-white"
                    rows="3"
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.enabled}
                    onChange={(e) => setFormData({ ...formData, enabled: e.target.checked })}
                    className="rounded"
                  />
                  <label className="text-sm text-gray-300">Activar alerta inmediatamente</label>
                </div>

                <div className="flex space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowCreateModal(false)
                      resetForm()
                    }}
                    className="flex-1 px-4 py-2 bg-dark-700 hover:bg-dark-600 text-white rounded-lg transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-accent-blue hover:bg-accent-blue/80 text-white rounded-lg transition-colors"
                  >
                    Crear Alerta
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Edit Alert Modal */}
        {showEditModal && editingAlert && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-dark-800 rounded-xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-white">Editar Alerta</h2>
                <button
                  onClick={() => {
                    setShowEditModal(false)
                    setEditingAlert(null)
                    resetForm()
                  }}
                  className="text-gray-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleUpdateAlert} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Activo *
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={symbolSearchInput}
                      onChange={handleSymbolInputChange}
                      onFocus={() => setShowSymbolDropdown(true)}
                      onBlur={() => {
                        // Delay para permitir el click en el dropdown
                        setTimeout(() => setShowSymbolDropdown(false), 200)
                      }}
                      placeholder="Busca un activo (ej: BTC, AAPL, EURUSD)"
                      className="w-full p-3 bg-dark-700 border border-dark-600 rounded-lg text-white focus:border-accent-blue focus:outline-none"
                      required={!formData.symbol}
                      disabled={loadingSymbols}
                    />
                    {loadingSymbols && (
                      <p className="text-xs text-gray-400 mt-1">Cargando activos...</p>
                    )}
                    {showSymbolDropdown && filteredSymbols.length > 0 && !loadingSymbols && (
                      <div className="absolute z-50 w-full mt-1 bg-dark-700 border border-dark-600 rounded-lg max-h-60 overflow-y-auto shadow-lg">
                        {filteredSymbols.map((symbol) => (
                          <button
                            key={symbol.symbol}
                            type="button"
                            onClick={() => handleSymbolSelect(symbol)}
                            className="w-full text-left px-4 py-3 hover:bg-dark-600 text-white border-b border-dark-600 last:border-b-0 transition-colors"
                          >
                            <div className="font-medium text-accent-blue">{symbol.symbol}</div>
                            <div className="text-sm text-gray-400">{symbol.description}</div>
                          </button>
                        ))}
                        {filteredSymbols.length === 0 && symbolSearchInput && (
                          <div className="px-4 py-3 text-gray-400 text-sm">
                            No se encontraron activos
                          </div>
                        )}
                      </div>
                    )}
                    {formData.symbol && (
                      <input type="hidden" value={formData.symbol} required />
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Tipo de Alerta *
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full p-3 bg-dark-700 border border-dark-600 rounded-lg text-white"
                    required
                  >
                    <option value="price">Precio</option>
                    <option value="volume">Volumen</option>
                    <option value="technical">Técnico</option>
                    <option value="risk">Riesgo</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Condición *
                  </label>
                  <select
                    value={formData.condition}
                    onChange={(e) => setFormData({ ...formData, condition: e.target.value })}
                    className="w-full p-3 bg-dark-700 border border-dark-600 rounded-lg text-white"
                    required
                  >
                    <option value="above">Supera</option>
                    <option value="below">Cae por debajo de</option>
                    <option value="equals">Igual a</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Valor * (Precio objetivo)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.value}
                    onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                    className="w-full p-3 bg-dark-700 border border-dark-600 rounded-lg text-white"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Descripción (opcional)
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full p-3 bg-dark-700 border border-dark-600 rounded-lg text-white"
                    rows="3"
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.enabled}
                    onChange={(e) => setFormData({ ...formData, enabled: e.target.checked })}
                    className="rounded"
                  />
                  <label className="text-sm text-gray-300">Activar alerta</label>
                </div>

                <div className="flex space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowEditModal(false)
                      setEditingAlert(null)
                      resetForm()
                    }}
                    className="flex-1 px-4 py-2 bg-dark-700 hover:bg-dark-600 text-white rounded-lg transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-accent-blue hover:bg-accent-blue/80 text-white rounded-lg transition-colors"
                  >
                    Guardar Cambios
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

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
