import express from 'express';
import { db } from '../db/database.js';

const router = express.Router();

// GET /api/policies - List all enterprise rules & policies
router.get('/', (req, res) => {
  const policies = db.find('policies');
  res.json({ success: true, data: policies });
});

export default router;
