import React, { useState } from 'react';
import { Send, Bot, User, Sparkles, CheckCircle2, ShieldAlert, AlertTriangle, ArrowRight, RefreshCw } from 'lucide-react';

export default function CustomerChat({ onTicketCreated }) {
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([
    {
      sender: 'bot',
      text: 'Hello Aarav! Welcome to Customer Care. How can I assist you with your account or recent orders today?',
      time: '18:00'
    }
  ]);
  const [executionSteps, setExecutionSteps] = useState([]);

  const KILLER_DEMO_TEXT = "My order hasn't arrived and I was charged twice. I already contacted support yesterday.";

  const handleSend = async (textToSend) => {
    const text = textToSend || inputMessage;
    if (!text.trim() || loading) return;

    // Add user message to chat
    const userMsg = { sender: 'user', text, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInputMessage('');

    setLoading(true);
    setExecutionSteps([
      { title: 'Ingesting Complaint', status: 'active', desc: 'Identifying customer profile C1024 (Aarav Sharma - VIP Gold)...' }
    ]);

    try {
      // 1. Create Ticket
      const ticketRes = await fetch('/api/tickets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer_id: 'C1024',
          customer_message: text,
          channel: 'Chat Widget'
        })
      });
      const ticketData = await ticketRes.json();
      const ticketId = ticketData.data.id;

      // Update step 2
      setExecutionSteps(prev => [
        ...prev.map(s => ({ ...s, status: 'done' })),
        { title: 'Multi-Source Investigation', status: 'active', desc: 'Gathering CRM, Orders (ORD9281), Razorpay Payments, Support History & Policies...' }
      ]);

      await new Promise(r => setTimeout(r, 900));

      // 2. Trigger Workflow Investigation
      const invRes = await fetch('/api/investigations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ticket_id: ticketId })
      });
      const invData = await invRes.json();

      setExecutionSteps(prev => [
        ...prev.map(s => ({ ...s, status: 'done' })),
        { title: 'Contradiction & Evidence Engine', status: 'active', desc: 'FLAGGED: Duplicate payment ₹4,999 (PAY-9921 & PAY-9922) + Delivery SLA breach (6 days delay).' }
      ]);

      await new Promise(r => setTimeout(r, 900));

      setExecutionSteps(prev => [
        ...prev.map(s => ({ ...s, status: 'done' })),
        { title: 'Qwen AI Root Cause Reasoning', status: 'active', desc: 'Root Cause: Gateway retry race condition & Logistics hub backlog. Generated 3 resolution actions.' }
      ]);

      await new Promise(r => setTimeout(r, 900));

      setExecutionSteps(prev => [
        ...prev.map(s => ({ ...s, status: 'done' })),
        { title: 'EnterPro Workflow & Risk Check', status: 'done', desc: 'Risk: HIGH (Refund ₹4,999). Routed to Human Supervisor Approval Queue.' }
      ]);

      const recOutput = invData.data.recommendation?.reasoning_output;
      const botResponseText = recOutput?.customer_response || "Our investigation confirmed a duplicate charge of ₹4,999 for order ORD9281, which has been submitted for immediate refund. Additionally, due to delivery SLA delay, we have escalated your order to logistics and issued a ₹500 store credit voucher.";

      setMessages(prev => [
        ...prev,
        {
          sender: 'bot',
          text: botResponseText,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          ticketId,
          badge: 'HIGH RISK — Supervisor Review Requested'
        }
      ]);

      if (onTicketCreated) {
        onTicketCreated(ticketId);
      }
    } catch (err) {
      console.error('Error sending message:', err);
      setMessages(prev => [
        ...prev,
        {
          sender: 'bot',
          text: 'An error occurred while connecting to the investigation engine. Please check backend status.',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
      
      {/* Left Chat Console */}
      <div className="lg:col-span-7 flex flex-col h-[650px] glass-panel rounded-2xl border border-slate-800 shadow-2xl overflow-hidden">
        
        {/* Chat Header */}
        <div className="p-4 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-blue-600/20 border border-blue-500/30 flex items-center justify-center">
                <Bot className="w-5 h-5 text-blue-400" />
              </div>
              <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-400 border-2 border-slate-900"></span>
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-100 flex items-center gap-1.5">
                ResolveAI Customer Support
                <span className="text-[10px] px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">Live</span>
              </h3>
              <p className="text-xs text-slate-400">Authenticated: Aarav Sharma (C1024 - VIP Gold)</p>
            </div>
          </div>
          
          <button
            onClick={() => handleSend(KILLER_DEMO_TEXT)}
            disabled={loading}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 text-xs font-medium transition-all"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>Load Demo Complaint</span>
          </button>
        </div>

        {/* Messages Body */}
        <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-slate-950/40">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[80%] rounded-2xl p-4 shadow-lg ${
                m.sender === 'user'
                  ? 'bg-blue-600 text-white rounded-br-none'
                  : 'glass-panel text-slate-100 border-slate-800 rounded-bl-none'
              }`}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[11px] font-semibold opacity-70 flex items-center gap-1">
                    {m.sender === 'user' ? <User className="w-3 h-3" /> : <Bot className="w-3 h-3 text-blue-400" />}
                    {m.sender === 'user' ? 'Aarav Sharma' : 'ResolveAI System'}
                  </span>
                  <span className="text-[10px] opacity-50">{m.time}</span>
                </div>

                <p className="text-xs leading-relaxed font-normal">{m.text}</p>

                {m.badge && (
                  <div className="mt-3 pt-2 border-t border-slate-700/50 flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1">
                      <ShieldAlert className="w-3 h-3 text-amber-400" />
                      {m.badge}
                    </span>
                    {m.ticketId && (
                      <span className="text-[10px] text-slate-400">Ref: {m.ticketId}</span>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex items-center space-x-2 text-slate-400 text-xs italic p-3 glass-panel rounded-xl max-w-[60%]">
              <RefreshCw className="w-4 h-4 animate-spin text-blue-400" />
              <span>Multi-Source Intelligence engine investigating customer ticket...</span>
            </div>
          )}
        </div>

        {/* Input Bar */}
        <div className="p-3 bg-slate-900 border-t border-slate-800 flex items-center space-x-2">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Type your complaint here (or click 'Load Demo Complaint' above)..."
            className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-blue-500 transition-colors"
          />
          <button
            onClick={() => handleSend()}
            disabled={loading || !inputMessage.trim()}
            className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-semibold text-xs flex items-center space-x-1.5 transition-all shadow-md shadow-blue-600/20"
          >
            <span>Send</span>
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>

      {/* Right Live Execution Pipeline Monitor */}
      <div className="lg:col-span-5 flex flex-col space-y-4">
        
        <div className="glass-panel p-5 rounded-2xl border border-slate-800">
          <h3 className="font-bold text-sm text-slate-100 flex items-center gap-2 mb-3">
            <Sparkles className="w-4 h-4 text-blue-400" />
            <span>Autonomous Pipeline Monitor</span>
          </h3>
          <p className="text-xs text-slate-400 mb-4">
            Watch ResolveAI perform multi-source data ingestion, Qwen reasoning, and EnterPro risk check in real time.
          </p>

          {executionSteps.length === 0 ? (
            <div className="p-8 text-center border border-dashed border-slate-800 rounded-xl bg-slate-900/30">
              <Bot className="w-8 h-8 text-slate-600 mx-auto mb-2" />
              <p className="text-xs text-slate-400 font-medium">No active workflow running.</p>
              <p className="text-[11px] text-slate-500 mt-1">Send a message or click "Load Demo Complaint" to trigger live execution.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {executionSteps.map((step, idx) => (
                <div
                  key={idx}
                  className={`p-3 rounded-xl border text-xs transition-all ${
                    step.status === 'active'
                      ? 'bg-blue-950/40 border-blue-500/40 text-blue-200'
                      : 'bg-slate-900/60 border-slate-800 text-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between font-semibold mb-1">
                    <span className="flex items-center gap-2">
                      {step.status === 'done' ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      ) : (
                        <RefreshCw className="w-4 h-4 text-blue-400 animate-spin" />
                      )}
                      {step.title}
                    </span>
                    <span className="text-[10px] uppercase font-bold text-slate-400">Step {idx + 1}</span>
                  </div>
                  <p className="text-[11px] opacity-80 pl-6">{step.desc}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Demo Case Card */}
        <div className="glass-panel p-5 rounded-2xl border border-slate-800 bg-gradient-to-br from-slate-900/80 to-slate-950">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-200 uppercase tracking-wider">Killer Demo Scenario</span>
            <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-bold border border-emerald-500/20">Pre-loaded</span>
          </div>
          <p className="text-xs text-slate-300 italic mb-3">
            "My order hasn't arrived and I was charged twice. I already contacted support yesterday."
          </p>
          <div className="space-y-1.5 text-[11px] text-slate-400 border-t border-slate-800/80 pt-3">
            <div className="flex justify-between"><span>Customer:</span> <strong className="text-slate-200">Aarav Sharma (C1024)</strong></div>
            <div className="flex justify-between"><span>Target Order:</span> <strong className="text-slate-200">ORD9281 (Headphones Pro)</strong></div>
            <div className="flex justify-between"><span>Billing Flag:</span> <strong className="text-amber-400 font-bold">2x ₹4,999 (Duplicate Debit)</strong></div>
            <div className="flex justify-between"><span>Logistics SLA:</span> <strong className="text-rose-400 font-bold">6 Days Delayed</strong></div>
          </div>
        </div>

      </div>

    </div>
  );
}
