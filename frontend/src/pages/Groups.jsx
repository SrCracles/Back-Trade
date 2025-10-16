import { useState } from 'react'
import { Search, Users, TrendingUp, Shield, Zap, Plus, Check } from 'lucide-react'

const GROUPS = [
  {
    id: 1,
    name: 'Crecimiento Agresivo',
    description: 'Estrategias de alto riesgo y alta recompensa para traders experimentados',
    members: 1247,
    riskLevel: 'Alto',
    color: 'red',
    icon: TrendingUp,
    strategies: ['Day Trading', 'Swing Trading', 'Momentum Trading'],
    requirements: 'Experiencia mínima 2 años, capital $10,000+'
  },
  {
    id: 2,
    name: 'Estabilidad Conservadora',
    description: 'Enfoque en preservación de capital y crecimiento sostenible',
    members: 2156,
    riskLevel: 'Bajo',
    color: 'green',
    icon: Shield,
    strategies: ['Value Investing', 'Dividend Investing', 'DCA'],
    requirements: 'Cualquier nivel de experiencia'
  },
  {
    id: 3,
    name: 'Tecnología Emergente',
    description: 'Especialización en criptomonedas y tecnologías disruptivas',
    members: 892,
    riskLevel: 'Medio',
    color: 'blue',
    icon: Zap,
    strategies: ['Crypto Trading', 'DeFi', 'NFT Trading'],
    requirements: 'Conocimiento básico de blockchain'
  }
]

function Groups() {
  const [searchTerm, setSearchTerm] = useState('')
  const [joinedGroups, setJoinedGroups] = useState(new Set())
  const [selectedGroup, setSelectedGroup] = useState(null)

  const filteredGroups = GROUPS.filter(group =>
    group.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    group.description.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleJoinGroup = (groupId) => {
    setJoinedGroups(prev => new Set([...prev, groupId]))
    alert('¡Te has unido al grupo exitosamente!')
  }

  const handleLeaveGroup = (groupId) => {
    setJoinedGroups(prev => {
      const newSet = new Set(prev)
      newSet.delete(groupId)
      return newSet
    })
    alert('Has abandonado el grupo')
  }

  const getRiskColor = (level) => {
    switch (level) {
      case 'Alto': return 'text-red-400'
      case 'Medio': return 'text-yellow-400'
      case 'Bajo': return 'text-green-400'
      default: return 'text-gray-400'
    }
  }

  const getGroupColor = (color) => {
    switch (color) {
      case 'red': return 'bg-red-500/20 border-red-500/30'
      case 'green': return 'bg-green-500/20 border-green-500/30'
      case 'blue': return 'bg-blue-500/20 border-blue-500/30'
      default: return 'bg-gray-500/20 border-gray-500/30'
    }
  }

  return (
    <div className="min-h-screen bg-dark-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Grupos de Trading</h1>
          <p className="text-gray-400">Únete a comunidades de traders con estrategias similares</p>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Buscar grupos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-dark-800 border border-dark-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-accent-blue"
            />
          </div>
        </div>

        {/* Groups Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGroups.map((group) => {
            const IconComponent = group.icon
            const isJoined = joinedGroups.has(group.id)
            
            return (
              <div
                key={group.id}
                className={`bg-dark-800 border rounded-xl p-6 hover:border-accent-blue/50 transition-all duration-300 ${getGroupColor(group.color)}`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className={`p-3 rounded-lg ${getGroupColor(group.color)}`}>
                      <IconComponent className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-white">{group.name}</h3>
                      <p className="text-sm text-gray-400">{group.members} miembros</p>
                    </div>
                  </div>
                  <span className={`text-sm font-medium ${getRiskColor(group.riskLevel)}`}>
                    {group.riskLevel}
                  </span>
                </div>

                <p className="text-gray-300 mb-4">{group.description}</p>

                <div className="space-y-3 mb-6">
                  <div>
                    <h4 className="text-sm font-semibold text-white mb-2">Estrategias:</h4>
                    <div className="flex flex-wrap gap-2">
                      {group.strategies.map((strategy, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-dark-700 text-gray-300 text-xs rounded"
                        >
                          {strategy}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-semibold text-white mb-1">Requisitos:</h4>
                    <p className="text-xs text-gray-400">{group.requirements}</p>
                  </div>
                </div>

                <div className="flex space-x-3">
                  <button
                    onClick={() => setSelectedGroup(group)}
                    className="flex-1 px-4 py-2 bg-dark-700 hover:bg-dark-600 text-white rounded-lg transition-colors text-sm"
                  >
                    Ver Detalles
                  </button>
                  
                  {isJoined ? (
                    <button
                      onClick={() => handleLeaveGroup(group.id)}
                      className="flex items-center space-x-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors text-sm"
                    >
                      <span>Abandonar</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => handleJoinGroup(group.id)}
                      className="flex items-center space-x-2 px-4 py-2 bg-accent-blue hover:bg-accent-blue/80 text-white rounded-lg transition-colors text-sm"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Unirse</span>
                    </button>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        {/* Group Detail Modal */}
        {selectedGroup && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-dark-800 rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">{selectedGroup.name}</h2>
                <button
                  onClick={() => setSelectedGroup(null)}
                  className="text-gray-400 hover:text-white"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <div className={`p-4 rounded-lg ${getGroupColor(selectedGroup.color)}`}>
                    <selectedGroup.icon className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <p className="text-gray-300">{selectedGroup.description}</p>
                    <div className="flex items-center space-x-4 mt-2">
                      <span className="text-sm text-gray-400">
                        <Users className="w-4 h-4 inline mr-1" />
                        {selectedGroup.members} miembros
                      </span>
                      <span className={`text-sm font-medium ${getRiskColor(selectedGroup.riskLevel)}`}>
                        Riesgo {selectedGroup.riskLevel}
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">Estrategias Principales</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {selectedGroup.strategies.map((strategy, index) => (
                      <div key={index} className="bg-dark-700 p-3 rounded-lg">
                        <span className="text-white text-sm">{strategy}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">Requisitos de Ingreso</h3>
                  <p className="text-gray-300">{selectedGroup.requirements}</p>
                </div>

                <div className="flex space-x-3 pt-4">
                  {joinedGroups.has(selectedGroup.id) ? (
                    <button
                      onClick={() => {
                        handleLeaveGroup(selectedGroup.id)
                        setSelectedGroup(null)
                      }}
                      className="flex-1 px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                    >
                      Abandonar Grupo
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        handleJoinGroup(selectedGroup.id)
                        setSelectedGroup(null)
                      }}
                      className="flex-1 px-6 py-3 bg-accent-blue hover:bg-accent-blue/80 text-white rounded-lg transition-colors"
                    >
                      Unirse al Grupo
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Groups
