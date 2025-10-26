import express from 'express';
import {
  calculateTradeAnalysis,
  generateAlternativeScenarios,
  compareWithHistorical
} from '../services/tradeAnalysisService.js';

const router = express.Router();

/**
 * POST /api/trade-analysis/analyze
 * Analiza un trade individual
 */
router.post('/analyze', (req, res) => {
  try {
    const trade = req.body;

    // Validar que el trade tenga los datos necesarios
    if (!trade.entryPrice || !trade.exitPrice || !trade.quantity) {
      return res.status(400).json({
        error: 'Missing required trade data',
        required: ['entryPrice', 'exitPrice', 'quantity', 'commission', 'entryDate', 'exitDate']
      });
    }

    const analysis = calculateTradeAnalysis(trade);

    res.json({
      success: true,
      trade: trade,
      analysis: analysis
    });
  } catch (error) {
    console.error('Error analyzing trade:', error);
    res.status(500).json({
      error: 'Error analyzing trade',
      message: error.message
    });
  }
});

/**
 * POST /api/trade-analysis/scenarios
 * Genera escenarios alternativos para un trade
 */
router.post('/scenarios', (req, res) => {
  try {
    const trade = req.body;

    // Validar que el trade tenga los datos necesarios
    if (!trade.entryPrice || !trade.exitPrice || !trade.quantity) {
      return res.status(400).json({
        error: 'Missing required trade data',
        required: ['entryPrice', 'exitPrice', 'quantity', 'commission']
      });
    }

    const scenarios = generateAlternativeScenarios(trade);

    res.json({
      success: true,
      trade: trade,
      scenarios: scenarios
    });
  } catch (error) {
    console.error('Error generating scenarios:', error);
    res.status(500).json({
      error: 'Error generating scenarios',
      message: error.message
    });
  }
});

/**
 * POST /api/trade-analysis/compare
 * Compara un trade con estadísticas históricas
 */
router.post('/compare', (req, res) => {
  try {
    const { trade, historicalStats } = req.body;

    // Validar que el trade tenga los datos necesarios
    if (!trade || !trade.entryPrice || !trade.exitPrice || !trade.quantity) {
      return res.status(400).json({
        error: 'Missing required trade data',
        required: ['trade object with: entryPrice, exitPrice, quantity, commission, entryDate, exitDate']
      });
    }

    const comparison = compareWithHistorical(trade, historicalStats);

    res.json({
      success: true,
      comparison: comparison
    });
  } catch (error) {
    console.error('Error comparing with historical:', error);
    res.status(500).json({
      error: 'Error comparing with historical data',
      message: error.message
    });
  }
});

/**
 * POST /api/trade-analysis/full
 * Análisis completo: trade analysis + scenarios + comparison
 */
router.post('/full', (req, res) => {
  try {
    const { trade, historicalStats } = req.body;

    // Validar que el trade tenga los datos necesarios
    if (!trade || !trade.entryPrice || !trade.exitPrice || !trade.quantity) {
      return res.status(400).json({
        error: 'Missing required trade data',
        required: ['trade object with: entryPrice, exitPrice, quantity, commission, entryDate, exitDate']
      });
    }

    const analysis = calculateTradeAnalysis(trade);
    const scenarios = generateAlternativeScenarios(trade);
    const comparison = compareWithHistorical(trade, historicalStats);

    res.json({
      success: true,
      trade: trade,
      analysis: analysis,
      scenarios: scenarios,
      comparison: comparison
    });
  } catch (error) {
    console.error('Error performing full analysis:', error);
    res.status(500).json({
      error: 'Error performing full analysis',
      message: error.message
    });
  }
});

/**
 * POST /api/trade-analysis/batch
 * Analiza múltiples trades a la vez
 */
router.post('/batch', (req, res) => {
  try {
    const { trades } = req.body;

    if (!trades || !Array.isArray(trades) || trades.length === 0) {
      return res.status(400).json({
        error: 'Invalid trades array',
        message: 'Please provide an array of trades'
      });
    }

    const results = trades.map(trade => {
      try {
        const analysis = calculateTradeAnalysis(trade);
        return {
          trade: trade,
          analysis: analysis,
          success: true
        };
      } catch (error) {
        return {
          trade: trade,
          error: error.message,
          success: false
        };
      }
    });

    // Calcular estadísticas agregadas
    const successfulAnalyses = results.filter(r => r.success);
    const totalPL = successfulAnalyses.reduce((sum, r) => sum + r.analysis.netPL, 0);
    const avgReturn = successfulAnalyses.length > 0
      ? successfulAnalyses.reduce((sum, r) => sum + r.analysis.plPercentage, 0) / successfulAnalyses.length
      : 0;
    const winRate = successfulAnalyses.length > 0
      ? successfulAnalyses.filter(r => r.analysis.netPL > 0).length / successfulAnalyses.length
      : 0;

    res.json({
      success: true,
      results: results,
      summary: {
        totalTrades: trades.length,
        successfulAnalyses: successfulAnalyses.length,
        totalPL: totalPL,
        avgReturn: avgReturn,
        winRate: winRate
      }
    });
  } catch (error) {
    console.error('Error performing batch analysis:', error);
    res.status(500).json({
      error: 'Error performing batch analysis',
      message: error.message
    });
  }
});

export default router;

