import { useEffect } from 'react'
import { AlertTriangle, X } from 'lucide-react'
import { usePsychologicalTracking } from '../contexts/PsychologicalTrackingContext'

function RiskAlert() {
  const { riskAlert, dismissAlert } = usePsychologicalTracking()

  // Auto-dismiss after 10 seconds
  useEffect(() => {
    if (riskAlert) {
      const timeout = setTimeout(() => {
        dismissAlert()
      }, 10000)

      return () => clearTimeout(timeout)
    }
  }, [riskAlert, dismissAlert])

  if (!riskAlert) return null

  return (
    <div className="fixed top-20 right-4 z-50 w-96 animate-slide-in">
      <div className="bg-gradient-to-r from-accent-red/20 to-accent-red/10 border-2 border-accent-red rounded-lg shadow-2xl p-4">
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0">
            <AlertTriangle className="w-6 h-6 text-accent-red" />
          </div>
          
          <div className="flex-1">
            <h3 className="text-white font-semibold mb-1">
              Alerta de Comportamiento
            </h3>
            <p className="text-sm text-gray-300">
              {riskAlert.message}
            </p>
          </div>

          <button
            onClick={dismissAlert}
            className="flex-shrink-0 text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  )
}

export default RiskAlert

