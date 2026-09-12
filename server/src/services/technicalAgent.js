import { db } from '../db/database.js';

export class TechnicalAgent {
  /**
   * Technical Support Agent investigation module.
   * Checks app crash reports, known bug database, and returns technical findings.
   */
  static inspectTechnicalIssue(ticket) {
    const msg = (ticket.customer_message || '').toLowerCase();
    const technicalIssues = db.find('technical_issues');
    const kbArticles = db.find('knowledge_articles', a => a.category === 'Technical');

    let matchedBug = null;
    let evidenceItem = null;

    if (msg.includes('crash') || msg.includes('checkout') || msg.includes('app')) {
      matchedBug = technicalIssues.find(b => b.id === 'BUG-404') || technicalIssues[0];
    }

    if (matchedBug) {
      evidenceItem = {
        source: 'Engineering Incident DB & Mobile Webview Logs',
        type: 'KNOWN_TECHNICAL_BUG',
        fact: `IDENTIFIED KNOWN ISSUE: Bug ${matchedBug.id} ("${matchedBug.component} Crash"). Patch Status: ${matchedBug.status}. Fix: ${matchedBug.known_fix}.`,
        severity: 'INFO',
        timestamp: new Date().toISOString()
      };
    } else {
      evidenceItem = {
        source: 'Technical Diagnostics',
        type: 'APP_HEALTH_CHECK',
        fact: 'No active mobile application crash incidents reported for user device session.',
        severity: 'INFO',
        timestamp: new Date().toISOString()
      };
    }

    return {
      agent_role: 'Technical Support Agent',
      matched_bug: matchedBug,
      knowledge_articles: kbArticles,
      evidence: evidenceItem
    };
  }
}
