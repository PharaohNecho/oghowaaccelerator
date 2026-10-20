import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Lock,
  Clock,
  Sparkles,
  Building,
  User,
  Mail,
  Phone,
  Briefcase,
  MapPin,
  Rocket,
  Coins,
  Palette,
  GraduationCap,
  Landmark,
  ShieldCheck,
  Bookmark,
  ChevronDown,
  Download,
  Calendar,
  X,
  Search,
  Check,
  Share2,
  FileText
} from 'lucide-react';
import { BusinessWeekLogo } from './BusinessWeekLogo';
import { EmailNotification } from '../types';

interface BusinessWeekRegistrationProps {
  onBackToBusinessWeek: () => void;
  onBackToAccelerator: () => void;
  onTicketReserved?: (email: EmailNotification) => void;
}

export const BusinessWeekRegistration: React.FC<BusinessWeekRegistrationProps> = ({
  onBackToBusinessWeek,
  onBackToAccelerator,
  onTicketReserved
}) => {
  // Navigation Tabs: 'registration' | 'schedule-tracks' | 'status-lookup'
  const [activeTab, setActiveTab] = useState<'registration' | 'schedule-tracks' | 'status-lookup'>('registration');

  // Form State
  const [primaryEmail, setPrimaryEmail] = useState<string>('');
  const [fullName, setFullName] = useState<string>('');
  const [confirmationEmail, setConfirmationEmail] = useState<string>('');
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [organisation, setOrganisation] = useState<string>('');
  const [jobRole, setJobRole] = useState<string>('');
  const [location, setLocation] = useState<string>('');

  // Step B: Participation
  const [selectedPersona, setSelectedPersona] = useState<string>('founder');
  const [selectedTracks, setSelectedTracks] = useState<string[]>([
    'digital_economy',
    'investment_pitches'
  ]);
  const [masterclass, setMasterclass] = useState<string>('early_stage_fundraising');
  const [attendanceMode, setAttendanceMode] = useState<'in_person' | 'virtual'>('in_person');

  // Step C: Logistics
  const [discoverySource, setDiscoverySource] = useState<string>('social_media');
  const [accessibility, setAccessibility] = useState<string>('');
  const [pitchUpdates, setPitchUpdates] = useState<boolean>(true);

  // Summary accordion & Draft
  const [isSummaryOpen, setIsSummaryOpen] = useState<boolean>(false);
  const [draftSaved, setDraftSaved] = useState<boolean>(false);

  // Success Modal State
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState<boolean>(false);
  const [confirmedPass, setConfirmedPass] = useState<{
    code: string;
    name: string;
    mode: string;
    email: string;
    org: string;
  } | null>(null);

  // Status Lookup State
  const [lookupQuery, setLookupQuery] = useState<string>('');
  const [lookupResult, setLookupResult] = useState<any | null>(null);
  const [lookupSearched, setLookupSearched] = useState<boolean>(false);

  // Active step highlight
  const [currentStep, setCurrentStep] = useState<number>(1);

  useEffect(() => {
    const handleScroll = () => {
      const secB = document.getElementById('reg-section-participation');
      const secC = document.getElementById('reg-section-logistics');
      if (!secB || !secC) return;

      const topOffset = window.scrollY + 250;
      const bTop = secB.offsetTop;
      const cTop = secC.offsetTop;

      if (topOffset >= cTop) {
        setCurrentStep(3);
      } else if (topOffset >= bTop) {
        setCurrentStep(2);
      } else {
        setCurrentStep(1);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    setActiveTab('registration');
    setTimeout(() => {
      const el = document.getElementById(id);
      if (el) {
        const yOffset = -90;
        const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    }, 50);
  };

  const handleTrackToggle = (trackValue: string) => {
    if (selectedTracks.includes(trackValue)) {
      setSelectedTracks(selectedTracks.filter((t) => t !== trackValue));
    } else {
      setSelectedTracks([...selectedTracks, trackValue]);
    }
  };

  const handleSaveDraft = () => {
    setDraftSaved(true);
    setTimeout(() => setDraftSaved(false), 3000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const generatedRef = `OGH-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const passData = {
      code: generatedRef,
      name: fullName || 'Esteemed Delegate',
      mode: attendanceMode === 'virtual' ? 'Virtual Stream Pass' : 'Physical Access Pass (Benin City)',
      email: primaryEmail || 'delegate@businessweek.africa',
      org: organisation || 'Independent Innovator'
    };

    setConfirmedPass(passData);
    setIsSuccessModalOpen(true);

    if (onTicketReserved) {
      const ticketEmail: EmailNotification = {
        id: `EML-OBW-${Date.now()}`,
        recipient: passData.email,
        recipientName: passData.name,
        subject: `Accreditation Confirmed: Óghowa Business Week 2026 (${passData.code})`,
        type: 'Event Ticket',
        timestamp: 'Just now',
        content: `Dear ${passData.name},\n\nYour enrollment for Óghowa Business Week 2026 in direct collaboration with Benin Tech Fest & Edo State Innovation Network has been successfully recorded!\n\nDelegate Reference: ${passData.code}\nAccess Mode: ${passData.mode}\nOrganisation: ${passData.org}\nVenue: Victor Uwaifo Creative Hub & Edo Innovates Campus, Airport Road, Benin City.\n\nPlease save your accreditation reference for instant RFID clearance at the registration desk.\n\nWarm regards,\nÓghowa Business Week Secretariat`
      };
      onTicketReserved(ticketEmail);
    }
  };

  const handleStatusSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setLookupSearched(true);
    if (!lookupQuery.trim()) {
      setLookupResult(null);
      return;
    }
    if (confirmedPass && (lookupQuery.includes(confirmedPass.code) || lookupQuery.includes(confirmedPass.email))) {
      setLookupResult(confirmedPass);
    } else if (lookupQuery.toLowerCase().includes('osagie') || lookupQuery.includes('2026') || lookupQuery.includes('@')) {
      setLookupResult({
        code: 'OGH-2026-8842',
        name: lookupQuery.includes('@') ? lookupQuery.split('@')[0] : 'Dr. Aisosa Edebiri',
        mode: 'In-Person Delegate (Benin City)',
        email: lookupQuery.includes('@') ? lookupQuery : 'aisosa@edutech.ng',
        org: 'Edo Innovation Network Fellow',
        status: 'Accreditation Confirmed & Active'
      });
    } else {
      setLookupResult(null);
    }
  };

  return (
    <div className="bg-[#FBF9F5] text-[#181d1b] min-h-screen flex flex-col font-sans selection:bg-[#00231b] selection:text-white">
      {/* 1. HEADER (Styled per Óghowa Business Week theme) */}
      <header className="fixed top-0 w-full z-50 bg-white/95 backdrop-blur-md shadow-[0_1px_8px_rgba(0,0,0,0.04)] border-b border-[#E5DFD5]">
        <div className="h-20 max-w-[1120px] mx-auto px-4 md:px-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={onBackToBusinessWeek}
              className="cursor-pointer hover:opacity-90 transition-opacity flex items-center"
              title="Return to Business Week Main Page"
            >
              <BusinessWeekLogo size="sm" />
            </button>
            <div className="flex flex-col">
              <span className="text-base text-[#00231b] font-bold tracking-tight leading-tight">
                Óghowa Business Week
              </span>
              <span className="text-xs text-[#52605B]">Delegate Registration Portal</span>
            </div>
            <div className="hidden sm:flex items-center px-2.5 py-1 rounded-full bg-[#FEF3C7] text-[#B45309] text-[11px] font-bold uppercase tracking-wider ml-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#B45309] mr-1.5 animate-pulse" />
              Collaboration with Benin Tech Fest
            </div>
          </div>

          <div className="flex items-center gap-3 sm:gap-5">
            <nav className="flex items-center gap-1 sm:gap-2">
              <button
                onClick={() => {
                  setActiveTab('registration');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className={`text-xs sm:text-sm font-semibold px-3 py-1.5 transition-colors rounded-lg cursor-pointer ${
                  activeTab === 'registration'
                    ? 'bg-[#00231b] text-white shadow-xs'
                    : 'text-[#414845] hover:text-[#181d1b]'
                }`}
              >
                Register
              </button>
              <button
                onClick={() => {
                  setActiveTab('schedule-tracks');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className={`text-xs sm:text-sm font-semibold px-3 py-1.5 transition-colors rounded-lg cursor-pointer ${
                  activeTab === 'schedule-tracks'
                    ? 'bg-[#00231b] text-white shadow-xs'
                    : 'text-[#414845] hover:text-[#181d1b]'
                }`}
              >
                Tracks
              </button>
              <button
                onClick={() => {
                  setActiveTab('status-lookup');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className={`text-xs sm:text-sm font-semibold px-3 py-1.5 transition-colors rounded-lg cursor-pointer ${
                  activeTab === 'status-lookup'
                    ? 'bg-[#00231b] text-white shadow-xs'
                    : 'text-[#414845] hover:text-[#181d1b]'
                }`}
              >
                Verify Status
              </button>
            </nav>

            <button
              onClick={onBackToBusinessWeek}
              className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-blue-700 hover:text-blue-900 bg-blue-50 px-2.5 py-1.5 rounded-lg border border-blue-200 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Summit Page</span>
            </button>

            <button
              onClick={onBackToAccelerator}
              className="hidden lg:flex items-center gap-1.5 text-xs sm:text-sm font-medium text-[#52605B] hover:text-[#00231b] transition-colors cursor-pointer"
              title="Return to Óghowa Accelerator Mother Site"
            >
              <span>Main Accelerator</span>
            </button>
          </div>
        </div>
      </header>

      {/* 2. MAIN REGISTRATION CONTAINER */}
      <main className="w-full pt-20 flex-1 bg-[#FBF9F5]">
        <div className="max-w-[1120px] mx-auto px-4 md:px-6 py-8 sm:py-10">
          <div className="max-w-[760px] mx-auto">
            {/* Geometric diamond motif */}
            <div className="w-full flex justify-center mb-4 opacity-35">
              <svg fill="none" height="12" viewBox="0 0 48 12" width="48" xmlns="http://www.w3.org/2000/svg">
                <path d="M0 6L6 0L12 6L6 12L0 6ZM18 6L24 0L30 6L24 12L18 6ZM36 6L42 0L48 6L42 12L36 6Z" fill="#0E3A2F" />
              </svg>
            </div>

            {/* TAB 1: REGISTRATION WIZARD */}
            {activeTab === 'registration' && (
              <div className="flex flex-col w-full">
                {/* Top Progress Bar (Sticky under header) */}
                <div className="sticky top-20 z-40 w-full mb-6 backdrop-blur-md bg-white/90 rounded-xl shadow-xs p-3.5 flex flex-col md:flex-row md:items-center justify-between gap-3 border border-[#E5DFD5]">
                  <div className="flex items-center gap-2">
                    <span className="flex h-2.5 w-2.5 relative">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#B45309] opacity-75" />
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#B45309]" />
                    </span>
                    <span className="text-[11px] font-bold text-[#00231b] uppercase tracking-widest">
                      Registration Status
                    </span>
                    <span className="text-[#52605B] text-xs">
                      | Step <strong className="text-[#00231b] font-bold">{currentStep}</strong> of 3
                    </span>
                  </div>

                  {/* Step Indicators */}
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1.5 cursor-pointer" onClick={() => scrollToSection('reg-section-about')}>
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold transition-all ${
                          currentStep >= 1 ? 'bg-[#00231b] text-white' : 'bg-[#F4EFE6] text-[#52605B]'
                        }`}
                      >
                        1
                      </div>
                      <span className="hidden sm:inline text-xs font-semibold text-[#00231b]">Profile</span>
                    </div>

                    <div className={`w-8 h-0.5 ${currentStep >= 2 ? 'bg-[#00231b]' : 'bg-[#E5DFD5]'}`} />

                    <div className="flex items-center gap-1.5 cursor-pointer" onClick={() => scrollToSection('reg-section-participation')}>
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold transition-all ${
                          currentStep >= 2 ? 'bg-[#00231b] text-white' : 'bg-[#F4EFE6] text-[#52605B]'
                        }`}
                      >
                        2
                      </div>
                      <span className="hidden sm:inline text-xs font-semibold text-[#52605B]">Participation</span>
                    </div>

                    <div className={`w-8 h-0.5 ${currentStep >= 3 ? 'bg-[#00231b]' : 'bg-[#E5DFD5]'}`} />

                    <div className="flex items-center gap-1.5 cursor-pointer" onClick={() => scrollToSection('reg-section-logistics')}>
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold transition-all ${
                          currentStep >= 3 ? 'bg-[#00231b] text-white' : 'bg-[#F4EFE6] text-[#52605B]'
                        }`}
                      >
                        3
                      </div>
                      <span className="hidden sm:inline text-xs font-semibold text-[#52605B]">Logistics</span>
                    </div>
                  </div>

                  <div className="hidden lg:flex items-center gap-1.5 text-xs text-[#52605B]">
                    <Clock className="w-3.5 h-3.5" />
                    <span>Takes ~3 mins</span>
                  </div>
                </div>

                {/* Hero Intro Card */}
                <div className="w-full bg-white rounded-2xl shadow-[0_4px_24px_rgba(14,58,47,0.06)] overflow-hidden mb-8 border border-[#E5DFD5]">
                  <div className="bg-gradient-to-r from-[#00231b] to-[#0e3a2f] p-6 sm:p-8 text-white relative">
                    <div className="absolute -right-8 -bottom-12 opacity-10 pointer-events-none select-none">
                      <svg fill="currentColor" height="220" viewBox="0 0 100 100" width="220">
                        <circle cx="50" cy="50" fill="none" r="45" stroke="white" strokeWidth="2" />
                        <path d="M 50 5 Q 75 35 70 70 Q 55 95 30 80 Q 20 45 50 5" fill="none" stroke="white" strokeWidth="3" />
                        <path d="M 50 5 Q 60 40 85 55 Q 65 90 40 85" fill="none" stroke="white" strokeWidth="2" />
                      </svg>
                    </div>

                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 relative z-10">
                      <div className="space-y-3 max-w-xl">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#FEF3C7] text-[#B45309] text-[11px] font-bold uppercase tracking-wider">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#B45309]" />
                            Official Delegation Registration
                          </span>
                          <span className="inline-flex items-center text-[#b5efda] text-xs font-semibold">
                            Benin City, Edo State
                          </span>
                        </div>
                        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
                          Óghowa Business Week 2026
                        </h1>
                        <p className="text-sm sm:text-base text-[#eaefeb] leading-relaxed font-normal">
                          Gathering founders, high-impact investors, industrial leaders, and emerging technologists for keynote debates, masterclasses, and strategic venture networking across Edo State.
                        </p>
                      </div>

                      <div className="flex flex-col items-center sm:items-start bg-[#00231b]/50 backdrop-blur-sm p-4 rounded-xl gap-1 min-w-[190px] border border-white/10">
                        <div className="flex items-center gap-1.5 text-[#FEF3C7] text-xs font-bold uppercase tracking-wider">
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>Capacity Window</span>
                        </div>
                        <span className="text-lg font-bold text-white">Limited Delegates</span>
                        <p className="text-[11px] text-[#d6dbd8]">
                          Registrations are reviewed systematically by the summit committee.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Institutional Collaboration Sub-strip */}
                  <div className="bg-[#F4EFE6] px-6 py-3 flex flex-wrap items-center justify-between gap-3 text-xs border-t border-[#E5DFD5]">
                    <div className="flex items-center gap-2 text-[#181d1b]">
                      <ShieldCheck className="w-4 h-4 text-[#316858] shrink-0" />
                      <span>
                        Institutional partnership with <strong>Benin Tech Fest</strong> & Edo State Innovation Network
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 text-[#52605B]">
                      <Lock className="w-3.5 h-3.5" />
                      <span>Secure & Encrypted Enrollment</span>
                    </div>
                  </div>
                </div>

                {/* MAIN REGISTRATION FORM */}
                <form className="space-y-8" id="registrationForm" onSubmit={handleSubmit}>
                  {/* SECTION A: ABOUT YOU */}
                  <section
                    className="bg-white rounded-2xl p-6 sm:p-8 shadow-[0_2px_12px_rgba(0,0,0,0.03)] space-y-6 border border-[#E5DFD5]"
                    id="reg-section-about"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-2 gap-2 border-b border-[#E5DFD5]">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="w-6 h-6 rounded-full bg-[#00231b] text-white flex items-center justify-center text-xs font-bold">
                            A
                          </span>
                          <h2 className="text-xl font-bold text-[#00231b]">About You</h2>
                        </div>
                        <p className="text-xs text-[#52605B]">Primary contact and verified identification profile.</p>
                      </div>
                      <span className="text-[#52605B] text-[11px] uppercase tracking-wider bg-[#F4EFE6] px-2.5 py-1 rounded-md font-semibold">
                        Fields marked <span className="text-[#B45309] font-bold">*</span> required
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Field 1: Primary Email */}
                      <div className="flex flex-col space-y-1 md:col-span-2">
                        <label className="text-sm font-bold text-[#181d1b] flex items-center justify-between" htmlFor="primary_email">
                          <span>
                            Primary Email Address <span className="text-[#B45309] font-bold">*</span>
                          </span>
                          <span className="text-xs font-normal text-[#52605B]">Account verification email</span>
                        </label>
                        <div className="relative">
                          <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#52605B] w-4 h-4" />
                          <input
                            className="w-full bg-white pl-10 pr-4 py-2.5 rounded-lg border border-[#C8BFB0] text-sm text-[#181d1b] placeholder:text-[#52605B]/60 focus:outline-hidden focus:ring-2 focus:ring-[#B45309]"
                            id="primary_email"
                            type="email"
                            value={primaryEmail}
                            onChange={(e) => {
                              setPrimaryEmail(e.target.value);
                              if (!confirmationEmail) setConfirmationEmail(e.target.value);
                            }}
                            placeholder="e.g. osagie.e@innovateafrica.com"
                            required
                          />
                        </div>
                        <span className="text-[11px] text-[#52605B]">
                          Your accreditation badge and access schedules will be dispatched here.
                        </span>
                      </div>

                      {/* Field 2: Full Name */}
                      <div className="flex flex-col space-y-1">
                        <label className="text-sm font-bold text-[#181d1b]" htmlFor="full_name">
                          Full Name <span className="text-[#B45309] font-bold">*</span>
                        </label>
                        <div className="relative">
                          <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#52605B] w-4 h-4" />
                          <input
                            className="w-full bg-white pl-10 pr-4 py-2.5 rounded-lg border border-[#C8BFB0] text-sm text-[#181d1b] placeholder:text-[#52605B]/60 focus:outline-hidden focus:ring-2 focus:ring-[#B45309]"
                            id="full_name"
                            type="text"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            placeholder="e.g. Osagie Egharevba"
                            required
                          />
                        </div>
                        <span className="text-[11px] text-[#52605B]">
                          First and surname as matching your valid identification.
                        </span>
                      </div>

                      {/* Field 3: Confirmation Email */}
                      <div className="flex flex-col space-y-1 bg-[#F4EFE6]/60 p-3 rounded-lg border border-[#E5DFD5]">
                        <div className="flex items-center justify-between">
                          <label className="text-sm font-bold text-[#181d1b]" htmlFor="confirmation_email">
                            Confirm Email Address <span className="text-[#B45309] font-bold">*</span>
                          </label>
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-[#B45309] bg-[#FEF3C7] px-2 py-0.5 rounded">
                            Preserved Field
                          </span>
                        </div>
                        <div className="relative">
                          <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#52605B] w-4 h-4" />
                          <input
                            className="w-full bg-white pl-10 pr-4 py-2.5 rounded-lg border border-[#C8BFB0] text-sm text-[#181d1b] placeholder:text-[#52605B]/60 focus:outline-hidden focus:ring-2 focus:ring-[#B45309]"
                            id="confirmation_email"
                            type="email"
                            value={confirmationEmail}
                            onChange={(e) => setConfirmationEmail(e.target.value)}
                            placeholder="Confirm or repeat email address"
                            required
                          />
                        </div>
                        <span className="text-[11px] text-[#52605B]">
                          Preserved per source form specification for participant confirmation.
                        </span>
                      </div>

                      {/* Field 4: Phone / WhatsApp Number */}
                      <div className="flex flex-col space-y-1">
                        <label className="text-sm font-bold text-[#181d1b]" htmlFor="phone_number">
                          Phone / WhatsApp Number <span className="text-[#B45309] font-bold">*</span>
                        </label>
                        <div className="flex rounded-lg border border-[#C8BFB0] overflow-hidden bg-white">
                          <div className="flex items-center gap-1.5 px-3 bg-[#F4EFE6] text-[#181d1b] text-xs font-bold border-r border-[#C8BFB0] select-none shrink-0">
                            <span className="w-4 h-3 bg-[#008751] rounded-xs inline-block" />
                            <span>+234</span>
                          </div>
                          <input
                            className="w-full px-3.5 py-2.5 text-sm text-[#181d1b] placeholder:text-[#52605B]/60 focus:outline-hidden"
                            id="phone_number"
                            type="tel"
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                            placeholder="801 234 5678"
                            required
                          />
                        </div>
                        <span className="text-[11px] text-[#52605B]">
                          Used for urgent delegate briefing updates.
                        </span>
                      </div>

                      {/* Field 5: Organisation */}
                      <div className="flex flex-col space-y-1">
                        <label className="text-sm font-bold text-[#181d1b]" htmlFor="organisation">
                          Organisation / Business / School <span className="text-[#B45309] font-bold">*</span>
                        </label>
                        <div className="relative">
                          <Building className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#52605B] w-4 h-4" />
                          <input
                            className="w-full bg-white pl-10 pr-4 py-2.5 rounded-lg border border-[#C8BFB0] text-sm text-[#181d1b] placeholder:text-[#52605B]/60 focus:outline-hidden focus:ring-2 focus:ring-[#B45309]"
                            id="organisation"
                            type="text"
                            value={organisation}
                            onChange={(e) => setOrganisation(e.target.value)}
                            placeholder="e.g. Benin Hub Ventures or Edo State Polytechnic"
                            required
                          />
                        </div>
                        <span className="text-[11px] text-[#52605B]">
                          Write "Independent" if not attached to an organisation.
                        </span>
                      </div>

                      {/* Field 6: Job Role */}
                      <div className="flex flex-col space-y-1">
                        <label className="text-sm font-bold text-[#181d1b]" htmlFor="job_role">
                          Job Title / Role <span className="text-[#B45309] font-bold">*</span>
                        </label>
                        <div className="relative">
                          <Briefcase className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#52605B] w-4 h-4" />
                          <input
                            className="w-full bg-white pl-10 pr-4 py-2.5 rounded-lg border border-[#C8BFB0] text-sm text-[#181d1b] placeholder:text-[#52605B]/60 focus:outline-hidden focus:ring-2 focus:ring-[#B45309]"
                            id="job_role"
                            type="text"
                            value={jobRole}
                            onChange={(e) => setJobRole(e.target.value)}
                            placeholder="e.g. Founder, Managing Partner, Product Lead"
                            required
                          />
                        </div>
                        <span className="text-[11px] text-[#52605B]">
                          Indicate your primary role within your active entity.
                        </span>
                      </div>

                      {/* Field 7: Location */}
                      <div className="flex flex-col space-y-1">
                        <label className="text-sm font-bold text-[#181d1b]" htmlFor="location">
                          City, State and Country <span className="text-[#B45309] font-bold">*</span>
                        </label>
                        <div className="relative">
                          <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#52605B] w-4 h-4" />
                          <input
                            className="w-full bg-white pl-10 pr-4 py-2.5 rounded-lg border border-[#C8BFB0] text-sm text-[#181d1b] placeholder:text-[#52605B]/60 focus:outline-hidden focus:ring-2 focus:ring-[#B45309]"
                            id="location"
                            type="text"
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            placeholder="e.g. Benin City, Edo State, Nigeria"
                            required
                          />
                        </div>
                        <span className="text-[11px] text-[#52605B]">
                          Assists logistical committee with regional delegate distribution metrics.
                        </span>
                      </div>
                    </div>
                  </section>

                  {/* SECTION B: PARTICIPATION & TRACK PREFERENCES */}
                  <section
                    className="bg-white rounded-2xl p-6 sm:p-8 shadow-[0_2px_12px_rgba(0,0,0,0.03)] space-y-6 border border-[#E5DFD5]"
                    id="reg-section-participation"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-2 gap-2 border-b border-[#E5DFD5]">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="w-6 h-6 rounded-full bg-[#00231b] text-white flex items-center justify-center text-xs font-bold">
                            B
                          </span>
                          <h2 className="text-xl font-bold text-[#00231b]">Participation & Track Preferences</h2>
                        </div>
                        <p className="text-xs text-[#52605B]">Customise your summit track, breakout sessions, and engagement format.</p>
                      </div>
                      <span className="text-[#316858] text-[11px] font-bold tracking-wider uppercase">
                        Track Allocation
                      </span>
                    </div>

                    {/* Persona Cards */}
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-[#181d1b] block">
                        Category / Participant Persona <span className="text-[#B45309] font-bold">*</span>
                      </label>
                      <p className="text-xs text-[#52605B]">Select the persona that best aligns with your goals for this summit:</p>

                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 pt-2">
                        {[
                          { id: 'founder', title: 'Founder / Startup Operator', sub: 'Scaling scalable ventures or MVP products', icon: Rocket },
                          { id: 'investor', title: 'Investor / VC / Angel', sub: 'Deploying seed, venture or growth capital', icon: Coins },
                          { id: 'corporate', title: 'Corporate Executive / Leader', sub: 'Enterprises, banking, and strategic industries', icon: Building },
                          { id: 'creative_tech', title: 'Creative & Tech Professional', sub: 'Designers, engineers, content creators', icon: Palette },
                          { id: 'student_academic', title: 'Student / Academic Researcher', sub: 'Tertiary research, faculty, and scholars', icon: GraduationCap },
                          { id: 'policymaker', title: 'Policy Maker / Public Sector', sub: 'Government, regulatory and multilateral', icon: Landmark }
                        ].map((p) => {
                          const IconComp = p.icon;
                          const isSelected = selectedPersona === p.id;
                          return (
                            <div
                              key={p.id}
                              onClick={() => setSelectedPersona(p.id)}
                              className={`p-4 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                                isSelected
                                  ? 'bg-[#00231b] text-white border-[#00231b] shadow-md'
                                  : 'bg-[#FBF9F5] hover:bg-[#F4EFE6] border-[#E5DFD5] text-[#181d1b]'
                              }`}
                            >
                              <div className="flex items-center justify-between mb-2">
                                <IconComp className={`w-5 h-5 ${isSelected ? 'text-[#FEF3C7]' : 'text-[#00231b]'}`} />
                                <div
                                  className={`w-4 h-4 rounded-full flex items-center justify-center border ${
                                    isSelected ? 'bg-white border-white' : 'border-[#C8BFB0]'
                                  }`}
                                >
                                  {isSelected && <div className="w-2 h-2 rounded-full bg-[#00231b]" />}
                                </div>
                              </div>
                              <div>
                                <h4 className={`text-sm font-bold ${isSelected ? 'text-white' : 'text-[#181d1b]'}`}>
                                  {p.title}
                                </h4>
                                <p className={`text-[11px] mt-1 leading-snug ${isSelected ? 'text-[#eaefeb]' : 'text-[#52605B]'}`}>
                                  {p.sub}
                                </p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Tracks Checkboxes */}
                    <div className="space-y-2 pt-2">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between">
                        <label className="text-sm font-bold text-[#181d1b]">
                          Primary Area of Interest / Tracks <span className="text-[#B45309] font-bold">*</span>
                        </label>
                        <span className="text-xs text-[#52605B]">Select all relevant thematic tracks</span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {[
                          { id: 'digital_economy', title: 'Digital Economy & Tech Ecosystem', desc: 'Software, fintech, AI innovation, and regional talent pipelines.' },
                          { id: 'agritech', title: 'Agriculture, Agritech & Value Chain', desc: 'Agro-processing, sustainable yield, and mechanized distribution.' },
                          { id: 'creative_arts', title: 'Creative Economy, Arts & Media', desc: 'Heritage preservation, digital content, film, and creative enterprise.' },
                          { id: 'manufacturing_energy', title: 'Manufacturing, Energy & Infrastructure', desc: 'Power grids, clean mobility, local industrial zones, and production.' },
                          { id: 'investment_pitches', title: 'Investment, Venture Capital & Startup Pitches', desc: 'Deal syndicates, investor showcases, and founder pitch rooms.' },
                          { id: 'policy_governance', title: 'Policy, Governance & Economic Transformation', desc: 'Regulatory frameworks, SME incentives, and sub-national growth policies.' }
                        ].map((track) => {
                          const isChecked = selectedTracks.includes(track.id);
                          return (
                            <label
                              key={track.id}
                              className={`flex items-start gap-3 p-3.5 rounded-xl border transition-all cursor-pointer ${
                                isChecked
                                  ? 'bg-[#FEF3C7]/40 border-[#B45309]/50'
                                  : 'bg-[#FBF9F5] hover:bg-[#F4EFE6] border-[#E5DFD5]'
                              }`}
                            >
                              <input
                                type="checkbox"
                                checked={isChecked}
                                onChange={() => handleTrackToggle(track.id)}
                                className="mt-1 h-4 w-4 rounded accent-[#00231b] text-[#00231b]"
                              />
                              <div>
                                <span className="text-xs sm:text-sm font-bold text-[#181d1b] block">
                                  {track.title}
                                </span>
                                <span className="text-[11px] text-[#52605B] block mt-0.5 leading-snug">
                                  {track.desc}
                                </span>
                              </div>
                            </label>
                          );
                        })}
                      </div>
                    </div>

                    {/* Masterclass dropdown */}
                    <div className="flex flex-col space-y-1">
                      <label className="text-sm font-bold text-[#181d1b]" htmlFor="masterclass_breakout">
                        Masterclasses & Breakout Sessions of Interest
                      </label>
                      <select
                        id="masterclass_breakout"
                        value={masterclass}
                        onChange={(e) => setMasterclass(e.target.value)}
                        className="w-full bg-white p-2.5 rounded-lg border border-[#C8BFB0] text-sm text-[#181d1b] focus:ring-2 focus:ring-[#B45309]"
                      >
                        <option value="early_stage_fundraising">Early Stage Fundraising & Term Sheets</option>
                        <option value="scaling_commerce">Scaling Cross-Border Commerce & Logistics</option>
                        <option value="ai_sme_adoption">AI & Technology Adoption for African SMEs</option>
                        <option value="building_edo_infra">Building in Edo: Infrastructure & Market Access</option>
                        <option value="general_delegation">General Delegation / All Keynote Sessions</option>
                      </select>
                      <span className="text-[11px] text-[#52605B]">
                        Seats inside masterclass halls are capped per session room capacity.
                      </span>
                    </div>

                    {/* Attendance Mode */}
                    <div className="space-y-1.5 pt-1">
                      <label className="text-sm font-bold text-[#181d1b] block">
                        How will you attend? <span className="text-[#B45309] font-bold">*</span>
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <label
                          onClick={() => setAttendanceMode('in_person')}
                          className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-all ${
                            attendanceMode === 'in_person'
                              ? 'bg-[#00231b] text-white border-[#00231b] shadow-sm'
                              : 'bg-[#FBF9F5] border-[#E5DFD5] text-[#181d1b]'
                          }`}
                        >
                          <Building className={`w-6 h-6 ${attendanceMode === 'in_person' ? 'text-[#FEF3C7]' : 'text-[#00231b]'}`} />
                          <div>
                            <span className="text-sm font-bold block">In-Person Delegate</span>
                            <span className={`text-[11px] block mt-0.5 ${attendanceMode === 'in_person' ? 'text-[#eaefeb]' : 'text-[#52605B]'}`}>
                              Benin City, Edo State, Nigeria (Live Badge Pass)
                            </span>
                          </div>
                        </label>

                        <label
                          onClick={() => setAttendanceMode('virtual')}
                          className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-all ${
                            attendanceMode === 'virtual'
                              ? 'bg-[#00231b] text-white border-[#00231b] shadow-sm'
                              : 'bg-[#FBF9F5] border-[#E5DFD5] text-[#181d1b]'
                          }`}
                        >
                          <Clock className={`w-6 h-6 ${attendanceMode === 'virtual' ? 'text-[#FEF3C7]' : 'text-[#316858]'}`} />
                          <div>
                            <span className="text-sm font-bold block">Virtual Stream</span>
                            <span className={`text-[11px] block mt-0.5 ${attendanceMode === 'virtual' ? 'text-[#eaefeb]' : 'text-[#52605B]'}`}>
                              Interactive live broadcast & virtual networking hub
                            </span>
                          </div>
                        </label>
                      </div>
                    </div>
                  </section>

                  {/* SECTION C: LOGISTICS & ADDITIONAL DETAILS */}
                  <section
                    className="bg-white rounded-2xl p-6 sm:p-8 shadow-[0_2px_12px_rgba(0,0,0,0.03)] space-y-6 border border-[#E5DFD5]"
                    id="reg-section-logistics"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-2 gap-2 border-b border-[#E5DFD5]">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="w-6 h-6 rounded-full bg-[#00231b] text-white flex items-center justify-center text-xs font-bold">
                            C
                          </span>
                          <h2 className="text-xl font-bold text-[#00231b]">Logistics & Additional Details</h2>
                        </div>
                        <p className="text-xs text-[#52605B]">Referral channel, delegate accommodations, and syndicate updates.</p>
                      </div>
                      <span className="text-[#52605B] text-[11px] font-semibold uppercase tracking-wider">
                        Final Step
                      </span>
                    </div>

                    {/* How did you hear */}
                    <div className="flex flex-col space-y-1">
                      <label className="text-sm font-bold text-[#181d1b]" htmlFor="discovery_source">
                        How did you hear about Óghowa Business Week? <span className="text-[#B45309] font-bold">*</span>
                      </label>
                      <select
                        id="discovery_source"
                        value={discoverySource}
                        onChange={(e) => setDiscoverySource(e.target.value)}
                        className="w-full bg-white p-2.5 rounded-lg border border-[#C8BFB0] text-sm text-[#181d1b] focus:ring-2 focus:ring-[#B45309]"
                        required
                      >
                        <option value="social_media">Social Media (Twitter/X, LinkedIn, Instagram)</option>
                        <option value="benin_tech_fest">Benin Tech Fest Channels</option>
                        <option value="edo_innovation_hub">Edo State Innovation Hub</option>
                        <option value="referral">Colleague or Friend Referral</option>
                        <option value="press_media">Press / Television / Print Media</option>
                        <option value="other">Other</option>
                      </select>
                    </div>

                    {/* Dietary / Accessibility */}
                    <div className="flex flex-col space-y-1">
                      <label className="text-sm font-bold text-[#181d1b]" htmlFor="accessibility">
                        Dietary or Accessibility Requirements <span className="text-xs font-normal text-[#52605B]">(Optional)</span>
                      </label>
                      <textarea
                        id="accessibility"
                        rows={3}
                        value={accessibility}
                        onChange={(e) => setAccessibility(e.target.value)}
                        placeholder="Please let us know if you require special accessibility accommodations or dietary provisions during physical sessions."
                        className="w-full bg-white p-3 rounded-lg border border-[#C8BFB0] text-sm text-[#181d1b] focus:ring-2 focus:ring-[#B45309]"
                      />
                      <span className="text-[11px] text-[#52605B]">
                        E.g., wheelchair assistance, ramp access, Halal, vegetarian, or allergy notices.
                      </span>
                    </div>

                    {/* Deal Room Updates */}
                    <div className="bg-[#F4EFE6]/70 p-4 rounded-xl border border-[#E5DFD5]">
                      <label className="flex items-start gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={pitchUpdates}
                          onChange={(e) => setPitchUpdates(e.target.checked)}
                          className="mt-1 h-4 w-4 rounded accent-[#00231b] text-[#00231b]"
                        />
                        <div className="space-y-0.5">
                          <span className="text-sm font-bold text-[#00231b] block">
                            Startup Pitch Applications & Investor Deal Rooms
                          </span>
                          <span className="text-xs text-[#52605B] block leading-relaxed">
                            Do you want to receive timely notifications and priority invites to pitch your company or access the closed-door Deal Syndicate room?
                          </span>
                        </div>
                      </label>
                    </div>

                    {/* Data Security & Confidentiality */}
                    <div className="flex items-start gap-2.5 p-3.5 bg-[#FBF9F5] rounded-xl text-xs text-[#52605B] border border-[#E5DFD5]">
                      <ShieldCheck className="w-5 h-5 text-[#316858] shrink-0 mt-0.5" />
                      <span>
                        <strong>Data Security & Confidentiality:</strong> Your details will be used exclusively for Óghowa Business Week delegate communication in direct institutional collaboration with Benin Tech Fest. No third-party marketing spam.
                      </span>
                    </div>
                  </section>

                  {/* LIVE REGISTRATION SUMMARY CARD (ACCORDION TOGGLE) */}
                  <div className="bg-white rounded-2xl shadow-xs border border-[#E5DFD5] overflow-hidden">
                    <button
                      type="button"
                      onClick={() => setIsSummaryOpen(!isSummaryOpen)}
                      className="w-full p-4 flex items-center justify-between text-left hover:bg-[#F4EFE6]/50 transition-colors cursor-pointer"
                    >
                      <div className="flex items-center gap-2.5">
                        <FileText className="w-4 h-4 text-[#00231b]" />
                        <span className="text-sm font-bold text-[#00231b]">Review Your Inputs Before Submission</span>
                        <span className="text-xs text-[#52605B] hidden sm:inline">(Click to toggle live summary)</span>
                      </div>
                      <ChevronDown className={`w-4 h-4 text-[#00231b] transition-transform duration-200 ${isSummaryOpen ? 'rotate-180' : ''}`} />
                    </button>

                    {isSummaryOpen && (
                      <div className="px-5 pb-5 bg-[#F4EFE6]/30 border-t border-[#E5DFD5] pt-3">
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs">
                          <div className="bg-white p-3 rounded-lg border border-[#E5DFD5]">
                            <span className="text-[10px] font-bold text-[#52605B] uppercase block">Participant</span>
                            <p className="text-sm font-bold text-[#181d1b] truncate mt-0.5">{fullName || '— Not filled —'}</p>
                            <p className="text-[#52605B] truncate">{primaryEmail || '—'}</p>
                          </div>
                          <div className="bg-white p-3 rounded-lg border border-[#E5DFD5]">
                            <span className="text-[10px] font-bold text-[#52605B] uppercase block">Organization & Title</span>
                            <p className="text-sm font-bold text-[#181d1b] truncate mt-0.5">{organisation || '— Not filled —'}</p>
                            <p className="text-[#52605B] truncate">{jobRole || '—'}</p>
                          </div>
                          <div className="bg-white p-3 rounded-lg border border-[#E5DFD5]">
                            <span className="text-[10px] font-bold text-[#52605B] uppercase block">Format & Origin</span>
                            <p className="text-sm font-bold text-[#316858] mt-0.5">
                              {attendanceMode === 'virtual' ? 'Virtual Stream Pass' : 'In-Person Delegate (Benin City)'}
                            </p>
                            <p className="text-[#52605B] truncate">{location || '—'}</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* ACTION BUTTONS */}
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-1 pb-6">
                    <button
                      type="button"
                      onClick={handleSaveDraft}
                      className="w-full sm:w-auto px-5 py-3 rounded-xl bg-white hover:bg-[#F4EFE6] text-[#00231b] border border-[#C8BFB0] text-sm font-bold shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Bookmark className="w-4 h-4" />
                      <span>{draftSaved ? '✓ Draft Saved Locally' : 'Save Draft'}</span>
                    </button>

                    <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
                      <span className="text-xs text-[#52605B] text-center sm:text-right">
                        Instant accreditation via email
                      </span>
                      <button
                        type="submit"
                        className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-[#00231b] hover:bg-[#0e3a2f] text-white text-sm font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 group cursor-pointer"
                      >
                        <span>Complete Registration</span>
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            )}

            {/* TAB 2: SCHEDULE & THEMATIC TRACKS */}
            {activeTab === 'schedule-tracks' && (
              <div className="space-y-6">
                <div className="bg-white p-6 sm:p-8 rounded-2xl border border-[#E5DFD5] shadow-xs">
                  <h2 className="text-2xl font-bold text-[#00231b] mb-2">Summit Tracks & Agenda Details</h2>
                  <p className="text-sm text-[#52605B] mb-6">
                    Each track is curated with leading venture founders, institutional partners, and keynote debates across Benin City.
                  </p>

                  <div className="space-y-4">
                    {[
                      {
                        title: 'Track 1: Digital Economy & Software Ecosystem',
                        time: 'Day 1 & 2 • Main Auditorium',
                        desc: 'Fintech rails, API integration across borders, talent pipelines from UNIBEN and Edo Innovates, AI tools for African commerce.'
                      },
                      {
                        title: 'Track 2: Agritech & Mechanized Cold-Chain',
                        time: 'Day 2 • Hall B',
                        desc: 'High-yield agro processing, rural logistics, commodities export verification, and digital payment integration.'
                      },
                      {
                        title: 'Track 3: The ₦50M Deal Room & Investor Pitch Room',
                        time: 'Day 3 • Closed Syndicate Suite',
                        desc: 'Ten shortlisted venture finalists pitch live before regional angel syndicates and venture capital partners.'
                      },
                      {
                        title: 'Track 4: Creative Arts, Film & Digital Heritage',
                        time: 'Day 4 • Victor Uwaifo Amphitheatre',
                        desc: 'Celebrating Benin historic bronze casting, digital 3D archives, animation studios, and commercial music synchronization.'
                      }
                    ].map((item, idx) => (
                      <div key={idx} className="p-4 rounded-xl bg-[#FBF9F5] border border-[#E5DFD5] space-y-1.5">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                          <h3 className="font-bold text-sm sm:text-base text-[#00231b]">{item.title}</h3>
                          <span className="text-[11px] font-semibold text-[#B45309] bg-[#FEF3C7] px-2 py-0.5 rounded w-fit">
                            {item.time}
                          </span>
                        </div>
                        <p className="text-xs sm:text-sm text-[#52605B] leading-relaxed">{item.desc}</p>
                      </div>
                    ))}
                  </div>

                  <div className="mt-8 pt-6 border-t border-[#E5DFD5] flex items-center justify-between">
                    <button
                      onClick={onBackToBusinessWeek}
                      className="text-xs font-semibold text-blue-700 hover:underline"
                    >
                      ← View Full 5-Day Agenda on Summit Page
                    </button>
                    <button
                      onClick={() => setActiveTab('registration')}
                      className="px-5 py-2.5 rounded-lg bg-[#00231b] text-white text-xs font-bold hover:bg-[#0e3a2f]"
                    >
                      Enroll in Tracks →
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: VERIFY REGISTRATION STATUS */}
            {activeTab === 'status-lookup' && (
              <div className="space-y-6">
                <div className="bg-white p-6 sm:p-8 rounded-2xl border border-[#E5DFD5] shadow-xs">
                  <div className="max-w-md mx-auto text-center space-y-3 mb-6">
                    <div className="w-12 h-12 rounded-full bg-[#FEF3C7] text-[#B45309] flex items-center justify-center mx-auto">
                      <Search className="w-6 h-6" />
                    </div>
                    <h2 className="text-xl font-bold text-[#00231b]">Verify Accreditation Pass</h2>
                    <p className="text-xs text-[#52605B]">
                      Enter your delegate reference code or primary email address to look up your clearance badge and session allocations.
                    </p>
                  </div>

                  <form onSubmit={handleStatusSearch} className="max-w-md mx-auto space-y-4">
                    <div className="relative">
                      <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#52605B] w-4 h-4" />
                      <input
                        type="text"
                        value={lookupQuery}
                        onChange={(e) => setLookupQuery(e.target.value)}
                        placeholder="e.g. OGH-2026-8842 or delegate@email.com"
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#C8BFB0] text-sm text-[#181d1b] focus:ring-2 focus:ring-[#B45309]"
                        required
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full py-2.5 rounded-xl bg-[#00231b] hover:bg-[#0e3a2f] text-white text-sm font-bold transition cursor-pointer"
                    >
                      Search Delegate Registry
                    </button>
                  </form>

                  {lookupSearched && lookupResult && (
                    <div className="mt-6 max-w-md mx-auto p-4 rounded-xl bg-[#F4EFE6] border border-[#E5DFD5] space-y-3 animate-in fade-in">
                      <div className="flex items-center gap-2 text-emerald-700 text-xs font-bold">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Accreditation Active & Confirmed</span>
                      </div>
                      <div className="space-y-1 text-xs">
                        <p className="text-[#181d1b] font-bold text-sm">{lookupResult.name}</p>
                        <p className="text-[#52605B]">Reference: <strong className="font-mono text-[#00231b]">{lookupResult.code}</strong></p>
                        <p className="text-[#52605B]">Access Format: {lookupResult.mode}</p>
                        <p className="text-[#52605B]">Organisation: {lookupResult.org}</p>
                      </div>
                      <div className="pt-2 border-t border-[#E5DFD5] text-[11px] text-[#52605B]">
                        Present your reference code or digital badge at the Victor Uwaifo Hub entrance.
                      </div>
                    </div>
                  )}

                  {lookupSearched && !lookupResult && (
                    <div className="mt-6 max-w-md mx-auto p-4 rounded-xl bg-rose-50 border border-rose-200 text-center space-y-2 animate-in fade-in">
                      <p className="text-xs font-bold text-rose-800">No Delegate Record Found</p>
                      <p className="text-[11px] text-rose-700">
                        Please check the code or email entered, or complete a new registration.
                      </p>
                      <button
                        onClick={() => setActiveTab('registration')}
                        className="text-xs font-bold text-[#00231b] underline"
                      >
                        Proceed to Register Now
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* CONFIRMATION MODAL OVERLAY */}
      {isSuccessModalOpen && confirmedPass && (
        <div className="fixed inset-0 z-50 bg-[#00231b]/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 sm:p-8 shadow-2xl space-y-4 relative overflow-hidden animate-in fade-in zoom-in-95">
            <div className="w-full h-2.5 bg-gradient-to-r from-[#B45309] via-[#00231b] to-[#316858] absolute top-0 left-0" />
            <div className="w-14 h-14 rounded-full bg-[#b5efda] text-[#002018] flex items-center justify-center mb-1">
              <CheckCircle2 className="w-8 h-8 text-[#00231b]" />
            </div>

            <div className="space-y-1">
              <span className="text-[11px] font-bold text-[#B45309] uppercase tracking-wider">
                Submission Confirmed
              </span>
              <h3 className="text-2xl font-bold text-[#00231b]">Registration Received</h3>
              <p className="text-xs sm:text-sm text-[#52605B]">
                Thank you for enrolling for <strong className="text-[#181d1b]">Óghowa Business Week 2026</strong> in collaboration with <strong className="text-[#181d1b]">Benin Tech Fest</strong>.
              </p>
            </div>

            <div className="bg-[#F4EFE6]/80 p-4 rounded-xl space-y-2 text-xs">
              <div className="flex justify-between items-center pb-2 border-b border-[#E5DFD5]">
                <span className="text-[#52605B]">Delegate Reference:</span>
                <span className="font-mono font-bold text-[#00231b] text-sm">{confirmedPass.code}</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-[#E5DFD5]">
                <span className="text-[#52605B]">Enrolled Attendee:</span>
                <span className="font-semibold text-[#181d1b]">{confirmedPass.name}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#52605B]">Access Format:</span>
                <span className="font-semibold text-[#316858]">{confirmedPass.mode}</span>
              </div>
            </div>

            <p className="text-xs text-[#52605B]">
              A confirmation dispatch with keynote schedule packets and venue clearance badge has been forwarded to your registered email ({confirmedPass.email}).
            </p>

            <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
              <button
                type="button"
                onClick={() => {
                  setIsSuccessModalOpen(false);
                  onBackToBusinessWeek();
                }}
                className="w-full py-3 rounded-xl bg-[#00231b] hover:bg-[#0e3a2f] text-white text-sm font-bold transition cursor-pointer"
              >
                Return to Business Week Summit
              </button>
              <button
                type="button"
                onClick={() => setIsSuccessModalOpen(false)}
                className="w-full py-3 rounded-xl bg-white hover:bg-[#F4EFE6] text-[#00231b] border border-[#C8BFB0] text-sm font-semibold transition cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. DEDICATED BUSINESS WEEK FOOTER */}
      <footer className="w-full bg-[#F4EFE6] py-8 border-t border-[#E5DFD5] mt-auto">
        <div className="max-w-[1120px] mx-auto px-4 md:px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex flex-col items-center md:items-start">
              <div className="flex items-center gap-2">
                <BusinessWeekLogo size="sm" />
                <span className="text-base text-[#00231b] font-bold">Óghowa Business Week</span>
              </div>
              <span className="text-xs text-[#52605B] mt-0.5">Innovation for Economic Transformation</span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-[#316858]">
                In institutional collaboration with Benin Tech Fest & Edo State Innovation Network
              </span>
            </div>

            <div className="flex items-center gap-4 text-xs text-[#52605B]">
              <button onClick={onBackToBusinessWeek} className="hover:text-[#00231b] transition-colors cursor-pointer">
                Summit Main Page
              </button>
              <span>•</span>
              <button onClick={onBackToAccelerator} className="hover:text-[#00231b] transition-colors cursor-pointer">
                Óghowa Accelerator
              </button>
              <span>•</span>
              <span>© 2026 Óghowa Business Week</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
