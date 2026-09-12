import { db } from '../db/database.js';

export class SecurityAgent {
  /**
   * Account & Security Agent investigation module.
   * Inspects InfoSec security logs, IP login anomalies, and account takeover indicators.
   */
  static inspectAccountSecurity(ticket) {
    const customerId = ticket.customer_id;
    const securityEvents = db.find('account_security_events', e => e.customer_id === customerId);
    const kbArticles = db.find('knowledge_articles', a => a.category === 'Security');

    let flagDetected = false;
    let evidenceItem = null;

    if (securityEvents.length > 0) {
      const sec = securityEvents[0];
      flagDetected = true;
      evidenceItem = {
        source: 'InfoSec Audit & Security Threat Monitor',
        type: 'UNAUTHORIZED_LOGIN_THREAT',
        fact: `CRITICAL SECURITY ALERT: Event ${sec.id} (${sec.event_type}) detected from IP ${sec.ip_address} (${sec.location}). Action: ${sec.flagged_action}. Risk Rating: ${sec.risk_rating}.`,
        severity: 'CRITICAL',
        timestamp: sec.timestamp
      };
    } else {
      evidenceItem = {
        source: 'Account Security Engine',
        type: 'SECURITY_VERIFICATION',
        fact: 'Account 2FA and login IP records show normal session activity.',
        severity: 'INFO',
        timestamp: new Date().toISOString()
      };
    }

    return {
      agent_role: 'Account & Security Agent',
      security_flagged: flagDetected,
      security_events: securityEvents,
      knowledge_articles: kbArticles,
      evidence: evidenceItem
    };
  }
}
