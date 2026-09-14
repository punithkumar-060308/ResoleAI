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
    <div className="knowledge-page-enter mx-auto max-w-7xl space-y-8 px-4 py-8">
      
      {/* Knowledge Base Header */}
      <div className="glass-panel flex flex-col gap-6 rounded-2xl border border-slate-800 bg-gradient-to-br from-slate-900/90 via-slate-900/70 to-blue-950/15 p-6">
        <div>
          <div className="mb-2 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.16em] text-blue-400">
            <BookOpen className="w-4 h-4" />
            <span>Knowledge Reasoning Engine Repository</span>
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-50 sm:text-3xl">Enterprise Policy & Troubleshooting Knowledge</h1>
          <p className="mt-2 max-w-2xl text-xs leading-relaxed text-slate-400">
            Searchable documentation layer referenced dynamically by Qwen for 100% explainable reasoning.
          </p>
        </div>

        {/* Search & Category Controls */}
        <div className="flex flex-col gap-3 xl:flex-row xl:items-center">
          <div className="relative w-full xl:max-w-md xl:flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-blue-400" />
            <input
              type="text"
              placeholder="Search knowledge articles, policies..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="Search knowledge repository"
              className="w-full rounded-xl border border-slate-700 bg-slate-950 py-2.5 pl-10 pr-4 text-xs text-slate-200 transition-colors placeholder:text-slate-600 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>

          <div className="grid grid-cols-3 gap-1 rounded-xl border border-slate-800 bg-slate-950 p-1 text-xs sm:grid-cols-5 xl:flex">
            {['ALL', 'Billing', 'Logistics', 'Technical', 'Security'].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`rounded-lg px-3 py-2 font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50 sm:py-1.5 ${
                  selectedCategory === cat ? 'bg-blue-600 text-white shadow-sm shadow-blue-950/40' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content Grid: Policies (Left) & Knowledge Articles (Right) */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:gap-8">
        
        {/* Left Column: Governance Policies */}
        <div className="space-y-4 lg:col-span-6">
          <h3 className="flex items-center justify-between gap-3 border-b border-slate-800 pb-3 text-sm font-extrabold text-slate-100">
              <span className="flex min-w-0 items-center gap-2">
              <Scale className="w-4 h-4 text-indigo-400" />
                <span>Governance & Compliance Policies ({filteredPolicies.length})</span>
            </span>
          </h3>

          {loading ? (
            <div className="p-10 text-center text-slate-400"><RefreshCw className="mx-auto mb-3 h-6 w-6 animate-spin text-indigo-400" /><p className="text-xs font-medium">Loading policies...</p></div>
          ) : filteredPolicies.length === 0 ? (
            <div className="knowledge-empty-enter rounded-xl border border-dashed border-slate-700 bg-slate-900/30 p-10 text-center text-slate-400"><Scale className="mx-auto mb-3 h-8 w-8 text-slate-600" /><h4 className="text-sm font-bold text-slate-200">No policies match this view</h4><p className="mx-auto mt-1 max-w-xs text-xs leading-relaxed text-slate-500">Try another category or search term to find governance guidance.</p></div>
          ) : (
            <div className="space-y-3">
              {filteredPolicies.map((p) => (
                <div key={p.id} className="glass-panel-hover glass-panel space-y-2 rounded-xl border border-slate-800 p-4 text-xs">
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
        <div className="space-y-4 lg:col-span-6">
          <h3 className="flex items-center justify-between gap-3 border-b border-slate-800 pb-3 text-sm font-extrabold text-slate-100">
            <span className="flex min-w-0 items-center gap-2">
              <FileText className="w-4 h-4 text-blue-400" />
              <span>Troubleshooting & Knowledge Guides ({filteredArticles.length})</span>
            </span>
          </h3>

          {loading ? (
            <div className="p-10 text-center text-slate-400"><RefreshCw className="mx-auto mb-3 h-6 w-6 animate-spin text-blue-400" /><p className="text-xs font-medium">Loading knowledge guides...</p></div>
          ) : filteredArticles.length === 0 ? (
            <div className="knowledge-empty-enter rounded-xl border border-dashed border-slate-700 bg-slate-900/30 p-10 text-center text-slate-400"><FileText className="mx-auto mb-3 h-8 w-8 text-slate-600" /><h4 className="text-sm font-bold text-slate-200">No guides match this view</h4><p className="mx-auto mt-1 max-w-xs text-xs leading-relaxed text-slate-500">Try another category or search term to find troubleshooting guidance.</p></div>
          ) : (
            <div className="space-y-3">
              {filteredArticles.map((a) => (
                <div key={a.id} className="glass-panel-hover glass-panel space-y-2 rounded-xl border border-slate-800 p-4 text-xs">
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
