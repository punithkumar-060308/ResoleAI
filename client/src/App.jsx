import React, { useState } from 'react';
import Navbar from './components/Navbar';
import DashboardOverview from './components/DashboardOverview';
import CustomerChat from './components/CustomerChat';
import TicketDetailView from './components/TicketDetailView';
import ApprovalConsole from './components/ApprovalConsole';
import AnalyticsHub from './components/AnalyticsHub';
import UserProfileManager from './components/UserProfileManager';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedTicketId, setSelectedTicketId] = useState(null);

  const handleSelectTicket = (id) => {
    setSelectedTicketId(id);
    setActiveTab('detail');
  };

  const handleTicketCreatedFromChat = (id) => {
    setSelectedTicketId(id);
    setActiveTab('detail');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <Navbar
        activeTab={activeTab}
        setActiveTab={(tab) => {
          if (tab !== 'detail') setSelectedTicketId(null);
          setActiveTab(tab);
        }}
        pendingApprovalsCount={1}
      />

      <main className="flex-1 pb-12">
        {activeTab === 'dashboard' && (
          <DashboardOverview onSelectTicket={handleSelectTicket} />
        )}

        {activeTab === 'chat' && (
          <CustomerChat onTicketCreated={handleTicketCreatedFromChat} />
        )}

        {activeTab === 'detail' && selectedTicketId && (
          <TicketDetailView
            ticketId={selectedTicketId}
            onBack={() => {
              setSelectedTicketId(null);
              setActiveTab('dashboard');
            }}
          />
        )}

        {activeTab === 'approval' && (
          <ApprovalConsole onSelectTicket={handleSelectTicket} />
        )}

        {activeTab === 'users' && (
          <UserProfileManager onSelectUserForChat={() => setActiveTab('chat')} />
        )}

        {activeTab === 'analytics' && (
          <AnalyticsHub />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 py-6 text-center text-xs text-slate-500 bg-slate-950/80">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p>© 2026 ResolveAI Platform • Customer Support Intelligence Engine</p>
          <p className="font-mono text-[11px]">Build Bengaluru Hackathon Submission</p>
        </div>
      </footer>
    </div>
  );
}
