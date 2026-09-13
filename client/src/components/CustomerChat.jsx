import React, { useState } from 'react';
import { Send, Bot, User, MessageSquare, Sparkles, CheckCircle2, ShieldAlert, Cpu, Lock, RefreshCw, PlayCircle } from 'lucide-react';

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
  const [selectedDemoId, setSelectedDemoId] = useState(null);

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
      setSelectedDemoId(demoCase.id);
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
    <div className="chat-page-enter mx-auto grid max-w-6xl grid-cols-1 gap-6 px-4 py-8 lg:grid-cols-12 lg:gap-8">
      
      {/* Left Chat Console */}
      <div className="flex h-[min(680px,calc(100vh-8rem))] min-h-[560px] flex-col overflow-hidden rounded-2xl border border-blue-500/20 bg-slate-950/70 shadow-2xl shadow-slate-950/40 lg:col-span-7">
        
        {/* Chat Header */}
        <div className="flex items-center justify-between border-b border-slate-800 bg-slate-900/90 p-5">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="flex h-11 w-11 items-center justify-center rounded-full border border-blue-500/30 bg-blue-600/20">
                <Bot className="w-5 h-5 text-blue-400" />
              </div>
              <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-slate-900 bg-emerald-400"></span>
            </div>
            <div>
              <h3 className="flex items-center gap-2 text-sm font-extrabold text-slate-100">
                ResolveAI Customer Support
                <span className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-300">Live</span>
              </h3>
              <p className="mt-0.5 text-[11px] text-slate-400">Autonomous Multi-Agent Intelligence</p>
            </div>
          </div>
          <div className="hidden items-center gap-2 text-[10px] font-semibold uppercase tracking-wider text-slate-500 sm:flex">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400"></span>
            Ready to assist
          </div>
        </div>

        {/* Messages Body */}
        <div className="flex-1 space-y-4 overflow-y-auto bg-slate-950/40 p-5">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`chat-message-enter flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[86%] rounded-2xl p-4 shadow-lg sm:max-w-[80%] ${
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
            <div className="chat-message-enter flex max-w-[80%] items-center gap-2 rounded-xl border border-slate-800 bg-slate-900/80 p-3 text-xs italic text-slate-400">
              <RefreshCw className="w-4 h-4 animate-spin text-blue-400" />
              <span>Multi-Agent Engine investigating customer request...</span>
            </div>
          )}
        </div>

        {/* Input Bar */}
        <div className="border-t border-slate-800 bg-slate-900 p-4">
          <div className="mb-2 flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-slate-500">
            <MessageSquare className="h-3.5 w-3.5 text-blue-400" />
            Customer complaint
          </div>
          <div className="flex items-center gap-2">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Describe the customer issue or choose a demo scenario..."
            aria-label="Customer complaint"
            className="min-w-0 flex-1 rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-xs text-slate-100 transition-colors placeholder:text-slate-600 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          />
          <button
            onClick={() => handleSend()}
            disabled={loading || !inputMessage.trim()}
            className="flex shrink-0 items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-3 text-xs font-semibold text-white shadow-md shadow-blue-600/20 transition-all duration-200 hover:-translate-y-0.5 hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-400/60 active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <span>Send</span>
            <Send className="w-3.5 h-3.5" />
          </button>
          </div>
        </div>

      </div>

      {/* Right Column: Demo Cases & Pipeline Monitor */}
      <div className="flex flex-col gap-5 lg:col-span-5">
        
        {/* Preset Demo Cases Buttons */}
        <div className="glass-panel space-y-4 rounded-2xl border border-slate-800 p-5">
          <div>
          <h3 className="flex items-center gap-2 text-sm font-extrabold text-slate-100">
            <Sparkles className="w-4 h-4 text-indigo-400" />
            <span>Select Track 2 Demo Scenario</span>
          </h3>
          <p className="mt-1 pl-6 text-[11px] leading-relaxed text-slate-500">Run a known customer issue through the live autonomous support pipeline.</p>
          </div>

          <div className="space-y-2">
            {DEMO_CASES.map((d) => (
              <button
                key={d.id}
                onClick={() => handleSend(d)}
                disabled={loading}
                className={`group w-full rounded-xl border p-4 text-left text-xs transition-all duration-200 hover:-translate-y-0.5 hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60 ${selectedDemoId === d.id ? 'border-indigo-400/60 bg-indigo-950/30 shadow-md shadow-indigo-950/20' : 'border-slate-800 bg-slate-900/80 hover:border-indigo-500/40'}`}
              >
                <div className="flex items-start gap-3">
                  <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border text-[10px] font-extrabold ${selectedDemoId === d.id ? 'border-indigo-400/40 bg-indigo-500/20 text-indigo-200' : 'border-slate-700 bg-slate-950 text-slate-500'}`}>
                    {d.id.replace('demo', '')}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-3 font-bold text-slate-200">
                      <span className="group-hover:text-indigo-300">{d.title.replace(/^Demo \d+: /, '')}</span>
                      <span className="shrink-0 text-[10px] font-normal text-slate-400">{d.name}</span>
                    </div>
                    <p className="mt-1 truncate text-[11px] italic text-slate-400">"{d.text}"</p>
                  </div>
                  <PlayCircle className={`mt-1 h-4 w-4 shrink-0 ${selectedDemoId === d.id ? 'text-indigo-300' : 'text-slate-600 group-hover:text-indigo-300'}`} />
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Live Execution Steps Monitor */}
        <div className="glass-panel rounded-2xl border border-slate-800 p-5">
          <h3 className="mb-4 flex items-center gap-2 text-sm font-extrabold text-slate-100">
            <Cpu className="w-4 h-4 text-blue-400" />
            <span>Autonomous Pipeline Monitor</span>
          </h3>

          {executionSteps.length === 0 ? (
            <div className="rounded-xl border border-dashed border-slate-700 bg-slate-900/30 p-7 text-center text-xs text-slate-400">
              <Cpu className="mx-auto mb-3 h-7 w-7 text-slate-600" />
              <p className="font-semibold text-slate-300">Pipeline monitor is standing by</p>
              <p className="mx-auto mt-1 max-w-xs leading-relaxed text-slate-500">Select a demo scenario above to watch ResolveAI process it in real time.</p>
            </div>
          ) : (
            <div className="space-y-2.5">
              {executionSteps.map((step, idx) => (
                <div key={idx} className="pipeline-step-enter rounded-xl border border-slate-800 bg-slate-900/60 p-3 text-xs">
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
