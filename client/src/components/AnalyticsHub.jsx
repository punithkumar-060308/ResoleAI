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
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      
      {/* Analytics Header */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-semibold text-blue-400 mb-1 uppercase tracking-wider">
            <BarChart3 className="w-4 h-4" />
            <span>Support Intelligence Platform Analytics</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-100">Customer Experience & Operational Intelligence</h1>
          <p className="text-xs text-slate-400 mt-1">
            Analyze first-contact resolution rates, retention risk signals, logistics bottlenecks, and root cause distributions.
          </p>
        </div>
      </div>

      {/* Customer Experience KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-panel p-5 rounded-2xl border border-slate-800">
          <p className="text-xs text-slate-400 font-medium">First Contact Resolution (FCR)</p>
          <h3 className="text-2xl font-bold text-emerald-400 mt-1">{data?.kpis?.first_contact_resolution_rate || '76%'}</h3>
          <p className="text-[11px] text-slate-400 mt-2">Cases resolved without follow-up ticket</p>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-slate-800">
          <p className="text-xs text-slate-400 font-medium">Repeat Contact Rate</p>
          <h3 className="text-2xl font-bold text-amber-400 mt-1">{data?.kpis?.repeat_contact_rate || '14%'}</h3>
          <p className="text-[11px] text-slate-400 mt-2">Driven by legacy bot auto-closures</p>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-slate-800">
          <p className="text-xs text-slate-400 font-medium">AI Auto-Resolution Rate</p>
          <h3 className="text-2xl font-bold text-blue-400 mt-1">{data?.kpis?.ai_resolution_rate || '78%'}</h3>
          <p className="text-[11px] text-slate-400 mt-2">Zero human intervention on low risk</p>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-slate-800">
          <p className="text-xs text-slate-400 font-medium">Logistics SLA Breaches</p>
          <h3 className="text-2xl font-bold text-rose-400 mt-1">{data?.kpis?.sla_breaches_detected || 19}</h3>
          <p className="text-[11px] text-slate-400 mt-2">67% originating from SwiftLogistics</p>
        </div>
      </div>

      {/* Intelligence Spotlight Card */}
      <div className="bg-gradient-to-r from-blue-950/60 via-indigo-950/40 to-slate-950 border-2 border-blue-500/40 p-6 rounded-2xl shadow-2xl flex items-start space-x-4">
        <div className="p-3.5 rounded-2xl bg-blue-600/20 text-blue-400 border border-blue-500/30">
          <Lightbulb className="w-6 h-6 animate-pulse" />
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
      <div className="glass-panel p-6 rounded-2xl border border-amber-500/30 space-y-4">
        <h3 className="font-extrabold text-sm text-slate-100 border-b border-slate-800 pb-3 flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-amber-400" />
          <span>Customer Retention Risk Signals</span>
        </h3>

        <div className="space-y-3">
          {data?.retention_risk_signals?.map((sig, idx) => (
            <div key={idx} className="p-4 rounded-xl bg-amber-950/20 border border-amber-500/30 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <span className="font-extrabold text-slate-100">{sig.customer}</span>
                <p className="text-slate-300 mt-0.5">{sig.reason}</p>
              </div>
              <span className="px-2.5 py-1 rounded text-[10px] font-extrabold uppercase bg-amber-500/20 text-amber-300 border border-amber-500/30 shrink-0">
                {sig.risk_level}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Charts Grid 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Ticket Volume & AI Resolution Trend */}
        <div className="lg:col-span-7 glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
          <div className="flex justify-between items-center border-b border-slate-800 pb-3">
            <h3 className="font-extrabold text-sm text-slate-100 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              <span>Weekly Ticket Volume & AI Auto-Resolution</span>
            </h3>
            <span className="text-xs text-emerald-400 font-bold">78% Auto-Resolved</span>
          </div>

          <div className="h-64 w-full">
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
        <div className="lg:col-span-5 glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
          <div className="flex justify-between items-center border-b border-slate-800 pb-3">
            <h3 className="font-extrabold text-sm text-slate-100 flex items-center gap-2">
              <Truck className="w-4 h-4 text-rose-400" />
              <span>Logistics Carrier SLA Breaches</span>
            </h3>
          </div>

          <div className="space-y-4 pt-2">
            {data?.carrier_breakdown?.map((item, idx) => (
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
            ))}
          </div>
        </div>

      </div>

      {/* Charts Grid 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Common Root Causes */}
        <div className="lg:col-span-6 glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
          <h3 className="font-extrabold text-sm text-slate-100 border-b border-slate-800 pb-3 flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-400" />
            <span>Top Identified Root Causes</span>
          </h3>

          <div className="space-y-3 text-xs">
            {data?.root_causes?.map((rc, idx) => (
              <div key={idx} className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-slate-100">{rc.cause}</h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">{rc.count} incidents detected this month</p>
                </div>
                <span className="text-sm font-extrabold text-blue-400 font-mono">{rc.percentage}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Department Escalations */}
        <div className="lg:col-span-6 glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
          <h3 className="font-extrabold text-sm text-slate-100 border-b border-slate-800 pb-3 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-indigo-400" />
            <span>Department Escalation Destinations</span>
          </h3>

          <div className="space-y-3 text-xs">
            {data?.department_escalations?.map((dept, idx) => (
              <div key={idx} className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between">
                <span className="font-semibold text-slate-200">{dept.department}</span>
                <span className="px-2.5 py-1 rounded-full text-xs font-mono font-extrabold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  {dept.count} Escalations
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
