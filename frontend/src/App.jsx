import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { PsychologicalTrackingProvider } from './contexts/PsychologicalTrackingContext'
import Header from './components/Header'
import TradingModal from './components/TradingModal'
import EmotionalPopup from './components/EmotionalPopup'
import RiskAlert from './components/RiskAlert'
import Dashboard from './pages/Dashboard'
import Portfolio from './pages/Portfolio'
import Watchlist from './pages/Watchlist'
import Report from './pages/Report'
import FAQ from './pages/FAQ'
import Chat from './pages/Chat'
import { getQuote } from './services/api'

const INITIAL_WATCHLIST = [
  { symbol: 'BTC', category: 'crypto' },
  { symbol: 'ETH', category: 'crypto' },
  { symbol: 'AAPL', category: 'us-stocks' },
  { symbol: 'TSLA', category: 'us-stocks' },
  { symbol: 'EURUSD', category: 'forex' },
  { symbol: 'GBPUSD', category: 'forex' },
  { symbol: 'MSFT', category: 'us-stocks' },
  { symbol: 'GOOGL', category: 'us-stocks' },
  { symbol: 'SOL', category: 'crypto' },
  { symbol: 'ECOPETROL', category: 'colombia-stocks' }
];

function App() {
  const [selectedMarket, setSelectedMarket] = useState('crypto');
  const [selectedSymbol, setSelectedSymbol] = useState('BTC');
  const [tradingModal, setTradingModal] = useState({ isOpen: false, mode: null });
  const [balance, setBalance] = useState(2000);
  const [holdings, setHoldings] = useState([
    { symbol: 'BTC', quantity: 1, avgPrice: 43000, currentPrice: 45250 },
    { symbol: 'TSLA', quantity: 5, avgPrice: 235, currentPrice: 242.50 }
  ]);
  const [watchlist, setWatchlist] = useState(INITIAL_WATCHLIST);

  useEffect(() => {
    updateHoldingsPrices();
  }, [selectedSymbol]);

  const updateHoldingsPrices = async () => {
    // Actualizar precios actuales de holdings
    const updatedHoldings = await Promise.all(
      holdings.map(async (holding) => {
        try {
          const quoteData = await getQuote(holding.symbol);
          return { ...holding, currentPrice: quoteData.price };
        } catch (error) {
          return holding;
        }
      })
    );
    setHoldings(updatedHoldings);
  };

  const handleTrade = (trade) => {
    if (trade.mode === 'buy') {
      // Comprar
      if (trade.totalCost > balance) {
        alert('Fondos insuficientes');
        return;
      }

      setBalance(prev => prev - trade.totalCost);
      
      const existingHolding = holdings.find(h => h.symbol === trade.symbol);
      if (existingHolding) {
        // Actualizar holding existente
        setHoldings(prev => prev.map(h => 
          h.symbol === trade.symbol
            ? {
                ...h,
                quantity: h.quantity + trade.quantity,
                avgPrice: ((h.avgPrice * h.quantity) + (trade.price * trade.quantity)) / (h.quantity + trade.quantity),
                currentPrice: trade.price
              }
            : h
        ));
      } else {
        // Crear nuevo holding
        setHoldings(prev => [...prev, {
          symbol: trade.symbol,
          quantity: trade.quantity,
          avgPrice: trade.price,
          currentPrice: trade.price
        }]);
      }

      alert(`Compra exitosa!\n${trade.quantity.toFixed(4)} ${trade.symbol} por $${trade.totalCost.toFixed(2)}`);
    } else {
      // Vender
      const holding = holdings.find(h => h.symbol === trade.symbol);
      if (!holding || holding.quantity < trade.quantity) {
        alert('No tienes suficientes unidades para vender');
        return;
      }

      setBalance(prev => prev + trade.totalCost);
      
      if (holding.quantity === trade.quantity) {
        // Eliminar holding si se vende todo
        setHoldings(prev => prev.filter(h => h.symbol !== trade.symbol));
      } else {
        // Reducir cantidad
        setHoldings(prev => prev.map(h =>
          h.symbol === trade.symbol
            ? { ...h, quantity: h.quantity - trade.quantity, currentPrice: trade.price }
            : h
        ));
      }

      alert(`Venta exitosa!\n${trade.quantity.toFixed(4)} ${trade.symbol} por $${trade.totalCost.toFixed(2)}`);
    }
  };

  const handleSelectSymbolFromPortfolio = (symbol) => {
    // Determinar el mercado del símbolo
    const marketMap = {
      'BTC': 'crypto',
      'ETH': 'crypto',
      'BNB': 'crypto',
      'TSLA': 'us-stocks',
      'AAPL': 'us-stocks',
      'MSFT': 'us-stocks',
      'ECOPETROL': 'colombia-stocks',
      'BANCOLOMBIA': 'colombia-stocks',
      'EURUSD': 'forex',
      'GBPUSD': 'forex'
    };

    const market = marketMap[symbol] || 'us-stocks';
    setSelectedMarket(market);
    setSelectedSymbol(symbol);
  };

  return (
    <Router>
      <PsychologicalTrackingProvider>
        <div className="min-h-screen bg-dark-900">
          <Header 
            onOpenBuy={() => setTradingModal({ isOpen: true, mode: 'buy' })}
            onOpenSell={() => setTradingModal({ isOpen: true, mode: 'sell' })}
            balance={balance}
          />
          
          <TradingModal
            isOpen={tradingModal.isOpen}
            onClose={() => setTradingModal({ isOpen: false, mode: null })}
            mode={tradingModal.mode}
            currentSymbol={selectedSymbol}
            balance={balance}
            holdings={holdings}
            onTrade={handleTrade}
          />

          <EmotionalPopup />
          <RiskAlert />
          
          <main>
            <Routes>
              <Route 
                path="/" 
                element={
                  <Dashboard
                    selectedMarket={selectedMarket}
                    setSelectedMarket={setSelectedMarket}
                    selectedSymbol={selectedSymbol}
                    setSelectedSymbol={setSelectedSymbol}
                    watchlist={watchlist}
                    setWatchlist={setWatchlist}
                  />
                } 
              />
              <Route 
                path="/watchlist" 
                element={
                  <Watchlist
                    watchlist={watchlist}
                    setWatchlist={setWatchlist}
                    onSelectSymbol={handleSelectSymbolFromPortfolio}
                  />
                } 
              />
              <Route 
                path="/portfolio" 
                element={
                  <Portfolio
                    balance={balance}
                    holdings={holdings}
                    onSelectSymbol={handleSelectSymbolFromPortfolio}
                  />
                } 
              />
              <Route 
                path="/report" 
                element={<Report />} 
              />
              <Route 
                path="/faq" 
                element={<FAQ />} 
              />
              <Route 
                path="/chat" 
                element={<Chat />} 
              />
            </Routes>
          </main>
        </div>
      </PsychologicalTrackingProvider>
    </Router>
  )
}

export default App

