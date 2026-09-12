import React, { useState, useEffect } from 'react';
import { 
  Ticket, 
  CheckCircle, 
  AlertOctagon, 
  Clock, 
  Search, 
  Filter, 
  ArrowUpRight, 
  ShieldAlert, 
  UserCheck, 
  Zap,
  ChevronRight,
  Sparkles
} from 'lucide-react';

export default function DashboardOverview({ onSelectTicket }) {
  const [tickets, setTickets] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const fetchData = async () => {
    setLoading(true);
    try {
      const [tRes, aRes] = await Promise.all([
        fetch('/api/tickets'),
        fetch('/api/analytics')
      ]);
      const tData = await tRes.json();
      const aData = await aRes.json();

      if (tData.success) setTickets(tData.data);
      if (aData.success) setAnalytics(aData.data);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredTickets = tickets.filter(t => {
    if (filter === 'HIGH_RISK' && t.risk_level !== 'HIGH') return false;
    if (filter === 'PENDING' && t.status !== 'AWAITING_HUMAN_APPROVAL' && t.status !== 'PENDING_APPROVAL' && t.status !== 'INVESTIGATING') return false;
    if (filter === 'RESOLVED' && t.status !== 'RESOLVED') return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        t.id.toLowerCase().includes(q) ||
        (t.customer?.name || '').toLowerCase().includes(q) ||
        (t.customer_message || '').toLowerCase().includes(q) ||
        (t.order_id || '').toLowerCase().includes(q)
      );
    }
    return true;
  });

  const getRiskBadge = (risk) => {
    if (risk === 'HIGH' || risk === 'CRITICAL') {
      return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/10 text-rose-400 border border-rose-500/20 flex items-center gap-1"><ShieldAlert className="w-3 h-3"/> High Risk</span>;
    } else if (risk === 'MEDIUM') {
      return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">Medium Risk</span>;
    }
    return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">Low Risk</span>;
  };

  const getStatusBadge = (status) => {
    if (status === 'RESOLVED') {
      return <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">Resolved</span>;
    } else if (status === 'AWAITING_HUMAN_APPROVAL' || status === 'PENDING_APPROVAL') {
      return <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/15 text-amber-300 border border-amber-500/30 animate-pulse">Human Approval</span>;
    } else if (status === 'INVESTIGATING') {
      return <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-blue-500/15 text-blue-300 border border-blue-500/30">Investigating</span>;
    }
    return <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-slate-800 text-slate-300">{status}</span>;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      
      {/* Dashboard Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 glass-panel p-6 rounded-2xl border border-slate-800">
        <div>
          <div className="flex items-center space-x-2 text-xs font-semibold text-blue-400 mb-1 uppercase tracking-wider">
            <Zap className="w-3.5 h-3.5" />
            <span>Autonomous Intelligence Command Center</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-100">ResolveAI Support Operations</h1>
          <p className="text-xs text-slate-400 mt-1">
            Real-time investigation across CRM, Razorpay, Logistics, and Policy Engine.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={fetchData}
            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 text-xs font-medium transition-all"
          >
            Refresh Data
          </button>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="glass-panel p-5 rounded-2xl border border-slate-800">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs text-slate-400 font-medium">Total Tickets Ingested</p>
              <h3 className="text-2xl font-bold text-slate-100 mt-1">{analytics?.kpis?.total_tickets || 45}</h3>
            </div>
            <div className="p-2.5 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400">
              <Ticket className="w-5 h-5" />
            </div>
          </div>
          <p className="text-[11px] text-emerald-400 font-medium mt-3 flex items-center gap-1">
            <ArrowUpRight className="w-3.5 h-3.5" /> +14% vs last week
          </p>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-slate-800">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs text-slate-400 font-medium">AI Autonomous Resolution Rate</p>
              <h3 className="text-2xl font-bold text-emerald-400 mt-1">{analytics?.kpis?.ai_resolution_rate || '78%'}</h3>
            </div>
            <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              <Zap className="w-5 h-5" />
            </div>
          </div>
          <p className="text-[11px] text-slate-400 mt-3">Zero human intervention required on low-risk</p>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-slate-800">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs text-slate-400 font-medium">Human Supervisor Escalations</p>
              <h3 className="text-2xl font-bold text-amber-400 mt-1">{analytics?.kpis?.human_escalation_rate || '22%'}</h3>
            </div>
            <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
              <UserCheck className="w-5 h-5" />
            </div>
          </div>
          <p className="text-[11px] text-amber-400 font-medium mt-3 flex items-center gap-1">
            <ShieldAlert className="w-3.5 h-3.5" /> Risk-aware approval threshold active
          </p>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-slate-800">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs text-slate-400 font-medium">SLA Breaches & Contradictions</p>
              <h3 className="text-2xl font-bold text-rose-400 mt-1">{analytics?.kpis?.sla_breaches_detected || 19}</h3>
            </div>
            <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400">
              <AlertOctagon className="w-5 h-5" />
            </div>
          </div>
          <p className="text-[11px] text-slate-400 mt-3">SwiftLogistics Express (67% breaches)</p>
        </div>

      </div>

      {/* Main Tickets Queue Table */}
      <div className="glass-panel rounded-2xl border border-slate-800 overflow-hidden shadow-2xl">
        
        {/* Table Header & Controls */}
        <div className="p-5 bg-slate-900/90 border-b border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <h2 className="font-bold text-base text-slate-100">Live Investigation Tickets</h2>
            <span className="px-2.5 py-0.5 text-xs font-semibold bg-slate-800 text-slate-300 rounded-full">
              {filteredTickets.length} items
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search ticket, customer, order..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-blue-500 w-60"
              />
            </div>

            {/* Filter Buttons */}
            <div className="flex space-x-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
              <button
                onClick={() => setFilter('ALL')}
                className={`px-3 py-1 rounded-lg font-medium transition-all ${filter === 'ALL' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-slate-200'}`}
              >
                All
              </button>
              <button
                onClick={() => setFilter('HIGH_RISK')}
                className={`px-3 py-1 rounded-lg font-medium transition-all ${filter === 'HIGH_RISK' ? 'bg-rose-600 text-white' : 'text-slate-400 hover:text-slate-200'}`}
              >
                High Risk
              </button>
              <button
                onClick={() => setFilter('PENDING')}
                className={`px-3 py-1 rounded-lg font-medium transition-all ${filter === 'PENDING' ? 'bg-amber-600 text-white' : 'text-slate-400 hover:text-slate-200'}`}
              >
                Pending Approval
              </button>
            </div>
          </div>
        </div>

        {/* Table Content */}
        {loading ? (
          <div className="p-12 text-center text-slate-400 text-xs">Loading tickets database...</div>
        ) : filteredTickets.length === 0 ? (
          <div className="p-12 text-center text-slate-400 text-xs">No tickets matching selected filter.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900/60 text-slate-400 font-semibold border-b border-slate-800 uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="px-5 py-3.5">Ticket ID</th>
                  <th className="px-5 py-3.5">Customer</th>
                  <th className="px-5 py-3.5">Complaint Summary</th>
                  <th className="px-5 py-3.5">Order Ref</th>
                  <th className="px-5 py-3.5">Risk Score</th>
                  <th className="px-5 py-3.5">Status</th>
                  <th className="px-5 py-3.5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredTickets.map((t) => (
                  <tr
                    key={t.id}
                    onClick={() => onSelectTicket(t.id)}
                    className="hover:bg-slate-900/80 cursor-pointer transition-colors group"
                  >
                    <td className="px-5 py-4 font-mono font-bold text-blue-400 flex items-center space-x-2">
                      <span>{t.id}</span>
                      {t.id === 'T-9001' && (
                        <span className="px-1.5 py-0.5 text-[9px] font-bold uppercase bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 rounded">Demo</span>
                      )}
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex items-center space-x-2.5">
                        <img
                          src={t.customer?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"}
                          alt={t.customer?.name}
                          className="w-7 h-7 rounded-full object-cover border border-slate-700"
                        />
                        <div>
                          <p className="font-bold text-slate-200">{t.customer?.name || 'Aarav Sharma'}</p>
                          <p className="text-[10px] text-slate-400">{t.customer?.tier || 'VIP Gold'}</p>
                        </div>
                      </div>
                    </td>

                    <td className="px-5 py-4 max-w-xs">
                      <div className="flex items-center space-x-1.5 mb-1">
                        <span className="px-2 py-0.5 text-[9px] font-extrabold uppercase rounded bg-indigo-500/15 text-indigo-300 border border-indigo-500/30">
                          {t.specialist_agent || t.category || 'Specialist Agent'}
                        </span>
                      </div>
                      <p className="text-slate-300 font-medium truncate">{t.customer_message}</p>
                      <p className="text-[10px] text-slate-500 mt-0.5">{new Date(t.created_at).toLocaleString()}</p>
                    </td>

                    <td className="px-5 py-4 font-mono text-slate-400">
                      {t.order_id || 'ORD9281'}
                    </td>

                    <td className="px-5 py-4">
                      {getRiskBadge(t.risk_level)}
                    </td>

                    <td className="px-5 py-4">
                      {getStatusBadge(t.status)}
                    </td>

                    <td className="px-5 py-4 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectTicket(t.id);
                        }}
                        className="px-3 py-1.5 rounded-lg bg-blue-600/10 hover:bg-blue-600 text-blue-400 hover:text-white border border-blue-500/20 font-semibold text-xs transition-all flex items-center space-x-1 ml-auto group-hover:bg-blue-600 group-hover:text-white"
                      >
                        <span>Investigate</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
}
