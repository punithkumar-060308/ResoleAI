import express from 'express';
import { db } from '../db/database.js';
import { WorkflowOrchestrator } from '../services/workflowService.js';

const router = express.Router();

// POST /api/actions/validate - Validate recommended actions
router.post('/validate', (req, res) => {
  const { actions, ticket_id } = req.body;
  const policies = db.find('policies');

  const validated = (actions || []).map(act => {
    const policy = policies.find(p => p.code === act.policy_code);
    const requiresApproval = act.amount > 2000 || act.risk_level === 'HIGH' || (policy && !policy.auto_action_eligible);
    return {
      ...act,
      valid: true,
      requires_approval: requiresApproval,
      policy_title: policy ? policy.title : 'General Operating Procedure'
    };
  });

  res.json({ success: true, data: validated });
});

// POST /api/actions/execute - Human approval or auto-execution of actions
router.post('/execute', async (req, res) => {
  const { ticket_id, actions, supervisor_name, note } = req.body;

  if (!ticket_id || !actions || !Array.isArray(actions)) {
    return res.status(400).json({ success: false, error: 'ticket_id and actions array are required' });
  }

  try {
    const actor = supervisor_name || 'Human Supervisor (Admin)';
    const results = [];

    for (const act of actions) {
      const resItem = await WorkflowOrchestrator.executeSingleAction(ticket_id, act, actor);
      results.push(resItem);
    }

    // Mark ticket as resolved
    db.update('tickets', t => t.id === ticket_id, {
      status: 'RESOLVED',
      resolved_at: new Date().toISOString(),
      supervisor_note: note || 'Approved by Supervisor'
    });

    db.insert('audit_logs', {
      ticket_id,
      actor,
      action: 'HUMAN_APPROVAL_EXECUTED',
      details: `${actor} approved and executed ${actions.length} action(s). Note: ${note || 'All recommendations verified.'}`,
      timestamp: new Date().toISOString()
    });

    res.json({
      success: true,
      message: 'Actions executed successfully and ticket resolved',
      data: {
        ticket_id,
        status: 'RESOLVED',
        executed_actions: results
      }
    });
  } catch (err) {
    console.error('Error executing actions:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
