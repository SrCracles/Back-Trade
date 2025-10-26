import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { PsychologicalTrackingProvider } from './contexts/PsychologicalTrackingContext'
import Header from './components/Header'
import TradingModal from './components/TradingModal'
import EmotionalPopup from './components/EmotionalPopup'
import RiskAlert from './components/RiskAlert'
import ChatButton from './components/ChatButton'
import Dashboard from './pages/Dashboard'
import Portfolio from './pages/Portfolio'
import Watchlist from './pages/Watchlist'
import Trades from './pages/Trades'
import Report from './pages/Report'
import FAQ from './pages/FAQ'
import Chat from './pages/Chat'
import Groups from './pages/Groups'
import Alerts from './pages/Alerts'
import Funding from './pages/Funding'
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
    { 
      symbol: 'BTC', 
      quantity: 1, 
      avgPrice: 43000, 
      currentPrice: 45250,
      purchaseDate: '2024-10-20T10:30:00'
    },
    { 
      symbol: 'TSLA', 
      quantity: 5, 
      avgPrice: 235, 
      currentPrice: 242.50,
      purchaseDate: '2024-10-22T09:15:00'
    }
  ]);
  const [watchlist, setWatchlist] = useState(INITIAL_WATCHLIST);
  const [closedTrades, setClosedTrades] = useState([]);

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
      const purchaseDate = new Date().toISOString();
      
      if (existingHolding) {
        // Actualizar holding existente
        setHoldings(prev => prev.map(h => 
          h.symbol === trade.symbol
            ? {
                ...h,
                quantity: h.quantity + trade.quantity,
                avgPrice: ((h.avgPrice * h.quantity) + (trade.price * trade.quantity)) / (h.quantity + trade.quantity),
                currentPrice: trade.price,
                purchaseDate: h.purchaseDate || purchaseDate // Mantener fecha original si existe
              }
            : h
        ));
      } else {
        // Crear nuevo holding con fecha de compra
        setHoldings(prev => [...prev, {
          symbol: trade.symbol,
          quantity: trade.quantity,
          avgPrice: trade.price,
          currentPrice: trade.price,
          purchaseDate: purchaseDate
        }]);
      }

      alert(`Compra exitosa!\n${trade.quantity.toFixed(4)} ${trade.symbol} por $${trade.totalCost.toFixed(2)}`);
    } else {
      // Vender - GENERA TRADE CERRADO
      const holding = holdings.find(h => h.symbol === trade.symbol);
      if (!holding || holding.quantity < trade.quantity) {
        alert('No tienes suficientes unidades para vender');
        return;
      }

      setBalance(prev => prev + trade.totalCost);
      
      // Calcular comisión (0.1% del valor de la transacción)
      const commission = trade.totalCost * 0.001;
      
      // Crear registro de trade cerrado
      const closedTrade = {
        id: `trade-${Date.now()}`,
        symbol: trade.symbol,
        type: 'buy', // El tipo original fue compra
        entryPrice: holding.avgPrice,
        exitPrice: trade.price,
        quantity: trade.quantity,
        entryDate: holding.purchaseDate,
        exitDate: new Date().toISOString(),
        commission: commission,
        status: 'closed'
      };
      
      // Agregar a la lista de trades cerrados
      setClosedTrades(prev => [closedTrade, ...prev]);
      
      if (holding.quantity === trade.quantity) {
        // Eliminar holding si se vende todo
        setHoldings(prev => prev.filter(h => h.symbol !== trade.symbol));
      } else {
        // Reducir cantidad (venta parcial también genera trade cerrado)
        setHoldings(prev => prev.map(h =>
          h.symbol === trade.symbol
            ? { ...h, quantity: h.quantity - trade.quantity, currentPrice: trade.price }
            : h
        ));
      }

      const profitLoss = (trade.price - holding.avgPrice) * trade.quantity - commission;
      const plEmoji = profitLoss >= 0 ? '📈' : '📉';
      
      alert(`${plEmoji} Venta exitosa!\n${trade.quantity.toFixed(4)} ${trade.symbol} por $${trade.totalCost.toFixed(2)}\nP&L: ${profitLoss >= 0 ? '+' : ''}$${profitLoss.toFixed(2)}\n\n✅ Trade cerrado registrado - Revisa la sección Trades para análisis detallado`);
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
          <ChatButton />
          
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
                path="/trades" 
                element={<Trades closedTrades={closedTrades} />} 
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
              <Route 
                path="/groups" 
                element={<Groups />} 
              />
              <Route 
                path="/alerts" 
                element={<Alerts />} 
              />
              <Route 
                path="/funding" 
                element={<Funding />} 
              />
            </Routes>
          </main>
        </div>
      </PsychologicalTrackingProvider>
    </Router>
  )
}

export default App

