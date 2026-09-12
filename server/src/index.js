import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { seedDatabase } from './db/seed.js';

import ticketsRouter from './routes/tickets.js';
import customersRouter from './routes/customers.js';
import investigationsRouter from './routes/investigations.js';
import actionsRouter from './routes/actions.js';
import escalationsRouter from './routes/escalations.js';
import policiesRouter from './routes/policies.js';
import auditRouter from './routes/audit.js';
import analyticsRouter from './routes/analytics.js';

dotenv.config();

// Auto seed initial data
seedDatabase();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/tickets', ticketsRouter);
app.use('/api/customers', customersRouter);
app.use('/api/investigations', investigationsRouter);
app.use('/api/actions', actionsRouter);
app.use('/api/escalations', escalationsRouter);
app.use('/api/policies', policiesRouter);
app.use('/api/audit', auditRouter);
app.use('/api/analytics', analyticsRouter);

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ONLINE',
    service: 'ResolveAI Autonomous Intelligence Server',
    timestamp: new Date().toISOString()
  });
});

app.listen(PORT, () => {
  console.log(`==================================================`);
  console.log(` ResolveAI Backend API running on http://localhost:${PORT}`);
  console.log(`==================================================`);
});
