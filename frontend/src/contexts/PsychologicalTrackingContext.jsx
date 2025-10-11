import { createContext, useContext, useState, useEffect, useCallback } from 'react'

const PsychologicalTrackingContext = createContext()

export function usePsychologicalTracking() {
  const context = useContext(PsychologicalTrackingContext)
  if (!context) {
    throw new Error('usePsychologicalTracking must be used within PsychologicalTrackingProvider')
  }
  return context
}

export function PsychologicalTrackingProvider({ children }) {
  // Session tracking
  const [sessionStart] = useState(new Date())
  const [sessionData, setSessionData] = useState({
    startTime: new Date(),
    totalActiveTime: 0,
    lastActivityTime: new Date()
  })

  // Trades tracking
  const [tradesHistory, setTradesHistory] = useState([])

  // Emotional responses tracking
  const [emotionalResponses, setEmotionalResponses] = useState([])

  // Popup state
  const [showEmotionalPopup, setShowEmotionalPopup] = useState(false)
  const [popupTrigger, setPopupTrigger] = useState(null)

  // Alert state
  const [riskAlert, setRiskAlert] = useState(null)

  // Update activity time every minute
  useEffect(() => {
    const interval = setInterval(() => {
      setSessionData(prev => ({
        ...prev,
        totalActiveTime: Math.floor((new Date() - prev.startTime) / 1000 / 60), // minutes
        lastActivityTime: new Date()
      }))
    }, 60000) // every minute

    return () => clearInterval(interval)
  }, [])

  // Random popup timer (1 minute for testing)
  useEffect(() => {
    const randomDelay = 60 * 1000 // 1 minute in ms
    
    const timeout = setTimeout(() => {
      if (!showEmotionalPopup) {
        setPopupTrigger('random')
        setShowEmotionalPopup(true)
      }
    }, randomDelay)

    return () => clearTimeout(timeout)
  }, [showEmotionalPopup])

  // Register a trade
  const registerTrade = useCallback((tradeData) => {
    const trade = {
      ...tradeData,
      timestamp: new Date(),
      sessionTime: Math.floor((new Date() - sessionStart) / 1000 / 60)
    }
    
    setTradesHistory(prev => [...prev, trade])

    // Check for risk behavior (5+ trades in 30 minutes)
    const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000)
    const recentTrades = [...tradesHistory, trade].filter(t => 
      new Date(t.timestamp) > thirtyMinutesAgo
    )

    if (recentTrades.length >= 5) {
      setRiskAlert({
        type: 'overtrading',
        message: 'Has realizado 5 o más operaciones en los últimos 30 minutos. Considera tomar un descanso.',
        timestamp: new Date()
      })
    }

    // Trigger emotional popup after trade
    setPopupTrigger('post-trade')
    setShowEmotionalPopup(true)
  }, [tradesHistory, sessionStart])

  // Register emotional response
  const registerEmotionalResponse = useCallback((response) => {
    const emotionalData = {
      ...response,
      timestamp: new Date(),
      trigger: popupTrigger,
      sessionTime: Math.floor((new Date() - sessionStart) / 1000 / 60)
    }
    
    setEmotionalResponses(prev => [...prev, emotionalData])
    setShowEmotionalPopup(false)
    setPopupTrigger(null)
  }, [popupTrigger, sessionStart])

  // Dismiss popup
  const dismissPopup = useCallback(() => {
    setShowEmotionalPopup(false)
    setPopupTrigger(null)
  }, [])

  // Dismiss alert
  const dismissAlert = useCallback(() => {
    setRiskAlert(null)
  }, [])

  // Get report data
  const getReportData = useCallback(() => {
    const now = new Date()
    const sessionDuration = Math.floor((now - sessionStart) / 1000 / 60) // minutes

    // Calculate trades statistics
    const totalTrades = tradesHistory.length
    const buyTrades = tradesHistory.filter(t => t.mode === 'buy').length
    const sellTrades = tradesHistory.filter(t => t.mode === 'sell').length

    // Calculate average emotional states
    const avgStress = emotionalResponses.length > 0
      ? emotionalResponses.reduce((sum, r) => sum + (r.stress || 0), 0) / emotionalResponses.length
      : null

    const avgConfidence = emotionalResponses.length > 0
      ? emotionalResponses.reduce((sum, r) => sum + (r.confidence || 0), 0) / emotionalResponses.length
      : null

    const avgFatigue = emotionalResponses.length > 0
      ? emotionalResponses.reduce((sum, r) => sum + (r.fatigue || 0), 0) / emotionalResponses.length
      : null

    // Detect patterns
    const patterns = []
    
    // Pattern: High frequency trading
    if (totalTrades > 10 && sessionDuration < 60) {
      patterns.push({
        type: 'overtrading',
        severity: 'high',
        description: 'Frecuencia de trading muy alta en corto período'
      })
    }

    // Pattern: High stress correlation
    if (avgStress && avgStress > 6) {
      patterns.push({
        type: 'high-stress',
        severity: 'high',
        description: 'Niveles de estrés consistentemente altos'
      })
    }

    // Pattern: Low confidence
    if (avgConfidence && avgConfidence < 7) {
      patterns.push({
        type: 'low-confidence',
        severity: 'high',
        description: 'Baja confianza en las operaciones'
      })
    }

    // Pattern: High fatigue
    if (avgFatigue && avgFatigue > 6) {
      patterns.push({
        type: 'high-fatigue',
        severity: 'high',
        description: 'Niveles de fatiga elevados que pueden afectar decisiones'
      })
    }

    // Generate recommendations
    const recommendations = []

    if (patterns.some(p => p.type === 'overtrading')) {
      recommendations.push({
        priority: 'high',
        title: 'Reduce la frecuencia de operaciones',
        description: 'Estás operando con demasiada frecuencia. Establece un límite diario de operaciones y respétalo.',
        action: 'Considera implementar una regla de máximo 3-5 trades por sesión.'
      })
    }

    if (patterns.some(p => p.type === 'high-stress')) {
      recommendations.push({
        priority: 'high',
        title: 'Gestión del estrés',
        description: 'Tus niveles de estrés son peligrosamente altos. El estrés conduce a decisiones impulsivas.',
        action: 'Pausa las operaciones. Toma un descanso de 30 minutos. Considera reducir el tamaño de tus posiciones.'
      })
    }

    if (patterns.some(p => p.type === 'low-confidence')) {
      recommendations.push({
        priority: 'high',
        title: 'Fortalece tu estrategia',
        description: 'Tus respuestas indican baja confianza en tus decisiones. Con dinero real, esto es crítico.',
        action: 'Detén operaciones reales. Revisa tu plan de trading y opera en cuenta demo hasta recuperar confianza (7+/10).'
      })
    }

    if (patterns.some(p => p.type === 'high-fatigue')) {
      recommendations.push({
        priority: 'high',
        title: 'Descanso necesario',
        description: 'Estás operando con niveles de fatiga peligrosos. La fatiga nubla el juicio.',
        action: 'CIERRA la plataforma ahora. No operes más hoy. La fatiga causa errores costosos.'
      })
    }

    if (sessionDuration > 120 && totalTrades > 0) {
      recommendations.push({
        priority: 'medium',
        title: 'Sesiones más cortas',
        description: 'Sesiones largas pueden llevar a decisiones impulsivas.',
        action: 'Limita tus sesiones de trading a 60-90 minutos máximo.'
      })
    }

    if (recommendations.length === 0) {
      recommendations.push({
        priority: 'low',
        title: 'Buen trabajo',
        description: 'No se han detectado patrones de riesgo significativos.',
        action: 'Continúa manteniendo disciplina y registrando tus estados emocionales.'
      })
    }

    return {
      session: {
        start: sessionStart,
        duration: sessionDuration,
        totalActiveTime: sessionData.totalActiveTime
      },
      trades: {
        total: totalTrades,
        buy: buyTrades,
        sell: sellTrades,
        history: tradesHistory
      },
      emotional: {
        totalResponses: emotionalResponses.length,
        avgStress,
        avgConfidence,
        avgFatigue,
        responses: emotionalResponses
      },
      patterns,
      recommendations
    }
  }, [sessionStart, sessionData, tradesHistory, emotionalResponses])

  const value = {
    sessionData,
    tradesHistory,
    emotionalResponses,
    showEmotionalPopup,
    popupTrigger,
    riskAlert,
    registerTrade,
    registerEmotionalResponse,
    dismissPopup,
    dismissAlert,
    getReportData
  }

  return (
    <PsychologicalTrackingContext.Provider value={value}>
      {children}
    </PsychologicalTrackingContext.Provider>
  )
}

