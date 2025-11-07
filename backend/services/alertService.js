/**
 * Alert Service
 * Servicio para gestionar alertas de trading personalizadas
 */

// Almacenamiento en memoria (en producción usarías una base de datos)
let alerts = [];
let nextId = 1;
let initialized = false;

/**
 * Inicializa alertas de ejemplo
 */
function initializeExampleAlerts() {
  if (initialized || alerts.length > 0) {
    return;
  }

  const exampleAlerts = [
    {
      symbol: 'BTC',
      type: 'price',
      condition: 'above',
      value: 50000,
      enabled: true,
      description: 'BTC alcanza $50,000',
      notificationMethod: 'push'
    },
    {
      symbol: 'AAPL',
      type: 'price',
      condition: 'below',
      value: 170,
      enabled: true,
      description: 'AAPL cae por debajo de $170',
      notificationMethod: 'push'
    },
    {
      symbol: 'ETH',
      type: 'price',
      condition: 'above',
      value: 2500,
      enabled: true,
      description: 'ETH supera $2,500',
      notificationMethod: 'push'
    },
    {
      symbol: 'TSLA',
      type: 'price',
      condition: 'above',
      value: 250,
      enabled: false,
      description: 'TSLA supera $250',
      notificationMethod: 'push'
    },
    {
      symbol: 'EURUSD',
      type: 'price',
      condition: 'above',
      value: 1.09,
      enabled: true,
      description: 'EURUSD rompe resistencia en 1.09',
      notificationMethod: 'push'
    },
    {
      symbol: 'MSFT',
      type: 'price',
      condition: 'below',
      value: 375,
      enabled: true,
      description: 'MSFT cae por debajo de $375',
      notificationMethod: 'push'
    }
  ];

  exampleAlerts.forEach(alertData => {
    const alert = {
      id: nextId++,
      symbol: alertData.symbol,
      type: alertData.type,
      condition: alertData.condition,
      value: alertData.value,
      enabled: alertData.enabled,
      description: alertData.description,
      notificationMethod: alertData.notificationMethod,
      createdAt: new Date().toISOString(),
      triggeredAt: null,
      triggered: false
    };
    alerts.push(alert);
  });

  initialized = true;
  console.log(`Initialized ${exampleAlerts.length} example alerts`);
}

/**
 * Crea una nueva alerta
 * @param {Object} alertData - Datos de la alerta
 * @returns {Object} Alerta creada
 */
export function createAlert(alertData) {
  // Debug: Log received data
  console.log('createAlert received:', JSON.stringify(alertData, null, 2));
  
  const {
    symbol,
    type,
    condition,
    value,
    enabled = true,
    description,
    notificationMethod = 'push'
  } = alertData;

  // Validaciones más detalladas
  const missingFields = [];
  if (!symbol || (typeof symbol === 'string' && symbol.trim() === '')) missingFields.push('symbol');
  if (!type || (typeof type === 'string' && type.trim() === '')) missingFields.push('type');
  if (!condition || (typeof condition === 'string' && condition.trim() === '')) missingFields.push('condition');
  
  // Validar value - puede ser número o string numérico
  const numValue = typeof value === 'string' ? parseFloat(value) : value;
  if (value === undefined || value === null || value === '' || isNaN(numValue)) {
    missingFields.push('value');
  }
  
  if (missingFields.length > 0) {
    console.error('Missing fields:', missingFields);
    console.error('Received data:', alertData);
    throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
  }

  const alert = {
    id: nextId++,
    symbol: String(symbol).toUpperCase().trim(),
    type: String(type).trim(), // 'price', 'volume', 'technical', 'risk'
    condition: String(condition).trim(), // 'above', 'below', 'equals', 'percent_change'
    value: parseFloat(numValue),
    enabled,
    description: description || `${symbol} ${condition} ${value}`,
    notificationMethod,
    createdAt: new Date().toISOString(),
    triggeredAt: null,
    triggered: false
  };

  alerts.push(alert);
  return alert;
}

/**
 * Obtiene todas las alertas
 * @param {Object} filters - Filtros opcionales
 * @returns {Array} Lista de alertas
 */
export function getAlerts(filters = {}) {
  // Inicializar alertas de ejemplo si no hay ninguna
  if (alerts.length === 0) {
    initializeExampleAlerts();
  }
  
  let result = [...alerts];

  // Filtrar por símbolo
  if (filters.symbol) {
    result = result.filter(a => a.symbol === filters.symbol.toUpperCase());
  }

  // Filtrar por tipo
  if (filters.type) {
    result = result.filter(a => a.type === filters.type);
  }

  // Filtrar por estado
  if (filters.enabled !== undefined) {
    result = result.filter(a => a.enabled === filters.enabled);
  }

  // Filtrar por triggered
  if (filters.triggered !== undefined) {
    result = result.filter(a => a.triggered === filters.triggered);
  }

  return result;
}

/**
 * Obtiene una alerta por ID
 * @param {number} id - ID de la alerta
 * @returns {Object|null} Alerta encontrada
 */
export function getAlertById(id) {
  return alerts.find(a => a.id === parseInt(id)) || null;
}

/**
 * Actualiza una alerta
 * @param {number} id - ID de la alerta
 * @param {Object} updates - Campos a actualizar
 * @returns {Object|null} Alerta actualizada
 */
export function updateAlert(id, updates) {
  const alert = getAlertById(id);
  if (!alert) {
    return null;
  }

  // Actualizar campos permitidos
  const allowedFields = ['symbol', 'type', 'condition', 'value', 'enabled', 'description', 'notificationMethod'];
  allowedFields.forEach(field => {
    if (updates[field] !== undefined) {
      alert[field] = updates[field];
    }
  });

  alert.updatedAt = new Date().toISOString();
  return alert;
}

/**
 * Elimina una alerta
 * @param {number} id - ID de la alerta
 * @returns {boolean} True si se eliminó, false si no existe
 */
export function deleteAlert(id) {
  const index = alerts.findIndex(a => a.id === parseInt(id));
  if (index === -1) {
    return false;
  }

  alerts.splice(index, 1);
  return true;
}

/**
 * Verifica si una alerta debe dispararse basándose en el precio actual
 * @param {Object} alert - Alerta a verificar
 * @param {number} currentPrice - Precio actual del símbolo
 * @returns {boolean} True si la alerta debe dispararse
 */
export function checkAlertTrigger(alert, currentPrice) {
  if (!alert.enabled || alert.triggered) {
    return false;
  }

  const { condition, value } = alert;

  switch (condition) {
    case 'above':
      return currentPrice > value;
    case 'below':
      return currentPrice < value;
    case 'equals':
      return Math.abs(currentPrice - value) < 0.01; // Tolerancia para comparación de floats
    default:
      return false;
  }
}

/**
 * Marca una alerta como disparada
 * @param {number} id - ID de la alerta
 * @returns {Object|null} Alerta actualizada
 */
export function markAlertAsTriggered(id) {
  const alert = getAlertById(id);
  if (!alert) {
    return null;
  }

  alert.triggered = true;
  alert.triggeredAt = new Date().toISOString();
  return alert;
}

/**
 * Resetea una alerta (la marca como no disparada)
 * @param {number} id - ID de la alerta
 * @returns {Object|null} Alerta actualizada
 */
export function resetAlert(id) {
  const alert = getAlertById(id);
  if (!alert) {
    return null;
  }

  alert.triggered = false;
  alert.triggeredAt = null;
  return alert;
}

