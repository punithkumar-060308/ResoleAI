import React, { useState, useEffect } from 'react';
import { BookOpen, Search, Filter, FileText, Scale, ShieldCheck, Cpu, RefreshCw, Sparkles } from 'lucide-react';

export default function KnowledgeBaseExplorer() {
  const [knowledge, setKnowledge] = useState({ articles: [], policies: [] });
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');

  const fetchKnowledge = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/knowledge');
      const json = await res.json();
      if (json.success) {
        setKnowledge(json.data);
      }
    } catch (err) {
      console.error('Error fetching knowledge:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchKnowledge();
  }, []);

  const filteredArticles = knowledge.articles.filter(a => {
    if (selectedCategory !== 'ALL' && (a.category || '').toLowerCase() !== selectedCategory.toLowerCase()) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return a.title.toLowerCase().includes(q) || a.summary.toLowerCase().includes(q) || a.content.toLowerCase().includes(q);
    }
    return true;
  });

  const filteredPolicies = knowledge.policies.filter(p => {
    if (selectedCategory !== 'ALL' && (p.category || '').toLowerCase() !== selectedCategory.toLowerCase()) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return p.title.toLowerCase().includes(q) || p.description.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      
      {/* Knowledge Base Header */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-semibold text-blue-400 mb-1 uppercase tracking-wider">
            <BookOpen className="w-4 h-4" />
            <span>Knowledge Reasoning Engine Repository</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-100">Enterprise Policy & Troubleshooting Knowledge</h1>
          <p className="text-xs text-slate-400 mt-1">
            Searchable documentation layer referenced dynamically by Qwen for 100% explainable reasoning.
          </p>
        </div>

        {/* Search & Category Controls */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search knowledge articles, policies..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-blue-500 w-64"
            />
          </div>

          <div className="flex space-x-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
            {['ALL', 'Billing', 'Logistics', 'Technical', 'Security'].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 rounded-lg font-medium transition-all ${
                  selectedCategory === cat ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content Grid: Policies (Left) & Knowledge Articles (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Governance Policies */}
        <div className="lg:col-span-6 space-y-4">
          <h3 className="font-extrabold text-sm text-slate-100 flex items-center justify-between border-b border-slate-800 pb-3">
            <span className="flex items-center gap-2">
              <Scale className="w-4 h-4 text-indigo-400" />
              <span>Governance & Compliance Policies ({filteredPolicies.length})</span>
            </span>
          </h3>

          {loading ? (
            <div className="p-8 text-center text-slate-400 text-xs">Loading policies...</div>
          ) : filteredPolicies.length === 0 ? (
            <div className="p-8 text-center text-slate-400 text-xs">No policies match filter.</div>
          ) : (
            <div className="space-y-3">
              {filteredPolicies.map((p) => (
                <div key={p.id} className="glass-panel p-4 rounded-xl border border-slate-800 space-y-2 text-xs">
                  <div className="flex items-center justify-between font-bold">
                    <span className="font-mono text-indigo-400">{p.code}</span>
                    <span className="px-2 py-0.5 text-[10px] rounded bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                      {p.category}
                    </span>
                  </div>
                  <h4 className="font-bold text-slate-100 text-sm">{p.title}</h4>
                  <p className="text-slate-300 leading-relaxed text-[11px]">{p.description}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Troubleshooting & Technical Manuals */}
        <div className="lg:col-span-6 space-y-4">
          <h3 className="font-extrabold text-sm text-slate-100 flex items-center justify-between border-b border-slate-800 pb-3">
            <span className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-blue-400" />
              <span>Troubleshooting & Knowledge Guides ({filteredArticles.length})</span>
            </span>
          </h3>

          {loading ? (
            <div className="p-8 text-center text-slate-400 text-xs">Loading knowledge guides...</div>
          ) : filteredArticles.length === 0 ? (
            <div className="p-8 text-center text-slate-400 text-xs">No knowledge guides match filter.</div>
          ) : (
            <div className="space-y-3">
              {filteredArticles.map((a) => (
                <div key={a.id} className="glass-panel p-4 rounded-xl border border-slate-800 space-y-2 text-xs">
                  <div className="flex items-center justify-between font-bold">
                    <span className="font-mono text-blue-400">{a.code || a.id}</span>
                    <span className="text-[10px] text-slate-400 font-normal">{a.source}</span>
                  </div>
                  <h4 className="font-bold text-slate-100 text-sm">{a.title}</h4>
                  <p className="text-slate-300 leading-relaxed text-[11px] bg-slate-950/60 p-2.5 rounded-lg border border-slate-800/80">
                    {a.content}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
