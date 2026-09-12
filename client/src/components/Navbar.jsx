import React, { useState } from 'react';
import { 
  Bot, 
  ShieldCheck, 
  MessageSquare, 
  LayoutDashboard, 
  BarChart3, 
  CheckCircle2, 
  AlertTriangle,
  Zap,
  Users,
  BookOpen,
  Menu,
  X
} from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab, pendingApprovalsCount = 1 }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setMobileMenuOpen(false);
  };

  const navItems = [
    { id: 'dashboard', label: 'Support Dashboard', icon: LayoutDashboard },
    { id: 'chat', label: 'Customer Chat Widget', icon: MessageSquare },
    { id: 'approval', label: 'Human Approval Queue', icon: ShieldCheck, risk: true },
    { id: 'users', label: 'User Profiles', icon: Users },
    { id: 'knowledge', label: 'Knowledge Base', icon: BookOpen },
    { id: 'analytics', label: 'Analytics & Insights', icon: BarChart3 }
  ];

  const renderNavItem = ({ id, label, icon: Icon, risk }) => {
    const isActive = activeTab === id;
    const activeClasses = risk
      ? 'bg-amber-500/15 text-amber-200 border-amber-400/30 shadow-sm shadow-amber-950/30'
      : 'bg-blue-600 text-white border-blue-400/20 shadow-md shadow-blue-950/40';

    return (
      <button
        key={id}
        onClick={() => handleTabChange(id)}
        aria-current={isActive ? 'page' : undefined}
        className={`group flex w-full items-center gap-3 rounded-lg border px-3 py-2.5 text-left text-xs font-semibold transition-all duration-200 ease-out motion-reduce:transition-none ${
          isActive
            ? activeClasses
            : 'border-transparent text-slate-400 hover:border-slate-700/80 hover:bg-slate-800/70 hover:text-slate-100'
        }`}
      >
        <Icon className={`h-4 w-4 shrink-0 transition-transform duration-200 ease-out motion-reduce:transition-none ${isActive ? '' : 'group-hover:scale-105 group-hover:text-blue-300'}`} />
        <span className="flex-1 truncate">{label}</span>
        {risk && pendingApprovalsCount > 0 && (
          <span className={`rounded-full px-1.5 py-0.5 text-[10px] font-bold leading-none ${
            isActive ? 'bg-amber-400 text-slate-950' : 'bg-amber-500 text-slate-950'
          }`}>
            {pendingApprovalsCount}
          </span>
        )}
      </button>
    );
  };

  return (
    <header className="sticky top-0 z-50 border-b border-slate-800/90 bg-slate-950/90 shadow-lg shadow-slate-950/20 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex min-h-16 items-center justify-between gap-4 py-3 xl:py-0">
          
          {/* Brand Logo */}
          <button
            type="button"
            className="flex min-w-0 shrink-0 items-center gap-3 text-left"
            onClick={() => handleTabChange('dashboard')}
            aria-label="Go to ResolveAI support dashboard"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-400 shadow-lg shadow-blue-500/20 transition-transform duration-200 ease-out hover:scale-105 motion-reduce:transition-none">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="truncate bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-lg font-extrabold tracking-tight text-transparent sm:text-xl">
                  ResolveAI
                </span>
                <span className="hidden rounded-full border border-blue-500/20 bg-blue-500/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-blue-400 sm:inline-flex">
                  Enterprise
                </span>
              </div>
              <p className="hidden text-[11px] font-medium text-slate-400 sm:block">Autonomous Customer Intelligence</p>
            </div>
          </button>

          {/* Navigation Tabs */}
          <nav className="hidden items-center gap-1 rounded-xl border border-slate-800 bg-slate-900/80 p-1 xl:flex" aria-label="Primary navigation">
            {navItems.map(renderNavItem)}
          </nav>

          {/* Right Status Badge */}
          <div className="flex items-center gap-2 text-xs">
            <div className="hidden items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1.5 text-emerald-400 xl:flex">
              <span className="h-2 w-2 rounded-full bg-emerald-400"></span>
              <span className="font-semibold">Qwen AI & EnterPro Active</span>
            </div>
            <div className="flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-1.5 text-emerald-400 xl:hidden" title="Qwen AI & EnterPro Active">
              <span className="h-2 w-2 rounded-full bg-emerald-400"></span>
              <span className="hidden font-semibold sm:inline">AI Active</span>
            </div>
            <button
              type="button"
              onClick={() => setMobileMenuOpen((open) => !open)}
              className="rounded-lg border border-slate-700 bg-slate-900 p-2 text-slate-300 transition-colors duration-200 hover:border-slate-600 hover:bg-slate-800 hover:text-white motion-reduce:transition-none xl:hidden"
              aria-expanded={mobileMenuOpen}
              aria-controls="responsive-navigation"
              aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>

        </div>

        <div
          id="responsive-navigation"
          className={`${mobileMenuOpen ? 'grid' : 'hidden'} border-t border-slate-800/80 py-3 xl:hidden`}
        >
          <nav className="grid gap-1 sm:grid-cols-2" aria-label="Responsive primary navigation">
            {navItems.map(renderNavItem)}
          </nav>
        </div>
      </div>
    </header>
  );
}
