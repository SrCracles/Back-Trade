import express from 'express';
import cors from 'cors';
import marketDataRoutes from './routes/marketData.js';
import searchRoutes from './routes/search.js';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/market', marketDataRoutes);
app.use('/api/search', searchRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Trading Sinergico API is running' });
});

// 👇 en lugar de app.listen, exporta el handler
export default app;
