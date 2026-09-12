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
  RefreshCw,
  Inbox
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
    <div className="dashboard-enter max-w-7xl mx-auto space-y-8 px-4 py-8">
      
      {/* Dashboard Top Banner */}
      <div className="glass-panel flex flex-col justify-between gap-5 rounded-2xl border border-slate-800 bg-gradient-to-br from-slate-900/90 via-slate-900/70 to-blue-950/20 p-6 shadow-xl shadow-slate-950/20 md:flex-row md:items-center">
        <div>
          <div className="mb-2 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.16em] text-blue-400">
            <Zap className="w-3.5 h-3.5" />
            <span>Autonomous Intelligence Command Center</span>
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-50 sm:text-3xl">ResolveAI Support Operations</h1>
          <p className="mt-2 max-w-2xl text-xs leading-relaxed text-slate-400">
            Real-time investigation across CRM, Razorpay, Logistics, and Policy Engine.
          </p>
        </div>

        <div className="flex shrink-0 items-center">
          <button
            onClick={fetchData}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-900/80 px-4 py-2.5 text-xs font-semibold text-slate-200 transition-all duration-200 hover:border-slate-600 hover:bg-slate-800 hover:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/60 focus:ring-offset-2 focus:ring-offset-slate-950 sm:w-auto"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            Refresh Data
          </button>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="dashboard-stagger group glass-panel-hover glass-panel flex min-h-[164px] flex-col justify-between rounded-2xl border border-slate-800 p-5" style={{ '--stagger-delay': '60ms' }}>
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Total Tickets Ingested</p>
              <h3 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-100">{analytics?.kpis?.total_tickets || 45}</h3>
            </div>
            <div className="rounded-xl border border-blue-500/20 bg-blue-500/10 p-2.5 text-blue-400 transition-transform duration-200 group-hover:scale-105">
              <Ticket className="w-5 h-5" />
            </div>
          </div>
          <p className="mt-4 flex items-center gap-1 text-[11px] font-medium text-emerald-400">
            <ArrowUpRight className="w-3.5 h-3.5" /> +14% vs last week
          </p>
        </div>

        <div className="dashboard-stagger group glass-panel-hover glass-panel flex min-h-[164px] flex-col justify-between rounded-2xl border border-slate-800 p-5" style={{ '--stagger-delay': '120ms' }}>
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">AI Autonomous Resolution Rate</p>
              <h3 className="mt-2 text-3xl font-extrabold tracking-tight text-emerald-400">{analytics?.kpis?.ai_resolution_rate || '78%'}</h3>
            </div>
            <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-2.5 text-emerald-400 transition-transform duration-200 group-hover:scale-105">
              <Zap className="w-5 h-5" />
            </div>
          </div>
          <p className="mt-4 text-[11px] leading-relaxed text-slate-400">Zero human intervention required on low-risk</p>
        </div>

        <div className="dashboard-stagger group glass-panel-hover glass-panel flex min-h-[164px] flex-col justify-between rounded-2xl border border-slate-800 p-5" style={{ '--stagger-delay': '180ms' }}>
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Human Supervisor Escalations</p>
              <h3 className="mt-2 text-3xl font-extrabold tracking-tight text-amber-400">{analytics?.kpis?.human_escalation_rate || '22%'}</h3>
            </div>
            <div className="rounded-xl border border-amber-500/20 bg-amber-500/10 p-2.5 text-amber-400 transition-transform duration-200 group-hover:scale-105">
              <UserCheck className="w-5 h-5" />
            </div>
          </div>
          <p className="mt-4 flex items-center gap-1 text-[11px] font-medium text-amber-400">
            <ShieldAlert className="w-3.5 h-3.5" /> Risk-aware approval threshold active
          </p>
        </div>

        <div className="dashboard-stagger group glass-panel-hover glass-panel flex min-h-[164px] flex-col justify-between rounded-2xl border border-slate-800 p-5" style={{ '--stagger-delay': '240ms' }}>
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">SLA Breaches & Contradictions</p>
              <h3 className="mt-2 text-3xl font-extrabold tracking-tight text-rose-400">{analytics?.kpis?.sla_breaches_detected || 19}</h3>
            </div>
            <div className="rounded-xl border border-rose-500/20 bg-rose-500/10 p-2.5 text-rose-400 transition-transform duration-200 group-hover:scale-105">
              <AlertOctagon className="w-5 h-5" />
            </div>
          </div>
          <p className="mt-4 text-[11px] leading-relaxed text-slate-400">SwiftLogistics Express (67% breaches)</p>
        </div>

      </div>

      {/* Main Tickets Queue Table */}
      <div className="glass-panel overflow-hidden rounded-2xl border border-slate-800 shadow-2xl shadow-slate-950/30">
        
        {/* Table Header & Controls */}
        <div className="flex flex-col justify-between gap-4 border-b border-slate-800 bg-slate-900/80 p-5 lg:flex-row lg:items-center">
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-base font-extrabold text-slate-100">Live Investigation Tickets</h2>
              <span className="rounded-full border border-slate-700 bg-slate-800 px-2.5 py-0.5 text-[11px] font-semibold text-slate-300">
              {filteredTickets.length} items
              </span>
            </div>
            <p className="mt-1 text-[11px] text-slate-500">Prioritize active cases, escalations, and tickets requiring attention.</p>
          </div>

          <div className="flex w-full flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center lg:w-auto lg:justify-end">
            {/* Search Input */}
            <div className="relative w-full sm:w-60">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
              <input
                type="text"
                placeholder="Search ticket, customer, order..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                aria-label="Search investigation tickets"
                className="w-full rounded-xl border border-slate-800 bg-slate-950 py-2 pl-9 pr-4 text-xs text-slate-200 transition-colors placeholder:text-slate-600 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>

            {/* Filter Buttons */}
            <div className="grid grid-cols-3 gap-1 rounded-xl border border-slate-800 bg-slate-950 p-1 text-xs sm:flex">
              <button
                onClick={() => setFilter('ALL')}
                className={`rounded-lg px-2.5 py-2 font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50 sm:py-1.5 ${filter === 'ALL' ? 'bg-blue-600 text-white shadow-sm shadow-blue-950/40' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'}`}
              >
                All
              </button>
              <button
                onClick={() => setFilter('HIGH_RISK')}
                className={`rounded-lg px-2.5 py-2 font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-rose-500/50 sm:py-1.5 ${filter === 'HIGH_RISK' ? 'bg-rose-600 text-white shadow-sm shadow-rose-950/40' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'}`}
              >
                High Risk
              </button>
              <button
                onClick={() => setFilter('PENDING')}
                className={`rounded-lg px-2.5 py-2 font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-amber-500/50 sm:py-1.5 ${filter === 'PENDING' ? 'bg-amber-600 text-white shadow-sm shadow-amber-950/40' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'}`}
              >
                Pending Approval
              </button>
            </div>
          </div>
        </div>

        {/* Table Content */}
        {loading ? (
          <div className="p-14 text-center text-slate-400">
            <RefreshCw className="mx-auto mb-3 h-6 w-6 animate-spin text-blue-400" />
            <p className="text-xs font-medium">Loading tickets database...</p>
          </div>
        ) : filteredTickets.length === 0 ? (
          <div className="p-12 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl border border-slate-700 bg-slate-900 text-slate-500">
              <Inbox className="h-6 w-6" />
            </div>
            <h3 className="mt-4 text-sm font-bold text-slate-200">No active investigations</h3>
            <p className="mx-auto mt-1 max-w-sm text-xs leading-relaxed text-slate-500">
              No tickets match the current search or filter. New customer issues requiring investigation will appear here.
            </p>
          </div>
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
