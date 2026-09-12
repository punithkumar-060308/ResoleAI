import React, { useState } from 'react';
import { Send, Bot, User, Sparkles, CheckCircle2, ShieldAlert, Cpu, Lock, RefreshCw } from 'lucide-react';

export default function CustomerChat({ onTicketCreated }) {
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([
    {
      sender: 'bot',
      text: 'Hello! Welcome to Customer Care. How can I assist you with your account, orders, or technical queries today?',
      time: '18:00'
    }
  ]);
  const [executionSteps, setExecutionSteps] = useState([]);

  const DEMO_CASES = [
    {
      id: 'demo1',
      title: 'Demo 1: Billing & SLA Breach',
      customer_id: 'C1024',
      name: 'Aarav Sharma',
      text: "My order hasn't arrived and I was charged twice. I already contacted support yesterday."
    },
    {
      id: 'demo2',
      title: 'Demo 2: Technical Checkout Crash',
      customer_id: 'C1025',
      name: 'Priya Nair',
      text: "My app crashes whenever I open checkout to place an order."
    },
    {
      id: 'demo3',
      title: 'Demo 3: Account Security Alert',
      customer_id: 'C1026',
      name: 'Rohan Verma',
      text: "I think someone changed my account email without my permission."
    }
  ];

  const handleSend = async (demoCase) => {
    let text = inputMessage;
    let customerId = 'C1024';
    let customerName = 'Aarav Sharma';

    if (demoCase) {
      text = demoCase.text;
      customerId = demoCase.customer_id;
      customerName = demoCase.name;
    }

    if (!text.trim() || loading) return;

    // Add user message to chat
    const userMsg = { sender: 'user', text, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), customerName };
    setMessages(prev => [...prev, userMsg]);
    if (!demoCase) setInputMessage('');

    setLoading(true);
    setExecutionSteps([
      { title: 'Intelligent Ticket Router', status: 'active', desc: `Analyzing intent & sentiment for ${customerName} (${customerId})...` }
    ]);

    try {
      // 1. Create Ticket
      const ticketRes = await fetch('/api/tickets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer_id: customerId,
          customer_message: text,
          channel: 'Chat Widget'
        })
      });
      const ticketData = await ticketRes.json();
      const ticketId = ticketData.data.id;

      // Update step 2
      setExecutionSteps(prev => [
        ...prev.map(s => ({ ...s, status: 'done' })),
        { title: 'Multi-Agent Investigation Engine', status: 'active', desc: 'Querying Billing, Order, Technical & Security Specialist Agents...' }
      ]);

      await new Promise(r => setTimeout(r, 800));

      // 2. Trigger Workflow Investigation
      const invRes = await fetch('/api/investigations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ticket_id: ticketId })
      });
      const invData = await invRes.json();
      const routing = invData.data?.investigation?.routing_info;

      setExecutionSteps(prev => [
        ...prev.map(s => ({ ...s, status: 'done' })),
        { title: 'Knowledge Reasoning Engine', status: 'active', desc: `Assigned: ${routing?.specialist_agent || 'Specialist Agent'}. Matched KB rules & policies.` }
      ]);

      await new Promise(r => setTimeout(r, 800));

      setExecutionSteps(prev => [
        ...prev.map(s => ({ ...s, status: 'done' })),
        { title: 'Qwen AI Root Cause Analysis', status: 'active', desc: 'Extracted root causes & formulated context-aware resolution.' }
      ]);

      await new Promise(r => setTimeout(r, 800));

      const isHighRisk = invData.data?.investigation?.calculated_risk === 'HIGH';

      setExecutionSteps(prev => [
        ...prev.map(s => ({ ...s, status: 'done' })),
        { title: 'EnterPro Action & Risk Check', status: 'done', desc: isHighRisk ? 'Risk: HIGH -> Routed to Human Supervisor Approval.' : 'Risk: LOW -> Safe action auto-executed & resolved.' }
      ]);

      const recOutput = invData.data.recommendation?.reasoning_output;
      const botResponseText = recOutput?.customer_response || "Our investigation has analyzed your request and initiated resolution.";

      setMessages(prev => [
        ...prev,
        {
          sender: 'bot',
          text: botResponseText,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          ticketId,
          badge: isHighRisk ? 'HIGH RISK — Human Review Requested' : 'AUTO-RESOLVED — Low Risk Action Completed'
        }
      ]);

      if (onTicketCreated) {
        onTicketCreated(ticketId);
      }
    } catch (err) {
      console.error('Error sending message:', err);
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
              <p className="text-xs text-slate-400">Autonomous Multi-Agent Intelligence</p>
            </div>
          </div>
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
                    {m.sender === 'user' ? (m.customerName || 'Customer') : 'ResolveAI System'}
                  </span>
                  <span className="text-[10px] opacity-50">{m.time}</span>
                </div>

                <p className="text-xs leading-relaxed font-normal">{m.text}</p>

                {m.badge && (
                  <div className="mt-3 pt-2 border-t border-slate-700/50 flex items-center justify-between">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold border flex items-center gap-1 ${
                      m.badge.includes('HIGH') ? 'bg-amber-500/20 text-amber-300 border-amber-500/30' : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                    }`}>
                      <ShieldAlert className="w-3 h-3" />
                      {m.badge}
                    </span>
                    {m.ticketId && (
                      <span className="text-[10px] text-slate-400 font-mono">Ref: {m.ticketId}</span>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex items-center space-x-2 text-slate-400 text-xs italic p-3 glass-panel rounded-xl max-w-[60%]">
              <RefreshCw className="w-4 h-4 animate-spin text-blue-400" />
              <span>Multi-Agent Engine investigating customer request...</span>
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
            placeholder="Type your complaint here or select a Demo Case on the right..."
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

      {/* Right Column: Demo Cases & Pipeline Monitor */}
      <div className="lg:col-span-5 flex flex-col space-y-4">
        
        {/* Preset Demo Cases Buttons */}
        <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-3">
          <h3 className="font-extrabold text-sm text-slate-100 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-indigo-400" />
            <span>Select Track 2 Demo Scenario</span>
          </h3>

          <div className="space-y-2">
            {DEMO_CASES.map((d) => (
              <button
                key={d.id}
                onClick={() => handleSend(d)}
                disabled={loading}
                className="w-full text-left p-3 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-800 hover:border-indigo-500/40 text-xs transition-all group"
              >
                <div className="flex items-center justify-between font-bold text-slate-200 mb-0.5">
                  <span className="group-hover:text-indigo-300">{d.title}</span>
                  <span className="text-[10px] text-slate-400 font-normal">{d.name}</span>
                </div>
                <p className="text-[11px] text-slate-400 italic truncate">"{d.text}"</p>
              </button>
            ))}
          </div>
        </div>

        {/* Live Execution Steps Monitor */}
        <div className="glass-panel p-5 rounded-2xl border border-slate-800">
          <h3 className="font-bold text-sm text-slate-100 flex items-center gap-2 mb-3">
            <Cpu className="w-4 h-4 text-blue-400" />
            <span>Autonomous Pipeline Monitor</span>
          </h3>

          {executionSteps.length === 0 ? (
            <div className="p-6 text-center border border-dashed border-slate-800 rounded-xl bg-slate-900/30 text-xs text-slate-400">
              Click any demo scenario button above to watch ResolveAI run in real time.
            </div>
          ) : (
            <div className="space-y-2.5">
              {executionSteps.map((step, idx) => (
                <div key={idx} className="p-2.5 rounded-xl border text-xs bg-slate-900/60 border-slate-800">
                  <div className="flex items-center justify-between font-bold text-slate-200">
                    <span className="flex items-center gap-2">
                      {step.status === 'done' ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <RefreshCw className="w-3.5 h-3.5 text-blue-400 animate-spin" />
                      )}
                      {step.title}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 pl-5.5 mt-0.5">{step.desc}</p>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
