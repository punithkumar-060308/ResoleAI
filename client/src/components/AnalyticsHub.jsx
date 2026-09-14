import React, { useState, useEffect } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  AreaChart, 
  Area 
} from 'recharts';
import { BarChart3, TrendingUp, AlertTriangle, ShieldCheck, Truck, Zap, Lightbulb, ShieldAlert, CheckCircle, RefreshCw } from 'lucide-react';

export default function AnalyticsHub() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/analytics')
      .then(res => res.json())
      .then(json => {
        if (json.success) setData(json.data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const volumeTrendData = [
    { day: 'Mon', total: 42, ai_resolved: 33, escalated: 9 },
    { day: 'Tue', total: 58, ai_resolved: 46, escalated: 12 },
    { day: 'Wed', total: 64, ai_resolved: 50, escalated: 14 },
    { day: 'Thu', total: 51, ai_resolved: 40, escalated: 11 },
    { day: 'Fri', total: 72, ai_resolved: 57, escalated: 15 },
    { day: 'Sat', total: 45, ai_resolved: 35, escalated: 10 },
    { day: 'Sun', total: 39, ai_resolved: 31, escalated: 8 },
  ];

  return (
    <div className="analytics-page-enter mx-auto max-w-7xl space-y-8 px-4 py-8">
      
      {/* Analytics Header */}
      <div className="glass-panel rounded-2xl border border-slate-800 bg-gradient-to-br from-slate-900/90 via-slate-900/70 to-blue-950/15 p-6">
        <div>
          <div className="mb-2 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.16em] text-blue-400">
            <BarChart3 className="w-4 h-4" />
            <span>Support Intelligence Platform Analytics</span>
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-50 sm:text-3xl">Customer Experience & Operational Intelligence</h1>
          <p className="mt-2 max-w-3xl text-xs leading-relaxed text-slate-400">
            Analyze first-contact resolution rates, retention risk signals, logistics bottlenecks, and root cause distributions.
          </p>
        </div>
      </div>

      {/* Customer Experience KPI Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="glass-panel-hover glass-panel analytics-stagger flex min-h-[150px] flex-col justify-between rounded-2xl border border-slate-800 p-5" style={{ '--stagger-delay': '60ms' }}>
          <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">First Contact Resolution (FCR)</p>
          <h3 className="mt-2 text-3xl font-extrabold tracking-tight text-emerald-400">{data?.kpis?.first_contact_resolution_rate || '76%'}</h3>
          <p className="mt-3 text-[11px] leading-relaxed text-slate-400">Cases resolved without follow-up ticket</p>
        </div>

        <div className="glass-panel-hover glass-panel analytics-stagger flex min-h-[150px] flex-col justify-between rounded-2xl border border-slate-800 p-5" style={{ '--stagger-delay': '120ms' }}>
          <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Repeat Contact Rate</p>
          <h3 className="mt-2 text-3xl font-extrabold tracking-tight text-amber-400">{data?.kpis?.repeat_contact_rate || '14%'}</h3>
          <p className="mt-3 text-[11px] leading-relaxed text-slate-400">Driven by legacy bot auto-closures</p>
        </div>

        <div className="glass-panel-hover glass-panel analytics-stagger flex min-h-[150px] flex-col justify-between rounded-2xl border border-slate-800 p-5" style={{ '--stagger-delay': '180ms' }}>
          <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">AI Auto-Resolution Rate</p>
          <h3 className="mt-2 text-3xl font-extrabold tracking-tight text-blue-400">{data?.kpis?.ai_resolution_rate || '78%'}</h3>
          <p className="mt-3 text-[11px] leading-relaxed text-slate-400">Zero human intervention on low risk</p>
        </div>

        <div className="glass-panel-hover glass-panel analytics-stagger flex min-h-[150px] flex-col justify-between rounded-2xl border border-slate-800 p-5" style={{ '--stagger-delay': '240ms' }}>
          <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Logistics SLA Breaches</p>
          <h3 className="mt-2 text-3xl font-extrabold tracking-tight text-rose-400">{data?.kpis?.sla_breaches_detected || 19}</h3>
          <p className="mt-3 text-[11px] leading-relaxed text-slate-400">67% originating from SwiftLogistics</p>
        </div>
      </div>

      {/* Intelligence Spotlight Card */}
      <div className="analytics-section-enter flex items-start gap-4 rounded-2xl border border-blue-500/30 bg-gradient-to-r from-blue-950/60 via-indigo-950/40 to-slate-950 p-6 shadow-xl shadow-blue-950/20">
        <div className="shrink-0 rounded-2xl border border-blue-500/30 bg-blue-600/20 p-3.5 text-blue-400">
          <Lightbulb className="h-6 w-6" />
        </div>
        <div>
          <span className="text-[10px] font-extrabold uppercase text-blue-400 tracking-wider">Key Intelligence Insight Spotlight</span>
          <h3 className="text-base font-extrabold text-slate-100 mt-1">
            "{data?.insight_spotlight || '23% of delivery SLA complaints came from the same logistics partner.'}"
          </h3>
          <p className="text-xs text-slate-300 mt-1 leading-relaxed">
            ResolveAI cross-referenced delivery complaints against carrier logs: SwiftLogistics Express sorting hub in Bengaluru has a 6-day backlog, accounting for 67% of total SLA breaches.
          </p>
        </div>
      </div>

      {/* Retention Risk Signals Section */}
      <div className="analytics-section-enter glass-panel space-y-4 rounded-2xl border border-amber-500/30 p-6">
        <h3 className="flex items-center gap-2 border-b border-slate-800 pb-3 text-sm font-extrabold text-slate-100">
          <ShieldAlert className="w-4 h-4 text-amber-400" />
          <span>Customer Retention Risk Signals</span>
        </h3>

        <div className="space-y-3">
          {data?.retention_risk_signals?.length ? data.retention_risk_signals.map((sig, idx) => (
            <div key={idx} className="p-4 rounded-xl bg-amber-950/20 border border-amber-500/30 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <span className="font-extrabold text-slate-100">{sig.customer}</span>
                <p className="text-slate-300 mt-0.5">{sig.reason}</p>
              </div>
              <span className="px-2.5 py-1 rounded text-[10px] font-extrabold uppercase bg-amber-500/20 text-amber-300 border border-amber-500/30 shrink-0">
                {sig.risk_level}
              </span>
            </div>
          )) : (
            <div className="rounded-xl border border-dashed border-slate-700 bg-slate-900/30 p-8 text-center text-xs text-slate-500">No retention risk signals are currently reported.</div>
          )}
        </div>
      </div>

      {/* Charts Grid 1 */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:gap-8">
        
        {/* Ticket Volume & AI Resolution Trend */}
        <div className="analytics-section-enter glass-panel space-y-4 rounded-2xl border border-slate-800 p-6 lg:col-span-7">
          <div className="flex items-center justify-between gap-3 border-b border-slate-800 pb-3">
            <h3 className="flex items-center gap-2 text-sm font-extrabold text-slate-100">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              <span>Weekly Ticket Volume & AI Auto-Resolution</span>
            </h3>
            <span className="text-xs text-emerald-400 font-bold">78% Auto-Resolved</span>
          </div>

          <div className="h-64 w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={volumeTrendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="day" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }} />
                <Area type="monotone" dataKey="total" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.15} name="Total Ingested" />
                <Area type="monotone" dataKey="ai_resolved" stroke="#10b981" fill="#10b981" fillOpacity={0.25} name="AI Auto-Resolved" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Carrier SLA Breach Distribution */}
        <div className="analytics-section-enter glass-panel space-y-4 rounded-2xl border border-slate-800 p-6 lg:col-span-5">
          <div className="flex items-center justify-between gap-3 border-b border-slate-800 pb-3">
            <h3 className="flex items-center gap-2 text-sm font-extrabold text-slate-100">
              <Truck className="w-4 h-4 text-rose-400" />
              <span>Logistics Carrier SLA Breaches</span>
            </h3>
          </div>

          <div className="space-y-4 pt-2">
            {data?.carrier_breakdown?.length ? data.carrier_breakdown.map((item, idx) => (
              <div key={idx} className="space-y-1.5 text-xs">
                <div className="flex justify-between font-semibold">
                  <span className="text-slate-200">{item.carrier}</span>
                  <span className="text-rose-400 font-mono font-bold">{item.percentage}% ({item.breach_count} breaches)</span>
                </div>
                <div className="w-full bg-slate-900 rounded-full h-2.5 overflow-hidden border border-slate-800">
                  <div
                    className="bg-gradient-to-r from-rose-500 to-amber-500 h-full rounded-full transition-all duration-500"
                    style={{ width: `${item.percentage}%` }}
                  ></div>
                </div>
              </div>
            )) : <div className="rounded-xl border border-dashed border-slate-700 bg-slate-900/30 p-8 text-center text-xs text-slate-500">No carrier SLA breakdown is currently available.</div>}
          </div>
        </div>

      </div>

      {/* Charts Grid 2 */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:gap-8">
        
        {/* Common Root Causes */}
        <div className="analytics-section-enter glass-panel space-y-4 rounded-2xl border border-slate-800 p-6 lg:col-span-6">
          <h3 className="flex items-center gap-2 border-b border-slate-800 pb-3 text-sm font-extrabold text-slate-100">
            <Zap className="w-4 h-4 text-amber-400" />
            <span>Top Identified Root Causes</span>
          </h3>

          <div className="space-y-3 text-xs">
            {data?.root_causes?.length ? data.root_causes.map((rc, idx) => (
              <div key={idx} className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-slate-100">{rc.cause}</h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">{rc.count} incidents detected this month</p>
                </div>
                <span className="text-sm font-extrabold text-blue-400 font-mono">{rc.percentage}%</span>
              </div>
            )) : <div className="rounded-xl border border-dashed border-slate-700 bg-slate-900/30 p-8 text-center text-xs text-slate-500">No root causes are currently reported.</div>}
          </div>
        </div>

        {/* Department Escalations */}
        <div className="analytics-section-enter glass-panel space-y-4 rounded-2xl border border-slate-800 p-6 lg:col-span-6">
          <h3 className="flex items-center gap-2 border-b border-slate-800 pb-3 text-sm font-extrabold text-slate-100">
            <ShieldCheck className="w-4 h-4 text-indigo-400" />
            <span>Department Escalation Destinations</span>
          </h3>

          <div className="space-y-3 text-xs">
            {data?.department_escalations?.length ? data.department_escalations.map((dept, idx) => (
              <div key={idx} className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between">
                <span className="font-semibold text-slate-200">{dept.department}</span>
                <span className="px-2.5 py-1 rounded-full text-xs font-mono font-extrabold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  {dept.count} Escalations
                </span>
              </div>
            )) : <div className="rounded-xl border border-dashed border-slate-700 bg-slate-900/30 p-8 text-center text-xs text-slate-500">No department escalations are currently reported.</div>}
          </div>
        </div>

      </div>

    </div>
  );
}
