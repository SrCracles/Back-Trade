// Market Data Service - Solo datos simulados
import { calculateRSI, calculateMACD, calculateSMA, calculateEMA } from '../utils/indicators.js';
import { getSymbolPrice } from '../data/markets.js';

// Generar precio aleatorio con volatilidad
function generatePrice(basePrice, volatility) {
  const change = (Math.random() - 0.5) * 2 * volatility;
  return basePrice * (1 + change);
}

// Generar volumen realista
function generateVolume(baseVolume = 50000000) {
  return Math.floor(baseVolume * (0.5 + Math.random()));
}

// Generar datos OHLC
function generateOHLC(previousClose, volatility) {
  const open = generatePrice(previousClose, volatility * 0.5);
  const close = generatePrice(open, volatility);
  const high = Math.max(open, close) * (1 + Math.random() * volatility);
  const low = Math.min(open, close) * (1 - Math.random() * volatility);
  
  return {
    open: parseFloat(open.toFixed(2)),
    high: parseFloat(high.toFixed(2)),
    low: parseFloat(low.toFixed(2)),
    close: parseFloat(close.toFixed(2)),
    volume: generateVolume()
  };
}

// Generar timestamp (en formato YYYY-MM-DD para Lightweight Charts)
function generateTimestamp(index, timeframe) {
  // Para evitar duplicados, cada barra será un día diferente
  // independientemente del timeframe
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  // Retroceder 'index' días desde hoy
  const timestamp = new Date(today.getTime() - (index * 24 * 60 * 60 * 1000));
  
  return timestamp.toISOString().split('T')[0];
}

// Get current quote
export async function getQuote(symbol) {
  console.log(`[MOCK] Generating quote for ${symbol}`);
  
  const symbolUpper = symbol.toUpperCase();
  const config = getSymbolPrice(symbolUpper);
  
  const previousClose = config.base;
  const currentPrice = generatePrice(previousClose, config.volatility * 0.3);
  const change = currentPrice - previousClose;
  const changePercent = (change / previousClose) * 100;
  
  const ohlc = generateOHLC(previousClose, config.volatility);
  
  return {
    symbol: symbolUpper,
    price: parseFloat(currentPrice.toFixed(2)),
    change: parseFloat(change.toFixed(2)),
    changePercent: parseFloat(changePercent.toFixed(2)),
    high: ohlc.high,
    low: ohlc.low,
    open: ohlc.open,
    previousClose: parseFloat(previousClose.toFixed(2)),
    timestamp: Math.floor(Date.now() / 1000)
  };
}

// Get historical data
export async function getHistoricalData(symbol, timeframe) {
  console.log(`[MOCK] Generating historical data for ${symbol} (${timeframe})`);
  
  const symbolUpper = symbol.toUpperCase();
  const config = getSymbolPrice(symbolUpper);
  
  const barCounts = {
    '1m': 200,   // Más datos para ver indicadores completos
    '5m': 200,
    '15m': 200,
    '1h': 200,
    '1d': 150,
    '1w': 100    // ~2 años de datos semanales
  };
  
  const barCount = barCounts[timeframe] || 100;
  const data = [];
  let currentPrice = config.base;
  
  for (let i = barCount - 1; i >= 0; i--) {
    const ohlc = generateOHLC(currentPrice, config.volatility);
    data.push({
      time: generateTimestamp(i, timeframe),
      ...ohlc
    });
    currentPrice = ohlc.close;
  }
  
  // Calcular indicadores
  const closes = data.map(d => d.close);
  const rsi = calculateRSI(closes, 14);
  const macd = calculateMACD(closes);
  const sma20 = calculateSMA(closes, 20);
  const sma50 = calculateSMA(closes, 50);
  const ema12 = calculateEMA(closes, 12);
  const ema26 = calculateEMA(closes, 26);
  
  return {
    symbol: symbolUpper,
    timeframe,
    data,
    indicators: {
      rsi,
      macd,
      sma20,
      sma50,
      ema12,
      ema26
    }
  };
}

// Get intraday data (alias para getHistoricalData)
export async function getIntradayData(symbol, interval) {
  return getHistoricalData(symbol, interval);
}
