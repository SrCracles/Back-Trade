import express from 'express';
import { searchSymbols } from '../services/searchService.js';

const router = express.Router();

// Search for symbols by ticker or name
router.get('/symbols', async (req, res) => {
  try {
    const { query } = req.query;
    
    if (!query || query.length < 1) {
      return res.json([]);
    }
    
    const results = await searchSymbols(query);
    res.json(results);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;

