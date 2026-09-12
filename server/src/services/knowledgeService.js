import { db } from '../db/database.js';

export class KnowledgeService {
  /**
   * Search knowledge base for relevant articles matching query or ticket category.
   * @param {string} query
   * @param {string} category
   */
  static searchKnowledge(query = '', category = '') {
    const articles = db.find('knowledge_articles');
    const policies = db.find('policies');

    if (!query && !category) {
      return { articles, policies };
    }

    const q = query.toLowerCase();
    const c = category.toLowerCase();

    const matchedArticles = articles.filter(a => {
      const matchCat = c ? (a.category || '').toLowerCase() === c : true;
      const matchText = q 
        ? (a.title.toLowerCase().includes(q) || a.summary.toLowerCase().includes(q) || a.content.toLowerCase().includes(q))
        : true;
      return matchCat && matchText;
    });

    const matchedPolicies = policies.filter(p => {
      const matchCat = c ? (p.category || '').toLowerCase() === c : true;
      const matchText = q 
        ? (p.title.toLowerCase().includes(q) || p.description.toLowerCase().includes(q))
        : true;
      return matchCat && matchText;
    });

    return {
      articles: matchedArticles,
      policies: matchedPolicies
    };
  }

  /**
   * Dynamically match knowledge articles for a ticket.
   */
  static getMatchedKnowledgeForTicket(ticket, investigationContext) {
    const category = ticket.category || 'GENERAL';
    const msg = (ticket.customer_message || '').toLowerCase();

    const { articles, policies } = KnowledgeService.searchKnowledge(msg, category);
    
    // Always include top 2 matched policies or articles
    const combined = [
      ...policies.map(p => ({ type: 'POLICY', id: p.id, title: p.title, category: p.category, content: p.description, code: p.code })),
      ...articles.map(a => ({ type: 'KNOWLEDGE_ARTICLE', id: a.id, title: a.title, category: a.category, content: a.content, code: a.code, source: a.source }))
    ];

    return combined.slice(0, 4);
  }
}
