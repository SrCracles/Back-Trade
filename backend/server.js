import express from 'express';
import cors from 'cors';
import marketDataRoutes from './routes/marketData.js';
import searchRoutes from './routes/search.js';
import tradeAnalysisRoutes from './routes/tradeAnalysis.js';

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/market', marketDataRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/trade-analysis', tradeAnalysisRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'BackTrade API is running' });
});

app.listen(PORT, () => {
  console.log(`BackTrade API server running on port ${PORT}`);
  console.log(`Using simulated data (no API keys required)`);
  console.log(`Ready to go!`);
});

