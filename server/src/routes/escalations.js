import express from 'express';
import { db } from '../db/database.js';

const router = express.Router();

// GET /api/escalations - List all active escalations
router.get('/', (req, res) => {
  const escalations = db.find('escalations');
  res.json({ success: true, data: escalations });
});

// POST /api/escalations - Create manual or automated escalation
router.post('/', (req, res) => {
  const { ticket_id, department, priority, note } = req.body;
  if (!ticket_id || !department) {
    return res.status(400).json({ success: false, error: 'ticket_id and department are required' });
  }

  const esc = {
    id: `ESC_${Date.now()}`,
    ticket_id,
    department,
    priority: priority || 'HIGH',
    status: 'OPEN',
    note: note || 'Escalated from support dashboard',
    created_at: new Date().toISOString()
  };

  db.insert('escalations', esc);
  db.update('tickets', t => t.id === ticket_id, { status: 'ESCALATED' });

  db.insert('audit_logs', {
    ticket_id,
    actor: 'Support Agent',
    action: 'DEPARTMENT_ESCALATION',
    details: `Ticket escalated to ${department} (Priority: ${esc.priority}). Note: ${esc.note}`,
    timestamp: new Date().toISOString()
  });

  res.status(201).json({ success: true, data: esc });
});

export default router;
