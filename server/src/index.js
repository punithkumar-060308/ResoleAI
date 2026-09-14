import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { seedDatabase } from './db/seed.js';

import ticketsRouter from './routes/tickets.js';
import customersRouter from './routes/customers.js';
import investigationsRouter from './routes/investigations.js';
import actionsRouter from './routes/actions.js';
import escalationsRouter from './routes/escalations.js';
import policiesRouter from './routes/policies.js';
import auditRouter from './routes/audit.js';
import analyticsRouter from './routes/analytics.js';
import knowledgeRouter from './routes/knowledge.js';

dotenv.config();

// Auto seed initial data
seedDatabase();

const app = express();
const PORT = process.env.PORT || 5000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
app.use('/api/knowledge', knowledgeRouter);

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ONLINE',
    service: 'ResolveAI Autonomous Intelligence Server',
    timestamp: new Date().toISOString()
  });
});

// Serve frontend static build if client/dist exists
const clientDistPath = path.resolve(__dirname, '../../client/dist');
if (fs.existsSync(clientDistPath)) {
  app.use(express.static(clientDistPath));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api')) return next();
    res.sendFile(path.join(clientDistPath, 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`==================================================`);
  console.log(` ResolveAI Backend API running on port ${PORT}`);
  console.log(`==================================================`);
});

