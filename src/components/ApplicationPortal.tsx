import React, { useState } from 'react';
import {
  Rocket,
  CheckCircle2,
  UploadCloud,
  FileText,
  ArrowRight,
  Sparkles,
  AlertCircle,
  Building,
  User,
  Check,
  ChevronRight
} from 'lucide-react';
import { EmailNotification } from '../types';

interface ApplicationPortalProps {
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
  setAppData: React.Dispatch<React.SetStateAction<any>>;
  onSubmitApplication: (submission: any) => void;
  onBackToHome: () => void;
  onOpenDashboard: () => void;
}

export const ApplicationPortal: React.FC<ApplicationPortalProps> = ({
  appData,
  setAppData,
  onSubmitApplication,
  onBackToHome,
  onOpenDashboard
}) => {
  const [appStep, setAppStep] = useState<number>(1);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [deckUploaded, setDeckUploaded] = useState<boolean>(true);
  const [cacUploaded, setCacUploaded] = useState<boolean>(true);

  // 1-Click Auto-Fill for instant demonstration
  const handleAutoFill = () => {
    setAppData({
      founderName: 'Osahon Ehigiator',
      founderEmail: 'osahon@edutechpulse.ng',
      founderPhone: '+234 803 123 4567',
      startupName: 'Edutech Pulse',
      sector: 'Education Technology',
      stage: 'Seed Stage',
      description: 'An AI-powered foundational literacy engine and smart tuition reconciliation platform for primary schools across Sub-Saharan Africa.',
      targetMarket: 'K-12 schools, state education ministries, and low-cost private educators.',
      tractionMRR: '₦3,800,000',
      activeUsers: '14,200',
      deckFileName: 'EdutechPulse_PitchDeck_Q4.pdf',
      cacFileName: 'CAC_Registration_RC198273.pdf'
    });
    setDeckUploaded(true);
    setCacUploaded(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      onSubmitApplication({
        ...appData,
        deckFileName: appData.deckFileName || 'EdutechPulse_PitchDeck_Q4.pdf',
        cacFileName: appData.cacFileName || 'CAC_Registration_RC198273.pdf'
      });
    }, 700);
  };

  return (
    <section className="py-10 sm:py-16 bg-slate-50 min-h-[85vh]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Header */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <button
              onClick={onBackToHome}
              className="text-xs text-slate-500 hover:text-slate-800 mb-2 flex items-center gap-1 font-semibold"
            >
              ← Back to Home
            </button>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0B1E48]">
              Óghowa Accelerator & Venture Studio Application
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Complete all 5 sections to submit your startup for Cohort 2026 selection review.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleAutoFill}
              className="px-3 py-1.5 rounded-lg bg-rose-50 text-rose-600 border border-rose-200 text-xs font-semibold hover:bg-rose-100 transition flex items-center gap-1.5 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Auto-Fill Sample</span>
            </button>

            <span className="text-xs font-bold px-3 py-1 bg-rose-100 text-rose-700 rounded-full">
              Step {appStep} of 5
            </span>
          </div>
        </div>

        {/* Stepper Progress Bar */}
        <div className="grid grid-cols-5 gap-2 mb-8">
          {['1. Founder', '2. Venture', '3. Traction', '4. Documents', '5. Review'].map((stepName, idx) => (
            <button
              key={stepName}
              type="button"
              onClick={() => setAppStep(idx + 1)}
              className="flex flex-col gap-1 text-left cursor-pointer focus:outline-hidden"
            >
              <div
                className={`h-2 rounded-full transition-all ${
                  appStep >= idx + 1 ? 'bg-rose-600' : 'bg-slate-200'
                }`}
              />
              <span className={`text-[11px] font-medium hidden sm:block ${
                appStep === idx + 1 ? 'text-rose-600 font-bold' : 'text-slate-500'
              }`}>
                {stepName}
              </span>
            </button>
          ))}
        </div>

        {/* Form Container */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 sm:p-8">
          <form onSubmit={handleSubmit}>
            {/* Step 1: Founder Information */}
            {appStep === 1 && (
              <div className="space-y-5 animate-in fade-in duration-200">
                <div className="border-b border-slate-100 pb-3">
                  <h3 className="text-lg font-bold text-[#0B1E48]">
                    1. Founder & Primary Contact Profile
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Provide the official contact credentials for the lead entrepreneur.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={appData.founderName}
                      onChange={(e) => setAppData({ ...appData, founderName: e.target.value })}
                      className="w-full text-xs sm:text-sm px-3.5 py-2.5 border rounded-lg focus:ring-2 focus:ring-[#0B1E48] focus:border-transparent"
                      placeholder="e.g. Osahon Ehigiator"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Official Founder Email *
                    </label>
                    <input
                      type="email"
                      required
                      value={appData.founderEmail}
                      onChange={(e) => setAppData({ ...appData, founderEmail: e.target.value })}
                      className="w-full text-xs sm:text-sm px-3.5 py-2.5 border rounded-lg focus:ring-2 focus:ring-[#0B1E48] focus:border-transparent"
                      placeholder="founder@venture.africa"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Phone Number (WhatsApp Enabled) *
                    </label>
                    <input
                      type="tel"
                      required
                      value={appData.founderPhone}
                      onChange={(e) => setAppData({ ...appData, founderPhone: e.target.value })}
                      className="w-full text-xs sm:text-sm px-3.5 py-2.5 border rounded-lg focus:ring-2 focus:ring-[#0B1E48] focus:border-transparent"
                      placeholder="+234 803 123 4567"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Base Location
                    </label>
                    <input
                      type="text"
                      defaultValue="Benin City, Edo State"
                      className="w-full text-xs sm:text-sm px-3.5 py-2.5 border rounded-lg focus:ring-2 focus:ring-[#0B1E48] focus:border-transparent"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Venture Profile */}
            {appStep === 2 && (
              <div className="space-y-5 animate-in fade-in duration-200">
                <div className="border-b border-slate-100 pb-3">
                  <h3 className="text-lg font-bold text-[#0B1E48]">
                    2. Startup Details & Sector
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    What market problem does your company tackle in Sub-Saharan Africa?
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Venture Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={appData.startupName}
                      onChange={(e) => setAppData({ ...appData, startupName: e.target.value })}
                      className="w-full text-xs sm:text-sm px-3.5 py-2.5 border rounded-lg focus:ring-2 focus:ring-[#0B1E48] focus:border-transparent"
                      placeholder="e.g. Edutech Pulse"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Primary Sector *
                    </label>
                    <select
                      value={appData.sector}
                      onChange={(e) => setAppData({ ...appData, sector: e.target.value })}
                      className="w-full text-xs sm:text-sm px-3.5 py-2.5 border rounded-lg focus:ring-2 focus:ring-[#0B1E48] focus:border-transparent"
                    >
                      <option>Education Technology</option>
                      <option>Financial Services (FinTech)</option>
                      <option>HealthTech & Life Sciences</option>
                      <option>AgriTech & Food Security</option>
                      <option>Mobility & Transport</option>
                      <option>CleanTech & Renewable Energy</option>
                      <option>GovTech & Digital Identity</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Elevator Pitch & Solution (100 words max) *
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={appData.description}
                    onChange={(e) => setAppData({ ...appData, description: e.target.value })}
                    className="w-full text-xs sm:text-sm px-3.5 py-2.5 border rounded-lg focus:ring-2 focus:ring-[#0B1E48] focus:border-transparent"
                    placeholder="Describe how your solution solves the customer's acute pain point..."
                  />
                </div>
              </div>
            )}

            {/* Step 3: Market & Traction */}
            {appStep === 3 && (
              <div className="space-y-5 animate-in fade-in duration-200">
                <div className="border-b border-slate-100 pb-3">
                  <h3 className="text-lg font-bold text-[#0B1E48]">
                    3. Market Traction & Current Numbers
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Share verifiable metrics indicating product demand and willingness to pay.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Target Customer / Market Size
                  </label>
                  <input
                    type="text"
                    value={appData.targetMarket}
                    onChange={(e) => setAppData({ ...appData, targetMarket: e.target.value })}
                    className="w-full text-xs sm:text-sm px-3.5 py-2.5 border rounded-lg focus:ring-2 focus:ring-[#0B1E48] focus:border-transparent"
                    placeholder="e.g. K-12 schools, state ministries, private educators"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Monthly Recurring Revenue (MRR in ₦) *
                    </label>
                    <input
                      type="text"
                      required
                      value={appData.tractionMRR}
                      onChange={(e) => setAppData({ ...appData, tractionMRR: e.target.value })}
                      className="w-full text-xs sm:text-sm px-3.5 py-2.5 border rounded-lg focus:ring-2 focus:ring-[#0B1E48] focus:border-transparent"
                      placeholder="e.g. ₦3,800,000"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Active Users / Paying Clients *
                    </label>
                    <input
                      type="text"
                      required
                      value={appData.activeUsers}
                      onChange={(e) => setAppData({ ...appData, activeUsers: e.target.value })}
                      className="w-full text-xs sm:text-sm px-3.5 py-2.5 border rounded-lg focus:ring-2 focus:ring-[#0B1E48] focus:border-transparent"
                      placeholder="e.g. 14,200 active students"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Documents Upload */}
            {appStep === 4 && (
              <div className="space-y-6 animate-in fade-in duration-200">
                <div className="border-b border-slate-100 pb-3">
                  <h3 className="text-lg font-bold text-[#0B1E48]">
                    4. Supporting Documents & Pitch Deck
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Upload your slide deck and corporate registration for the diligence room.
                  </p>
                </div>

                {/* Pitch Deck Upload Zone */}
                <div
                  onClick={() => {
                    setDeckUploaded(true);
                    setAppData({ ...appData, deckFileName: 'EdutechPulse_PitchDeck_Q4.pdf' });
                  }}
                  className="border-2 border-dashed border-slate-300 hover:border-rose-500 rounded-xl p-6 text-center cursor-pointer bg-slate-50 hover:bg-rose-50/20 transition-all"
                >
                  <UploadCloud className="w-10 h-10 text-slate-400 mx-auto mb-2" />
                  <p className="text-sm font-semibold text-slate-800">
                    Upload Startup Pitch Deck (PDF only)
                  </p>
                  <p className="text-xs text-slate-500 mb-3">Maximum file size: 25MB · Problem, Market, Team</p>
                  {deckUploaded ? (
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200">
                      <FileText className="w-4 h-4" /> {appData.deckFileName || 'Startup_PitchDeck_2026.pdf'} (Verified)
                    </div>
                  ) : (
                    <span className="px-4 py-1.5 rounded bg-slate-800 text-white text-xs font-semibold inline-block">
                      Select PDF File
                    </span>
                  )}
                </div>

                {/* CAC / Incorporation Upload Zone */}
                <div
                  onClick={() => {
                    setCacUploaded(true);
                    setAppData({ ...appData, cacFileName: 'CAC_Registration_RC198273.pdf' });
                  }}
                  className="border-2 border-dashed border-slate-300 hover:border-rose-500 rounded-xl p-6 text-center cursor-pointer bg-slate-50 hover:bg-rose-50/20 transition-all"
                >
                  <UploadCloud className="w-10 h-10 text-slate-400 mx-auto mb-2" />
                  <p className="text-sm font-semibold text-slate-800">
                    Certificate of Incorporation (CAC / Registered Entity)
                  </p>
                  <p className="text-xs text-slate-500 mb-3">Proof of registered legal entity or business name</p>
                  {cacUploaded ? (
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200">
                      <FileText className="w-4 h-4" /> {appData.cacFileName || 'CAC_Certificate.pdf'} (Verified)
                    </div>
                  ) : (
                    <span className="px-4 py-1.5 rounded bg-slate-800 text-white text-xs font-semibold inline-block">
                      Select PDF File
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* Step 5: Final Review & Submit */}
            {appStep === 5 && (
              <div className="space-y-5 animate-in fade-in duration-200">
                <div className="border-b border-slate-100 pb-3">
                  <h3 className="text-lg font-bold text-[#0B1E48]">
                    5. Review Application Summary
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Double check your submission information before formal submission.
                  </p>
                </div>

                <div className="bg-slate-50 p-4 sm:p-5 rounded-xl border border-slate-200 space-y-3 text-xs">
                  <div className="flex justify-between border-b border-slate-200/60 pb-2">
                    <span className="text-slate-500">Lead Founder:</span>
                    <span className="font-bold text-slate-800">{appData.founderName}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-200/60 pb-2">
                    <span className="text-slate-500">Founder Email:</span>
                    <span className="font-bold text-slate-800">{appData.founderEmail}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-200/60 pb-2">
                    <span className="text-slate-500">Startup Name:</span>
                    <span className="font-bold text-slate-800">{appData.startupName}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-200/60 pb-2">
                    <span className="text-slate-500">Sector:</span>
                    <span className="font-bold text-slate-800">{appData.sector}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-200/60 pb-2">
                    <span className="text-slate-500">Current MRR:</span>
                    <span className="font-bold text-emerald-700">{appData.tractionMRR}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Attached Documents:</span>
                    <span className="font-bold text-slate-800">
                      {appData.deckFileName} · {appData.cacFileName}
                    </span>
                  </div>
                </div>

                <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800 flex items-start gap-2.5">
                  <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <span>
                    By submitting, you certify that all information submitted to the Óghowa screening committee is accurate. An automated confirmation email will be dispatched to your email address.
                  </span>
                </div>
              </div>
            )}

            {/* Stepper Navigation Buttons */}
            <div className="mt-8 flex items-center justify-between border-t border-slate-100 pt-5">
              {appStep > 1 ? (
                <button
                  type="button"
                  onClick={() => setAppStep((prev) => prev - 1)}
                  className="px-4 py-2 border rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-100 transition cursor-pointer"
                >
                  Previous Step
                </button>
              ) : (
                <button
                  type="button"
                  onClick={onBackToHome}
                  className="text-xs font-medium text-slate-500 hover:text-slate-800"
                >
                  Cancel
                </button>
              )}

              {appStep < 5 ? (
                <button
                  type="button"
                  onClick={() => setAppStep((prev) => prev + 1)}
                  className="px-6 py-2.5 bg-[#0B1E48] hover:bg-[#153474] text-white rounded-lg text-xs font-bold shadow-xs transition flex items-center gap-1.5 cursor-pointer"
                >
                  <span>Next Step</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-7 py-3 bg-rose-600 hover:bg-rose-700 active:scale-98 text-white rounded-lg text-xs font-bold shadow-md transition flex items-center gap-2 cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Submitting to Committee...</span>
                    </>
                  ) : (
                    <>
                      <Rocket className="w-4 h-4" />
                      <span>Submit Formal Application</span>
                    </>
                  )}
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};
