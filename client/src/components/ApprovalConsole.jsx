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
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      
      {/* Header */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 flex items-center justify-between">
        <div>
          <div className="flex items-center space-x-2 text-xs font-semibold text-amber-400 mb-1 uppercase tracking-wider">
            <ShieldAlert className="w-4 h-4" />
            <span>Human-in-the-Loop Governance Queue</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-100">High-Risk Approval Operations</h1>
          <p className="text-xs text-slate-400 mt-1">
            ResolveAI automatically executes low-risk actions. High-value refunds and system contradictions require supervisor signoff.
          </p>
        </div>

        <button
          onClick={fetchPending}
          className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 text-xs font-medium transition-all"
        >
          Refresh Queue
        </button>
      </div>

      {/* Cards List */}
      {loading ? (
        <div className="p-12 text-center text-slate-400 text-xs">Loading queue...</div>
      ) : pendingTickets.length === 0 ? (
        <div className="glass-panel p-12 text-center text-slate-400 rounded-2xl border border-slate-800">
          <ShieldCheck className="w-12 h-12 text-emerald-400 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-200">Approval Queue Cleared</h3>
          <p className="text-xs text-slate-400 mt-1">All high-risk tickets have been reviewed and executed.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {pendingTickets.map((t) => (
            <div key={t.id} className="glass-panel p-6 rounded-2xl border border-amber-500/30 bg-gradient-to-r from-slate-900 via-slate-900 to-amber-950/20 shadow-xl space-y-4">
              
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
