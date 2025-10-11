import { useState, useEffect } from 'react'
import { X, Brain } from 'lucide-react'
import { usePsychologicalTracking } from '../contexts/PsychologicalTrackingContext'

function EmotionalPopup() {
  const { showEmotionalPopup, popupTrigger, registerEmotionalResponse, dismissPopup } = usePsychologicalTracking()
  
  const [stress, setStress] = useState(5)
  const [confidence, setConfidence] = useState(5)
  const [fatigue, setFatigue] = useState(5)

  // Auto-dismiss after 30 seconds
  useEffect(() => {
    if (showEmotionalPopup) {
      const timeout = setTimeout(() => {
        dismissPopup()
      }, 30000)

      return () => clearTimeout(timeout)
    }
  }, [showEmotionalPopup, dismissPopup])

  if (!showEmotionalPopup) return null

  const handleSubmit = () => {
    registerEmotionalResponse({
      stress,
      confidence,
      fatigue
    })
  }

  const getTriggerMessage = () => {
    if (popupTrigger === 'post-trade') {
      return 'Acabas de realizar una operación'
    }
    return 'Evaluación periódica'
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 w-96 animate-slide-in">
      <div className="bg-dark-800 border border-dark-600 rounded-lg shadow-2xl p-5">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Brain className="w-5 h-5 text-accent-purple" />
            <h3 className="text-white font-semibold">Evaluación Emocional</h3>
          </div>
          <button
            onClick={dismissPopup}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Trigger message */}
        <p className="text-sm text-gray-400 mb-4">{getTriggerMessage()}</p>

        {/* Questions */}
        <div className="space-y-4">
          {/* Stress Level */}
          <div>
            <label className="block text-sm text-gray-300 mb-2">
              Nivel de Estrés: <span className="text-white font-semibold">{stress}</span>
            </label>
            <input
              type="range"
              min="1"
              max="10"
              value={stress}
              onChange={(e) => setStress(parseInt(e.target.value))}
              className="w-full accent-accent-red"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>Relajado</span>
              <span>Muy estresado</span>
            </div>
          </div>

          {/* Confidence Level */}
          <div>
            <label className="block text-sm text-gray-300 mb-2">
              Nivel de Confianza: <span className="text-white font-semibold">{confidence}</span>
            </label>
            <input
              type="range"
              min="1"
              max="10"
              value={confidence}
              onChange={(e) => setConfidence(parseInt(e.target.value))}
              className="w-full accent-accent-blue"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>Sin confianza</span>
              <span>Muy confiado</span>
            </div>
          </div>

          {/* Fatigue Level */}
          <div>
            <label className="block text-sm text-gray-300 mb-2">
              Nivel de Fatiga: <span className="text-white font-semibold">{fatigue}</span>
            </label>
            <input
              type="range"
              min="1"
              max="10"
              value={fatigue}
              onChange={(e) => setFatigue(parseInt(e.target.value))}
              className="w-full accent-accent-purple"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>Energizado</span>
              <span>Muy cansado</span>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          className="w-full mt-5 bg-accent-blue hover:bg-accent-blue/80 text-white font-semibold py-2 rounded-lg transition-colors"
        >
          Enviar
        </button>

        {/* Auto-dismiss notice */}
        <p className="text-xs text-gray-500 text-center mt-3">
          Se cerrará automáticamente en 30s
        </p>
      </div>
    </div>
  )
}

export default EmotionalPopup

