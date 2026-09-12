import { db } from '../db/database.js';

export class RoutingService {
  /**
   * Intelligently analyze and route an incoming support request.
   * @param {Object} ticket - { customer_message, customer_id, channel }
   */
  static analyzeAndRoute(ticket) {
    const msg = (ticket.customer_message || '').toLowerCase();
    const customer = ticket.customer_id ? db.findById('customers', ticket.customer_id) : null;
    const isVip = customer && (customer.tier === 'VIP Gold' || customer.tier === 'Platinum');

    let category = 'GENERAL';
    let intent = 'GENERAL_QUERY';
    let specialist = 'Orchestrator Agent';
    let urgency = 'MEDIUM';
    let sentiment = 'NEUTRAL';
    let priority = isVip ? 'P2_HIGH' : 'P3_MEDIUM';
    let escalationProb = 25;

    // Rule & Intent Evaluation
    if (msg.includes('charged') || msg.includes('twice') || msg.includes('refund') || msg.includes('billing') || msg.includes('payment')) {
      category = 'BILLING';
      intent = msg.includes('twice') || msg.includes('double') ? 'DUPLICATE_PAYMENT' : 'REFUND_INQUIRY';
      specialist = 'Billing Agent';
      urgency = 'HIGH';
      sentiment = 'FRUSTRATED';
      priority = 'P1_CRITICAL';
      escalationProb = 85;
    } else if (msg.includes('crash') || msg.includes('bug') || msg.includes('app') || msg.includes('error') || msg.includes('checkout')) {
      category = 'TECHNICAL';
      intent = 'APP_CHECKOUT_CRASH';
      specialist = 'Technical Support Agent';
      urgency = 'MEDIUM';
      sentiment = 'CONCERNED';
      priority = 'P3_MEDIUM';
      escalationProb = 15; // Known fix, low escalation
    } else if (msg.includes('email') || msg.includes('security') || msg.includes('hacked') || msg.includes('password') || msg.includes('login') || msg.includes('permission')) {
      category = 'ACCOUNT_SECURITY';
      intent = 'UNAUTHORIZED_ACCOUNT_CHANGE';
      specialist = 'Account & Security Agent';
      urgency = 'URGENT';
      sentiment = 'FRUSTRATED';
      priority = 'P1_CRITICAL';
      escalationProb = 95; // High security risk
    } else if (msg.includes('order') || msg.includes('arrived') || msg.includes('tracking') || msg.includes('delay') || msg.includes('shipment')) {
      category = 'DELIVERY';
      intent = 'DELIVERY_STATUS_SLA';
      specialist = 'Order/Delivery Agent';
      urgency = 'HIGH';
      sentiment = 'CONCERNED';
      priority = isVip ? 'P1_CRITICAL' : 'P2_HIGH';
      escalationProb = 60;
    }

    const routingResult = {
      category,
      intent,
      urgency,
      sentiment,
      priority,
      specialist_agent: specialist,
      is_vip: isVip,
      sla_priority_hours: priority === 'P1_CRITICAL' ? 1 : 4,
      escalation_probability: escalationProb,
      routed_at: new Date().toISOString()
    };

    // Update ticket record with routing attributes
    if (ticket.id) {
      db.update('tickets', t => t.id === ticket.id, {
        category,
        intent,
        priority,
        specialist_agent: specialist,
        routing_info: routingResult
      });

      db.insert('audit_logs', {
        ticket_id: ticket.id,
        actor: 'Intelligent Ticket Router',
        action: 'TICKET_ROUTED',
        details: `Categorized as ${category} (${intent}). Assigned to ${specialist} [Priority: ${priority}, Escalation Prob: ${escalationProb}%].`,
        timestamp: new Date().toISOString()
      });
    }

    return routingResult;
  }
}
