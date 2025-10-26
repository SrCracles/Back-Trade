/**
 * Trade Analysis Service
 * Servicio para calcular análisis detallados de trades y generar escenarios alternativos
 */

/**
 * Calcula el análisis completo de un trade
 * @param {Object} trade - Objeto con información del trade
 * @returns {Object} Análisis detallado del trade
 */
function calculateTradeAnalysis(trade) {
  const {
    entryPrice,
    exitPrice,
    quantity,
    commission,
    entryDate,
    exitDate,
    symbol
  } = trade;

  // Cálculos básicos
  const entryValue = entryPrice * quantity;
  const exitValue = exitPrice * quantity;
  const grossPL = exitValue - entryValue;
  const netPL = grossPL - commission;
  const plPercentage = (netPL / entryValue) * 100;

  // Duración
  const entryDateTime = new Date(entryDate);
  const exitDateTime = new Date(exitDate);
  const durationMs = exitDateTime - entryDateTime;
  const durationDays = Math.floor(durationMs / (1000 * 60 * 60 * 24));
  const durationHours = Math.floor((durationMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const totalDurationDays = durationDays + (durationHours / 24);

  // Benchmark (S&P 500 promedio: ~10% anual = ~0.027% diario)
  const benchmarkDailyReturn = 0.00027;
  const benchmarkReturn = entryValue * benchmarkDailyReturn * totalDurationDays;
  const benchmarkPercentage = (benchmarkReturn / entryValue) * 100;
  const vsVsBenchmark = netPL - benchmarkReturn;

  // Métricas de riesgo
  // Drawdown simulado basado en el movimiento del precio
  const priceChange = Math.abs((exitPrice - entryPrice) / entryPrice);
  const maxDrawdown = Math.abs(Math.min(0, grossPL)) || (entryValue * priceChange * 0.3);
  const riskRewardRatio = maxDrawdown > 0 ? Math.abs(netPL / maxDrawdown) : 0;

  // Retorno anualizado
  const annualizedReturn = (plPercentage / totalDurationDays) * 365;

  // Ratio de Sharpe simplificado (asumiendo tasa libre de riesgo del 3%)
  const riskFreeRate = 3;
  const sharpeRatio = (annualizedReturn - riskFreeRate) / (priceChange * 100 || 1);

  return {
    entryValue,
    exitValue,
    grossPL,
    netPL,
    plPercentage,
    durationDays,
    durationHours,
    totalDurationDays,
    benchmarkReturn,
    benchmarkPercentage,
    vsVsBenchmark,
    maxDrawdown,
    riskRewardRatio,
    annualizedReturn,
    sharpeRatio,
    commissionPercentage: (commission / entryValue) * 100
  };
}

/**
 * Genera escenarios alternativos para un trade
 * @param {Object} trade - Objeto con información del trade
 * @returns {Array} Array de escenarios alternativos
 */
function generateAlternativeScenarios(trade) {
  const {
    entryPrice,
    exitPrice,
    quantity,
    commission,
    entryDate,
    exitDate
  } = trade;

  const entryValue = entryPrice * quantity;
  const scenarios = [];

  // Escenario 1: Mantener más tiempo (+2 días)
  // Simulamos diferentes resultados según el tipo de activo
  const longerHoldMultiplier = 1.015; // +1.5%
  const longerHoldPrice = exitPrice * longerHoldMultiplier;
  const longerHoldExitValue = longerHoldPrice * quantity;
  const longerHoldPL = longerHoldExitValue - entryValue - commission;
  const longerHoldPercentage = (longerHoldPL / entryValue) * 100;

  scenarios.push({
    id: 'longer-hold',
    name: 'Mantener Posición +2 días',
    description: 'Si hubieras mantenido la posición 2 días más',
    type: 'duration',
    params: {
      exitPrice: longerHoldPrice,
      quantity: quantity,
      duration: 'extra 2d',
      commission: commission
    },
    results: {
      pl: longerHoldPL,
      percentage: longerHoldPercentage,
      exitValue: longerHoldExitValue,
      commission: commission
    }
  });

  // Escenario 2: Stop-loss estricto (-2%)
  const strictStopLossPrice = entryPrice * 0.98;
  const strictStopLossExitValue = strictStopLossPrice * quantity;
  const strictStopLossPL = strictStopLossExitValue - entryValue - commission;
  const strictStopLossPercentage = (strictStopLossPL / entryValue) * 100;

  scenarios.push({
    id: 'strict-stop-loss',
    name: 'Stop-Loss Estricto (-2%)',
    description: 'Con un stop-loss más conservador en -2%',
    type: 'risk-management',
    params: {
      exitPrice: strictStopLossPrice,
      quantity: quantity,
      stopLoss: '-2%',
      commission: commission
    },
    results: {
      pl: strictStopLossPL,
      percentage: strictStopLossPercentage,
      exitValue: strictStopLossExitValue,
      commission: commission
    }
  });

  // Escenario 3: Take-profit mayor (+3%)
  const higherTakeProfitPrice = entryPrice * 1.03;
  const higherTakeProfitExitValue = higherTakeProfitPrice * quantity;
  const higherTakeProfitPL = higherTakeProfitExitValue - entryValue - commission;
  const higherTakeProfitPercentage = (higherTakeProfitPL / entryValue) * 100;

  scenarios.push({
    id: 'higher-take-profit',
    name: 'Take-Profit Mayor (+3%)',
    description: 'Con un objetivo de ganancia más ambicioso',
    type: 'risk-management',
    params: {
      exitPrice: higherTakeProfitPrice,
      quantity: quantity,
      takeProfit: '+3%',
      commission: commission
    },
    results: {
      pl: higherTakeProfitPL,
      percentage: higherTakeProfitPercentage,
      exitValue: higherTakeProfitExitValue,
      commission: commission
    }
  });

  // Escenario 4: Posición reducida (50%)
  const smallerQuantity = quantity * 0.5;
  const smallerEntryValue = entryPrice * smallerQuantity;
  const smallerExitValue = exitPrice * smallerQuantity;
  const smallerCommission = commission * 0.5;
  const smallerPL = smallerExitValue - smallerEntryValue - smallerCommission;
  const smallerPercentage = (smallerPL / smallerEntryValue) * 100;

  scenarios.push({
    id: 'smaller-position',
    name: 'Posición Reducida (50%)',
    description: 'Con la mitad del tamaño de posición',
    type: 'position-sizing',
    params: {
      exitPrice: exitPrice,
      quantity: smallerQuantity,
      size: '50% del original',
      commission: smallerCommission
    },
    results: {
      pl: smallerPL,
      percentage: smallerPercentage,
      exitValue: smallerExitValue,
      commission: smallerCommission
    }
  });

  // Escenario 5: Posición aumentada (150%)
  const largerQuantity = quantity * 1.5;
  const largerEntryValue = entryPrice * largerQuantity;
  const largerExitValue = exitPrice * largerQuantity;
  const largerCommission = commission * 1.5;
  const largerPL = largerExitValue - largerEntryValue - largerCommission;
  const largerPercentage = (largerPL / largerEntryValue) * 100;

  scenarios.push({
    id: 'larger-position',
    name: 'Posición Aumentada (150%)',
    description: 'Con 50% más de tamaño de posición',
    type: 'position-sizing',
    params: {
      exitPrice: exitPrice,
      quantity: largerQuantity,
      size: '150% del original',
      commission: largerCommission
    },
    results: {
      pl: largerPL,
      percentage: largerPercentage,
      exitValue: largerExitValue,
      commission: largerCommission
    }
  });

  // Escenario 6: Stop-loss amplio (-5%)
  const wideStopLossPrice = entryPrice * 0.95;
  const wideStopLossExitValue = wideStopLossPrice * quantity;
  const wideStopLossPL = wideStopLossExitValue - entryValue - commission;
  const wideStopLossPercentage = (wideStopLossPL / entryValue) * 100;

  scenarios.push({
    id: 'wide-stop-loss',
    name: 'Stop-Loss Amplio (-5%)',
    description: 'Con un stop-loss más permisivo en -5%',
    type: 'risk-management',
    params: {
      exitPrice: wideStopLossPrice,
      quantity: quantity,
      stopLoss: '-5%',
      commission: commission
    },
    results: {
      pl: wideStopLossPL,
      percentage: wideStopLossPercentage,
      exitValue: wideStopLossExitValue,
      commission: commission
    }
  });

  // Escenario 7: Exit anticipado (mitad de duración)
  const midPrice = entryPrice + ((exitPrice - entryPrice) / 2);
  const earlyExitValue = midPrice * quantity;
  const earlyExitPL = earlyExitValue - entryValue - commission;
  const earlyExitPercentage = (earlyExitPL / entryValue) * 100;

  scenarios.push({
    id: 'early-exit',
    name: 'Salida Anticipada (50% duración)',
    description: 'Si hubieras salido a mitad del tiempo',
    type: 'duration',
    params: {
      exitPrice: midPrice,
      quantity: quantity,
      duration: '50% de duración',
      commission: commission
    },
    results: {
      pl: earlyExitPL,
      percentage: earlyExitPercentage,
      exitValue: earlyExitValue,
      commission: commission
    }
  });

  return scenarios;
}

/**
 * Compara un trade con estadísticas históricas del símbolo
 * @param {Object} trade - Trade a analizar
 * @param {Object} historicalStats - Estadísticas históricas del símbolo
 * @returns {Object} Comparación con histórico
 */
function compareWithHistorical(trade, historicalStats = null) {
  const analysis = calculateTradeAnalysis(trade);

  // Si no hay estadísticas históricas, usar valores simulados
  const avgReturn = historicalStats?.avgReturn || 0.5; // 0.5% promedio
  const avgDuration = historicalStats?.avgDuration || 5; // 5 días promedio
  const winRate = historicalStats?.winRate || 0.55; // 55% win rate
  const avgWin = historicalStats?.avgWin || 2.0; // 2% ganancia promedio
  const avgLoss = historicalStats?.avgLoss || -1.5; // -1.5% pérdida promedia

  return {
    trade: analysis,
    historical: {
      avgReturn,
      avgDuration,
      winRate,
      avgWin,
      avgLoss
    },
    comparison: {
      returnVsAvg: analysis.plPercentage - avgReturn,
      durationVsAvg: analysis.totalDurationDays - avgDuration,
      isWin: analysis.netPL > 0,
      betterThanAvgWin: analysis.netPL > 0 && analysis.plPercentage > avgWin,
      betterThanAvgLoss: analysis.netPL < 0 && analysis.plPercentage > avgLoss
    }
  };
}

export {
  calculateTradeAnalysis,
  generateAlternativeScenarios,
  compareWithHistorical
};

