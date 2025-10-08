// Search Service - Solo datos simulados
import { getMarketSymbols, getAllSymbols } from '../data/markets.js';

export async function searchSymbols(query, market = 'all') {
  console.log(`[MOCK] Searching symbols for: ${query || 'all'} in market: ${market}`);
  
  // Obtener símbolos del mercado seleccionado
  let symbols = market === 'all' ? getAllSymbols() : getMarketSymbols(market);
  
  // Si no hay query, retornar todos los símbolos del mercado
  if (!query || query.trim() === '') {
    return symbols;
  }
  
  // Filtrar por query
  const queryLower = query.toLowerCase();
  return symbols.filter(s => 
    s.symbol.toLowerCase().includes(queryLower) || 
    s.description.toLowerCase().includes(queryLower)
  );
}
