import React, { useState } from 'react';
import {
  Ticket,
  ShieldCheck,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  QrCode,
  Eye,
  Trash2,
  Plus,
  X,
  ExternalLink,
  MapPin,
  Building,
  User,
  Mail,
  Phone,
  Sparkles,
  Award,
  AlertCircle,
  Copy,
  Check,
  Download
} from 'lucide-react';
import { BusinessWeekConfig, RegisteredDelegate } from '../types';
import { BusinessWeekLogo } from './BusinessWeekLogo';

interface SuperadminRegistrationManagerProps {
  config: BusinessWeekConfig;
  onUpdateConfig: (updated: BusinessWeekConfig) => void;
  onPreviewRegistration?: () => void;
}

export const SuperadminRegistrationManager: React.FC<SuperadminRegistrationManagerProps> = ({
  config,
  onUpdateConfig,
  onPreviewRegistration
}) => {
  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [modeFilter, setModeFilter] = useState<string>('all');

  // Badge Inspection Modal State
  const [inspectingDelegate, setInspectingDelegate] = useState<RegisteredDelegate | null>(null);
  const [copiedCode, setCopiedCode] = useState<string>('');

  // Add Delegate Modal State
  const [isAddingDelegate, setIsAddingDelegate] = useState<boolean>(false);
  const [newDelegateForm, setNewDelegateForm] = useState<Partial<RegisteredDelegate>>({
    name: '',
    email: '',
    phone: '',
    organization: '',
    role: '',
    location: 'Benin City, Edo State, Nigeria',
    persona: 'executive',
    attendanceMode: 'in_person',
    status: 'Accreditation Issued',
    dealRoomInterest: false
  });

  // Toggle Registration Open / Closed
  const handleToggleRegistrationGateway = () => {
    const updatedStatus = config.isRegistrationOpen === false ? true : false;
    onUpdateConfig({
      ...config,
      isRegistrationOpen: updatedStatus
    });
  };

  // Change Delegate Status
  const handleChangeDelegateStatus = (delegateId: string, newStatus: RegisteredDelegate['status']) => {
    const updatedDelegates = config.delegates.map((d) =>
      d.id === delegateId ? { ...d, status: newStatus } : d
    );
    onUpdateConfig({ ...config, delegates: updatedDelegates });
  };

  // Delete Participant
  const handleDeleteDelegate = (delegateId: string) => {
    if (window.confirm('Are you sure you want to revoke and delete this participant accreditation?')) {
      const updatedDelegates = config.delegates.filter((d) => d.id !== delegateId);
      onUpdateConfig({ ...config, delegates: updatedDelegates });
    }
  };

  // Add Delegate Submit
  const handleSaveNewDelegate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDelegateForm.name || !newDelegateForm.email) {
      alert('Delegate name and email are required');
      return;
    }

    const randomDigits = Math.floor(1000 + Math.random() * 9000);
    const createdDelegate: RegisteredDelegate = {
      id: `del-${Date.now()}`,
      code: `OBW-2026-DELEGATE-${randomDigits}`,
      name: newDelegateForm.name || 'Accredited Delegate',
      email: newDelegateForm.email || '',
      phone: newDelegateForm.phone || '+234 800 000 0000',
      organization: newDelegateForm.organization || 'Independent Operator',
      role: newDelegateForm.role || 'Executive Participant',
      location: newDelegateForm.location || 'Benin City, Nigeria',
      persona: newDelegateForm.persona || 'executive',
      tracks: ['digital_economy', 'investment_pitches'],
      masterclass: 'early_stage_fundraising',
      attendanceMode: (newDelegateForm.attendanceMode as any) || 'in_person',
      registeredAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      status: (newDelegateForm.status as RegisteredDelegate['status']) || 'Accreditation Issued',
      dealRoomInterest: newDelegateForm.dealRoomInterest || false
    };

    onUpdateConfig({
      ...config,
      delegates: [createdDelegate, ...config.delegates]
    });
    setIsAddingDelegate(false);
    setNewDelegateForm({
      name: '',
      email: '',
      phone: '',
      organization: '',
      role: '',
      location: 'Benin City, Edo State, Nigeria',
      persona: 'executive',
      attendanceMode: 'in_person',
      status: 'Accreditation Issued',
      dealRoomInterest: false
    });
  };

  // Filter delegates list
  const filteredDelegates = config.delegates.filter((d) => {
    const matchesSearch =
      d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.organization.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === 'all' ? true : d.status.toLowerCase().includes(statusFilter.toLowerCase());

    const matchesMode =
      modeFilter === 'all' ? true : d.attendanceMode === modeFilter;

    return matchesSearch && matchesStatus && matchesMode;
  });

  // Calculate live stats
  const totalDelegates = config.delegates.length;
  const inPersonCount = config.delegates.filter((d) => d.attendanceMode === 'in_person').length;
  const virtualCount = config.delegates.filter((d) => d.attendanceMode === 'virtual').length;
  const accreditedCount = config.delegates.filter((d) => d.status.includes('Accreditation Issued') || d.status.includes('VIP')).length;
  const dealRoomApplicants = config.delegates.filter((d) => d.dealRoomInterest).length;

  return (
    <div className="space-y-6">
      {/* 1. TOP GATEWAY STATUS BANNER */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span
              className={`w-3 h-3 rounded-full ${
                config.isRegistrationOpen !== false ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'
              }`}
            />
            <h3 className="text-xl font-bold text-[#0B1E48]">
              Registration Gateway Status:{' '}
              <span className={config.isRegistrationOpen !== false ? 'text-emerald-700' : 'text-rose-700'}>
                {config.isRegistrationOpen !== false ? 'OPEN & ACCEPTING PASSES' : 'PAUSED BY SUPERADMIN'}
              </span>
            </h3>
          </div>
          <p className="text-xs text-slate-500">
            Control whether prospective attendees can submit new registrations or view closed status on the registration portal.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={handleToggleRegistrationGateway}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs transition shadow-xs flex items-center gap-2 cursor-pointer ${
              config.isRegistrationOpen !== false
                ? 'bg-rose-600 hover:bg-rose-700 text-white'
                : 'bg-emerald-600 hover:bg-emerald-700 text-white'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>
              {config.isRegistrationOpen !== false ? 'Pause Registration Gateway' : 'Reopen Registration Gateway'}
            </span>
          </button>

          {onPreviewRegistration && (
            <button
              onClick={onPreviewRegistration}
              className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition flex items-center gap-1.5 cursor-pointer"
            >
              <span>Preview Registration Page</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* 2. REGISTRATION STATS DASHBOARD */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Total Enrolled</span>
          <p className="text-2xl font-black text-[#0B1E48] mt-1">{totalDelegates}</p>
          <span className="text-[11px] text-slate-500">All submissions</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider block">Accredited Passes</span>
          <p className="text-2xl font-black text-emerald-700 mt-1">{accreditedCount}</p>
          <span className="text-[11px] text-slate-500">RFID badges cleared</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[10px] font-bold text-[#0B1E48] uppercase tracking-wider block">In-Person Participants</span>
          <p className="text-2xl font-black text-[#0B1E48] mt-1">{inPersonCount}</p>
          <span className="text-[11px] text-slate-500">Victor Uwaifo Hub</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider block">Virtual Global Stream</span>
          <p className="text-2xl font-black text-blue-700 mt-1">{virtualCount}</p>
          <span className="text-[11px] text-slate-500">Remote attendees</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[10px] font-bold text-amber-600 uppercase tracking-wider block">Deal Room Pitches</span>
          <p className="text-2xl font-black text-amber-700 mt-1">{dealRoomApplicants}</p>
          <span className="text-[11px] text-slate-500">₦50M Syndicate</span>
        </div>
      </div>

      {/* 3. PARTICIPANTS ROSTER CONTROLS & TABLE */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-5">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h3 className="text-xl font-bold text-[#0B1E48]">Live Registered Participants Roster</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Review credentialed participants, inspect verified digital badge passes, and update security status.
            </p>
          </div>

          <button
            onClick={() => setIsAddingDelegate(true)}
            className="px-4 py-2 text-xs font-bold text-white bg-[#00231b] hover:bg-[#0e3a2f] rounded-xl flex items-center gap-1.5 shadow-xs transition cursor-pointer"
          >
            <Plus className="w-4 h-4 text-[#FEF3C7]" />
            <span>Manual VIP Accreditation</span>
          </button>
        </div>

        {/* Search & Filters Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 pt-2">
          <div className="sm:col-span-6 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, email, code (OBW-2026-...), or organization..."
              className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-[#00231b] focus:outline-hidden"
            />
          </div>

          <div className="sm:col-span-3">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white focus:ring-2 focus:ring-[#00231b] focus:outline-hidden font-medium"
            >
              <option value="all">All Accreditation Statuses</option>
              <option value="accreditation">Accreditation Issued</option>
              <option value="vip">Fast-Track VIP</option>
              <option value="pending">Pending Review</option>
              <option value="declined">Declined</option>
            </select>
          </div>

          <div className="sm:col-span-3">
            <select
              value={modeFilter}
              onChange={(e) => setModeFilter(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white focus:ring-2 focus:ring-[#00231b] focus:outline-hidden font-medium"
            >
              <option value="all">All Attendance Modes</option>
              <option value="in_person">In-Person Physical Pass</option>
              <option value="virtual">Virtual Global Stream</option>
            </select>
          </div>
        </div>

        {/* Delegates Table */}
        <div className="overflow-x-auto rounded-xl border border-slate-200">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-bold uppercase text-[10px] tracking-wider border-b border-slate-200">
              <tr>
                <th className="p-3.5">Reference Code</th>
                <th className="p-3.5">Delegate Details</th>
                <th className="p-3.5">Organization & Role</th>
                <th className="p-3.5">Mode & Pitch</th>
                <th className="p-3.5">Accreditation Status</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredDelegates.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-400">
                    No participants found matching your search and filter criteria.
                  </td>
                </tr>
              ) : (
                filteredDelegates.map((delegate) => (
                  <tr key={delegate.id} className="hover:bg-slate-50/80 transition">
                    <td className="p-3.5 whitespace-nowrap font-mono font-bold text-[#00231b]">
                      <div className="flex items-center gap-1.5">
                        <span className="bg-[#FEF3C7] text-[#B45309] px-2 py-0.5 rounded text-[11px]">
                          {delegate.code}
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-400 font-sans block mt-0.5">
                        {delegate.registeredAt}
                      </span>
                    </td>

                    <td className="p-3.5">
                      <div className="font-bold text-slate-800 text-sm">{delegate.name}</div>
                      <div className="text-slate-500 text-[11px] flex items-center gap-1 mt-0.5">
                        <Mail className="w-3 h-3 text-slate-400" />
                        <span>{delegate.email}</span>
                      </div>
                      <div className="text-slate-400 text-[10px] flex items-center gap-1">
                        <Phone className="w-3 h-3 text-slate-300" />
                        <span>{delegate.phone}</span>
                      </div>
                    </td>

                    <td className="p-3.5">
                      <div className="font-semibold text-slate-700">{delegate.organization}</div>
                      <div className="text-slate-500 text-[11px]">{delegate.role}</div>
                      <div className="text-slate-400 text-[10px] flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3 text-slate-300" />
                        <span>{delegate.location}</span>
                      </div>
                    </td>

                    <td className="p-3.5 whitespace-nowrap">
                      <span
                        className={`inline-block text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                          delegate.attendanceMode === 'in_person'
                            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                            : 'bg-blue-50 text-blue-800 border border-blue-200'
                        }`}
                      >
                        {delegate.attendanceMode === 'in_person' ? 'Physical Pass' : 'Virtual Pass'}
                      </span>
                      {delegate.dealRoomInterest && (
                        <span className="block mt-1 text-[10px] font-extrabold text-[#B45309]">
                          ★ ₦50M Deal Room Pitch
                        </span>
                      )}
                    </td>

                    <td className="p-3.5 whitespace-nowrap">
                      <select
                        value={delegate.status}
                        onChange={(e) => handleChangeDelegateStatus(delegate.id, e.target.value as RegisteredDelegate['status'])}
                        className={`px-2.5 py-1 rounded-lg text-xs font-bold border cursor-pointer focus:outline-hidden ${
                          delegate.status.includes('VIP')
                            ? 'bg-purple-50 text-purple-700 border-purple-300'
                            : delegate.status.includes('Issued')
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                            : delegate.status.includes('Declined')
                            ? 'bg-rose-50 text-rose-700 border-rose-300'
                            : 'bg-amber-50 text-amber-700 border-amber-300'
                        }`}
                      >
                        <option value="Accreditation Issued">Accreditation Issued</option>
                        <option value="Fast-Track VIP">Fast-Track VIP</option>
                        <option value="Pending Verification">Pending Verification</option>
                        <option value="Declined">Declined</option>
                      </select>
                    </td>

                    <td className="p-3.5 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setInspectingDelegate(delegate)}
                          className="px-2.5 py-1.5 bg-slate-100 hover:bg-[#00231b] hover:text-white text-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1 transition cursor-pointer"
                          title="Inspect live accreditation digital pass"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>View Badge</span>
                        </button>

                        <button
                          onClick={() => handleDeleteDelegate(delegate.id)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition cursor-pointer"
                          title="Revoke and delete registration"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ================= MODAL 1: VIEW ACCREDITATION BADGE PASS ================= */}
      {inspectingDelegate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs animate-in fade-in duration-200 overflow-y-auto">
          <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl p-6 sm:p-7 border border-[#E5DFD5]">
            <button
              onClick={() => setInspectingDelegate(null)}
              className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center mb-4">
              <span className="text-[10px] font-bold text-[#B45309] uppercase tracking-wider bg-[#FEF3C7] px-3 py-1 rounded-full">
                Accreditation Pass Inspector
              </span>
              <h3 className="text-xl font-bold text-[#00231b] mt-1">Official Delegate Badge</h3>
              <p className="text-xs text-slate-500">This is how the registrant views and presents their pass at security checkpoint.</p>
            </div>

            {/* DIGITAL BADGE VISUAL */}
            <div className="rounded-2xl bg-white border-2 border-[#00231b] shadow-xl overflow-hidden relative font-sans">
              {/* Lanyard Clip Hole */}
              <div className="w-full bg-[#00231b] py-2 flex justify-center items-center border-b border-[#316858]">
                <div className="w-16 h-3 bg-white/20 rounded-full flex items-center justify-center">
                  <div className="w-6 h-1 bg-[#00231b] rounded-full" />
                </div>
              </div>

              {/* Badge Header with Logo */}
              <div className="p-4 bg-gradient-to-b from-[#FBF9F5] to-white border-b border-[#E5DFD5] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <BusinessWeekLogo size="sm" />
                  <div>
                    <span className="text-xs font-black text-[#00231b] block leading-tight">Óghowa Business Week</span>
                    <span className="text-[9px] text-[#52605B]">Official Summit Pass • 2026</span>
                  </div>
                </div>
                <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                  {inspectingDelegate.status}
                </span>
              </div>

              {/* Attendee Info Body */}
              <div className="p-5 text-center space-y-2">
                <div className="w-16 h-16 rounded-2xl bg-[#00231b] text-white flex items-center justify-center mx-auto text-xl font-black shadow-md border-2 border-[#FEF3C7]">
                  {inspectingDelegate.name.substring(0, 2).toUpperCase()}
                </div>
                <h4 className="text-lg font-black text-[#00231b]">{inspectingDelegate.name}</h4>
                <p className="text-xs font-bold text-[#B45309]">{inspectingDelegate.role}</p>
                <p className="text-xs text-slate-600">{inspectingDelegate.organization}</p>
                <p className="text-[11px] text-slate-400 flex items-center justify-center gap-1">
                  <MapPin className="w-3 h-3" />
                  <span>{inspectingDelegate.location}</span>
                </p>
              </div>

              {/* QR Code and Barcode Box */}
              <div className="bg-[#FBF9F5] p-4 border-t border-[#E5DFD5] text-center space-y-2">
                <div className="flex items-center justify-center gap-3">
                  <div className="p-2 bg-white rounded-xl border border-slate-200 shadow-xs inline-block">
                    <QrCode className="w-16 h-16 text-[#00231b]" />
                  </div>
                  <div className="text-left text-[11px] space-y-1">
                    <span className="text-slate-400 uppercase text-[9px] font-bold block">RFID Accreditation</span>
                    <span className="font-mono font-bold text-slate-800 block">{inspectingDelegate.code}</span>
                    <span className="text-emerald-700 font-semibold block text-[10px]">
                      {inspectingDelegate.attendanceMode === 'in_person' ? '● Victor Uwaifo Creative Hub' : '● Global Virtual Stream'}
                    </span>
                  </div>
                </div>

                {/* Barcode Strip */}
                <div className="h-6 bg-slate-800/10 rounded flex items-center justify-center px-4 mt-2">
                  <div className="font-mono text-[9px] tracking-widest text-slate-600">
                    ||| | |||| | ||| |||| || | |||| || |
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-5 flex items-center justify-between gap-3 text-xs">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(inspectingDelegate.code);
                  setCopiedCode(inspectingDelegate.code);
                  setTimeout(() => setCopiedCode(''), 2500);
                }}
                className="flex-1 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-50 font-bold text-slate-700 transition flex items-center justify-center gap-1.5 cursor-pointer"
              >
                {copiedCode === inspectingDelegate.code ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Badge Code</span>
                  </>
                )}
              </button>

              <button
                onClick={() => setInspectingDelegate(null)}
                className="flex-1 py-2.5 rounded-xl bg-[#00231b] hover:bg-[#0e3a2f] text-white font-bold transition cursor-pointer"
              >
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL 2: MANUAL ACCREDITATION / ADD DELEGATE ================= */}
      {isAddingDelegate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl p-6 sm:p-8">
            <h3 className="text-xl font-bold text-[#0B1E48] mb-4">
              Manual VIP Delegate Accreditation
            </h3>
            <p className="text-xs text-slate-500 -mt-3 mb-4">
              Directly issue an official pass for keynote speakers, government liaisons, or sponsors.
            </p>

            <form onSubmit={handleSaveNewDelegate} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Delegate Full Name</label>
                <input
                  type="text"
                  value={newDelegateForm.name || ''}
                  onChange={(e) => setNewDelegateForm({ ...newDelegateForm, name: e.target.value })}
                  placeholder="Osagie Egharevba"
                  className="w-full p-2.5 rounded-lg border border-slate-300 text-sm"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Email Address</label>
                  <input
                    type="email"
                    value={newDelegateForm.email || ''}
                    onChange={(e) => setNewDelegateForm({ ...newDelegateForm, email: e.target.value })}
                    placeholder="delegate@company.com"
                    className="w-full p-2.5 rounded-lg border border-slate-300 text-sm"
                    required
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Phone Number</label>
                  <input
                    type="tel"
                    value={newDelegateForm.phone || ''}
                    onChange={(e) => setNewDelegateForm({ ...newDelegateForm, phone: e.target.value })}
                    placeholder="+234 801 234 5678"
                    className="w-full p-2.5 rounded-lg border border-slate-300 text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Organization / Firm</label>
                  <input
                    type="text"
                    value={newDelegateForm.organization || ''}
                    onChange={(e) => setNewDelegateForm({ ...newDelegateForm, organization: e.target.value })}
                    placeholder="Edo Innovation Hub / Pan-African VC"
                    className="w-full p-2.5 rounded-lg border border-slate-300 text-sm"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Job Role</label>
                  <input
                    type="text"
                    value={newDelegateForm.role || ''}
                    onChange={(e) => setNewDelegateForm({ ...newDelegateForm, role: e.target.value })}
                    placeholder="Managing Partner"
                    className="w-full p-2.5 rounded-lg border border-slate-300 text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Attendance Mode</label>
                  <select
                    value={newDelegateForm.attendanceMode || 'in_person'}
                    onChange={(e) => setNewDelegateForm({ ...newDelegateForm, attendanceMode: e.target.value as any })}
                    className="w-full p-2.5 rounded-lg border border-slate-300 text-sm bg-white"
                  >
                    <option value="in_person">In-Person (Victor Uwaifo Hub)</option>
                    <option value="virtual">Virtual Global Stream</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Accreditation Level</label>
                  <select
                    value={newDelegateForm.status || 'Accreditation Issued'}
                    onChange={(e) => setNewDelegateForm({ ...newDelegateForm, status: e.target.value as RegisteredDelegate['status'] })}
                    className="w-full p-2.5 rounded-lg border border-slate-300 text-sm bg-white font-bold"
                  >
                    <option value="Accreditation Issued">Accreditation Issued</option>
                    <option value="Fast-Track VIP">Fast-Track VIP</option>
                    <option value="Pending Verification">Pending Verification</option>
                  </select>
                </div>
              </div>

              <div className="pt-2 flex items-center gap-2">
                <input
                  type="checkbox"
                  id="dealRoomInterestCheck"
                  checked={newDelegateForm.dealRoomInterest || false}
                  onChange={(e) => setNewDelegateForm({ ...newDelegateForm, dealRoomInterest: e.target.checked })}
                  className="w-4 h-4 text-[#00231b] rounded"
                />
                <label htmlFor="dealRoomInterestCheck" className="text-slate-800 font-bold">
                  Grant Access to the ₦50,000,000 Deal Syndicate Pitch Room
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddingDelegate(false)}
                  className="px-4 py-2 rounded-lg bg-slate-100 text-slate-700 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-[#00231b] hover:bg-[#0e3a2f] text-white font-bold shadow-xs cursor-pointer"
                >
                  Issue VIP Pass
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
