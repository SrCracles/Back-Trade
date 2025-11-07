import { useEffect, useState } from 'react'
import { Bell, X, CheckCircle } from 'lucide-react'

function AlertNotification({ alert, onClose, onDismiss }) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Animación de entrada
    setTimeout(() => setIsVisible(true), 10)
  }, [])

  const handleClose = () => {
    setIsVisible(false)
    setTimeout(() => {
      onClose()
    }, 300) // Esperar a que termine la animación
  }

  const handleDismiss = () => {
    setIsVisible(false)
    setTimeout(() => {
      onDismiss()
      onClose()
    }, 300)
  }

  return (
    <div
      className={`fixed bottom-6 left-6 z-50 transition-all duration-300 ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
      }`}
    >
      <div className="bg-dark-800 border border-accent-green/50 rounded-xl p-4 shadow-2xl max-w-md min-w-[320px]">
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0">
            <div className="p-2 bg-accent-green/20 rounded-lg">
              <Bell className="w-5 h-5 text-accent-green" />
            </div>
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2 mb-1">
              <CheckCircle className="w-4 h-4 text-accent-green flex-shrink-0" />
              <h3 className="text-sm font-semibold text-white">¡Alerta Disparada!</h3>
            </div>
            
            <p className="text-sm text-gray-300 mb-2">
              <span className="font-medium text-accent-blue">{alert.symbol}</span> ha alcanzado las condiciones de tu alerta.
            </p>
            
            <div className="bg-dark-700 rounded-lg p-2 mb-2">
              <p className="text-xs text-gray-400 mb-1">Condición:</p>
              <p className="text-xs text-white font-medium">
                {alert.condition === 'above' ? 'Supera' : 
                 alert.condition === 'below' ? 'Cae por debajo de' : 
                 'Igual a'} ${parseFloat(alert.value).toFixed(2)}
              </p>
            </div>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={handleDismiss}
                className="text-xs px-3 py-1 bg-accent-green/20 hover:bg-accent-green/30 text-accent-green rounded-lg transition-colors"
              >
                Marcar como vista
              </button>
              <button
                onClick={handleClose}
                className="text-xs px-3 py-1 bg-dark-700 hover:bg-dark-600 text-gray-300 rounded-lg transition-colors"
              >
                Cerrar
              </button>
            </div>
          </div>
          
          <button
            onClick={handleClose}
            className="flex-shrink-0 text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}

export default AlertNotification

