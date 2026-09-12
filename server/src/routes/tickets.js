import express from 'express';
import { db } from '../db/database.js';

const router = express.Router();

// GET /api/tickets - List all tickets
router.get('/', (req, res) => {
  const tickets = db.find('tickets');
  // Enrich with customer details
  const enriched = tickets.map(ticket => {
    const customer = db.findById('customers', ticket.customer_id);
    const order = ticket.order_id ? db.findById('orders', ticket.order_id) : null;
    return { ...ticket, customer, order };
  });
  res.json({ success: true, data: enriched });
});

// GET /api/tickets/:id - Get ticket details with full context
router.get('/:id', (req, res) => {
  const ticket = db.findById('tickets', req.params.id);
  if (!ticket) {
    return res.status(404).json({ success: false, error: 'Ticket not found' });
  }

  const customer = db.findById('customers', ticket.customer_id);
  const order = ticket.order_id ? db.findById('orders', ticket.order_id) : null;
  const payments = ticket.customer_id ? db.find('payments', p => p.customer_id === ticket.customer_id) : [];
  const history = ticket.customer_id ? db.find('support_history', h => h.customer_id === ticket.customer_id) : [];
  const investigation = db.findOne('investigations', inv => inv.ticket_id === ticket.id);
  const recommendation = db.findOne('ai_recommendations', rec => rec.ticket_id === ticket.id);
  const auditLogs = db.find('audit_logs', log => log.ticket_id === ticket.id);

  res.json({
    success: true,
    data: {
      ticket,
      customer,
      order,
      payments,
      support_history: history,
      investigation,
      recommendation,
      audit_logs: auditLogs
    }
  });
});

// POST /api/tickets - Create a new ticket (Customer submission)
router.post('/', (req, res) => {
  const { customer_id, subject, customer_message, channel, order_id } = req.body;

  if (!customer_message) {
    return res.status(400).json({ success: false, error: 'customer_message is required' });
  }

  // Identify customer by ID or default to C1024 for demo if unspecified
  const cid = customer_id || 'C1024';
  const customer = db.findById('customers', cid);

  const ticketId = `T-${Math.floor(1000 + Math.random() * 9000)}`;
  const newTicket = {
    id: ticketId,
    customer_id: cid,
    order_id: order_id || 'ORD9281',
    channel: channel || 'Chat Widget',
    subject: subject || 'Customer Support Request',
    customer_message,
    status: 'INVESTIGATING',
    priority: 'HIGH',
    risk_level: 'PENDING',
    created_at: new Date().toISOString()
  };

  db.insert('tickets', newTicket);

  // Log creation
  db.insert('audit_logs', {
    ticket_id: ticketId,
    actor: 'System Ingestion',
    action: 'TICKET_CREATED',
    details: `Customer ${customer ? customer.name : cid} submitted new ticket via ${newTicket.channel}: "${customer_message}"`,
    timestamp: new Date().toISOString()
  });

  res.status(201).json({ success: true, data: newTicket });
});

export default router;
