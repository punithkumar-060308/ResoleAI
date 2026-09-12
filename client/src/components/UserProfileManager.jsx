import React, { useState, useEffect } from 'react';
import { User, UserPlus, Shield, ShoppingBag, CreditCard, Ticket, Check, Plus, Star, Sparkles, RefreshCw } from 'lucide-react';

export default function UserProfileManager({ onSelectUserForChat }) {
  const [customers, setCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '+91 ',
    tier: 'Silver',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
  });
  const [creating, setCreating] = useState(false);

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/customers');
      const json = await res.json();
      if (json.success) {
        setCustomers(json.data);
        if (!selectedCustomer && json.data.length > 0) {
          setSelectedCustomer(json.data[0]);
        }
      }
    } catch (err) {
      console.error('Error fetching customers:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const handleCreateCustomer = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email) return;

    setCreating(true);
    try {
      const res = await fetch('/api/customers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const json = await res.json();
      if (json.success) {
        await fetchCustomers();
        setSelectedCustomer(json.data);
        setShowCreateModal(false);
        setFormData({
          name: '',
          email: '',
          phone: '+91 ',
          tier: 'Silver',
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
        });
      }
    } catch (err) {
      console.error('Error creating user profile:', err);
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      
      {/* Header */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-semibold text-blue-400 mb-1 uppercase tracking-wider">
            <User className="w-4 h-4" />
            <span>Customer Intelligence Directory</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-100">User Profile Intelligence</h1>
          <p className="text-xs text-slate-400 mt-1">
            Manage enterprise customer accounts, VIP status tiers, LTV scores, and cross-channel support history.
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-lg shadow-blue-600/30 flex items-center space-x-2 transition-all"
        >
          <UserPlus className="w-4 h-4" />
          <span>Create New User Profile</span>
        </button>
      </div>

      {/* Grid: Profiles List (Left) & Detailed Profile View (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left List */}
        <div className="lg:col-span-5 glass-panel p-5 rounded-2xl border border-slate-800 space-y-4">
          <h3 className="font-extrabold text-sm text-slate-100 border-b border-slate-800 pb-3 flex items-center justify-between">
            <span>Customer Profiles ({customers.length})</span>
            <button onClick={fetchCustomers} className="text-slate-400 hover:text-slate-200">
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </h3>

          {loading ? (
            <div className="p-8 text-center text-slate-400 text-xs">Loading profile directory...</div>
          ) : (
            <div className="space-y-3">
              {customers.map((c) => (
                <div
                  key={c.id}
                  onClick={() => setSelectedCustomer(c)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                    selectedCustomer?.id === c.id
                      ? 'bg-blue-950/40 border-blue-500/50 text-slate-100 shadow-md'
                      : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:bg-slate-900'
                  }`}
                >
                  <div className="flex items-center space-x-3.5">
                    <img
                      src={c.avatar}
                      alt={c.name}
                      className="w-11 h-11 rounded-full object-cover border border-slate-700"
                    />
                    <div>
                      <h4 className="font-extrabold text-sm text-slate-100 flex items-center gap-2">
                        {c.name}
                        {c.tier === 'VIP Gold' && <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />}
                      </h4>
                      <p className="text-xs text-slate-400">{c.email}</p>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="px-2 py-0.5 text-[10px] font-extrabold uppercase rounded bg-slate-800 text-slate-300">
                      {c.tier}
                    </span>
                    <p className="text-[10px] text-slate-400 mt-1 font-mono">{c.id}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Detail Card */}
        <div className="lg:col-span-7">
          {selectedCustomer ? (
            <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-6">
              
              {/* Profile Top Banner */}
              <div className="flex items-center justify-between border-b border-slate-800 pb-5">
                <div className="flex items-center space-x-4">
                  <img
                    src={selectedCustomer.avatar}
                    alt={selectedCustomer.name}
                    className="w-16 h-16 rounded-2xl object-cover border-2 border-blue-500/40 shadow-xl"
                  />
                  <div>
                    <div className="flex items-center space-x-2">
                      <h2 className="text-xl font-extrabold text-slate-100">{selectedCustomer.name}</h2>
                      <span className="px-2.5 py-0.5 text-xs font-extrabold uppercase bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-full">
                        {selectedCustomer.tier}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">{selectedCustomer.email} • {selectedCustomer.phone}</p>
                    <p className="text-[11px] text-slate-500 mt-1">Customer ID: {selectedCustomer.id} • Member Since: {selectedCustomer.joined_date}</p>
                  </div>
                </div>

                {onSelectUserForChat && (
                  <button
                    onClick={() => onSelectUserForChat(selectedCustomer.id)}
                    className="px-3.5 py-2 rounded-xl bg-blue-600/20 hover:bg-blue-600 text-blue-300 hover:text-white border border-blue-500/30 text-xs font-bold transition-all"
                  >
                    Test Chat as {selectedCustomer.name.split(' ')[0]}
                  </button>
                )}
              </div>

              {/* Metrics Grid */}
              <div className="grid grid-cols-3 gap-4">
                <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 text-center">
                  <span className="text-[10px] font-extrabold uppercase text-slate-400">Lifetime Value</span>
                  <p className="text-xl font-extrabold text-emerald-400 mt-1">₹{selectedCustomer.lifetime_value?.toLocaleString()}</p>
                </div>
                <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 text-center">
                  <span className="text-[10px] font-extrabold uppercase text-slate-400">Total Orders</span>
                  <p className="text-xl font-extrabold text-slate-100 mt-1">{selectedCustomer.total_orders || 0}</p>
                </div>
                <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 text-center">
                  <span className="text-[10px] font-extrabold uppercase text-slate-400">Risk Profile</span>
                  <p className="text-xl font-extrabold text-emerald-400 mt-1">{selectedCustomer.risk_score || 'Low'}</p>
                </div>
              </div>

            </div>
          ) : (
            <div className="glass-panel p-12 text-center text-slate-400 rounded-2xl border border-slate-800">
              Select a customer profile from the left to view details.
            </div>
          )}
        </div>

      </div>

      {/* Create Customer Profile Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-panel p-6 rounded-2xl border border-slate-800 w-full max-w-md space-y-5 shadow-2xl">
            <h3 className="font-extrabold text-base text-slate-100 flex items-center gap-2">
              <UserPlus className="w-5 h-5 text-blue-400" />
              <span>Create New Customer Profile</span>
            </h3>

            <form onSubmit={handleCreateCustomer} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Vikram Seth"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-slate-100 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="e.g. vikram.seth@example.com"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-slate-100 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Phone Number</label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-slate-100 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Membership Tier</label>
                <select
                  value={formData.tier}
                  onChange={(e) => setFormData({ ...formData, tier: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-slate-100 focus:outline-none focus:border-blue-500"
                >
                  <option value="Silver">Silver</option>
                  <option value="VIP Gold">VIP Gold</option>
                  <option value="Platinum">Platinum</option>
                </select>
              </div>

              <div className="flex items-center justify-end space-x-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-900 text-slate-300 hover:bg-slate-800 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creating}
                  className="px-4 py-2 rounded-xl bg-blue-600 text-white font-extrabold hover:bg-blue-500 shadow-md shadow-blue-600/30"
                >
                  {creating ? 'Saving...' : 'Create Profile'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
