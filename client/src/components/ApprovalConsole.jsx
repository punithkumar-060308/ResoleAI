import React, { useState, useEffect } from 'react';
import { ShieldCheck, ShieldAlert, Check, X, RefreshCw, Sparkles, ExternalLink } from 'lucide-react';

export default function ApprovalConsole({ onSelectTicket }) {
  const [pendingTickets, setPendingTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [executingId, setExecutingId] = useState(null);

  const fetchPending = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/tickets');
      const json = await res.json();
      if (json.success) {
        // Filter tickets that need human approval or are pending
        const filtered = json.data.filter(t => 
          t.risk_level === 'HIGH' || 
          t.status === 'AWAITING_HUMAN_APPROVAL' || 
          t.status === 'PENDING_APPROVAL' ||
          t.id === 'T-9001'
        );
        setPendingTickets(filtered);
      }
    } catch (err) {
      console.error('Error fetching pending approvals:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPending();
  }, []);

  const handleExecute = async (ticketId) => {
    setExecutingId(ticketId);
    try {
      const recRes = await fetch(`/api/tickets/${ticketId}`);
      const recJson = await recRes.json();
      const actions = recJson.data?.recommendation?.reasoning_output?.recommended_actions || [
        { action_type: 'INITIATE_REFUND', amount: 4999, reason: 'Duplicate payment refund', policy_code: 'POL-001' }
      ];

      await fetch('/api/actions/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ticket_id: ticketId,
          actions,
          supervisor_name: 'Human Supervisor (Admin)'
        })
      });

      await fetchPending();
    } catch (err) {
      console.error('Error approving ticket:', err);
    } finally {
      setExecutingId(null);
    }
  };

  return (
    <div className="approval-page-enter mx-auto max-w-7xl space-y-8 px-4 py-8">
      
      {/* Header */}
      <div className="glass-panel flex flex-col justify-between gap-5 rounded-2xl border border-amber-500/20 bg-gradient-to-br from-slate-900/90 via-slate-900/70 to-amber-950/10 p-6 md:flex-row md:items-center">
        <div>
          <div className="mb-2 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.16em] text-amber-400">
            <ShieldAlert className="w-4 h-4" />
            <span>Human-in-the-Loop Governance Queue</span>
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-50 sm:text-3xl">High-Risk Approval Operations</h1>
          <p className="mt-2 max-w-2xl text-xs leading-relaxed text-slate-400">
            ResolveAI automatically executes low-risk actions. High-value refunds and system contradictions require supervisor signoff.
          </p>
        </div>

        <button
          onClick={fetchPending}
          className="flex w-full shrink-0 items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-900/80 px-4 py-2.5 text-xs font-semibold text-slate-200 transition-all duration-200 hover:border-slate-600 hover:bg-slate-800 hover:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50 sm:w-auto"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          Refresh Queue
        </button>
      </div>

      {/* Cards List */}
      {loading ? (
        <div className="p-14 text-center text-slate-400">
          <RefreshCw className="mx-auto mb-3 h-6 w-6 animate-spin text-amber-400" />
          <p className="text-xs font-medium">Loading approval queue...</p>
        </div>
      ) : pendingTickets.length === 0 ? (
        <div className="approval-empty-enter glass-panel rounded-2xl border border-emerald-500/20 bg-gradient-to-b from-emerald-950/15 to-slate-900/40 p-12 text-center text-slate-400">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 shadow-lg shadow-emerald-950/20">
            <ShieldCheck className="h-8 w-8" />
          </div>
          <h3 className="mt-5 text-lg font-extrabold text-slate-100">Nothing currently requires approval</h3>
          <p className="mx-auto mt-2 max-w-md text-xs leading-relaxed text-slate-400">All high-risk actions have been reviewed and executed. ResolveAI continues to handle low-risk actions automatically.</p>
          <div className="mx-auto mt-5 inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-emerald-300">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            Governance queue clear
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {pendingTickets.map((t) => (
            <div key={t.id} className="glass-panel approval-item-enter space-y-4 rounded-2xl border border-amber-500/30 bg-gradient-to-r from-slate-900 via-slate-900 to-amber-950/20 p-6 shadow-xl">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
                <div className="flex items-center space-x-3">
                  <span className="font-mono text-base font-bold text-blue-400">{t.id}</span>
                  <span className="px-2.5 py-0.5 rounded text-[10px] font-extrabold uppercase bg-rose-500/20 text-rose-300 border border-rose-500/30">
                    High Risk Threshold
                  </span>
                  <span className="text-xs text-slate-400">Customer: <strong className="text-slate-200">{t.customer?.name || 'Aarav Sharma'}</strong></span>
                </div>

                <button
                  onClick={() => onSelectTicket(t.id)}
                  className="text-xs font-semibold text-blue-400 hover:underline flex items-center gap-1"
                >
                  <span>Inspect Evidence Timeline</span>
                  <ExternalLink className="w-3 h-3" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 text-xs">
                <div className="md:col-span-8 bg-slate-950/60 p-4 rounded-xl border border-slate-800">
                  <span className="text-[10px] font-extrabold uppercase text-slate-400">Customer Complaint</span>
                  <p className="text-slate-200 italic font-medium mt-1">"{t.customer_message}"</p>
                  
                  <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                    <span>Order: <strong className="text-slate-200 font-mono">{t.order_id || 'ORD9281'}</strong></span>
                    <span>Reason for Review: <strong className="text-amber-300 font-medium">Duplicate Refund ₹4,999 exceeds Policy POL-003 limit</strong></span>
                  </div>
                </div>

                <div className="md:col-span-4 flex flex-col justify-between bg-amber-950/20 p-4 rounded-xl border border-amber-500/30">
                  <div>
                    <span className="text-[10px] font-extrabold uppercase text-amber-300">Pending Actions</span>
                    <ul className="mt-1.5 space-y-1 text-[11px] text-slate-200 font-medium">
                      <li>• Refund ₹4,999 to original card/UPI</li>
                      <li>• Issue ₹500 SLA courtesy voucher</li>
                      <li>• Escalate to SwiftLogistics Regional Manager</li>
                    </ul>
                  </div>

                  {t.status === 'RESOLVED' ? (
                    <span className="mt-3 px-3 py-1.5 text-center rounded-lg bg-emerald-500/20 text-emerald-300 font-bold text-xs border border-emerald-500/30">
                      Approved & Executed
                    </span>
                  ) : (
                    <button
                      onClick={() => handleExecute(t.id)}
                      disabled={executingId === t.id}
                      className="mt-3 py-2 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs shadow-lg shadow-emerald-600/30 flex items-center justify-center space-x-1.5 transition-all disabled:opacity-50"
                    >
                      {executingId === t.id ? (
                        <>
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                          <span>Processing...</span>
                        </>
                      ) : (
                        <>
                          <Check className="w-4 h-4" />
                          <span>Approve All Actions</span>
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>

            </div>
          ))}
        </div>
      )}

    </div>
  );
}
