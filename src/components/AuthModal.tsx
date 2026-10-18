import React, { useState } from 'react';
import { X, User, ShieldCheck, Rocket, Briefcase, ChevronRight } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUserRole: string;
  onSelectRole: (role: string) => void;
  onOpenPortal: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  currentUserRole,
  onSelectRole,
  onOpenPortal
}) => {
  const [activeTab, setActiveTab] = useState<'login' | 'personas'>('personas');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  if (!isOpen) return null;

  const personas = [
    {
      role: 'Founder',
      title: 'Startup Founder',
      desc: 'Submit pitch decks, view application review status, and book mentor office hours.',
      icon: Rocket,
      color: 'text-rose-600',
      bg: 'bg-rose-50'
    },
    {
      role: 'Mentor',
      title: 'Ecosystem Mentor & Advisor',
      desc: 'Manage office hour bookings, review cohort applications, and advise startups.',
      icon: ShieldCheck,
      color: 'text-blue-600',
      bg: 'bg-blue-50'
    },
    {
      role: 'Investor',
      title: 'Syndicate Angel & VC',
      desc: 'Access audited deal flow, inspect data rooms, and join syndicate co-investments.',
      icon: Briefcase,
      color: 'text-emerald-600',
      bg: 'bg-emerald-50'
    }
  ];

  const handlePersonaSelect = (role: string) => {
    onSelectRole(role);
    onClose();
    if (role === 'Founder') {
      onOpenPortal();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl p-6 sm:p-8 border border-slate-100">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 rounded-full"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-xl bg-[#0B1E48] text-white flex items-center justify-center mx-auto mb-3 shadow-sm">
            <User className="w-6 h-6" />
          </div>
          <h3 className="text-2xl font-bold text-[#0B1E48]">Óghowa Portal Access</h3>
          <p className="text-xs text-slate-500 mt-1">
            Sign in or switch demo persona to test the ecosystem experience.
          </p>
        </div>

        {/* Tab switcher */}
        <div className="flex bg-slate-100 p-1 rounded-xl mb-6 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('personas')}
            className={`flex-1 py-2 rounded-lg transition ${
              activeTab === 'personas' ? 'bg-white text-[#0B1E48] shadow-xs' : 'text-slate-500'
            }`}
          >
            Switch Demo Role
          </button>
          <button
            onClick={() => setActiveTab('login')}
            className={`flex-1 py-2 rounded-lg transition ${
              activeTab === 'login' ? 'bg-white text-[#0B1E48] shadow-xs' : 'text-slate-500'
            }`}
          >
            Direct Login
          </button>
        </div>

        {activeTab === 'personas' ? (
          <div className="space-y-3">
            {personas.map((p) => {
              const Icon = p.icon;
              const isCurrent = currentUserRole === p.role;
              return (
                <div
                  key={p.role}
                  onClick={() => handlePersonaSelect(p.role)}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                    isCurrent
                      ? 'border-rose-500 bg-rose-50/30 ring-1 ring-rose-500'
                      : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg ${p.bg} flex items-center justify-center`}>
                      <Icon className={`w-5 h-5 ${p.color}`} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-slate-900">{p.title}</span>
                        {isCurrent && (
                          <span className="text-[10px] font-bold bg-rose-600 text-white px-2 py-0.2 rounded-full">
                            Active
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-500 line-clamp-1">{p.desc}</p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </div>
              );
            })}
          </div>
        ) : (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              onSelectRole('Founder');
              onClose();
              onOpenPortal();
            }}
            className="space-y-4 text-xs"
          >
            <div>
              <label className="block font-bold text-slate-700 mb-1">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="founder@oghowa.africa"
                className="w-full px-3 py-2 rounded-lg border border-slate-300"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3 py-2 rounded-lg border border-slate-300"
              />
            </div>
            <button
              type="submit"
              className="w-full py-2.5 font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-lg transition"
            >
              Sign In to Portal
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
