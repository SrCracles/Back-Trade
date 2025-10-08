import express from 'express';
import { searchSymbols } from '../services/searchService.js';

const router = express.Router();

// Search for symbols by ticker or name
router.get('/symbols', async (req, res) => {
  try {
    const { query, market } = req.query;
    
    const results = await searchSymbols(query, market);
    res.json(results);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;

