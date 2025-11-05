import axios from 'axios';

// Lee la URL base del backend definida en vite.config.js
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

// --- ENDPOINTS ---
export const searchSymbols = async (query, market = 'us-stocks') => {
  try {
    const response = await api.get('/search/symbols', { params: { query, market } });
    return response.data;
  } catch (error) {
    console.error('Search API error:', error);
    throw error;
  }
};

export const getQuote = async (symbol) => {
  try {
    const response = await api.get(`/market/quote/${symbol}`);
    return response.data;
  } catch (error) {
    console.error('Quote API error:', error);
    throw error;
  }
};

export const getHistoricalData = async (symbol, timeframe = '1d') => {
  try {
    const response = await api.get(`/market/historical/${symbol}`, {
      params: { timeframe },
    });
    return response.data;
  } catch (error) {
    console.error('Historical data API error:', error);
    throw error;
  }
};

export const getIntradayData = async (symbol, interval = '5min') => {
  try {
    const response = await api.get(`/market/intraday/${symbol}`, {
      params: { interval },
    });
    return response.data;
  } catch (error) {
    console.error('Intraday data API error:', error);
    throw error;
  }
};

// Trade Analysis API calls
export const analyzeTradeAPI = async (trade) => {
  try {
    const response = await api.post('/trade-analysis/analyze', trade);
    return response.data;
  } catch (error) {
    console.error('Trade analysis API error:', error);
    throw error;
  }
};

export const generateScenariosAPI = async (trade) => {
  try {
    const response = await api.post('/trade-analysis/scenarios', trade);
    return response.data;
  } catch (error) {
    console.error('Scenarios generation API error:', error);
    throw error;
  }
};

export const compareWithHistoricalAPI = async (trade, historicalStats = null) => {
  try {
    const response = await api.post('/trade-analysis/compare', {
      trade,
      historicalStats
    });
    return response.data;
  } catch (error) {
    console.error('Historical comparison API error:', error);
    throw error;
  }
};

export const fullTradeAnalysisAPI = async (trade, historicalStats = null) => {
  try {
    const response = await api.post('/trade-analysis/full', {
      trade,
      historicalStats
    });
    return response.data;
  } catch (error) {
    console.error('Full trade analysis API error:', error);
    throw error;
  }
};

export const batchTradeAnalysisAPI = async (trades) => {
  try {
    const response = await api.post('/trade-analysis/batch', { trades });
    return response.data;
  } catch (error) {
    console.error('Batch trade analysis API error:', error);
    throw error;
  }
};

