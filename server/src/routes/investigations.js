import express from 'express';
import { db } from '../db/database.js';
import { WorkflowOrchestrator } from '../services/workflowService.js';

const router = express.Router();

// POST /api/investigations - Trigger workflow investigation for a ticket
router.post('/', async (req, res) => {
  const { ticket_id } = req.body;
  if (!ticket_id) {
    return res.status(400).json({ success: false, error: 'ticket_id is required' });
  }

  try {
    const result = await WorkflowOrchestrator.processTicketWorkflow(ticket_id);
    res.json({ success: true, data: result });
  } catch (err) {
    console.error('Error running investigation workflow:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/investigations/:ticketId - Get existing investigation & AI recommendation
router.get('/:ticketId', (req, res) => {
  const ticketId = req.params.ticketId;
  const investigation = db.findOne('investigations', inv => inv.ticket_id === ticketId);
  const recommendation = db.findOne('ai_recommendations', rec => rec.ticket_id === ticketId);

  if (!investigation && !recommendation) {
    return res.status(404).json({ success: false, error: 'No investigation found for this ticket' });
  }

  res.json({
    success: true,
    data: {
      investigation,
      recommendation
    }
  });
});

export default router;
