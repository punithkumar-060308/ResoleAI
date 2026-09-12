import { db } from '../db/database.js';

export class InvestigationService {
  /**
   * Conducts a deep multi-source investigation across CRM, Orders, Billing, Support Logs, and Policies.
   * @param {string} ticketId
   */
  static async investigateTicket(ticketId) {
    const ticket = db.findById('tickets', ticketId);
    if (!ticket) {
      throw new Error(`Ticket ${ticketId} not found`);
    }

    const customerId = ticket.customer_id;
    const customer = db.findById('customers', customerId);
    const orders = db.find('orders', o => o.customer_id === customerId);
    const targetOrder = ticket.order_id 
      ? db.findById('orders', ticket.order_id)
      : (orders.length > 0 ? orders[0] : null);

    const payments = targetOrder 
      ? db.find('payments', p => p.order_id === targetOrder.id || p.customer_id === customerId)
      : db.find('payments', p => p.customer_id === customerId);

    const supportHistory = db.find('support_history', h => h.customer_id === customerId);
    const policies = db.find('policies');

    // 1. Gather Evidence Package
    const evidencePackage = [];
    const contradictions = [];

    // Profile evidence
    if (customer) {
      evidencePackage.push({
        source: 'CRM / Customer Intelligence',
        type: 'CUSTOMER_PROFILE',
        fact: `Customer ${customer.name} (${customer.id}) is a ${customer.tier} tier member. Lifetime Value: ₹${customer.lifetime_value.toLocaleString()}.`,
        severity: 'INFO',
        timestamp: new Date().toISOString()
      });
    }

    // Order & SLA evidence
    if (targetOrder) {
      evidencePackage.push({
        source: 'Order Management System',
        type: 'ORDER_STATUS',
        fact: `Order ${targetOrder.id} placed on ${new Date(targetOrder.order_date).toLocaleDateString()} for ₹${targetOrder.total_amount}. Items: ${targetOrder.items.map(i => i.name).join(', ')}.`,
        severity: 'INFO',
        timestamp: targetOrder.order_date
      });

      if (targetOrder.sla_breached) {
        evidencePackage.push({
          source: 'Logistics SLA Monitoring',
          type: 'SLA_BREACH',
          fact: `Delivery SLA breached by ${targetOrder.delay_days} days! Promised SLA: ${targetOrder.promised_sla_days} days. Carrier: ${targetOrder.carrier}. Tracking status: "${targetOrder.last_hub_location}".`,
          severity: 'HIGH',
          timestamp: new Date().toISOString()
        });
      }
    }

    // Payment evidence & Duplicate payment check
    const successfulPayments = payments.filter(p => p.status === 'SUCCESS' && (!targetOrder || p.order_id === targetOrder.id));
    if (successfulPayments.length > 1) {
      const totalCharged = successfulPayments.reduce((sum, p) => sum + p.amount, 0);
      evidencePackage.push({
        source: 'Billing & Payment Gateway (Razorpay)',
        type: 'DUPLICATE_CHARGE_DETECTED',
        fact: `CRITICAL BILLING DISCREPANCY: Found ${successfulPayments.length} successful charges totaling ₹${totalCharged} for single Order ${targetOrder ? targetOrder.id : ''}. Transactions: ${successfulPayments.map(p => p.transaction_ref).join(', ')}.`,
        severity: 'CRITICAL',
        timestamp: new Date().toISOString()
      });

      contradictions.push({
        system_a: 'Order Management System',
        system_b: 'Billing Payment Gateway',
        conflict: `Order System expects 1 charge of ₹${targetOrder ? targetOrder.total_amount : 0}, but Payment Gateway recorded ${successfulPayments.length} separate successful debits (₹${totalCharged}).`,
        impact: 'Customer was double charged due to gateway retry race condition.'
      });
    } else if (successfulPayments.length === 1) {
      evidencePackage.push({
        source: 'Billing System',
        type: 'PAYMENT_VERIFIED',
        fact: `Single payment of ₹${successfulPayments[0].amount} verified. Txn Ref: ${successfulPayments[0].transaction_ref}.`,
        severity: 'INFO',
        timestamp: successfulPayments[0].timestamp
      });
    }

    // Support history evidence & Bot failure contradiction
    if (supportHistory && supportHistory.length > 0) {
      const recentUnresolved = supportHistory.find(h => h.resolution_status === 'CLOSED_AUTOMATED' || h.customer_rating <= 2);
      if (recentUnresolved) {
        evidencePackage.push({
          source: 'Support History Database',
          type: 'REPEAT_UNRESOLVED_COMPLAINT',
          fact: `Prior support ticket ${recentUnresolved.id} on ${new Date(recentUnresolved.created_at).toLocaleDateString()} was closed automatically without resolving customer's double-charge complaint.`,
          severity: 'WARNING',
          timestamp: recentUnresolved.created_at
        });

        contradictions.push({
          system_a: 'Legacy Bot Support System',
          system_b: 'Customer Reality',
          conflict: `Ticket ${recentUnresolved.id} was marked CLOSED by automated bot, but root issue was unaddressed, causing customer friction and repeat ticket ${ticketId}.`,
          impact: 'Customer satisfaction risk & repeat escalation.'
        });
      }
    }

    // Policy Applicability Check
    const applicablePolicies = [];
    if (successfulPayments.length > 1) {
      const p1 = policies.find(p => p.code === 'DUPLICATE_PAYMENT_REFUND');
      if (p1) applicablePolicies.push(p1);
      const p3 = policies.find(p => p.code === 'HIGH_VALUE_REFUND_APPROVAL');
      if (p3) applicablePolicies.push(p3);
    }

    if (targetOrder && targetOrder.sla_breached) {
      const p2 = policies.find(p => p.code === 'SLA_BREACH_COMPENSATION');
      if (p2) applicablePolicies.push(p2);
      const p4 = policies.find(p => p.code === 'LOGISTICS_ESCALATION_TIER');
      if (p4) applicablePolicies.push(p4);
    }

    // Overall Risk Calculation
    let calculatedRisk = 'LOW';
    if (contradictions.length > 0 || (targetOrder && targetOrder.sla_breached && successfulPayments.length > 1)) {
      calculatedRisk = 'HIGH';
    } else if (targetOrder && targetOrder.sla_breached) {
      calculatedRisk = 'MEDIUM';
    }

    // Investigation Result object
    const investigationId = `INV_${Date.now()}`;
    const investigationResult = {
      id: investigationId,
      ticket_id: ticketId,
      customer_id: customerId,
      order_id: targetOrder ? targetOrder.id : null,
      status: 'COMPLETED',
      calculated_risk: calculatedRisk,
      evidence_count: evidencePackage.length,
      contradiction_count: contradictions.length,
      evidence_package: evidencePackage,
      contradictions: contradictions,
      applicable_policies: applicablePolicies,
      created_at: new Date().toISOString()
    };

    // Store in DB
    db.update('investigations', inv => inv.ticket_id === ticketId, investigationResult);
    if (!db.findOne('investigations', inv => inv.ticket_id === ticketId)) {
      db.insert('investigations', investigationResult);
    }

    // Update ticket status
    db.update('tickets', t => t.id === ticketId, {
      status: 'INVESTIGATED',
      risk_level: calculatedRisk
    });

    // Log to Audit Trail
    db.insert('audit_logs', {
      ticket_id: ticketId,
      actor: 'Multi-Source Investigation Engine',
      action: 'INVESTIGATION_COMPLETED',
      details: `Gathered ${evidencePackage.length} evidence items, detected ${contradictions.length} system contradictions. Risk level evaluated as ${calculatedRisk}.`,
      timestamp: new Date().toISOString()
    });

    return {
      ticket,
      customer,
      order: targetOrder,
      payments,
      support_history: supportHistory,
      investigation: investigationResult
    };
  }
}
