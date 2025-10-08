// Search Service - Solo datos simulados

const POPULAR_SYMBOLS = [
  { symbol: 'AAPL', description: 'Apple Inc.', type: 'Common Stock' },
  { symbol: 'MSFT', description: 'Microsoft Corporation', type: 'Common Stock' },
  { symbol: 'GOOGL', description: 'Alphabet Inc.', type: 'Common Stock' },
  { symbol: 'AMZN', description: 'Amazon.com Inc.', type: 'Common Stock' },
  { symbol: 'TSLA', description: 'Tesla Inc.', type: 'Common Stock' },
  { symbol: 'META', description: 'Meta Platforms Inc.', type: 'Common Stock' },
  { symbol: 'NVDA', description: 'NVIDIA Corporation', type: 'Common Stock' },
  { symbol: 'SPY', description: 'SPDR S&P 500 ETF Trust', type: 'ETF' },
  { symbol: 'QQQ', description: 'Invesco QQQ Trust', type: 'ETF' },
  { symbol: 'BTC-USD', description: 'Bitcoin USD', type: 'Cryptocurrency' },
  { symbol: 'JPM', description: 'JPMorgan Chase & Co.', type: 'Common Stock' },
  { symbol: 'V', description: 'Visa Inc.', type: 'Common Stock' },
  { symbol: 'WMT', description: 'Walmart Inc.', type: 'Common Stock' },
  { symbol: 'DIS', description: 'The Walt Disney Company', type: 'Common Stock' },
  { symbol: 'NFLX', description: 'Netflix Inc.', type: 'Common Stock' }
];

export async function searchSymbols(query) {
  console.log(`[MOCK] Searching symbols for: ${query || 'all'}`);
  
  if (!query || query.trim() === '') {
    return POPULAR_SYMBOLS;
  }
  
  const queryLower = query.toLowerCase();
  return POPULAR_SYMBOLS.filter(s => 
    s.symbol.toLowerCase().includes(queryLower) || 
    s.description.toLowerCase().includes(queryLower)
  );
}
