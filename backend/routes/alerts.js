import express from 'express';
import {
  createAlert,
  getAlerts,
  getAlertById,
  updateAlert,
  deleteAlert,
  markAlertAsTriggered,
  resetAlert
} from '../services/alertService.js';

const router = express.Router();

/**
 * GET /api/alerts
 * Obtiene todas las alertas (con filtros opcionales)
 */
router.get('/', (req, res) => {
  try {
    const filters = {
      symbol: req.query.symbol,
      type: req.query.type,
      enabled: req.query.enabled !== undefined ? req.query.enabled === 'true' : undefined,
      triggered: req.query.triggered !== undefined ? req.query.triggered === 'true' : undefined
    };

    // Eliminar filtros undefined
    Object.keys(filters).forEach(key => {
      if (filters[key] === undefined) {
        delete filters[key];
      }
    });

    const alerts = getAlerts(filters);
    res.json({
      success: true,
      alerts,
      count: alerts.length
    });
  } catch (error) {
    console.error('Error getting alerts:', error);
    res.status(500).json({
      error: 'Error getting alerts',
      message: error.message
    });
  }
});

/**
 * GET /api/alerts/:id
 * Obtiene una alerta por ID
 */
router.get('/:id', (req, res) => {
  try {
    const alert = getAlertById(req.params.id);
    
    if (!alert) {
      return res.status(404).json({
        error: 'Alert not found',
        message: `Alert with id ${req.params.id} does not exist`
      });
    }

    res.json({
      success: true,
      alert
    });
  } catch (error) {
    console.error('Error getting alert:', error);
    res.status(500).json({
      error: 'Error getting alert',
      message: error.message
    });
  }
});

/**
 * POST /api/alerts
 * Crea una nueva alerta
 */
router.post('/', (req, res) => {
  try {
    // Debug: Log incoming data
    console.log('Received alert data:', JSON.stringify(req.body, null, 2));
    
    const alert = createAlert(req.body);
    res.status(201).json({
      success: true,
      alert
    });
  } catch (error) {
    console.error('Error creating alert:', error);
    console.error('Request body:', req.body);
    res.status(400).json({
      error: 'Error creating alert',
      message: error.message
    });
  }
});

/**
 * PUT /api/alerts/:id
 * Actualiza una alerta
 */
router.put('/:id', (req, res) => {
  try {
    const alert = updateAlert(req.params.id, req.body);
    
    if (!alert) {
      return res.status(404).json({
        error: 'Alert not found',
        message: `Alert with id ${req.params.id} does not exist`
      });
    }

    res.json({
      success: true,
      alert
    });
  } catch (error) {
    console.error('Error updating alert:', error);
    res.status(500).json({
      error: 'Error updating alert',
      message: error.message
    });
  }
});

/**
 * DELETE /api/alerts/:id
 * Elimina una alerta
 */
router.delete('/:id', (req, res) => {
  try {
    const deleted = deleteAlert(req.params.id);
    
    if (!deleted) {
      return res.status(404).json({
        error: 'Alert not found',
        message: `Alert with id ${req.params.id} does not exist`
      });
    }

    res.json({
      success: true,
      message: 'Alert deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting alert:', error);
    res.status(500).json({
      error: 'Error deleting alert',
      message: error.message
    });
  }
});

/**
 * POST /api/alerts/:id/trigger
 * Marca una alerta como disparada
 */
router.post('/:id/trigger', (req, res) => {
  try {
    const alert = markAlertAsTriggered(req.params.id);
    
    if (!alert) {
      return res.status(404).json({
        error: 'Alert not found',
        message: `Alert with id ${req.params.id} does not exist`
      });
    }

    res.json({
      success: true,
      alert
    });
  } catch (error) {
    console.error('Error triggering alert:', error);
    res.status(500).json({
      error: 'Error triggering alert',
      message: error.message
    });
  }
});

/**
 * POST /api/alerts/:id/reset
 * Resetea una alerta (la marca como no disparada)
 */
router.post('/:id/reset', (req, res) => {
  try {
    const alert = resetAlert(req.params.id);
    
    if (!alert) {
      return res.status(404).json({
        error: 'Alert not found',
        message: `Alert with id ${req.params.id} does not exist`
      });
    }

    res.json({
      success: true,
      alert
    });
  } catch (error) {
    console.error('Error resetting alert:', error);
    res.status(500).json({
      error: 'Error resetting alert',
      message: error.message
    });
  }
});

export default router;

