import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  ShieldAlert, 
  CheckCircle2, 
  AlertTriangle, 
  Zap, 
  CreditCard, 
  Truck, 
  FileText, 
  User, 
  Clock, 
  Check, 
  X, 
  Building2, 
  ExternalLink,
  Sparkles,
  RefreshCw,
  Scale
} from 'lucide-react';

export default function TicketDetailView({ ticketId, onBack }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [executing, setExecuting] = useState(false);
  const [executionSuccess, setExecutionSuccess] = useState(false);

  const fetchTicketDetails = async () => {
    setLoading(true);
    try {
      // Trigger investigation if not yet run
      await fetch('/api/investigations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ticket_id: ticketId })
      });

      const res = await fetch(`/api/tickets/${ticketId}`);
      const json = await res.json();
      if (json.success) {
        setData(json.data);
      }
    } catch (err) {
      console.error('Error fetching ticket detail:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (ticketId) fetchTicketDetails();
  }, [ticketId]);

  const handleApproveActions = async () => {
    if (!data?.recommendation?.reasoning_output?.recommended_actions) return;
    setExecuting(true);
    try {
      const actionsToExecute = data.recommendation.reasoning_output.recommended_actions;
      const res = await fetch('/api/actions/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ticket_id: ticketId,
          actions: actionsToExecute,
          supervisor_name: 'Human Supervisor (Admin)',
          note: 'Verified duplicate charge in Razorpay ledger and logistics delay SLA breach.'
        })
      });
      const resJson = await res.json();
      if (resJson.success) {
        setExecutionSuccess(true);
        await fetchTicketDetails();
      }
    } catch (err) {
      console.error('Error executing actions:', err);
    } finally {
      setExecuting(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center text-slate-400">
        <RefreshCw className="w-8 h-8 animate-spin mx-auto text-blue-500 mb-3" />
        <p className="text-xs font-semibold">Gathering multi-source evidence and running Qwen reasoning engine...</p>
      </div>
    );
  }

  const ticket = data?.ticket;
  const customer = data?.customer;
  const order = data?.order;
  const payments = data?.payments || [];
  const investigation = data?.investigation;
  const recommendation = data?.recommendation?.reasoning_output;
  const auditLogs = data?.audit_logs || [];

  const isResolved = ticket?.status === 'RESOLVED';

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      
      {/* Top Header & Back Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center space-x-2 px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 text-xs font-semibold transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Dashboard</span>
        </button>

        <div className="flex items-center space-x-3">
          <span className="text-xs text-slate-400 font-mono">Ticket Ref: {ticketId}</span>
          <span className={`px-3 py-1 rounded-full text-xs font-extrabold uppercase border ${
            isResolved 
              ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
              : 'bg-amber-500/15 text-amber-300 border-amber-500/30 animate-pulse'
          }`}>
            {ticket?.status}
          </span>
        </div>
      </div>

      {/* Customer Profile & Ticket Complaint Summary Header Card */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 grid grid-cols-1 md:grid-cols-12 gap-6">
        
        {/* Customer Avatar & Attributes */}
        <div className="md:col-span-4 flex items-center space-x-4 border-b md:border-b-0 md:border-r border-slate-800 pb-4 md:pb-0 pr-0 md:pr-4">
          <img
            src={customer?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"}
            alt={customer?.name}
            className="w-16 h-16 rounded-2xl object-cover border-2 border-blue-500/40 shadow-xl"
          />
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="font-extrabold text-lg text-slate-100">{customer?.name || 'Aarav Sharma'}</h2>
              <span className="px-2 py-0.5 text-[10px] font-extrabold uppercase bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded">
                {customer?.tier || 'VIP Gold'}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">{customer?.email} • {customer?.phone}</p>
            <div className="flex items-center space-x-3 mt-2 text-[11px] text-slate-400 font-medium">
              <span>Lifetime Value: <strong className="text-emerald-400">₹{customer?.lifetime_value?.toLocaleString()}</strong></span>
              <span>Orders: <strong className="text-slate-200">{customer?.total_orders || 18}</strong></span>
            </div>
          </div>
        </div>

        {/* Ticket Complaint Detail */}
        <div className="md:col-span-8 flex flex-col justify-between">
          <div>
            <span className="text-[10px] font-extrabold uppercase text-blue-400 tracking-wider">Customer Message</span>
            <p className="text-sm font-semibold text-slate-200 mt-1 italic bg-slate-900/60 p-3 rounded-xl border border-slate-800/80">
              "{ticket?.customer_message}"
            </p>
          </div>

          <div className="flex items-center justify-between mt-3 text-xs text-slate-400">
            <span>Ingestion Channel: <strong className="text-slate-200">{ticket?.channel}</strong></span>
            <span>Target Order: <strong className="text-blue-400 font-mono">{ticket?.order_id}</strong></span>
            <span>Created: <strong className="text-slate-200">{new Date(ticket?.created_at).toLocaleString()}</strong></span>
          </div>
        </div>

      </div>

      {/* Contradiction Alert Banner (If contradictions exist) */}
      {investigation?.contradictions && investigation.contradictions.length > 0 && (
        <div className="bg-rose-950/40 border-2 border-rose-500/50 p-5 rounded-2xl shadow-xl flex items-start space-x-4">
          <div className="p-3 rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/30">
            <ShieldAlert className="w-6 h-6 animate-bounce" />
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-sm text-rose-200 uppercase tracking-wider flex items-center gap-2">
                <span>Contradiction Engine Alert</span>
                <span className="px-2 py-0.5 text-[10px] bg-rose-500 text-slate-950 rounded font-bold">
                  {investigation.contradiction_count} System Discrepancies Flagged
                </span>
              </h3>
            </div>
            {investigation.contradictions.map((c, idx) => (
              <div key={idx} className="mt-2 text-xs text-rose-300/90 leading-relaxed bg-rose-900/30 p-2.5 rounded-lg border border-rose-800/40">
                <p><strong>Conflict ({c.system_a} vs {c.system_b}):</strong> {c.conflict}</p>
                <p className="mt-0.5 text-rose-200"><strong>Business Impact:</strong> {c.impact}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Main Grid: Multi-Source Evidence Timeline (Left) & Qwen Reasoning + Human Approval (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Multi-Source Evidence Package */}
        <div className="lg:col-span-6 space-y-6">
          
          <div className="glass-panel p-5 rounded-2xl border border-slate-800">
            <h3 className="font-extrabold text-sm text-slate-100 flex items-center gap-2 mb-4 border-b border-slate-800 pb-3">
              <FileText className="w-4 h-4 text-blue-400" />
              <span>Multi-Source Investigation Evidence</span>
              <span className="ml-auto text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
                {investigation?.evidence_package?.length || 0} Facts Verified
              </span>
            </h3>

            {/* Evidence List */}
            <div className="space-y-3.5">
              {investigation?.evidence_package?.map((ev, idx) => (
                <div
                  key={idx}
                  className={`p-3.5 rounded-xl border text-xs leading-relaxed transition-all ${
                    ev.severity === 'CRITICAL'
                      ? 'bg-rose-950/30 border-rose-500/30 text-rose-200'
                      : ev.severity === 'HIGH'
                      ? 'bg-amber-950/30 border-amber-500/30 text-amber-200'
                      : 'bg-slate-900/60 border-slate-800 text-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between font-bold mb-1">
                    <span className="text-[11px] uppercase tracking-wider text-blue-400">{ev.source}</span>
                    <span className={`text-[9px] px-1.5 py-0.5 rounded font-extrabold ${
                      ev.severity === 'CRITICAL' ? 'bg-rose-500 text-slate-950' : 'bg-slate-800 text-slate-400'
                    }`}>
                      {ev.type}
                    </span>
                  </div>
                  <p className="font-medium">{ev.fact}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Applicable Policies Card */}
          <div className="glass-panel p-5 rounded-2xl border border-slate-800">
            <h3 className="font-extrabold text-sm text-slate-100 flex items-center gap-2 mb-4 border-b border-slate-800 pb-3">
              <Scale className="w-4 h-4 text-indigo-400" />
              <span>Matching Enterprise Rules & Policies</span>
            </h3>

            <div className="space-y-3">
              {investigation?.applicable_policies?.map((pol) => (
                <div key={pol.id} className="p-3 rounded-xl bg-slate-900/70 border border-slate-800 text-xs">
                  <div className="flex items-center justify-between font-bold text-slate-200 mb-1">
                    <span className="text-indigo-400 font-mono">{pol.code}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                      {pol.category}
                    </span>
                  </div>
                  <h4 className="font-bold text-slate-100">{pol.title}</h4>
                  <p className="text-slate-400 text-[11px] mt-1">{pol.description}</p>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Column: Qwen Reasoning & Human Approval Console */}
        <div className="lg:col-span-6 space-y-6">
          
          {/* Qwen AI Reasoning Card */}
          <div className="glass-panel p-6 rounded-2xl border border-slate-800 bg-gradient-to-br from-slate-900 via-slate-900/90 to-slate-950">
            <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-lg bg-blue-600/20 border border-blue-500/30 flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-blue-400" />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm text-slate-100">Qwen AI Root Cause Engine</h3>
                  <p className="text-[10px] text-slate-400">Autonomous Reasoning & JSON Decision Output</p>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-full text-xs font-extrabold bg-blue-500/10 text-blue-400 border border-blue-500/20">
                Confidence: 99.4%
              </span>
            </div>

            {/* Root Causes Section */}
            <div className="space-y-4">
              <div>
                <span className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">Identified Root Causes</span>
                <ul className="mt-2 space-y-2 text-xs">
                  {recommendation?.root_causes?.map((rc, idx) => (
                    <li key={idx} className="flex items-start space-x-2 bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/80 text-slate-200">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5 shrink-0"></span>
                      <span>{rc}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Recommended Actions Breakdown */}
              <div>
                <span className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">Recommended Autonomous Actions</span>
                <div className="mt-2 space-y-2 text-xs">
                  {recommendation?.recommended_actions?.map((act, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                      <div>
                        <span className="font-bold text-slate-100">{act.title}</span>
                        <p className="text-[11px] text-slate-400 mt-0.5">{act.reason}</p>
                      </div>
                      <div className="text-right">
                        {act.amount > 0 && <span className="font-extrabold text-emerald-400 text-sm">₹{act.amount}</span>}
                        <span className={`block text-[9px] font-bold uppercase ${act.risk_level === 'HIGH' ? 'text-rose-400' : 'text-emerald-400'}`}>
                          {act.risk_level} RISK
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>

          {/* Human Supervisor Approval Console */}
          <div className={`glass-panel p-6 rounded-2xl border transition-all ${
            isResolved
              ? 'border-emerald-500/30 bg-emerald-950/10'
              : 'border-amber-500/40 bg-gradient-to-br from-amber-950/20 to-slate-950 pulse-glow'
          }`}>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-extrabold text-sm text-slate-100 flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-amber-400" />
                <span>Human Supervisor Approval Console</span>
              </h3>
              <span className={`px-2.5 py-0.5 text-[10px] font-extrabold uppercase rounded ${
                isResolved ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'
              }`}>
                {isResolved ? 'APPROVED & EXECUTED' : 'REQUIRES SUPERVISOR SIGNOFF'}
              </span>
            </div>

            <p className="text-xs text-slate-300 mb-4 leading-relaxed">
              {recommendation?.human_approval_reason || "Refund amount exceeds auto-approval policy threshold."}
            </p>

            {isResolved || executionSuccess ? (
              <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold flex items-center space-x-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                <span>Actions verified & executed! ₹4,999 refund initiated via Razorpay and ₹500 voucher issued to Aarav Sharma.</span>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800 text-[11px] text-slate-300 space-y-1">
                  <div className="flex justify-between"><span>Action 1: Refund Duplicate Debit</span> <strong className="text-emerald-400">₹4,999</strong></div>
                  <div className="flex justify-between"><span>Action 2: SLA Breach Courtesy Voucher</span> <strong className="text-emerald-400">₹500</strong></div>
                  <div className="flex justify-between"><span>Action 3: Carrier Priority Escalation</span> <strong className="text-slate-200">SwiftLogistics</strong></div>
                </div>

                <div className="flex items-center space-x-3 pt-1">
                  <button
                    onClick={handleApproveActions}
                    disabled={executing}
                    className="flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold text-xs shadow-lg shadow-emerald-600/30 flex items-center justify-center space-x-2 transition-all disabled:opacity-50"
                  >
                    {executing ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>Executing Ledger Disbursement...</span>
                      </>
                    ) : (
                      <>
                        <Check className="w-4 h-4" />
                        <span>1-Click Approve & Execute Actions</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Audit Logs Trail */}
          <div className="glass-panel p-5 rounded-2xl border border-slate-800">
            <h3 className="font-extrabold text-sm text-slate-100 flex items-center gap-2 mb-3 border-b border-slate-800 pb-2">
              <Clock className="w-4 h-4 text-slate-400" />
              <span>Immutable Audit Trail Ledger</span>
            </h3>

            <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
              {auditLogs.map((log) => (
                <div key={log.id} className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800/80 text-[11px]">
                  <div className="flex items-center justify-between text-slate-400 font-mono mb-0.5">
                    <span className="font-bold text-blue-400">{log.actor}</span>
                    <span>{new Date(log.timestamp).toLocaleTimeString()}</span>
                  </div>
                  <p className="text-slate-200 font-medium">{log.details}</p>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
