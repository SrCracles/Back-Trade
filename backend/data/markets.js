// Datos de mercados y símbolos

export const MARKETS = {
  'us-stocks': {
    name: 'Acciones EE.UU.',
    symbols: [
      { symbol: 'AAPL', description: 'Apple Inc.', type: 'Tech' },
      { symbol: 'MSFT', description: 'Microsoft Corporation', type: 'Tech' },
      { symbol: 'GOOGL', description: 'Alphabet Inc.', type: 'Tech' },
      { symbol: 'AMZN', description: 'Amazon.com Inc.', type: 'E-commerce' },
      { symbol: 'TSLA', description: 'Tesla Inc.', type: 'Automotive' },
      { symbol: 'META', description: 'Meta Platforms Inc.', type: 'Social Media' },
      { symbol: 'NVDA', description: 'NVIDIA Corporation', type: 'Semiconductors' },
      { symbol: 'JPM', description: 'JPMorgan Chase & Co.', type: 'Banking' },
      { symbol: 'V', description: 'Visa Inc.', type: 'Fintech' },
      { symbol: 'WMT', description: 'Walmart Inc.', type: 'Retail' },
      { symbol: 'DIS', description: 'The Walt Disney Company', type: 'Entertainment' },
      { symbol: 'NFLX', description: 'Netflix Inc.', type: 'Streaming' },
      { symbol: 'BA', description: 'Boeing Company', type: 'Aerospace' },
      { symbol: 'KO', description: 'Coca-Cola Company', type: 'Beverages' },
      { symbol: 'PFE', description: 'Pfizer Inc.', type: 'Pharmaceuticals' }
    ],
    prices: {
      'AAPL': { base: 175.50, volatility: 0.02 },
      'MSFT': { base: 380.25, volatility: 0.018 },
      'GOOGL': { base: 142.80, volatility: 0.022 },
      'AMZN': { base: 155.30, volatility: 0.025 },
      'TSLA': { base: 242.50, volatility: 0.04 },
      'META': { base: 485.60, volatility: 0.028 },
      'NVDA': { base: 495.75, volatility: 0.035 },
      'JPM': { base: 152.30, volatility: 0.02 },
      'V': { base: 258.90, volatility: 0.019 },
      'WMT': { base: 165.40, volatility: 0.015 },
      'DIS': { base: 92.50, volatility: 0.025 },
      'NFLX': { base: 485.30, volatility: 0.032 },
      'BA': { base: 210.45, volatility: 0.03 },
      'KO': { base: 59.20, volatility: 0.012 },
      'PFE': { base: 28.75, volatility: 0.022 }
    }
  },
  'colombia-stocks': {
    name: 'Acciones Colombia',
    symbols: [
      { symbol: 'ECOPETROL', description: 'Ecopetrol S.A.', type: 'Energía' },
      { symbol: 'BANCOLOMBIA', description: 'Bancolombia S.A.', type: 'Banca' },
      { symbol: 'GRUPOSURA', description: 'Grupo de Inversiones Suramericana', type: 'Holding' },
      { symbol: 'NUTRESA', description: 'Grupo Nutresa S.A.', type: 'Alimentos' },
      { symbol: 'CEMARGOS', description: 'Cementos Argos S.A.', type: 'Construcción' },
      { symbol: 'ISA', description: 'Interconexión Eléctrica S.A.', type: 'Energía' },
      { symbol: 'PFBCOLOM', description: 'Bancolombia Preferencial', type: 'Banca' },
      { symbol: 'GRUPOAVAL', description: 'Grupo Aval Acciones', type: 'Holding' },
      { symbol: 'BOGOTA', description: 'Banco de Bogotá', type: 'Banca' },
      { symbol: 'CELSIA', description: 'Celsia S.A.', type: 'Energía' }
    ],
    prices: {
      'ECOPETROL': { base: 2450, volatility: 0.025 },
      'BANCOLOMBIA': { base: 32500, volatility: 0.02 },
      'GRUPOSURA': { base: 28900, volatility: 0.022 },
      'NUTRESA': { base: 24300, volatility: 0.018 },
      'CEMARGOS': { base: 6800, volatility: 0.028 },
      'ISA': { base: 15200, volatility: 0.02 },
      'PFBCOLOM': { base: 29800, volatility: 0.019 },
      'GRUPOAVAL': { base: 940, volatility: 0.024 },
      'BOGOTA': { base: 42500, volatility: 0.021 },
      'CELSIA': { base: 3950, volatility: 0.023 }
    }
  },
  'crypto': {
    name: 'Criptomonedas',
    symbols: [
      { symbol: 'BTC', description: 'Bitcoin', type: 'Cryptocurrency' },
      { symbol: 'ETH', description: 'Ethereum', type: 'Cryptocurrency' },
      { symbol: 'BNB', description: 'Binance Coin', type: 'Cryptocurrency' },
      { symbol: 'XRP', description: 'Ripple', type: 'Cryptocurrency' },
      { symbol: 'ADA', description: 'Cardano', type: 'Cryptocurrency' },
      { symbol: 'SOL', description: 'Solana', type: 'Cryptocurrency' },
      { symbol: 'DOGE', description: 'Dogecoin', type: 'Cryptocurrency' },
      { symbol: 'DOT', description: 'Polkadot', type: 'Cryptocurrency' },
      { symbol: 'MATIC', description: 'Polygon', type: 'Cryptocurrency' },
      { symbol: 'AVAX', description: 'Avalanche', type: 'Cryptocurrency' }
    ],
    prices: {
      'BTC': { base: 45250, volatility: 0.05 },
      'ETH': { base: 2380, volatility: 0.055 },
      'BNB': { base: 312, volatility: 0.045 },
      'XRP': { base: 0.58, volatility: 0.06 },
      'ADA': { base: 0.45, volatility: 0.055 },
      'SOL': { base: 98, volatility: 0.065 },
      'DOGE': { base: 0.085, volatility: 0.08 },
      'DOT': { base: 6.85, volatility: 0.058 },
      'MATIC': { base: 0.92, volatility: 0.062 },
      'AVAX': { base: 35.50, volatility: 0.07 }
    }
  },
  'forex': {
    name: 'Divisas (Forex)',
    symbols: [
      { symbol: 'EURUSD', description: 'Euro / Dólar', type: 'Major' },
      { symbol: 'GBPUSD', description: 'Libra / Dólar', type: 'Major' },
      { symbol: 'USDJPY', description: 'Dólar / Yen', type: 'Major' },
      { symbol: 'USDCHF', description: 'Dólar / Franco Suizo', type: 'Major' },
      { symbol: 'AUDUSD', description: 'Dólar Australiano / Dólar', type: 'Major' },
      { symbol: 'USDCAD', description: 'Dólar / Dólar Canadiense', type: 'Major' },
      { symbol: 'NZDUSD', description: 'Dólar Neozelandés / Dólar', type: 'Major' },
      { symbol: 'EURGBP', description: 'Euro / Libra', type: 'Cross' },
      { symbol: 'EURJPY', description: 'Euro / Yen', type: 'Cross' },
      { symbol: 'GBPJPY', description: 'Libra / Yen', type: 'Cross' }
    ],
    prices: {
      'EURUSD': { base: 1.0850, volatility: 0.008 },
      'GBPUSD': { base: 1.2650, volatility: 0.01 },
      'USDJPY': { base: 148.50, volatility: 0.012 },
      'USDCHF': { base: 0.8920, volatility: 0.009 },
      'AUDUSD': { base: 0.6580, volatility: 0.011 },
      'USDCAD': { base: 1.3520, volatility: 0.008 },
      'NZDUSD': { base: 0.6120, volatility: 0.012 },
      'EURGBP': { base: 0.8580, volatility: 0.007 },
      'EURJPY': { base: 161.20, volatility: 0.013 },
      'GBPJPY': { base: 187.80, volatility: 0.015 }
    }
  }
};

export function getMarketSymbols(market) {
  return MARKETS[market]?.symbols || [];
}

export function getAllSymbols() {
  const allSymbols = [];
  Object.keys(MARKETS).forEach(market => {
    allSymbols.push(...MARKETS[market].symbols);
  });
  return allSymbols;
}

export function getSymbolPrice(symbol) {
  for (const market of Object.values(MARKETS)) {
    if (market.prices[symbol]) {
      return market.prices[symbol];
    }
  }
  return { base: 100, volatility: 0.02 };
}

