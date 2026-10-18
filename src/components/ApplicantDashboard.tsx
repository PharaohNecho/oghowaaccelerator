import React from 'react';
import {
  Clock,
  Check,
  FileText,
  Mail,
  ShieldCheck,
  AlertCircle,
  ExternalLink,
  ChevronRight,
  Sparkles,
  Download,
  Calendar,
  Building,
  User
} from 'lucide-react';

interface ApplicantDashboardProps {
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
  onOpenApply: () => void;
  onOpenAdmin: () => void;
  onBackToHome: () => void;
}

export const ApplicantDashboard: React.FC<ApplicantDashboardProps> = ({
  appData,
  appStatus,
  adminNotes,
  onOpenApply,
  onOpenAdmin,
  onBackToHome
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Approved':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      case 'Information Required':
        return 'bg-amber-100 text-amber-800 border-amber-300';
      case 'Rejected':
        return 'bg-rose-100 text-rose-800 border-rose-300';
      case 'Submitted':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      default:
        return 'bg-purple-100 text-purple-800 border-purple-300';
    }
  };

  const getStepStatus = (index: number) => {
    if (appStatus === 'Approved') {
      return index <= 3 ? 'done' : 'current';
    }
    if (appStatus === 'Information Required') {
      return index === 1 ? 'current' : index < 1 ? 'done' : 'pending';
    }
    if (appStatus === 'Under Review' || appStatus === 'Submitted') {
      return index === 1 ? 'current' : index < 1 ? 'done' : 'pending';
    }
    return index === 0 ? 'done' : 'pending';
  };

  return (
    <section className="py-10 sm:py-16 bg-slate-50 min-h-[85vh]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Navigation Breadcrumb */}
        <div className="mb-6 flex items-center justify-between">
          <button
            onClick={onBackToHome}
            className="text-xs font-semibold text-slate-500 hover:text-slate-800 flex items-center gap-1"
          >
            ← Return to Overview
          </button>

          <div className="flex items-center gap-3">
            <button
              onClick={onOpenApply}
              className="text-xs font-semibold text-rose-600 hover:text-rose-700 bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-2xs"
            >
              Edit Application
            </button>
            <button
              onClick={onOpenAdmin}
              className="text-xs font-semibold text-[#0B1E48] hover:text-blue-900 bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-200"
            >
              Open Superadmin Reviewer Console →
            </button>
          </div>
        </div>

        {/* Top Header Card */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/90 shadow-xs mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-rose-600 uppercase tracking-widest bg-rose-50 px-2 py-0.5 rounded">
                Cohort 2026-B Applicant
              </span>
              <span className="text-xs font-mono text-slate-500">
                Application ID: <strong className="text-slate-800">OGH-2026-0842</strong>
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-[#0B1E48]">
              {appData.startupName || 'Edutech Pulse'}
            </h1>

            <p className="text-xs sm:text-sm text-slate-600">
              Lead Founder: <strong className="text-slate-800">{appData.founderName}</strong> ({appData.founderEmail}) · Track: {appData.sector}
            </p>
          </div>

          <div className="text-left md:text-right w-full md:w-auto p-4 md:p-0 bg-slate-50 md:bg-transparent rounded-xl border md:border-0 border-slate-200">
            <span className="block text-[11px] text-slate-400 font-bold uppercase tracking-wider mb-1">
              Current Evaluation Status
            </span>
            <span
              className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider border shadow-2xs ${getStatusColor(
                appStatus
              )}`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>{appStatus}</span>
            </span>
            <p className="text-[10px] text-slate-400 mt-1">
              Automated notifications active for this file
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          {/* Left Column: Progress Steps & Uploaded Files */}
          <div className="lg:col-span-2 space-y-6">
            {/* Application Milestone Roadmap */}
            <div className="bg-white p-6 sm:p-7 rounded-2xl border border-slate-200/90 shadow-xs">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-sm font-bold text-[#0B1E48] uppercase tracking-wider">
                    Application Milestone Roadmap
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Live review pipeline with the Óghowa Investment Committee
                  </p>
                </div>
                <span className="text-xs font-semibold text-rose-600 bg-rose-50 px-2.5 py-1 rounded-md">
                  Active Sprint
                </span>
              </div>

              <div className="space-y-6 relative before:absolute before:left-4 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                {[
                  {
                    title: 'Application Received & KYC Verification',
                    desc: 'Initial founder credentials, legal entity registration, and deck recorded.',
                    stage: 0
                  },
                  {
                    title: 'Technical Review & Traction Audit',
                    desc: 'Evaluation of MRR metrics, customer retention, product architecture, and TAM.',
                    stage: 1
                  },
                  {
                    title: 'Partner Committee Pitch & Due Diligence',
                    desc: '15-minute pitch session with the Óghowa Syndicate and domain venture leads.',
                    stage: 2
                  },
                  {
                    title: 'Cohort Offer & Venture Studio Deployment',
                    desc: 'Final SAFE / grant term sheet, $100K cloud credits, and engineering pod allocation.',
                    stage: 3
                  }
                ].map((step) => {
                  const status = getStepStatus(step.stage);
                  return (
                    <div key={step.title} className="relative pl-10">
                      <div
                        className={`absolute left-2 top-0.5 w-5 h-5 rounded-full border-2 flex items-center justify-center -translate-x-1/2 transition-colors ${
                          status === 'done'
                            ? 'bg-emerald-500 border-emerald-500 text-white'
                            : status === 'current'
                            ? 'bg-[#0B1E48] border-[#0B1E48] text-white animate-pulse'
                            : 'bg-white border-slate-300 text-transparent'
                        }`}
                      >
                        <Check className="w-3 h-3" />
                      </div>
                      <h4 className="text-sm font-bold text-slate-900">{step.title}</h4>
                      <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{step.desc}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Submitted Documents Section */}
            <div className="bg-white p-6 sm:p-7 rounded-2xl border border-slate-200/90 shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-[#0B1E48] uppercase tracking-wider">
                  Submitted Verification Documents
                </h3>
                <span className="text-xs text-slate-400">PDF Encrypted</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 border border-slate-200 rounded-xl flex items-center justify-between bg-slate-50/70 hover:bg-white transition">
                  <div className="flex items-center gap-3 overflow-hidden">
                    <div className="w-9 h-9 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div className="truncate">
                      <p className="text-xs font-bold text-slate-800 truncate">
                        {appData.deckFileName || 'Startup_PitchDeck_Q4.pdf'}
                      </p>
                      <span className="text-[10px] text-slate-400">Investor Pitch Deck</span>
                    </div>
                  </div>
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded">
                    Verified
                  </span>
                </div>

                <div className="p-4 border border-slate-200 rounded-xl flex items-center justify-between bg-slate-50/70 hover:bg-white transition">
                  <div className="flex items-center gap-3 overflow-hidden">
                    <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div className="truncate">
                      <p className="text-xs font-bold text-slate-800 truncate">
                        {appData.cacFileName || 'CAC_Certificate_RC198273.pdf'}
                      </p>
                      <span className="text-[10px] text-slate-400">Incorporation Certificate</span>
                    </div>
                  </div>
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded">
                    Verified
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Reviewer Communication & Next Actions */}
          <div className="space-y-6">
            {/* Committee Feedback Box */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-[#0B1E48] uppercase tracking-wider">
                  Reviewer Notes
                </h3>
                <Mail className="w-4 h-4 text-rose-600" />
              </div>

              <div className="p-4 bg-blue-50/80 border border-blue-200 rounded-xl mb-4 text-xs text-blue-900">
                <span className="text-[10px] font-bold text-blue-700 uppercase tracking-wider block mb-1">
                  Latest Committee Feedback:
                </span>
                <p className="italic leading-relaxed">
                  "{adminNotes || 'Application received and currently being reviewed by the selection panel.'}"
                </p>
              </div>

              <p className="text-[11px] text-slate-500 mb-4 leading-relaxed">
                Automated email triggers ensure you receive instantaneous notices whenever the evaluation committee updates your application status.
              </p>

              <button
                onClick={onOpenAdmin}
                className="w-full py-2.5 bg-[#0B1E48] hover:bg-[#153474] text-white rounded-lg text-xs font-bold shadow-xs transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Simulate Superadmin Review</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Traction Summary Snapshot */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-xs space-y-3">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Audited Numbers On Record
              </h3>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                  <span className="text-slate-400 text-[10px] uppercase font-semibold">Traction / MRR</span>
                  <p className="font-bold text-emerald-700 text-sm mt-0.5">{appData.tractionMRR || '₦3,800,000'}</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                  <span className="text-slate-400 text-[10px] uppercase font-semibold">Active Base</span>
                  <p className="font-bold text-slate-800 text-sm mt-0.5">{appData.activeUsers || '14,200'}</p>
                </div>
              </div>

              <p className="text-[11px] text-slate-500 leading-relaxed pt-2">
                Target Market: {appData.targetMarket || 'K-12 schools, state education ministries, and private academies.'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
