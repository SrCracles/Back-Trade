import axios from 'axios';

const API_BASE_URL = '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

export const searchSymbols = async (query) => {
  try {
    const response = await api.get('/search/symbols', {
      params: { query }
    });
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
      params: { timeframe }
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
      params: { interval }
    });
    return response.data;
  } catch (error) {
    console.error('Intraday data API error:', error);
    throw error;
  }
};

