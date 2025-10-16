import { useState } from 'react'
import { Target, DollarSign, Trophy, Clock, CheckCircle, AlertCircle, Star, TrendingUp, Shield, Zap } from 'lucide-react'

const FUNDING_PLANS = [
  {
    id: 1,
    name: 'Plan Básico',
    amount: 10000,
    profitShare: 80,
    price: 99,
    duration: 30,
    difficulty: 'Fácil',
    color: 'green',
    icon: Shield,
    description: 'Perfecto para traders principiantes',
    objectives: [
      'Alcanzar 5% de ganancia en 30 días',
      'Máximo 5% de pérdida diaria',
      'Mínimo 5 días de trading activo'
    ],
    restrictions: [
      'No más de 2% de riesgo por operación',
      'No trading en noticias importantes',
      'Horario de trading: 9:00 AM - 6:00 PM'
    ]
  },
  {
    id: 2,
    name: 'Plan Intermedio',
    amount: 25000,
    profitShare: 85,
    price: 199,
    duration: 45,
    difficulty: 'Medio',
    color: 'blue',
    icon: Target,
    description: 'Para traders con experiencia moderada',
    objectives: [
      'Alcanzar 8% de ganancia en 45 días',
      'Máximo 4% de pérdida diaria',
      'Mínimo 8 días de trading activo',
      'Mantener drawdown máximo del 6%'
    ],
    restrictions: [
      'No más de 1.5% de riesgo por operación',
      'Máximo 3 operaciones simultáneas',
      'No trading en criptomonedas volátiles'
    ]
  },
  {
    id: 3,
    name: 'Plan Avanzado',
    amount: 50000,
    profitShare: 90,
    price: 399,
    duration: 60,
    difficulty: 'Difícil',
    color: 'purple',
    icon: Trophy,
    description: 'Para traders experimentados',
    objectives: [
      'Alcanzar 12% de ganancia en 60 días',
      'Máximo 3% de pérdida diaria',
      'Mínimo 12 días de trading activo',
      'Mantener drawdown máximo del 4%',
      'Alcanzar Sharpe ratio > 1.5'
    ],
    restrictions: [
      'No más de 1% de riesgo por operación',
      'Máximo 2 operaciones simultáneas',
      'Solo trading en horarios de alta liquidez'
    ]
  },
  {
    id: 4,
    name: 'Plan Elite',
    amount: 100000,
    profitShare: 95,
    price: 799,
    duration: 90,
    difficulty: 'Élite',
    color: 'yellow',
    icon: Star,
    description: 'Para traders profesionales',
    objectives: [
      'Alcanzar 15% de ganancia en 90 días',
      'Máximo 2% de pérdida diaria',
      'Mínimo 15 días de trading activo',
      'Mantener drawdown máximo del 3%',
      'Alcanzar Sharpe ratio > 2.0',
      'Mantener win rate > 60%'
    ],
    restrictions: [
      'No más de 0.8% de riesgo por operación',
      'Máximo 1 operación simultánea',
      'Solo trading en mercados principales',
      'Análisis técnico obligatorio'
    ]
  }
]

const EXAMPLE_OBJECTIVES = [
  {
    title: 'Objetivos de Ganancia',
    examples: [
      'Alcanzar 5% de ganancia total en 30 días',
      'Mantener ganancia mensual del 8%',
      'Superar el rendimiento del S&P 500'
    ]
  },
  {
    title: 'Objetivos de Riesgo',
    examples: [
      'Máximo 5% de pérdida diaria',
      'Drawdown máximo del 6%',
      'No más de 3 operaciones perdedoras consecutivas'
    ]
  },
  {
    title: 'Objetivos de Actividad',
    examples: [
      'Mínimo 5 días de trading por mes',
      'Al menos 20 operaciones en el período',
      'Trading activo en 3 mercados diferentes'
    ]
  }
]

const EXAMPLE_RESTRICTIONS = [
  {
    title: 'Restricciones de Riesgo',
    examples: [
      'No más de 2% de riesgo por operación',
      'Stop loss obligatorio en todas las operaciones',
      'No apalancamiento superior a 1:10'
    ]
  },
  {
    title: 'Restricciones de Horario',
    examples: [
      'Solo trading en horarios de alta liquidez',
      'No trading en noticias importantes',
      'Horario: 9:00 AM - 6:00 PM (GMT-5)'
    ]
  },
  {
    title: 'Restricciones de Mercado',
    examples: [
      'Solo trading en mercados principales',
      'No trading en criptomonedas volátiles',
      'Máximo 3 operaciones simultáneas'
    ]
  }
]

function Funding() {
  const [selectedPlan, setSelectedPlan] = useState(null)
  const [showPurchase, setShowPurchase] = useState(false)
  const [activeTab, setActiveTab] = useState('plans')

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Fácil': return 'text-green-400 bg-green-500/20'
      case 'Medio': return 'text-blue-400 bg-blue-500/20'
      case 'Difícil': return 'text-purple-400 bg-purple-500/20'
      case 'Élite': return 'text-yellow-400 bg-yellow-500/20'
      default: return 'text-gray-400 bg-gray-500/20'
    }
  }

  const getPlanColor = (color) => {
    switch (color) {
      case 'green': return 'border-green-500/30 bg-green-500/10'
      case 'blue': return 'border-blue-500/30 bg-blue-500/10'
      case 'purple': return 'border-purple-500/30 bg-purple-500/10'
      case 'yellow': return 'border-yellow-500/30 bg-yellow-500/10'
      default: return 'border-gray-500/30 bg-gray-500/10'
    }
  }

  const handlePurchase = (plan) => {
    setSelectedPlan(plan)
    setShowPurchase(true)
  }

  return (
    <div className="min-h-screen bg-dark-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Retos de Fondeo</h1>
          <p className="text-gray-400 mb-4">
            Te proporcionamos capital real para trading. Cumple los objetivos y conserva el porcentaje acordado de las ganancias.
          </p>
          
          {/* What is Funding Explanation */}
          <div className="bg-dark-800 border border-dark-600 rounded-xl p-6 mb-8">
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
              <DollarSign className="w-6 h-6 text-accent-green mr-2" />
              ¿Qué es el Fondeo?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-accent-blue/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <TrendingUp className="w-8 h-8 text-accent-blue" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Te Damos Capital</h3>
                <p className="text-gray-400 text-sm">Recibes dinero real para operar en los mercados financieros</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-accent-green/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Target className="w-8 h-8 text-accent-green" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Cumple Objetivos</h3>
                <p className="text-gray-400 text-sm">Debes alcanzar metas específicas de ganancia y gestión de riesgo</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-accent-purple/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Trophy className="w-8 h-8 text-accent-purple" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Conserva Ganancias</h3>
                <p className="text-gray-400 text-sm">Te quedas con el porcentaje acordado de las ganancias obtenidas</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 mb-8">
          <button
            onClick={() => setActiveTab('plans')}
            className={`px-6 py-3 rounded-lg font-medium transition-colors ${
              activeTab === 'plans'
                ? 'bg-accent-blue text-white'
                : 'bg-dark-800 text-gray-400 hover:text-white hover:bg-dark-700'
            }`}
          >
            Planes de Fondeo
          </button>
          <button
            onClick={() => setActiveTab('objectives')}
            className={`px-6 py-3 rounded-lg font-medium transition-colors ${
              activeTab === 'objectives'
                ? 'bg-accent-blue text-white'
                : 'bg-dark-800 text-gray-400 hover:text-white hover:bg-dark-700'
            }`}
          >
            Objetivos
          </button>
          <button
            onClick={() => setActiveTab('restrictions')}
            className={`px-6 py-3 rounded-lg font-medium transition-colors ${
              activeTab === 'restrictions'
                ? 'bg-accent-blue text-white'
                : 'bg-dark-800 text-gray-400 hover:text-white hover:bg-dark-700'
            }`}
          >
            Restricciones
          </button>
        </div>

        {/* Plans Tab */}
        {activeTab === 'plans' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {FUNDING_PLANS.map((plan) => {
              const IconComponent = plan.icon
              
              return (
                <div
                  key={plan.id}
                  className={`bg-dark-800 border rounded-xl p-6 hover:border-accent-blue/50 transition-all duration-300 ${getPlanColor(plan.color)}`}
                >
                  <div className="text-center mb-6">
                    <div className={`w-16 h-16 ${getPlanColor(plan.color)} rounded-full flex items-center justify-center mx-auto mb-4`}>
                      <IconComponent className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">{plan.name}</h3>
                    <p className="text-gray-400 text-sm mb-4">{plan.description}</p>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(plan.difficulty)}`}>
                      {plan.difficulty}
                    </span>
                  </div>

                  <div className="space-y-4 mb-6">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-white">${plan.amount.toLocaleString()}</div>
                      <div className="text-gray-400 text-sm">Capital de Trading</div>
                    </div>
                    
                    <div className="text-center">
                      <div className="text-2xl font-bold text-accent-green">{plan.profitShare}%</div>
                      <div className="text-gray-400 text-sm">Tu Porcentaje</div>
                    </div>
                    
                    <div className="text-center">
                      <div className="text-lg font-semibold text-white">{plan.duration} días</div>
                      <div className="text-gray-400 text-sm">Duración</div>
                    </div>
                  </div>

                  <div className="text-center mb-6">
                    <div className="text-3xl font-bold text-accent-blue">${plan.price}</div>
                    <div className="text-gray-400 text-sm">Precio del Plan</div>
                  </div>

                  <button
                    onClick={() => handlePurchase(plan)}
                    className="w-full px-4 py-3 bg-accent-blue hover:bg-accent-blue/80 text-white rounded-lg transition-colors font-semibold"
                  >
                    Comprar Plan
                  </button>
                </div>
              )
            })}
          </div>
        )}

        {/* Objectives Tab */}
        {activeTab === 'objectives' && (
          <div className="space-y-8">
            {EXAMPLE_OBJECTIVES.map((section, index) => (
              <div key={index} className="bg-dark-800 border border-dark-600 rounded-xl p-6">
                <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                  <Target className="w-6 h-6 text-accent-blue mr-2" />
                  {section.title}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {section.examples.map((example, idx) => (
                    <div key={idx} className="bg-dark-700 p-4 rounded-lg">
                      <div className="flex items-start space-x-3">
                        <CheckCircle className="w-5 h-5 text-accent-green mt-0.5 flex-shrink-0" />
                        <p className="text-gray-300 text-sm">{example}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Restrictions Tab */}
        {activeTab === 'restrictions' && (
          <div className="space-y-8">
            {EXAMPLE_RESTRICTIONS.map((section, index) => (
              <div key={index} className="bg-dark-800 border border-dark-600 rounded-xl p-6">
                <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                  <AlertCircle className="w-6 h-6 text-accent-red mr-2" />
                  {section.title}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {section.examples.map((example, idx) => (
                    <div key={idx} className="bg-dark-700 p-4 rounded-lg">
                      <div className="flex items-start space-x-3">
                        <AlertCircle className="w-5 h-5 text-accent-red mt-0.5 flex-shrink-0" />
                        <p className="text-gray-300 text-sm">{example}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Purchase Modal */}
        {showPurchase && selectedPlan && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-dark-800 rounded-xl p-6 max-w-2xl w-full">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">Confirmar Compra</h2>
                <button
                  onClick={() => setShowPurchase(false)}
                  className="text-gray-400 hover:text-white"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-6">
                <div className="bg-dark-700 p-6 rounded-lg">
                  <h3 className="text-xl font-semibold text-white mb-4">{selectedPlan.name}</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-gray-400 text-sm">Capital de Trading</p>
                      <p className="text-2xl font-bold text-white">${selectedPlan.amount.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm">Tu Porcentaje</p>
                      <p className="text-2xl font-bold text-accent-green">{selectedPlan.profitShare}%</p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm">Duración</p>
                      <p className="text-lg font-semibold text-white">{selectedPlan.duration} días</p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm">Precio</p>
                      <p className="text-2xl font-bold text-accent-blue">${selectedPlan.price}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-lg font-semibold text-white mb-3">Objetivos a Cumplir:</h4>
                  <ul className="space-y-2">
                    {selectedPlan.objectives.map((objective, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <CheckCircle className="w-5 h-5 text-accent-green mt-0.5 flex-shrink-0" />
                        <span className="text-gray-300">{objective}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="text-lg font-semibold text-white mb-3">Restricciones:</h4>
                  <ul className="space-y-2">
                    {selectedPlan.restrictions.map((restriction, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <AlertCircle className="w-5 h-5 text-accent-red mt-0.5 flex-shrink-0" />
                        <span className="text-gray-300">{restriction}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex space-x-3 pt-4">
                  <button
                    onClick={() => setShowPurchase(false)}
                    className="flex-1 px-6 py-3 bg-dark-700 hover:bg-dark-600 text-white rounded-lg transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={() => {
                      alert('¡Plan comprado exitosamente! Te contactaremos pronto para activar tu cuenta de fondeo.')
                      setShowPurchase(false)
                    }}
                    className="flex-1 px-6 py-3 bg-accent-blue hover:bg-accent-blue/80 text-white rounded-lg transition-colors"
                  >
                    Confirmar Compra
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

export default Funding
