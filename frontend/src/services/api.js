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

// Alerts API calls
export const getAlertsAPI = async (filters = {}) => {
  try {
    const response = await api.get('/alerts', { params: filters });
    return response.data;
  } catch (error) {
    console.error('Get alerts API error:', error);
    throw error;
  }
};

export const getAlertByIdAPI = async (id) => {
  try {
    const response = await api.get(`/alerts/${id}`);
    return response.data;
  } catch (error) {
    console.error('Get alert API error:', error);
    throw error;
  }
};

export const createAlertAPI = async (alertData) => {
  try {
    const response = await api.post('/alerts', alertData);
    return response.data;
  } catch (error) {
    console.error('Create alert API error:', error);
    throw error;
  }
};

export const updateAlertAPI = async (id, updates) => {
  try {
    const response = await api.put(`/alerts/${id}`, updates);
    return response.data;
  } catch (error) {
    console.error('Update alert API error:', error);
    throw error;
  }
};

export const deleteAlertAPI = async (id) => {
  try {
    const response = await api.delete(`/alerts/${id}`);
    return response.data;
  } catch (error) {
    console.error('Delete alert API error:', error);
    throw error;
  }
};

export const triggerAlertAPI = async (id) => {
  try {
    const response = await api.post(`/alerts/${id}/trigger`);
    return response.data;
  } catch (error) {
    console.error('Trigger alert API error:', error);
    throw error;
  }
};

export const resetAlertAPI = async (id) => {
  try {
    const response = await api.post(`/alerts/${id}/reset`);
    return response.data;
  } catch (error) {
    console.error('Reset alert API error:', error);
    throw error;
  }
};

