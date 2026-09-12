import express from 'express';
import { db } from '../db/database.js';

const router = express.Router();

// GET /api/customers - List all customer profiles
router.get('/', (req, res) => {
  const customers = db.find('customers');
  res.json({ success: true, data: customers });
});

// GET /api/customers/:id - Customer Profile Details
router.get('/:id', (req, res) => {
  const customer = db.findById('customers', req.params.id);
  if (!customer) {
    return res.status(404).json({ success: false, error: 'Customer not found' });
  }
  res.json({ success: true, data: customer });
});

// POST /api/customers - Create a new User Profile
router.post('/', (req, res) => {
  const { name, email, phone, tier, avatar } = req.body;

  if (!name || !email) {
    return res.status(400).json({ success: false, error: 'Name and email are required' });
  }

  const customId = `C${Math.floor(1000 + Math.random() * 9000)}`;
  const newCustomer = {
    id: customId,
    name,
    email,
    phone: phone || '+91 98000 00000',
    tier: tier || 'Silver',
    lifetime_value: 0,
    risk_score: 'Low',
    joined_date: new Date().toISOString().split('T')[0],
    avatar: avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    total_orders: 0,
    resolved_tickets: 0
  };

  db.insert('customers', newCustomer);

  res.status(201).json({ success: true, data: newCustomer });
});

// PUT /api/customers/:id - Update User Profile
router.put('/:id', (req, res) => {
  const customerId = req.params.id;
  const updates = req.body;

  const count = db.update('customers', c => c.id === customerId, updates);
  if (count === 0) {
    return res.status(404).json({ success: false, error: 'Customer profile not found' });
  }

  const updated = db.findById('customers', customerId);
  res.json({ success: true, data: updated });
});

// GET /api/customers/:id/orders - Customer Orders
router.get('/:id/orders', (req, res) => {
  const orders = db.find('orders', o => o.customer_id === req.params.id);
  res.json({ success: true, data: orders });
});

// GET /api/customers/:id/payments - Customer Payment History
router.get('/:id/payments', (req, res) => {
  const payments = db.find('payments', p => p.customer_id === req.params.id);
  res.json({ success: true, data: payments });
});

// GET /api/customers/:id/tickets - Customer Support Ticket History
router.get('/:id/tickets', (req, res) => {
  const tickets = db.find('tickets', t => t.customer_id === req.params.id);
  const supportHistory = db.find('support_history', h => h.customer_id === req.params.id);
  res.json({ success: true, data: { active_tickets: tickets, past_history: supportHistory } });
});

export default router;
