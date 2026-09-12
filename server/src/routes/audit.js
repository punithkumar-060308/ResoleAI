import express from 'express';
import { db } from '../db/database.js';

const router = express.Router();

// GET /api/audit/:ticketId - Get full audit log trail for a ticket
router.get('/:ticketId', (req, res) => {
  const logs = db.find('audit_logs', log => log.ticket_id === req.params.ticketId);
  // Sort chronologically
  logs.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
  res.json({ success: true, data: logs });
});

export default router;
