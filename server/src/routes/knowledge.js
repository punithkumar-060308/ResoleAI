import express from 'express';
import { db } from '../db/database.js';
import { KnowledgeService } from '../services/knowledgeService.js';

const router = express.Router();

// GET /api/knowledge - Get all knowledge articles and policies
router.get('/', (req, res) => {
  const articles = db.find('knowledge_articles');
  const policies = db.find('policies');
  res.json({ success: true, data: { articles, policies } });
});

// GET /api/knowledge/search - Search knowledge base
router.get('/search', (req, res) => {
  const { q, category } = req.query;
  const result = KnowledgeService.searchKnowledge(q, category);
  res.json({ success: true, data: result });
});

export default router;
