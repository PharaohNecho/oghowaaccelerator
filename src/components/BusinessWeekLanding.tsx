import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Calendar,
  Clock,
  MapPin,
  Sparkles,
  Ticket,
  Users,
  Building,
  Rocket,
  ShieldCheck,
  CheckCircle2,
  ExternalLink,
  ChevronRight,
  Layers,
  Award,
  BookOpen,
  Briefcase,
  HelpCircle,
  FileText,
  Target,
  Compass,
  TrendingUp,
  Cpu,
  GraduationCap
} from 'lucide-react';
import { BusinessWeekLogo } from './BusinessWeekLogo';
import { BusinessWeekConfig } from '../types';

interface BusinessWeekLandingProps {
  onBackToAccelerator: () => void;
  onOpenRegistration: () => void;
  onOpenApply: () => void;
  config?: BusinessWeekConfig;
}

// Target Date: November 16, 2026 at 09:00:00 WAT (UTC+1)
const SUMMIT_START_TIME = new Date('2026-11-16T09:00:00+01:00').getTime();
const TOTAL_PHYSICAL_SEATS = 500;

export const BusinessWeekLanding: React.FC<BusinessWeekLandingProps> = ({
  onBackToAccelerator,
  onOpenRegistration,
  onOpenApply,
  config
}) => {
  // Live accurate countdown to November 16, 2026 09:00:00 WAT
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  const [activeDayTab, setActiveDayTab] = useState<number>(1);

  useEffect(() => {
    const updateCountdown = () => {
      const now = Date.now();
      const difference = SUMMIT_START_TIME - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000)
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    updateCountdown();
    const timer = setInterval(updateCountdown, 1000);
    return () => clearInterval(timer);
  }, []);

  // Live Vacant Seats calculation
  const totalRegistered = 342 + (config?.delegates?.length || 0);
  const vacantSeats = Math.max(0, TOTAL_PHYSICAL_SEATS - totalRegistered);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const yOffset = -90;
      const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  // Exact 4-Day Timetable from the official PDF program
  const scheduleDays = [
    {
      day: 1,
      title: 'Day 1: The Macro-Economy, Commerce & Policy Forum',
      date: 'Monday, 16 November 2026',
      theme: '"Setting the Framework for Sub-National Growth"',
      summary: "This day brings out high-level policy enablers, regulatory heads, and major financial institutions to set the state's economic and trade agenda.",
      events: [
        {
          time: '09:00 AM – 10:15 AM',
          title: 'Grand Opening Ceremony',
          description: 'Welcome Address by the Organizers (Metaspace / Óghowa Team). Executive Keynote by the Edo State Government (The Executive Office / ESIPO) on the sub-national roadmap for economic stability.',
          speaker: 'Metaspace / Óghowa Team & Edo State Government (ESIPO)'
        },
        {
          time: '10:30 AM – 12:00 PM',
          title: 'Part 1: The High-Level Trade & Commerce Panel',
          description: 'The Ministry of Trade, Industry and Commerce alongside Commercial Bank Directors address regulatory updates, automating trade registries, ease of doing business, and credit lines for formalized regional MSMEs.',
          speaker: 'Ministry of Trade, Industry and Commerce & Commercial Bank Directors'
        },
        {
          time: '12:15 PM – 01:45 PM',
          title: 'Part 2: The Bank of Industry & Development Finance Masterclass',
          description: 'The Bank of Industry (BOI) details its operational intervention programs (including tech/creative initiatives like the iDICE fund framework), clarifying the exact compliance and governance checklist required for local ventures to access long-term capital.',
          speaker: 'Bank of Industry (BOI) Leadership'
        },
        {
          time: '01:45 PM – 03:00 PM',
          title: 'Networking Lunch',
          description: 'Curated networking between institutional executives, bank directors, policymakers, and regional business leaders.',
          speaker: 'Delegates & Partners'
        }
      ]
    },
    {
      day: 2,
      title: 'Day 2: Digital Infrastructure, Tech Policy & The Founder’s Blueprint',
      date: 'Tuesday, 17 November 2026',
      theme: '"Governing the Stack, Deploying Local Clouds & Real-Sector Integration"',
      summary: "A morning forum with technical government arms on data security and local networks, followed by an afternoon track on operational mechanics and real-world brick-and-mortar integration.",
      events: [
        {
          time: '08:30 AM – 10:00 AM',
          title: 'Part 1: The Tech Stack & Local Sovereignty Panel',
          description: 'The Information and Communication Technology Agency (ICTA) outlines modern sub-national cloud deployments (like the Edo Cloud homegrown e-governance infrastructure), public infrastructure access, and local software procurement rules.',
          speaker: 'ICTA & Infrastructure Leads'
        },
        {
          time: '10:15 AM – 11:45 AM',
          title: 'Part 2: Digital Economy Policy & Ecosystem Grants',
          description: 'The Ministry of Digital Economy, Science and Technology (MDEST) unpacks the state’s overarching data management policies, digital security frameworks, and multi-sector intervention programs (such as the Bill & Melinda Gates Foundation-backed Strengthening Edo State’s Digital Solutions Ecosystem initiative).',
          speaker: 'MDEST & Foundation Representatives'
        },
        {
          time: '11:45 AM – 12:45 PM',
          title: 'Open Networking Floor',
          description: 'Interactive exhibition showcase, founder-to-developer matchmaking, and technical networking.',
          speaker: 'Ecosystem Participants'
        },
        {
          time: '12:45 PM – 02:45 PM',
          title: 'Masterclass: Product-Market Fit (PMF) & System Architecture',
          description: 'Engineering scalable multi-tenant architectures, digital service workflows, and localized user onboarding strategies designed specifically for West African tech ecosystems (EdTech, Logistics, Fintech).',
          speaker: 'Senior Tech Leads & Venture Architects'
        },
        {
          time: '03:00 PM – 04:45 PM',
          title: 'Clinic: Corporate Governance & Legal Compliance',
          description: 'Structuring IP assignment, drafting ironclad NDAs, implementing clean financial tracking systems, and setting up founding teams to survive investor due diligence.',
          speaker: 'Corporate Attorneys & Venture Counsel'
        },
        {
          time: '05:00 PM – 07:00 PM',
          title: 'Panel Focus: Tech in the Trenches — AgriTech, Logistics & Commodity Trade',
          description: 'Bridging code with distribution: Local agro-processors, oil palm ecosystem players, and transport networks debate with tech founders on how to digitize supply chains, leverage data frameworks, and onboard local traders into automated market systems.',
          speaker: 'Agro-processors, Logistics Operators & Tech Founders'
        }
      ]
    },
    {
      day: 3,
      title: 'Day 3: Venture Capital & Private Equity Day',
      date: 'Thursday, 19 November 2026',
      theme: '"Unlocking Private Runway and Global Networks"',
      summary: 'Shifting the focus from public institutional funding to private markets, angel networks, and venture capital syndicates.',
      events: [
        {
          time: '10:00 AM – 11:30 AM',
          title: 'Investor Panel: What Venture Capital Looks For',
          description: 'Venture capitalists, angel syndicates, and seed-stage fund managers discuss metric expectations, evaluating tech talent, risk mitigation, and how they view sub-national markets.',
          speaker: 'VC Partners & Angel Syndicate Leads'
        },
        {
          time: '11:45 AM – 01:15 PM',
          title: 'Workshop: Deconstructing the Term Sheet',
          description: 'A practical workshop teaching tech founders how to navigate valuation, cap-table dilution, investor clauses, and board seats without losing corporate control.',
          speaker: 'Venture Legal & Financial Specialists'
        },
        {
          time: '02:30 PM – 04:00 PM',
          title: 'Closed Reverse Pitching Session',
          description: 'Visiting fund managers and ecosystem builders present their investment focus, sectors of interest, and ticket sizes directly to the general hub audience.',
          speaker: 'Fund Managers & Ecosystem Builders'
        }
      ]
    },
    {
      day: 4,
      title: 'Day 4: Grand Finale & Demo Day',
      date: 'Saturday, 21 November 2026',
      theme: '"Showcasing Ecosystem Transformation"',
      summary: 'The high-stakes culmination of the business week, celebrating tech landmarks and pitching verified local models to the market.',
      events: [
        {
          time: '10:00 AM – 11:30 AM',
          title: 'Ecosystem Keynote: The 2030+ Operational Outlook',
          description: 'A closing presentation mapping regional expansion goals, scalability milestones, student mobility frameworks, and the compounding growth of technology clusters in Edo.',
          speaker: 'Keynote Visionary & Ecosystem Leaders'
        },
        {
          time: '11:45 AM – 02:00 PM',
          title: 'The Main Event: The Óghowa Demo Day',
          description: 'Pre-vetted, high-traction startup cohorts pitch their working software models and business pipelines live on stage to our assembled panel of banks, institutional VCs, and angel networks.',
          speaker: 'Cohort Finalists & Investor Jury'
        },
        {
          time: '02:00 PM – 03:30 PM',
          title: 'Closing Ceremony & Ecosystem Awards',
          description: 'Presentation of startup grant acknowledgments, hackathon/innovation awards, and recognition of corporate, ministerial, and banking partners.',
          speaker: 'Óghowa Leadership & State Dignitaries'
        }
      ]
    }
  ];

  const summitDates = config?.dates || 'November 16 – 21, 2026';
  const summitVenue = config?.venueName || 'Victor Uwaifo Creative Hub & Edo Innovates Campus';
  const isRegOpen = config?.isRegistrationOpen !== false;

  return (
    <div className="bg-[#FBF9F5] text-[#181d1b] min-h-screen flex flex-col font-sans selection:bg-[#00231b] selection:text-white">
      {/* 1. SUMMIT NAVIGATION HEADER (Logo ONLY on left, clean navigation, Oghowa Homepage button) */}
      <header className="fixed top-0 w-full z-50 bg-white/95 backdrop-blur-md shadow-[0_1px_8px_rgba(0,0,0,0.04)] border-b border-[#E5DFD5]">
        <div className="h-20 max-w-[1240px] mx-auto px-4 md:px-6 flex items-center justify-between">
          {/* Logo ONLY - removed title and badge text as requested */}
          <div className="flex items-center">
            <button
              onClick={() => scrollToSection('bw-overview')}
              className="focus:outline-hidden hover:opacity-90 transition-opacity cursor-pointer"
              title="Óghowa Business Week"
            >
              <BusinessWeekLogo size="sm" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-6 text-xs sm:text-sm font-semibold text-[#414845]">
            <button onClick={() => scrollToSection('bw-overview')} className="hover:text-[#00231b] transition-colors cursor-pointer">
              Overview
            </button>
            <button onClick={() => scrollToSection('bw-problem-vision')} className="hover:text-[#00231b] transition-colors cursor-pointer">
              Vision & Pillars
            </button>
            <button onClick={() => scrollToSection('bw-goals')} className="hover:text-[#00231b] transition-colors cursor-pointer">
              Outcomes
            </button>
            <button onClick={() => scrollToSection('bw-agenda')} className="hover:text-[#00231b] transition-colors cursor-pointer">
              4-Day Program
            </button>
            <button onClick={() => scrollToSection('bw-venue')} className="hover:text-[#00231b] transition-colors cursor-pointer">
              Venue
            </button>
            <button onClick={() => scrollToSection('bw-faq')} className="hover:text-[#00231b] transition-colors cursor-pointer">
              FAQs
            </button>
          </nav>

          {/* Action Buttons: Register for Business Week & Oghowa Homepage button */}
          <div className="flex items-center gap-3">
            <button
              onClick={onOpenRegistration}
              className="px-4 sm:px-5 py-2.5 rounded-xl bg-[#00231b] hover:bg-[#0e3a2f] text-white font-bold text-xs sm:text-sm shadow-md hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer group"
            >
              <span>Register Now</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={onBackToAccelerator}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white hover:bg-[#F4EFE6] text-[#52605B] hover:text-[#00231b] border border-[#E5DFD5] text-xs font-semibold transition-colors cursor-pointer"
              title="Return to Óghowa Accelerator Homepage"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Oghowa Homepage</span>
            </button>
          </div>
        </div>
      </header>

      {/* 2. GRAND SUMMIT HERO SECTION */}
      <section id="bw-overview" className="pt-28 pb-16 sm:pb-24 bg-[#FBF9F5] relative overflow-hidden border-b border-[#E5DFD5]">
        {/* Decorative background grid and Benin bronze circular lattice */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 opacity-10 pointer-events-none select-none">
          <svg fill="#00231b" height="420" viewBox="0 0 100 100" width="420">
            <circle cx="50" cy="50" fill="none" r="45" stroke="#00231b" strokeWidth="1.5" />
            <circle cx="50" cy="50" fill="none" r="30" stroke="#00231b" strokeWidth="1" />
            <path d="M 50 5 Q 75 35 70 70 Q 55 95 30 80 Q 20 45 50 5" fill="none" stroke="#00231b" strokeWidth="2" />
            <path d="M 50 5 Q 60 40 85 55 Q 65 90 40 85" fill="none" stroke="#00231b" strokeWidth="1.5" />
          </svg>
        </div>

        <div className="max-w-[1240px] mx-auto px-4 md:px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left Column: Headline, Tags, CTAs */}
            <div className="lg:col-span-7 space-y-6 text-left">
              {/* Event Badge Ribbon with Óghowa Business Week 2026 */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FEF3C7] text-[#B45309] text-xs font-bold uppercase tracking-wider border border-[#B45309]/20">
                  <span className="w-2 h-2 rounded-full bg-[#B45309] animate-ping" />
                  Óghowa Business Week 2026
                </span>
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#00231b]/10 text-[#00231b] text-xs font-bold">
                  <MapPin className="w-3.5 h-3.5 text-[#316858]" />
                  Benin City, Edo State
                </span>
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-rose-50 text-rose-700 border border-rose-200 text-xs font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-600 animate-pulse" />
                  {vacantSeats} vacant physical seats remaining
                </span>
              </div>

              {/* Main Headline */}
              <div className="space-y-1">
                <span className="text-xs sm:text-sm font-bold uppercase tracking-widest text-[#B45309] block">
                  ...Our own
                </span>
                <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-[#00231b] tracking-tight leading-[1.12]">
                  Óghowa Business Week <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00231b] via-[#316858] to-[#B45309]">
                    Innovation for Economic Transformation
                  </span>
                </h1>
              </div>

              {/* Subhead matching user's exact brief */}
              <p className="text-base sm:text-lg text-[#52605B] leading-relaxed max-w-2xl font-normal">
                Register to take part in Óghowa Business Week, in collaboration with Benin Tech Fest. Join founders, investors, business leaders and innovators for keynotes, masterclasses, startup pitches and networking in Edo State.
              </p>

              {/* Date & Collaboration Tag */}
              <div className="p-4 rounded-xl bg-white border border-[#E5DFD5] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2.5 text-[#181d1b]">
                  <Calendar className="w-4 h-4 text-[#B45309]" />
                  <span className="font-bold">{summitDates}</span>
                  <span className="text-[#52605B] hidden sm:inline">•</span>
                  <span className="text-[#52605B]">{summitVenue}</span>
                </div>
                <span className="text-[#316858] font-bold">In Collaboration with Benin Tech Fest</span>
              </div>

              {/* Registration Gateway Alert if paused */}
              {!isRegOpen && (
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>Public registration is currently in closed review by the Summit Secretariat. Registered passes remain valid.</span>
                </div>
              )}

              {/* CTAs */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <button
                  onClick={onOpenRegistration}
                  className="px-7 py-4 rounded-xl bg-[#00231b] hover:bg-[#0e3a2f] text-white font-bold text-sm sm:text-base shadow-lg hover:shadow-xl active:scale-98 transition-all flex items-center gap-2.5 cursor-pointer group"
                >
                  <Ticket className="w-5 h-5 text-[#FEF3C7]" />
                  <span>{isRegOpen ? 'Register for Business Week' : 'View Accreditation Status'}</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>

                <button
                  onClick={() => scrollToSection('bw-agenda')}
                  className="px-6 py-4 rounded-xl bg-white hover:bg-[#F4EFE6] text-[#00231b] border border-[#C8BFB0] font-bold text-sm sm:text-base transition-colors flex items-center gap-2 cursor-pointer shadow-xs"
                >
                  <span>Explore 4-Day Agenda</span>
                </button>
              </div>

              {/* Summit Trust badges */}
              <div className="pt-2 flex items-center gap-4 text-xs text-[#52605B]">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-700" />
                  <span>Verified Delegate Passports</span>
                </span>
                <span>•</span>
                <span className="flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-[#B45309]" />
                  <span>Demo Day & Syndicate Pitch Rooms</span>
                </span>
              </div>
            </div>

            {/* Right Column: Real-Time Accurate Ticking Countdown & Vacant Seats Counter Card */}
            <div className="lg:col-span-5 space-y-6">
              <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-[0_4px_24px_rgba(0,35,27,0.08)] border border-[#E5DFD5]">
                <div className="flex items-center justify-between pb-4 border-b border-[#E5DFD5] mb-5">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-[#B45309]" />
                    <span className="text-xs font-bold uppercase tracking-wider text-[#00231b]">
                      Summit Commences In
                    </span>
                  </div>
                  <span className="text-[11px] font-semibold text-[#B45309] bg-[#FEF3C7] px-2.5 py-0.5 rounded-full">
                    Live Countdown
                  </span>
                </div>

                <div className="grid grid-cols-4 gap-2 sm:gap-3 text-center mb-6">
                  <div className="bg-[#FBF9F5] p-3 rounded-xl border border-[#E5DFD5]">
                    <span className="block text-2xl sm:text-3xl font-extrabold text-[#00231b] font-mono">
                      {String(timeLeft.days).padStart(2, '0')}
                    </span>
                    <span className="text-[10px] uppercase font-bold text-[#52605B] tracking-wider">Days</span>
                  </div>

                  <div className="bg-[#FBF9F5] p-3 rounded-xl border border-[#E5DFD5]">
                    <span className="block text-2xl sm:text-3xl font-extrabold text-[#00231b] font-mono">
                      {String(timeLeft.hours).padStart(2, '0')}
                    </span>
                    <span className="text-[10px] uppercase font-bold text-[#52605B] tracking-wider">Hours</span>
                  </div>

                  <div className="bg-[#FBF9F5] p-3 rounded-xl border border-[#E5DFD5]">
                    <span className="block text-2xl sm:text-3xl font-extrabold text-[#00231b] font-mono">
                      {String(timeLeft.minutes).padStart(2, '0')}
                    </span>
                    <span className="text-[10px] uppercase font-bold text-[#52605B] tracking-wider">Mins</span>
                  </div>

                  <div className="bg-[#FBF9F5] p-3 rounded-xl border border-[#E5DFD5]">
                    <span className="block text-2xl sm:text-3xl font-extrabold text-[#B45309] font-mono">
                      {String(timeLeft.seconds).padStart(2, '0')}
                    </span>
                    <span className="text-[10px] uppercase font-bold text-[#52605B] tracking-wider">Secs</span>
                  </div>
                </div>

                {/* Live Vacant Seats Progress Bar */}
                <div className="p-3.5 rounded-xl bg-[#FBF9F5] border border-[#E5DFD5] mb-5 space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="text-[#00231b] flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                      Physical Seats Status
                    </span>
                    <span className="text-rose-700 font-extrabold">
                      {vacantSeats} vacant of {TOTAL_PHYSICAL_SEATS}
                    </span>
                  </div>
                  <div className="w-full bg-[#E5DFD5] h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-[#00231b] to-rose-600 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${Math.min(100, (totalRegistered / TOTAL_PHYSICAL_SEATS) * 100)}%` }}
                    />
                  </div>
                  <p className="text-[11px] text-[#52605B] flex justify-between">
                    <span>{totalRegistered} registered</span>
                    <span className="text-rose-600 font-semibold">{vacantSeats} seats remaining</span>
                  </p>
                </div>

                {/* Direct Register Action */}
                <button
                  onClick={onOpenRegistration}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#00231b] to-[#0e3a2f] hover:from-[#0e3a2f] hover:to-[#00231b] text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Ticket className="w-4 h-4 text-[#FEF3C7]" />
                  <span>Secure Your Participant Registration Pass</span>
                </button>
                <p className="text-[11px] text-center text-[#52605B] mt-2.5">
                  Accreditation badges are strictly limited per hall capacity.
                </p>
              </div>

              {/* Key Highlights */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-white p-4 rounded-xl border border-[#E5DFD5] shadow-xs">
                  <p className="text-2xl font-extrabold text-[#00231b]">4 Days</p>
                  <p className="text-xs text-[#52605B] mt-0.5 font-medium">Focused Program</p>
                </div>
                <div className="bg-white p-4 rounded-xl border border-[#E5DFD5] shadow-xs">
                  <p className="text-2xl font-extrabold text-[#B45309]">8–10</p>
                  <p className="text-xs text-[#52605B] mt-0.5 font-medium">Demo Day Cohorts</p>
                </div>
                <div className="bg-white p-4 rounded-xl border border-[#E5DFD5] shadow-xs">
                  <p className="text-2xl font-extrabold text-[#00231b]">3 Tier-1</p>
                  <p className="text-xs text-[#52605B] mt-0.5 font-medium">Institutional Banks</p>
                </div>
                <div className="bg-white p-4 rounded-xl border border-[#E5DFD5] shadow-xs">
                  <p className="text-2xl font-extrabold text-[#316858]">50+</p>
                  <p className="text-xs text-[#52605B] mt-0.5 font-medium">Talent Placements</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. COLLABORATION MARQUEE */}
      <section className="bg-[#00231b] text-white py-3.5 border-y border-[#316858]/40">
        <div className="max-w-[1240px] mx-auto px-4 flex flex-wrap items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-3">
            <span className="w-2 h-2 rounded-full bg-[#FEF3C7] animate-pulse" />
            <span className="font-bold tracking-wide uppercase text-[#b5efda]">
              Institutional Collaboration:
            </span>
            <span className="text-slate-200">
              Óghowa Business Week × Benin Tech Fest
            </span>
          </div>

          <div className="flex items-center gap-4 text-slate-300">
            <span>Victor Uwaifo Creative Hub</span>
            <span>•</span>
            <span>Edo Innovates Campus</span>
            <span>•</span>
            <button
              onClick={onOpenRegistration}
              className="text-[#FEF3C7] font-bold hover:underline cursor-pointer"
            >
              Participant Registration →
            </button>
          </div>
        </div>
      </section>

      {/* 4. OFFICIAL PROBLEM STATEMENT & VISION STATEMENT (From PDF Page 1) */}
      <section id="bw-problem-vision" className="py-20 bg-white border-b border-[#E5DFD5]">
        <div className="max-w-[1240px] mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Problem Statement Card */}
            <div className="lg:col-span-7 bg-[#FBF9F5] p-8 sm:p-10 rounded-3xl border border-[#E5DFD5] space-y-5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-100 text-rose-800 text-xs font-bold uppercase tracking-wider">
                <Target className="w-3.5 h-3.5" />
                <span>Problem Statement</span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#00231b] tracking-tight">
                Addressing Ecosystem Fragmentation in Edo State
              </h2>

              <div className="text-sm sm:text-base text-[#414845] space-y-4 leading-relaxed font-normal">
                <p>
                  There is one prevailing challenge in our business ecosystem; <strong className="text-[#00231b]">Inability to work together to transform Edo state</strong>. Despite the growing number of entrepreneurs, SMEs, innovators, and research institutions in Edo State, collaboration between business, government, academia, investors, and development partners remains fragmented. This has limited access to finance, technology, strategic partnerships, markets, and policies needed to transform innovative ideas into sustainable businesses and economic opportunities.
                </p>
                <p>
                  In today's global economy, businesses are increasingly driven by innovation and technology, thereby, there's an urgent need for a platform that convenes key stakeholders to foster collaboration, promote investment, encourage digital transformation, and accelerate business growth.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-[#E5DFD5] shadow-xs text-xs sm:text-sm text-[#00231b] font-medium leading-relaxed">
                <p className="font-bold text-[#B45309] mb-1">Welcome to Óghowa Business Week:</p>
                Under the theme <strong className="font-bold">"Innovation for Economic Transformation,"</strong> we address this need by providing a flagship platform that connects ideas with investment, innovation with enterprise, and partnerships with measurable economic impact, positioning Edo State as a leading hub for business and innovation.
              </div>
            </div>

            {/* Vision Statement & Theme Card */}
            <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
              <div className="bg-gradient-to-br from-[#00231b] to-[#0e3a2f] text-white p-8 sm:p-10 rounded-3xl shadow-lg space-y-5">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-[#FEF3C7] text-xs font-bold uppercase tracking-wider">
                  <Compass className="w-3.5 h-3.5" />
                  <span>What's Our Vision Statement</span>
                </div>

                <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-[#FEF3C7]">
                  "Innovation for Economic Transformation"
                </h3>

                <p className="text-sm sm:text-base text-slate-200 leading-relaxed font-light">
                  Oghowa Business Week is an annual platform that brings together entrepreneurs, businesses, investors, policymakers, researchers, development partners, and innovators to accelerate economic transformation through innovation, technology, entrepreneurship, strategic partnerships, and investment.
                </p>

                <div className="pt-2 border-t border-white/15 flex items-center justify-between text-xs text-[#b5efda]">
                  <span>...Our own</span>
                  <span>Benin City, Edo State</span>
                </div>
              </div>

              <div className="p-6 rounded-3xl bg-[#FEF3C7]/60 border border-[#B45309]/20 space-y-2">
                <span className="text-xs font-bold text-[#B45309] uppercase tracking-wider block">
                  Delegate Accreditation
                </span>
                <p className="text-xs text-[#78350F] leading-relaxed">
                  Join founders, investors, corporate leaders, developers, and public sector champions for 4 intensive days of deal-making and policy alignment.
                </p>
                <button
                  onClick={onOpenRegistration}
                  className="text-xs font-bold text-[#00231b] hover:text-[#B45309] flex items-center gap-1 cursor-pointer pt-1"
                >
                  <span>Open Participant Registration Form</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. WHY US? 3 STRATEGIC PILLARS (From PDF Pages 1–2) */}
      <section className="py-20 bg-[#FBF9F5] border-b border-[#E5DFD5]">
        <div className="max-w-[1240px] mx-auto px-4 md:px-6">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-bold text-[#B45309] uppercase tracking-widest bg-[#FEF3C7] px-3 py-1 rounded-full">
              Why Us?
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#00231b] mt-3 tracking-tight">
              Three Strategic Pillars of Transformation
            </h2>
            <p className="text-sm sm:text-base text-[#52605B] mt-2">
              How Óghowa Business Week bridges regulatory frameworks, de-risks frontier capital, and connects tech to the real economy.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Pillar 1 */}
            <div className="bg-white p-7 rounded-3xl border border-[#E5DFD5] shadow-xs hover:border-[#00231b]/40 hover:shadow-lg transition-all flex flex-col justify-between">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-[#FBF9F5] border border-[#E5DFD5] flex items-center justify-center text-[#00231b] font-bold text-lg">
                  1
                </div>
                <div>
                  <h3 className="text-xl font-bold text-[#00231b]">
                    Institutional Alignment & Policy Activation
                  </h3>
                  <p className="text-xs text-[#B45309] font-bold uppercase tracking-wider mt-1">
                    Regulatory Bridging
                  </p>
                </div>
                <p className="text-xs sm:text-sm text-[#52605B] leading-relaxed">
                  To serve as the primary sub-national platform that bridges state regulatory frameworks (like MDEST and ICTA) with active private-sector innovations, turning public policy into executable business advantages.
                </p>
              </div>
              <div className="pt-5 mt-5 border-t border-[#E5DFD5] text-xs text-[#316858] font-semibold flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                <span>MDEST, ICTA & Startup Act Adoption</span>
              </div>
            </div>

            {/* Pillar 2 */}
            <div className="bg-white p-7 rounded-3xl border border-[#E5DFD5] shadow-xs hover:border-[#00231b]/40 hover:shadow-lg transition-all flex flex-col justify-between">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-[#FEF3C7] border border-[#B45309]/30 flex items-center justify-center text-[#B45309] font-bold text-lg">
                  2
                </div>
                <div>
                  <h3 className="text-xl font-bold text-[#00231b]">
                    Capital Mobilization for the Local Frontier
                  </h3>
                  <p className="text-xs text-[#B45309] font-bold uppercase tracking-wider mt-1">
                    De-risking Investment
                  </p>
                </div>
                <p className="text-xs sm:text-sm text-[#52605B] leading-relaxed">
                  To de-risk the Edo tech ecosystem by bringing public intervention funds (like BOI's iDICE framework) and private venture capital directly to Benin City, establishing formal funding pipelines for early-stage founders.
                </p>
              </div>
              <div className="pt-5 mt-5 border-t border-[#E5DFD5] text-xs text-[#B45309] font-semibold flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                <span>BOI iDICE & Venture Syndicate Lines</span>
              </div>
            </div>

            {/* Pillar 3 */}
            <div className="bg-white p-7 rounded-3xl border border-[#E5DFD5] shadow-xs hover:border-[#00231b]/40 hover:shadow-lg transition-all flex flex-col justify-between">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-[#FBF9F5] border border-[#E5DFD5] flex items-center justify-center text-[#00231b] font-bold text-lg">
                  3
                </div>
                <div>
                  <h3 className="text-xl font-bold text-[#00231b]">
                    Integration of the Real Sector & Remote Economy
                  </h3>
                  <p className="text-xs text-[#B45309] font-bold uppercase tracking-wider mt-1">
                    Direct Economic Impact
                  </p>
                </div>
                <p className="text-xs sm:text-sm text-[#52605B] leading-relaxed">
                  To drive true economic transformation by matching digital solutions with brick-and-mortar industries (AgriTech and Logistics) while formalizing global outsourcing tracks (such as AI data annotation and digital media) for local talents.
                </p>
              </div>
              <div className="pt-5 mt-5 border-t border-[#E5DFD5] text-xs text-[#316858] font-semibold flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                <span>AgriTech, Logistics & Remote Talents</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. WHAT WE WANT TO ACHIEVE (From PDF Page 2) */}
      <section id="bw-goals" className="py-20 bg-white border-b border-[#E5DFD5]">
        <div className="max-w-[1240px] mx-auto px-4 md:px-6">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-bold text-[#00231b] uppercase tracking-widest bg-[#00231b]/10 px-3 py-1 rounded-full">
              Measurable Impact
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#00231b] mt-3 tracking-tight">
              What We Want to Achieve
            </h2>
            <p className="text-sm sm:text-base text-[#52605B] mt-2">
              Tracking success dynamically broken down across core ecosystem stakeholders.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Stakeholder 1: Government & Financial Institutions */}
            <div className="bg-[#FBF9F5] p-7 rounded-3xl border border-[#E5DFD5] space-y-5">
              <div className="w-12 h-12 rounded-2xl bg-white border border-[#E5DFD5] flex items-center justify-center text-[#00231b]">
                <Building className="w-6 h-6" />
              </div>

              <div>
                <h3 className="text-lg font-bold text-[#00231b]">
                  For Government & Financial Institutions
                </h3>
                <p className="text-xs text-[#52605B] mt-0.5 font-medium">Policy and catalytic funding activation</p>
              </div>

              <div className="space-y-4 text-xs sm:text-sm text-[#414845]">
                <div className="p-3.5 bg-white rounded-xl border border-[#E5DFD5] space-y-1">
                  <span className="font-bold text-[#00231b] block">Secure Financial Commitments:</span>
                  <p className="text-[#52605B] leading-relaxed">
                    Onboard at least 3 tier-1 institutional partners (e.g., Bank of Industry, Ministry of Trade, and commercial bank SME divisions) to clarify and open application access lines directly for the ecosystem during the week.
                  </p>
                </div>

                <div className="p-3.5 bg-white rounded-xl border border-[#E5DFD5] space-y-1">
                  <span className="font-bold text-[#00231b] block">Policy Simplification:</span>
                  <p className="text-[#52605B] leading-relaxed">
                    Deliver 1 clear, actionable feedback brief from local founders directly to the Ministry of Digital Economy (MDEST) regarding local cloud procurement and startup incentives.
                  </p>
                </div>
              </div>
            </div>

            {/* Stakeholder 2: Founders & Private Investors */}
            <div className="bg-[#FBF9F5] p-7 rounded-3xl border border-[#E5DFD5] space-y-5">
              <div className="w-12 h-12 rounded-2xl bg-white border border-[#E5DFD5] flex items-center justify-center text-[#B45309]">
                <TrendingUp className="w-6 h-6" />
              </div>

              <div>
                <h3 className="text-lg font-bold text-[#00231b]">
                  For Founders & Private Investors
                </h3>
                <p className="text-xs text-[#52605B] mt-0.5 font-medium">Capital velocity and corporate readiness</p>
              </div>

              <div className="space-y-4 text-xs sm:text-sm text-[#414845]">
                <div className="p-3.5 bg-white rounded-xl border border-[#E5DFD5] space-y-1">
                  <span className="font-bold text-[#00231b] block">Capital Pipeline Velocity:</span>
                  <p className="text-[#52605B] leading-relaxed">
                    Pre-vet and showcase at least 8 to 10 high-traction startup cohorts on Demo Day to a panel of visiting angel investors and venture capitalists.
                  </p>
                </div>

                <div className="p-3.5 bg-white rounded-xl border border-[#E5DFD5] space-y-1">
                  <span className="font-bold text-[#00231b] block">Corporate Readiness:</span>
                  <p className="text-[#52605B] leading-relaxed">
                    Transition at least 20 early-stage ventures through the Day 2 Corporate Governance and legal compliance clinics, ensuring they leave with clean regulatory foundations.
                  </p>
                </div>
              </div>
            </div>

            {/* Stakeholder 3: Developers & Digital Talents */}
            <div className="bg-[#FBF9F5] p-7 rounded-3xl border border-[#E5DFD5] space-y-5">
              <div className="w-12 h-12 rounded-2xl bg-white border border-[#E5DFD5] flex items-center justify-center text-[#316858]">
                <Cpu className="w-6 h-6" />
              </div>

              <div>
                <h3 className="text-lg font-bold text-[#00231b]">
                  For Developers & Digital Talents
                </h3>
                <p className="text-xs text-[#52605B] mt-0.5 font-medium">Global integration and rapid prototyping</p>
              </div>

              <div className="space-y-4 text-xs sm:text-sm text-[#414845]">
                <div className="p-3.5 bg-white rounded-xl border border-[#E5DFD5] space-y-1">
                  <span className="font-bold text-[#00231b] block">Talent Placement:</span>
                  <p className="text-[#52605B] leading-relaxed">
                    Facilitate real-world workspace integration by connecting at least 50 skilled engineers, data specialists, and product managers directly to hiring founders or global remote outsourcing networks during the Day 5 Talent Expo.
                  </p>
                </div>

                <div className="p-3.5 bg-white rounded-xl border border-[#E5DFD5] space-y-1">
                  <span className="font-bold text-[#00231b] block">Rapid Prototyping Output:</span>
                  <p className="text-[#52605B] leading-relaxed">
                    Produce at least 4 working developer prototypes during the 24-hour Hackathon sprint that directly address localized bottlenecks in regional logistics or commodity distribution.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. FULL 4-DAY EVENT SCHEDULE & PROGRAM ARCHITECTURE (From PDF Pages 3–5) */}
      <section id="bw-agenda" className="py-20 bg-[#FBF9F5] border-b border-[#E5DFD5]">
        <div className="max-w-[1240px] mx-auto px-4 md:px-6">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold text-[#00231b] uppercase tracking-widest bg-[#00231b]/10 px-3 py-1 rounded-full">
              Event Schedule & Program Architecture
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#00231b] mt-3 tracking-tight">
              4-Day Official Timetable
            </h2>
            <p className="text-sm sm:text-base text-[#52605B] mt-2">
              From macroeconomic policy forums to deep technical clinics and the Grand Finale Demo Day.
            </p>
          </div>

          {/* Day Navigation Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
            {scheduleDays.map((d) => (
              <button
                key={d.day}
                onClick={() => setActiveDayTab(d.day)}
                className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer ${
                  activeDayTab === d.day
                    ? 'bg-[#00231b] text-white shadow-md'
                    : 'bg-white hover:bg-[#F4EFE6] text-[#52605B] border border-[#E5DFD5]'
                }`}
              >
                <span>Day {d.day}</span>
                <span className="hidden sm:inline font-normal opacity-80 ml-1.5">
                  ({d.date.split(',')[1]})
                </span>
              </button>
            ))}
          </div>

          {/* Active Day Content */}
          {(() => {
            const current = scheduleDays.find((d) => d.day === activeDayTab) || scheduleDays[0];
            return (
              <div className="bg-white rounded-3xl p-6 sm:p-10 border border-[#E5DFD5] shadow-xs max-w-4xl mx-auto">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-[#E5DFD5] gap-3">
                  <div>
                    <span className="text-xs font-bold text-[#B45309] uppercase tracking-wider">
                      {current.date}
                    </span>
                    <h3 className="text-xl sm:text-2xl font-bold text-[#00231b] mt-0.5">
                      {current.title}
                    </h3>
                    <p className="text-xs text-[#52605B] mt-1 max-w-xl">
                      {current.summary}
                    </p>
                  </div>
                  <span className="inline-block px-3 py-1 bg-[#FEF3C7] text-[#B45309] font-bold text-xs rounded-full self-start sm:self-center">
                    {current.theme}
                  </span>
                </div>

                <div className="divide-y divide-[#E5DFD5] mt-4">
                  {current.events.map((evt, idx) => (
                    <div key={idx} className="py-4.5 flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                      <div className="sm:w-40 shrink-0">
                        <span className="font-mono text-xs font-bold text-[#00231b] bg-[#F4EFE6] px-2.5 py-1 rounded-md block sm:inline-block">
                          {evt.time}
                        </span>
                      </div>
                      <div className="flex-1 space-y-1">
                        <h4 className="text-sm sm:text-base font-bold text-[#181d1b]">
                          {evt.title}
                        </h4>
                        <p className="text-xs text-[#52605B] leading-relaxed">
                          {evt.description}
                        </p>
                        <p className="text-[11px] text-[#316858] font-medium pt-0.5 flex items-center gap-1">
                          <Users className="w-3 h-3" />
                          <span>Session: <strong>{evt.speaker}</strong></span>
                        </p>
                      </div>
                      <button
                        onClick={onOpenRegistration}
                        className="text-xs font-semibold text-[#00231b] hover:text-[#B45309] underline shrink-0 cursor-pointer self-start sm:self-center"
                      >
                        Register
                      </button>
                    </div>
                  ))}
                </div>

                <div className="pt-6 mt-6 border-t border-[#E5DFD5] flex flex-col sm:flex-row items-center justify-between gap-4">
                  <span className="text-xs text-[#52605B]">
                    Full session briefing packets are provided to accredited participants.
                  </span>
                  <button
                    onClick={onOpenRegistration}
                    className="px-6 py-2.5 rounded-xl bg-[#00231b] hover:bg-[#0e3a2f] text-white text-xs font-bold transition cursor-pointer flex items-center gap-1.5"
                  >
                    <span>Register for Day {current.day} Pass</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })()}
        </div>
      </section>

      {/* 8. VENUE SECTION */}
      <section id="bw-venue" className="py-20 bg-white border-b border-[#E5DFD5]">
        <div className="max-w-[1240px] mx-auto px-4 md:px-6">
          <div className="bg-[#FBF9F5] rounded-3xl p-6 sm:p-12 border border-[#E5DFD5] shadow-xs">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
              <div className="lg:col-span-6 space-y-5">
                <span className="text-xs font-bold text-[#B45309] uppercase tracking-widest bg-[#FEF3C7] px-3 py-1 rounded-full">
                  Host City & Venue
                </span>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-[#00231b] tracking-tight">
                  {summitVenue}
                </h2>
                <p className="text-sm sm:text-base text-[#52605B] leading-relaxed">
                  Located along Airport Road in the cultural heart of Benin City, the Victor Uwaifo Creative Hub features state-of-the-art auditorium facilities, acoustic breakout halls, high-speed fiber connectivity, and outdoor networking plazas.
                </p>

                <div className="space-y-3 pt-2 text-xs sm:text-sm text-[#181d1b]">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-white border border-[#E5DFD5] flex items-center justify-center shrink-0">
                      <MapPin className="w-4 h-4 text-[#00231b]" />
                    </div>
                    <span>Airport Road, GRA, Benin City, Edo State, Nigeria</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-white border border-[#E5DFD5] flex items-center justify-center shrink-0">
                      <ShieldCheck className="w-4 h-4 text-emerald-700" />
                    </div>
                    <span>Full Security Perimeter & Dedicated Accreditation Desks</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-white border border-[#E5DFD5] flex items-center justify-center shrink-0">
                      <Rocket className="w-4 h-4 text-[#B45309]" />
                    </div>
                    <span>Airport Shuttle Access for Confirmed Delegates</span>
                  </div>
                </div>

                <div className="pt-4 flex items-center gap-4">
                  <button
                    onClick={onOpenRegistration}
                    className="px-6 py-3 rounded-xl bg-[#00231b] hover:bg-[#0e3a2f] text-white text-xs sm:text-sm font-bold transition cursor-pointer flex items-center gap-2"
                  >
                    <span>Register to Attend in Person</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="lg:col-span-6">
                <div className="rounded-2xl overflow-hidden border border-[#E5DFD5] shadow-md relative bg-[#00231b] text-white p-8 space-y-4">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#FEF3C7]">
                    In-Person & Remote Access
                  </span>
                  <h3 className="text-2xl font-bold">
                    Join Edo State's Landmark Business & Innovation Summit
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-light">
                    Whether you are an entrepreneur seeking venture capital, a corporate leader modernizing trade channels, or a government partner activating policy, Óghowa Business Week is built for high-value collaboration.
                  </p>
                  <div className="pt-2 flex items-center gap-3 text-xs text-[#b5efda]">
                    <span>Capacity: 500 Delegates</span>
                    <span>•</span>
                    <span className="text-rose-300 font-bold">{vacantSeats} Seats Vacant</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 9. FREQUENTLY ASKED QUESTIONS */}
      <section id="bw-faq" className="py-20 bg-[#FBF9F5] border-b border-[#E5DFD5]">
        <div className="max-w-[900px] mx-auto px-4 md:px-6">
          <div className="text-center mb-12">
            <span className="text-xs font-bold text-[#00231b] uppercase tracking-widest bg-[#00231b]/10 px-3 py-1 rounded-full">
              Frequently Asked Questions
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#00231b] mt-3 tracking-tight">
              Registration & Participation Details
            </h2>
          </div>

          <div className="space-y-4">
            {[
              {
                q: 'What is Óghowa Business Week?',
                a: 'Óghowa Business Week is an annual platform under the theme "Innovation for Economic Transformation," bringing together entrepreneurs, businesses, investors, policymakers, researchers, development partners, and innovators in collaboration with Benin Tech Fest.'
              },
              {
                q: 'How do I register for Óghowa Business Week?',
                a: 'Click the "Register Now" button anywhere on this page to access the official participant registration form. It takes approximately 3 minutes to complete.'
              },
              {
                q: 'Can I participate remotely?',
                a: 'Yes. In the registration form under "Will you attend in person?", you can select "No, I would like to follow remotely" or "Not sure yet" to receive virtual streaming access.'
              },
              {
                q: 'How can my company pitch at the Demo Day?',
                a: 'Select "Startup pitches & showcase" and "Startup founder" on the participant registration form. Shortlisted founders are contacted for the Demo Day cohort selection.'
              },
              {
                q: 'How can organizations exhibit or sponsor?',
                a: 'In the registration form, answer "Are you interested in exhibiting or sponsoring?" with Exhibiting, Sponsoring, or Both, and our secretariat team will contact you with the sponsorship prospectus.'
              }
            ].map((faq, idx) => (
              <div key={idx} className="p-5 rounded-2xl bg-white border border-[#E5DFD5] space-y-2">
                <h3 className="text-base font-bold text-[#00231b] flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-[#B45309] shrink-0" />
                  <span>{faq.q}</span>
                </h3>
                <p className="text-xs sm:text-sm text-[#52605B] leading-relaxed pl-6">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 10. PRE-FOOTER CALL TO ACTION */}
      <section className="py-16 sm:py-20 bg-gradient-to-r from-[#00231b] via-[#0e3a2f] to-[#00231b] text-white">
        <div className="max-w-[1000px] mx-auto px-4 text-center space-y-6">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-[#FEF3C7] text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Join Founders, Investors & Innovators</span>
          </span>

          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
            Ready to Take Part in Óghowa Business Week 2026?
          </h2>

          <p className="text-sm sm:text-base text-[#eaefeb] max-w-xl mx-auto leading-relaxed">
            Register to take part in Óghowa Business Week, in collaboration with Benin Tech Fest. Join founders, investors, business leaders and innovators for keynotes, masterclasses, startup pitches and networking in Edo State.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <button
              onClick={onOpenRegistration}
              className="px-8 py-4 rounded-xl bg-[#FEF3C7] hover:bg-white text-[#00231b] font-bold text-base shadow-xl transition-all flex items-center gap-2 cursor-pointer"
            >
              <span>Complete Participant Registration</span>
              <ArrowRight className="w-4 h-4 text-[#00231b]" />
            </button>

            <button
              onClick={onBackToAccelerator}
              className="px-6 py-4 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-base border border-white/20 transition cursor-pointer"
            >
              <span>Oghowa Homepage</span>
            </button>
          </div>
        </div>
      </section>

      {/* 11. DEDICATED BUSINESS WEEK FOOTER (Updated as requested) */}
      <footer className="w-full bg-[#F4EFE6] py-12 border-t border-[#E5DFD5]">
        <div className="max-w-[1240px] mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-10 border-b border-[#E5DFD5]">
            <div className="md:col-span-2 space-y-4">
              <div className="flex items-center">
                <BusinessWeekLogo size="md" />
              </div>
              <p className="text-xs sm:text-sm text-[#52605B] max-w-md leading-relaxed">
                Óghowa Business Week is West Africa's frontline venture, tech, and economic policy summit, powered in direct institutional collaboration with Benin Tech Fest & Edo State Innovation Network.
              </p>
            </div>

            <div>
              <h4 className="text-xs font-bold text-[#00231b] uppercase tracking-wider mb-3">
                Business Week Navigation
              </h4>
              <ul className="space-y-2 text-xs text-[#52605B]">
                <li>
                  <button onClick={onBackToAccelerator} className="font-semibold text-[#00231b] hover:underline">
                    Óghowa Accelerator Homepage
                  </button>
                </li>
                <li><button onClick={() => scrollToSection('bw-overview')} className="hover:text-[#00231b]">Business Week Overview</button></li>
                <li><button onClick={() => scrollToSection('bw-problem-vision')} className="hover:text-[#00231b]">Vision & Strategic Pillars</button></li>
                <li><button onClick={() => scrollToSection('bw-goals')} className="hover:text-[#00231b]">Stakeholder Outcomes</button></li>
                <li><button onClick={() => scrollToSection('bw-agenda')} className="hover:text-[#00231b]">4-Day Schedule</button></li>
                <li><button onClick={() => scrollToSection('bw-venue')} className="hover:text-[#00231b]">Host City & Venue</button></li>
                <li><button onClick={onOpenRegistration} className="text-[#B45309] font-bold hover:underline">Participant Registration</button></li>
              </ul>
            </div>
          </div>

          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#52605B]">
            <p>© 2026 Óghowa Business Week. All rights reserved.</p>
            <div className="flex items-center gap-4">
              <button onClick={onOpenRegistration} className="hover:text-[#00231b] font-bold">
                Participant Registration
              </button>
              <span>•</span>
              <button onClick={onBackToAccelerator} className="hover:text-[#00231b]">
                Oghowa Homepage
              </button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
