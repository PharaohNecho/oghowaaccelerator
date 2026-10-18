import React, { useState } from 'react';
import {
  ShieldAlert,
  Send,
  Mail,
  CheckCircle2,
  AlertCircle,
  XCircle,
  FileText,
  User,
  Building,
  DollarSign,
  ArrowRight,
  Eye,
  X,
  Sparkles
} from 'lucide-react';
import { EmailNotification } from '../types';

interface SuperadminPortalProps {
  appData: {
    founderName: string;
    founderEmail: string;
    founderPhone: string;
    startupName: string;
    sector: string;
    stage: string;
    description: string;
    targetMarket: string;
    tractionMRR: string;
    activeUsers: string;
    deckFileName: string;
    cacFileName: string;
  };
  appStatus: string;
  adminNotes: string;
  sentEmails: EmailNotification[];
  onUpdateStatus: (newStatus: string, feedbackMsg: string) => void;
  onBackToDashboard: () => void;
  onBackToHome: () => void;
}

export const SuperadminPortal: React.FC<SuperadminPortalProps> = ({
  appData,
  appStatus,
  adminNotes,
  sentEmails,
  onUpdateStatus,
  onBackToDashboard,
  onBackToHome
}) => {
  const [feedbackInput, setFeedbackInput] = useState<string>(adminNotes);
  const [selectedEmail, setSelectedEmail] = useState<EmailNotification | null>(null);

  const handleAction = (status: string) => {
    onUpdateStatus(status, feedbackInput);
  };

  return (
    <section className="py-10 sm:py-16 bg-slate-100 min-h-[85vh]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Admin Header */}
        <div className="bg-[#0B1A34] text-white p-6 sm:p-8 rounded-2xl shadow-lg mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs uppercase tracking-widest text-rose-400 font-bold mb-1">
              <ShieldAlert className="w-4 h-4" />
              <span>Óghowa Investment Committee</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white">
              Cohort Evaluation & Email Automator
            </h1>
            <p className="text-xs text-slate-300 mt-1">
              Review applicant dossiers, update status, and automatically trigger personalized transactional emails.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onBackToDashboard}
              className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 px-4 py-2.5 rounded-lg font-bold transition cursor-pointer"
            >
              View as Applicant
            </button>
            <button
              onClick={onBackToHome}
              className="text-xs bg-rose-600 hover:bg-rose-700 text-white px-4 py-2.5 rounded-lg font-bold transition cursor-pointer"
            >
              Back to Site
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          {/* Left 2 Columns: Startup Under Review */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-slate-100 pb-5 mb-5 gap-3">
                <div>
                  <span className="text-xs font-bold text-rose-600 uppercase tracking-widest">
                    Venture Under Review
                  </span>
                  <h2 className="text-2xl font-black text-slate-900 mt-0.5">
                    {appData.startupName}
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Lead: <strong className="text-slate-800">{appData.founderName}</strong> ({appData.founderEmail}) · Track: {appData.sector}
                  </p>
                </div>

                <span className="text-xs font-black px-3.5 py-1.5 rounded-full bg-slate-100 text-slate-800 border border-slate-200">
                  Current: {appStatus}
                </span>
              </div>

              {/* Startup Metrics Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs mb-6">
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-slate-400 block font-semibold text-[10px] uppercase">Traction / MRR</span>
                  <span className="font-bold text-emerald-700 text-sm">{appData.tractionMRR}</span>
                </div>
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-slate-400 block font-semibold text-[10px] uppercase">Active Base</span>
                  <span className="font-bold text-slate-800 text-sm">{appData.activeUsers}</span>
                </div>
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 col-span-2 sm:col-span-1">
                  <span className="text-slate-400 block font-semibold text-[10px] uppercase">Stage</span>
                  <span className="font-bold text-[#0B1E48] text-sm">{appData.stage}</span>
                </div>
              </div>

              {/* Pitch Summary */}
              <div className="space-y-2 mb-6 text-xs text-slate-700">
                <span className="font-bold text-slate-800 uppercase tracking-wider block text-[10px]">
                  Venture Value Proposition
                </span>
                <p className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 leading-relaxed">
                  {appData.description}
                </p>
              </div>

              {/* Document Review Row */}
              <div className="mb-6">
                <span className="font-bold text-slate-800 uppercase tracking-wider block text-[10px] mb-2">
                  Uploaded Dossier Files
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 border border-slate-200 rounded-xl flex items-center justify-between bg-slate-50">
                    <div className="flex items-center gap-2 overflow-hidden">
                      <FileText className="w-4 h-4 text-rose-600 shrink-0" />
                      <span className="font-semibold text-slate-700 truncate">{appData.deckFileName}</span>
                    </div>
                    <span className="text-[10px] text-emerald-700 font-bold">Ready</span>
                  </div>

                  <div className="p-3 border border-slate-200 rounded-xl flex items-center justify-between bg-slate-50">
                    <div className="flex items-center gap-2 overflow-hidden">
                      <FileText className="w-4 h-4 text-blue-600 shrink-0" />
                      <span className="font-semibold text-slate-700 truncate">{appData.cacFileName}</span>
                    </div>
                    <span className="text-[10px] text-emerald-700 font-bold">Verified</span>
                  </div>
                </div>
              </div>

              {/* Admin Feedback Input */}
              <div className="space-y-2 mb-6">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Committee Personalized Feedback (Sent to Founder via Automated Email)
                </label>
                <textarea
                  rows={3}
                  value={feedbackInput}
                  onChange={(e) => setFeedbackInput(e.target.value)}
                  className="w-full text-xs p-3.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#0B1E48] focus:border-transparent"
                  placeholder="Enter specific feedback, requests for data room access, or interview timeslots..."
                />
              </div>

              {/* Superadmin Decision Actions with Automated Email Triggers */}
              <div className="flex flex-wrap items-center gap-3 pt-3 border-t border-slate-100">
                <button
                  onClick={() => handleAction('Approved')}
                  className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold shadow-xs transition flex items-center gap-1.5 cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>✓ Approve Startup & Notify</span>
                </button>

                <button
                  onClick={() => handleAction('Information Required')}
                  className="px-4 py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-bold shadow-xs transition flex items-center gap-1.5 cursor-pointer"
                >
                  <AlertCircle className="w-4 h-4" />
                  <span>⚠ Request Additional Info</span>
                </button>

                <button
                  onClick={() => handleAction('Rejected')}
                  className="px-4 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-bold shadow-xs transition flex items-center gap-1.5 cursor-pointer"
                >
                  <XCircle className="w-4 h-4" />
                  <span>✕ Reject Application</span>
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Live Automated Email Outbox */}
          <div>
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Send className="w-4 h-4 text-rose-600" />
                  <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                    Automated Email Outbox
                  </h3>
                </div>
                <span className="text-[10px] font-bold bg-rose-50 text-rose-600 px-2 py-0.5 rounded-full">
                  {sentEmails.length} Dispatched
                </span>
              </div>

              <p className="text-[11px] text-slate-500 mb-4 leading-relaxed">
                Real-time transactional emails triggered and personalized with applicant details:
              </p>

              <div className="space-y-3.5 max-h-[500px] overflow-y-auto pr-1">
                {sentEmails.map((email) => (
                  <div
                    key={email.id}
                    onClick={() => setSelectedEmail(email)}
                    className="p-3.5 rounded-xl border border-slate-200/90 bg-slate-50/70 hover:bg-white hover:shadow-xs text-xs transition cursor-pointer group"
                  >
                    <div className="flex justify-between items-center text-[10px] text-slate-400 mb-1">
                      <span className="font-bold text-rose-600 uppercase tracking-wider">{email.type}</span>
                      <span>{email.timestamp}</span>
                    </div>

                    <h4 className="font-bold text-slate-900 mb-1 group-hover:text-rose-600 transition-colors line-clamp-1">
                      {email.subject}
                    </h4>

                    <p className="text-slate-600 line-clamp-2 text-[11px] leading-relaxed">
                      {email.content}
                    </p>

                    <div className="mt-2 pt-2 border-t border-slate-200/60 flex items-center justify-between text-[10px] text-slate-400">
                      <span className="truncate">To: {email.recipient}</span>
                      <span className="text-rose-600 font-semibold flex items-center gap-0.5">
                        <Eye className="w-3 h-3" /> View
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* EMAIL PREVIEW MODAL */}
      {selectedEmail && (
        <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative border border-slate-100">
            <button
              onClick={() => setSelectedEmail(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 p-1 rounded-full hover:bg-slate-100 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 mb-4">
              <Mail className="w-5 h-5 text-rose-600" />
              <span className="text-xs font-bold uppercase tracking-wider text-rose-600">
                Dispatched Transactional Notification
              </span>
            </div>

            <h3 className="text-lg font-bold text-[#0B1E48] mb-2 leading-snug">
              {selectedEmail.subject}
            </h3>

            <div className="py-2.5 px-3 bg-slate-50 rounded-lg border border-slate-100 text-xs text-slate-600 space-y-1 mb-5">
              <p><span className="text-slate-400">Recipient:</span> <strong>{selectedEmail.recipientName}</strong> &lt;{selectedEmail.recipient}&gt;</p>
              <p><span className="text-slate-400">Sent:</span> {selectedEmail.timestamp}</p>
              <p><span className="text-slate-400">Delivery Status:</span> <span className="text-emerald-700 font-bold">Delivered (Simulated SMTP)</span></p>
            </div>

            <div className="p-4 bg-slate-50/70 border border-slate-200 rounded-xl text-xs text-slate-800 leading-relaxed whitespace-pre-line mb-6 font-mono">
              {selectedEmail.content}
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => setSelectedEmail(null)}
                className="px-5 py-2 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition cursor-pointer"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
