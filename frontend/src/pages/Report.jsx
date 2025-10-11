import { usePsychologicalTracking } from '../contexts/PsychologicalTrackingContext'
import { 
  Clock, 
  TrendingUp, 
  Brain, 
  AlertCircle, 
  CheckCircle,
  Activity,
  BarChart3
} from 'lucide-react'

function Report() {
  const { getReportData } = usePsychologicalTracking()
  const report = getReportData()

  const formatDuration = (minutes) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    if (hours > 0) {
      return `${hours}h ${mins}m`
    }
    return `${mins}m`
  }

  const formatDate = (date) => {
    return new Date(date).toLocaleString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'text-accent-red border-accent-red bg-accent-red/10'
      case 'medium': return 'text-yellow-400 border-yellow-400 bg-yellow-400/10'
      case 'low': return 'text-accent-green border-accent-green bg-accent-green/10'
      default: return 'text-gray-400 border-gray-400 bg-gray-400/10'
    }
  }

  const getEmotionalColor = (value) => {
    if (value === null) return 'text-gray-400'
    if (value > 6) return 'text-accent-red'
    if (value >= 4) return 'text-yellow-400'
    return 'text-accent-green'
  }

  const getConfidenceColor = (value) => {
    if (value === null) return 'text-gray-400'
    if (value < 7) return 'text-accent-red'
    if (value < 8) return 'text-yellow-400'
    return 'text-accent-green'
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Informe Psicológico</h1>
          <p className="text-gray-400">Análisis de tu sesión de trading y patrones de comportamiento</p>
        </div>

        {/* Session Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-dark-800 border border-dark-600 rounded-lg p-6">
            <div className="flex items-center space-x-3 mb-2">
              <Clock className="w-5 h-5 text-accent-blue" />
              <h3 className="text-white font-semibold">Duración de Sesión</h3>
            </div>
            <p className="text-3xl font-bold text-white">{formatDuration(report.session.duration)}</p>
            <p className="text-sm text-gray-400 mt-1">
              Inicio: {formatDate(report.session.start)}
            </p>
          </div>

          <div className="bg-dark-800 border border-dark-600 rounded-lg p-6">
            <div className="flex items-center space-x-3 mb-2">
              <TrendingUp className="w-5 h-5 text-accent-green" />
              <h3 className="text-white font-semibold">Operaciones</h3>
            </div>
            <p className="text-3xl font-bold text-white">{report.trades.total}</p>
            <p className="text-sm text-gray-400 mt-1">
              {report.trades.buy} compras / {report.trades.sell} ventas
            </p>
          </div>

          <div className="bg-dark-800 border border-dark-600 rounded-lg p-6">
            <div className="flex items-center space-x-3 mb-2">
              <Brain className="w-5 h-5 text-accent-purple" />
              <h3 className="text-white font-semibold">Evaluaciones</h3>
            </div>
            <p className="text-3xl font-bold text-white">{report.emotional.totalResponses}</p>
            <p className="text-sm text-gray-400 mt-1">Respuestas emocionales registradas</p>
          </div>
        </div>

        {/* Emotional Metrics */}
        {report.emotional.totalResponses > 0 && (
          <div className="bg-dark-800 border border-dark-600 rounded-lg p-6 mb-8">
            <div className="flex items-center space-x-3 mb-6">
              <Activity className="w-5 h-5 text-accent-blue" />
              <h2 className="text-xl font-bold text-white">Métricas Emocionales</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-400">Estrés Promedio</span>
                  <span className={`text-2xl font-bold ${getEmotionalColor(report.emotional.avgStress)}`}>
                    {report.emotional.avgStress?.toFixed(1) || 'N/A'}/10
                  </span>
                </div>
                <div className="w-full bg-dark-700 rounded-full h-2">
                  <div 
                    className="bg-accent-red h-2 rounded-full transition-all"
                    style={{ width: `${(report.emotional.avgStress || 0) * 10}%` }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-400">Confianza Promedio</span>
                  <span className={`text-2xl font-bold ${getConfidenceColor(report.emotional.avgConfidence)}`}>
                    {report.emotional.avgConfidence?.toFixed(1) || 'N/A'}/10
                  </span>
                </div>
                <div className="w-full bg-dark-700 rounded-full h-2">
                  <div 
                    className="bg-accent-blue h-2 rounded-full transition-all"
                    style={{ width: `${(report.emotional.avgConfidence || 0) * 10}%` }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-400">Fatiga Promedio</span>
                  <span className={`text-2xl font-bold ${getEmotionalColor(report.emotional.avgFatigue)}`}>
                    {report.emotional.avgFatigue?.toFixed(1) || 'N/A'}/10
                  </span>
                </div>
                <div className="w-full bg-dark-700 rounded-full h-2">
                  <div 
                    className="bg-accent-purple h-2 rounded-full transition-all"
                    style={{ width: `${(report.emotional.avgFatigue || 0) * 10}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Detected Patterns */}
        {report.patterns.length > 0 && (
          <div className="bg-dark-800 border border-dark-600 rounded-lg p-6 mb-8">
            <div className="flex items-center space-x-3 mb-6">
              <BarChart3 className="w-5 h-5 text-yellow-400" />
              <h2 className="text-xl font-bold text-white">Patrones Detectados</h2>
            </div>

            <div className="space-y-3">
              {report.patterns.map((pattern, index) => (
                <div 
                  key={index}
                  className="flex items-start space-x-3 p-4 bg-dark-700 rounded-lg border border-dark-600"
                >
                  <AlertCircle className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
                    pattern.severity === 'high' ? 'text-accent-red' : 'text-yellow-400'
                  }`} />
                  <div>
                    <span className={`text-xs font-semibold uppercase ${
                      pattern.severity === 'high' ? 'text-accent-red' : 'text-yellow-400'
                    }`}>
                      {pattern.severity === 'high' ? 'Severidad Alta' : 'Severidad Media'}
                    </span>
                    <p className="text-white font-medium">{pattern.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recommendations */}
        <div className="bg-dark-800 border border-dark-600 rounded-lg p-6">
          <div className="flex items-center space-x-3 mb-6">
            <CheckCircle className="w-5 h-5 text-accent-green" />
            <h2 className="text-xl font-bold text-white">Recomendaciones Personalizadas</h2>
          </div>

          <div className="space-y-4">
            {report.recommendations.map((rec, index) => (
              <div 
                key={index}
                className={`border-l-4 p-4 rounded-r-lg ${getPriorityColor(rec.priority)}`}
              >
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-bold text-white">{rec.title}</h3>
                  <span className={`text-xs font-semibold uppercase px-2 py-1 rounded ${getPriorityColor(rec.priority)}`}>
                    {rec.priority === 'high' ? 'Prioridad Alta' : rec.priority === 'medium' ? 'Prioridad Media' : 'Prioridad Baja'}
                  </span>
                </div>
                <p className="text-gray-300 mb-3">{rec.description}</p>
                <div className="bg-dark-700 p-3 rounded border border-dark-600">
                  <p className="text-sm text-gray-300">
                    <span className="font-semibold text-white">Acción recomendada:</span> {rec.action}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Update Notice */}
        <div className="mt-6 p-4 bg-dark-700 border border-dark-600 rounded-lg">
          <p className="text-sm text-gray-400 text-center">
            Este informe se actualiza en tiempo real. Puedes consultarlo en cualquier momento para ver tu progreso.
          </p>
        </div>
      </div>
    </div>
  )
}

export default Report

