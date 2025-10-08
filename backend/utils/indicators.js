// Technical Indicators Calculations

// RSI (Relative Strength Index)
export function calculateRSI(prices, period = 14) {
  if (prices.length < period + 1) return [];

  const rsi = [];
  let gains = 0;
  let losses = 0;

  // Calculate initial average gain/loss
  for (let i = 1; i <= period; i++) {
    const change = prices[i] - prices[i - 1];
    if (change > 0) gains += change;
    else losses -= change;
  }

  let avgGain = gains / period;
  let avgLoss = losses / period;
  let rs = avgGain / avgLoss;
  rsi.push(100 - (100 / (1 + rs)));

  // Calculate RSI for remaining prices
  for (let i = period + 1; i < prices.length; i++) {
    const change = prices[i] - prices[i - 1];
    const gain = change > 0 ? change : 0;
    const loss = change < 0 ? -change : 0;

    avgGain = (avgGain * (period - 1) + gain) / period;
    avgLoss = (avgLoss * (period - 1) + loss) / period;

    rs = avgGain / avgLoss;
    rsi.push(100 - (100 / (1 + rs)));
  }

  return rsi;
}

// MACD (Moving Average Convergence Divergence)
export function calculateMACD(prices, fastPeriod = 12, slowPeriod = 26, signalPeriod = 9) {
  const emaFast = calculateEMA(prices, fastPeriod);
  const emaSlow = calculateEMA(prices, slowPeriod);

  if (emaFast.length === 0 || emaSlow.length === 0) return { macd: [], signal: [], histogram: [] };

  const macdLine = [];
  const startIndex = slowPeriod - fastPeriod;

  for (let i = 0; i < emaSlow.length; i++) {
    macdLine.push(emaFast[i + startIndex] - emaSlow[i]);
  }

  const signalLine = calculateEMA(macdLine, signalPeriod);
  const histogram = [];

  const signalStartIndex = signalPeriod - 1;
  for (let i = 0; i < signalLine.length; i++) {
    histogram.push(macdLine[i + signalStartIndex] - signalLine[i]);
  }

  return {
    macd: macdLine,
    signal: signalLine,
    histogram: histogram
  };
}

// SMA (Simple Moving Average)
export function calculateSMA(prices, period) {
  if (prices.length < period) return [];

  const sma = [];
  for (let i = period - 1; i < prices.length; i++) {
    let sum = 0;
    for (let j = 0; j < period; j++) {
      sum += prices[i - j];
    }
    sma.push(sum / period);
  }

  return sma;
}

// EMA (Exponential Moving Average)
export function calculateEMA(prices, period) {
  if (prices.length < period) return [];

  const ema = [];
  const multiplier = 2 / (period + 1);

  // Calculate initial SMA
  let sum = 0;
  for (let i = 0; i < period; i++) {
    sum += prices[i];
  }
  ema.push(sum / period);

  // Calculate EMA
  for (let i = period; i < prices.length; i++) {
    const currentEma = (prices[i] - ema[ema.length - 1]) * multiplier + ema[ema.length - 1];
    ema.push(currentEma);
  }

  return ema;
}

