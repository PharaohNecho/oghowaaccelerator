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
  FileText
} from 'lucide-react';
import { BusinessWeekLogo } from './BusinessWeekLogo';

interface BusinessWeekLandingProps {
  onBackToAccelerator: () => void;
  onOpenRegistration: () => void;
  onOpenApply: () => void;
}

export const BusinessWeekLanding: React.FC<BusinessWeekLandingProps> = ({
  onBackToAccelerator,
  onOpenRegistration,
  onOpenApply
}) => {
  // Live Countdown to Summit Opening (October 24, 2026)
  const [timeLeft, setTimeLeft] = useState({
    days: 18,
    hours: 7,
    minutes: 42,
    seconds: 15
  });

  const [activeDayTab, setActiveDayTab] = useState<number>(1);

  useEffect(() => {
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + 18);
    targetDate.setHours(targetDate.getHours() + 7);
    targetDate.setMinutes(targetDate.getMinutes() + 42);

    const timer = setInterval(() => {
      const now = new Date().getTime();
      const difference = targetDate.getTime() - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000)
        });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const yOffset = -90;
      const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  const scheduleDays = [
    {
      day: 1,
      title: 'Day 1: Opening Plenary & Policy Debates',
      date: 'Monday, Oct 24, 2026',
      theme: 'The Sub-National Innovation Blueprint',
      events: [
        { time: '08:30 AM', title: 'Accreditation, RFID Badge Collection & Delegate Breakfast', speaker: 'Summit Secretariat' },
        { time: '10:00 AM', title: 'Keynote: Building Africa\'s Next Innovation Corridor from Benin City', speaker: 'Edo State Innovation Council & Guests' },
        { time: '12:30 PM', title: 'Ministerial & Regulatory Roundtable: Digital Economy & SME Policy', speaker: 'Public Sector Delegation' },
        { time: '02:30 PM', title: 'Panel: Cross-Border Capital Flows into Emerging City Hubs', speaker: 'Pan-African Venture Leaders' }
      ]
    },
    {
      day: 2,
      title: 'Day 2: Masterclasses & Scale-Up Bootcamps',
      date: 'Tuesday, Oct 25, 2026',
      theme: 'Operational Excellence & Commercial Traction',
      events: [
        { time: '09:00 AM', title: 'Masterclass: Early-Stage Fundraising, Term Sheets & SAFE Notes', speaker: 'Top Venture Partners' },
        { time: '11:15 AM', title: 'Masterclass: AI Adoption & Process Automation for African SMEs', speaker: 'AI Engineering Leads' },
        { time: '02:00 PM', title: 'Masterclass: Scaling Agricultural Cold-Chain & Cross-Border Logistics', speaker: 'Agritech Operators' },
        { time: '04:00 PM', title: 'Founder Office Hours: 1-on-1 Mentorship Speed Networking', speaker: 'Ecosystem Mentors' }
      ]
    },
    {
      day: 3,
      title: 'Day 3: The ₦50M Great Venture Pitch & Deal Rooms',
      date: 'Wednesday, Oct 26, 2026',
      theme: 'High-Impact Capital Syndication',
      events: [
        { time: '09:30 AM', title: 'Opening: The State of Venture Capital in South-South Nigeria', speaker: 'Deal Syndicate Leads' },
        { time: '11:00 AM', title: 'Top 10 Finalist Venture Showcase: Live Pitch Arena', speaker: 'Venture Finalists' },
        { time: '02:00 PM', title: 'Closed-Door Investor Syndicate Deal Rooms', speaker: 'Accredited Investors & Angels' },
        { time: '05:00 PM', title: 'Announcement of ₦50,000,000 Deal Commitments & Co-Investments', speaker: 'Óghowa Investment Committee' }
      ]
    },
    {
      day: 4,
      title: 'Day 4: Creative Economy & Benin Tech Fest Synergy',
      date: 'Thursday, Oct 27, 2026',
      theme: 'Heritage Preservation & Frontier Digital Media',
      events: [
        { time: '10:00 AM', title: 'Keynote: Ancient Benin Metallurgy to Web3 & Digital 3D Archiving', speaker: 'Creative Technologists' },
        { time: '12:00 PM', title: 'Panel: African Film, Sound Sync & Global Streaming Distribution', speaker: 'Nollywood & Music Producers' },
        { time: '02:30 PM', title: 'Interactive Demo: Robotics, Drone Tech & Interactive Software Showcase', speaker: 'Benin Tech Fest Fellows' },
        { time: '06:00 PM', title: 'Cultural Heritage Night & Creator Showcase at Victor Uwaifo Amphitheatre', speaker: 'Special Performances' }
      ]
    },
    {
      day: 5,
      title: 'Day 5: Awards Gala & Executive Network Dinner',
      date: 'Friday, Oct 28, 2026',
      theme: 'Celebration of Ecosystem Milestones',
      events: [
        { time: '10:00 AM', title: 'Summary Communiqué: Economic Resolution for Edo Innovation Network', speaker: 'Drafting Committee' },
        { time: '12:30 PM', title: 'Venture Cohort 2026 Official Graduation Ceremony', speaker: 'Óghowa Accelerator Leadership' },
        { time: '06:30 PM', title: 'Annual Ecosystem Excellence Awards & Executive Dinner', speaker: 'VIP Delegation' }
      ]
    }
  ];

  return (
    <div className="bg-[#FBF9F5] text-[#181d1b] min-h-screen flex flex-col font-sans selection:bg-[#00231b] selection:text-white">
      {/* 1. SUMMIT NAVIGATION HEADER */}
      <header className="fixed top-0 w-full z-50 bg-white/95 backdrop-blur-md shadow-[0_1px_8px_rgba(0,0,0,0.04)] border-b border-[#E5DFD5]">
        <div className="h-20 max-w-[1240px] mx-auto px-4 md:px-6 flex items-center justify-between">
          {/* Logo with Benin Queen Idia emblem */}
          <div className="flex items-center gap-3">
            <div className="flex items-center">
              <BusinessWeekLogo size="sm" />
            </div>
            <div className="hidden sm:flex flex-col">
              <span className="text-base text-[#00231b] font-bold tracking-tight leading-tight">
                Óghowa Business Week
              </span>
              <span className="text-[11px] text-[#52605B]">The Frontier Business Summit</span>
            </div>
            <div className="hidden md:flex items-center px-2.5 py-1 rounded-full bg-[#FEF3C7] text-[#B45309] text-[10px] font-bold uppercase tracking-wider ml-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#B45309] mr-1.5 animate-pulse" />
              With Benin Tech Fest
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-6 text-xs sm:text-sm font-semibold text-[#414845]">
            <button onClick={() => scrollToSection('bw-overview')} className="hover:text-[#00231b] transition-colors cursor-pointer">
              Overview
            </button>
            <button onClick={() => scrollToSection('bw-tracks')} className="hover:text-[#00231b] transition-colors cursor-pointer">
              Tracks
            </button>
            <button onClick={() => scrollToSection('bw-speakers')} className="hover:text-[#00231b] transition-colors cursor-pointer">
              Speakers
            </button>
            <button onClick={() => scrollToSection('bw-agenda')} className="hover:text-[#00231b] transition-colors cursor-pointer">
              5-Day Schedule
            </button>
            <button onClick={() => scrollToSection('bw-venue')} className="hover:text-[#00231b] transition-colors cursor-pointer">
              Venue
            </button>
            <button onClick={() => scrollToSection('bw-faq')} className="hover:text-[#00231b] transition-colors cursor-pointer">
              FAQs
            </button>
          </nav>

          {/* Action Buttons: Register for Business Week & Return to Accelerator */}
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
              title="Return to Óghowa Accelerator Mother Group"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Mother Site</span>
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
              {/* Event Badge Ribbon */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FEF3C7] text-[#B45309] text-xs font-bold uppercase tracking-wider border border-[#B45309]/20">
                  <span className="w-2 h-2 rounded-full bg-[#B45309] animate-ping" />
                  Official Flagship Summit 2026
                </span>
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#00231b]/10 text-[#00231b] text-xs font-bold">
                  <MapPin className="w-3.5 h-3.5 text-[#316858]" />
                  Benin City, Edo State
                </span>
              </div>

              {/* Main Headline */}
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-[#00231b] tracking-tight leading-[1.12]">
                Powering Africa’s <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00231b] via-[#316858] to-[#B45309]">
                  Innovation Economy
                </span>
              </h1>

              {/* Subhead */}
              <p className="text-base sm:text-lg text-[#52605B] leading-relaxed max-w-2xl font-normal">
                Join 2,500+ ambitious founders, venture capitalists, corporate leaders, and policymaking titans for five transformative days of high-stakes keynote debates, masterclasses, and the ₦50M Closed Deal Syndicate room.
              </p>

              {/* Date & Collaboration Tag */}
              <div className="p-4 rounded-xl bg-white border border-[#E5DFD5] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2.5 text-[#181d1b]">
                  <Calendar className="w-4 h-4 text-[#B45309]" />
                  <span className="font-bold">October 24 – 28, 2026</span>
                  <span className="text-[#52605B] hidden sm:inline">•</span>
                  <span className="text-[#52605B]">Victor Uwaifo Creative Hub & Edo Innovates</span>
                </div>
                <span className="text-[#316858] font-bold">In Collaboration with Benin Tech Fest</span>
              </div>

              {/* CTAs */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <button
                  onClick={onOpenRegistration}
                  className="px-7 py-4 rounded-xl bg-[#00231b] hover:bg-[#0e3a2f] text-white font-bold text-sm sm:text-base shadow-lg hover:shadow-xl active:scale-98 transition-all flex items-center gap-2.5 cursor-pointer group"
                >
                  <Ticket className="w-5 h-5 text-[#FEF3C7]" />
                  <span>Register for Business Week</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>

                <button
                  onClick={() => scrollToSection('bw-agenda')}
                  className="px-6 py-4 rounded-xl bg-white hover:bg-[#F4EFE6] text-[#00231b] border border-[#C8BFB0] font-bold text-sm sm:text-base transition-colors flex items-center gap-2 cursor-pointer shadow-xs"
                >
                  <span>Explore 5-Day Agenda</span>
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
                  <span>Exclusive Pitch Deal Rooms</span>
                </span>
              </div>
            </div>

            {/* Right Column: Live Ticking Countdown & High-Impact Stat Card */}
            <div className="lg:col-span-5 space-y-6">
              {/* Countdown Card */}
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

                {/* Direct Register Action */}
                <button
                  onClick={onOpenRegistration}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#00231b] to-[#0e3a2f] hover:from-[#0e3a2f] hover:to-[#00231b] text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Ticket className="w-4 h-4 text-[#FEF3C7]" />
                  <span>Secure Your Delegate Registration Pass</span>
                </button>
                <p className="text-[11px] text-center text-[#52605B] mt-2.5">
                  Accreditation badges are strictly limited per hall capacity.
                </p>
              </div>

              {/* Four Impact Pillars */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-white p-4 rounded-xl border border-[#E5DFD5] shadow-xs">
                  <p className="text-2xl font-extrabold text-[#00231b]">2,500+</p>
                  <p className="text-xs text-[#52605B] mt-0.5 font-medium">Expected Delegates</p>
                </div>
                <div className="bg-white p-4 rounded-xl border border-[#E5DFD5] shadow-xs">
                  <p className="text-2xl font-extrabold text-[#B45309]">₦50,000,000</p>
                  <p className="text-xs text-[#52605B] mt-0.5 font-medium">Deal Room Syndicate</p>
                </div>
                <div className="bg-white p-4 rounded-xl border border-[#E5DFD5] shadow-xs">
                  <p className="text-2xl font-extrabold text-[#00231b]">150+</p>
                  <p className="text-xs text-[#52605B] mt-0.5 font-medium">Startups & Scale-ups</p>
                </div>
                <div className="bg-white p-4 rounded-xl border border-[#E5DFD5] shadow-xs">
                  <p className="text-2xl font-extrabold text-[#316858]">40+</p>
                  <p className="text-xs text-[#52605B] mt-0.5 font-medium">Masterclass Sessions</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. COLLABORATION WITH BENIN TECH FEST MARQUEE */}
      <section className="bg-[#00231b] text-white py-4 border-y border-[#316858]/40">
        <div className="max-w-[1240px] mx-auto px-4 flex flex-wrap items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-3">
            <span className="w-2 h-2 rounded-full bg-[#FEF3C7] animate-pulse" />
            <span className="font-bold tracking-wide uppercase text-[#b5efda]">
              Institutional Partnership:
            </span>
            <span className="text-slate-200">
              Óghowa Business Week × Benin Tech Fest × Edo State Innovation Network
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
              Get Accredited →
            </button>
          </div>
        </div>
      </section>

      {/* 4. THEMATIC TRACKS SECTION */}
      <section id="bw-tracks" className="py-20 bg-white border-b border-[#E5DFD5]">
        <div className="max-w-[1240px] mx-auto px-4 md:px-6">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-bold text-[#B45309] uppercase tracking-widest bg-[#FEF3C7] px-3 py-1 rounded-full">
              Thematic Focus Areas
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#00231b] mt-3 tracking-tight">
              Six Frontline Tracks Driving African Growth
            </h2>
            <p className="text-sm sm:text-base text-[#52605B] mt-2">
              Deep-dive into sectoral debates, cross-border commercial opportunities, and practical execution frameworks.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: Rocket,
                title: 'Digital Economy & Software Ecosystem',
                tag: 'Track 01',
                desc: 'Fintech rails, cross-border API payments, AI integration for African trade, and sub-national tech talent pipelines from UNIBEN and Edo Innovates.'
              },
              {
                icon: Layers,
                title: 'Agriculture, Agritech & Cold-Chain',
                tag: 'Track 02',
                desc: 'Mechanized food processing, high-yield agro commodities, rural aggregation depots, and digital commodity marketplace solutions.'
              },
              {
                icon: Award,
                title: 'Creative Economy, Film & Digital Heritage',
                tag: 'Track 03',
                desc: 'Ancient Benin bronze heritage preservation, digital 3D archives, animation, film sound sync, and monetizing African intellectual property.'
              },
              {
                icon: Building,
                title: 'Manufacturing, Energy & Infrastructure',
                tag: 'Track 04',
                desc: 'Clean mobility, local assembly plants, IPP industrial electricity zones, and sub-national enterprise manufacturing incentives.'
              },
              {
                icon: Sparkles,
                title: 'Investment, VC & Closed Deal Syndicates',
                tag: 'Track 05',
                desc: 'The ₦50M Great Venture Pitch, closed-door deal rooms, co-investment syndicates, and direct founder-investor term sheet negotiations.'
              },
              {
                icon: BookOpen,
                title: 'Policy, Governance & Sub-National Transformation',
                tag: 'Track 06',
                desc: 'Sub-national tax incentives, digital identity frameworks, state regulatory sandboxes, and commercial court arbitration.'
              }
            ].map((track, idx) => {
              const IconComp = track.icon;
              return (
                <div
                  key={idx}
                  className="p-6 rounded-2xl bg-[#FBF9F5] border border-[#E5DFD5] hover:border-[#00231b]/40 hover:shadow-lg transition-all flex flex-col justify-between group"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="w-11 h-11 rounded-xl bg-white border border-[#E5DFD5] flex items-center justify-center group-hover:bg-[#00231b] group-hover:text-white transition-colors">
                        <IconComp className="w-5 h-5 text-[#00231b] group-hover:text-white" />
                      </div>
                      <span className="text-[11px] font-bold text-[#B45309] bg-[#FEF3C7] px-2.5 py-0.5 rounded-full">
                        {track.tag}
                      </span>
                    </div>

                    <div>
                      <h3 className="text-lg font-bold text-[#00231b] group-hover:text-[#316858] transition-colors">
                        {track.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-[#52605B] mt-2 leading-relaxed">
                        {track.desc}
                      </p>
                    </div>
                  </div>

                  <div className="pt-4 mt-4 border-t border-[#E5DFD5]">
                    <button
                      onClick={onOpenRegistration}
                      className="text-xs font-bold text-[#00231b] hover:text-[#B45309] flex items-center gap-1 cursor-pointer"
                    >
                      <span>Enroll for this track</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 5. SUMMIT 5-DAY SCHEDULE */}
      <section id="bw-agenda" className="py-20 bg-[#FBF9F5] border-b border-[#E5DFD5]">
        <div className="max-w-[1240px] mx-auto px-4 md:px-6">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold text-[#00231b] uppercase tracking-widest bg-[#00231b]/10 px-3 py-1 rounded-full">
              Full Program of Events
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#00231b] mt-3 tracking-tight">
              5 Days of High-Impact Sessions
            </h2>
            <p className="text-sm sm:text-base text-[#52605B] mt-2">
              From high-level policy roundtables to late-night deal rooms and creative tech showcases.
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
              <div className="bg-white rounded-2xl p-6 sm:p-10 border border-[#E5DFD5] shadow-xs max-w-4xl mx-auto">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-[#E5DFD5] gap-3">
                  <div>
                    <span className="text-xs font-bold text-[#B45309] uppercase tracking-wider">
                      {current.date}
                    </span>
                    <h3 className="text-xl sm:text-2xl font-bold text-[#00231b] mt-0.5">
                      {current.title}
                    </h3>
                  </div>
                  <span className="inline-block px-3 py-1 bg-[#FEF3C7] text-[#B45309] font-bold text-xs rounded-full">
                    {current.theme}
                  </span>
                </div>

                <div className="divide-y divide-[#E5DFD5] mt-4">
                  {current.events.map((evt, idx) => (
                    <div key={idx} className="py-4.5 flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                      <div className="sm:w-32 shrink-0">
                        <span className="font-mono text-xs sm:text-sm font-bold text-[#00231b] bg-[#F4EFE6] px-2.5 py-1 rounded-md">
                          {evt.time}
                        </span>
                      </div>
                      <div className="flex-1 space-y-1">
                        <h4 className="text-sm sm:text-base font-bold text-[#181d1b]">
                          {evt.title}
                        </h4>
                        <p className="text-xs text-[#52605B] flex items-center gap-1.5">
                          <Users className="w-3.5 h-3.5 text-[#316858]" />
                          <span>Led by: <strong>{evt.speaker}</strong></span>
                        </p>
                      </div>
                      <button
                        onClick={onOpenRegistration}
                        className="text-xs font-semibold text-[#00231b] hover:text-[#B45309] underline shrink-0 cursor-pointer self-start sm:self-center"
                      >
                        Reserve Seat
                      </button>
                    </div>
                  ))}
                </div>

                <div className="pt-6 mt-6 border-t border-[#E5DFD5] flex flex-col sm:flex-row items-center justify-between gap-4">
                  <span className="text-xs text-[#52605B]">
                    Full session briefing packets are emailed to registered delegates upon pass verification.
                  </span>
                  <button
                    onClick={onOpenRegistration}
                    className="px-6 py-2.5 rounded-xl bg-[#00231b] hover:bg-[#0e3a2f] text-white text-xs font-bold transition cursor-pointer"
                  >
                    Register for Day {current.day} Access →
                  </button>
                </div>
              </div>
            );
          })()}
        </div>
      </section>

      {/* 6. SPEAKERS & ECOSYSTEM LEADERS */}
      <section id="bw-speakers" className="py-20 bg-white border-b border-[#E5DFD5]">
        <div className="max-w-[1240px] mx-auto px-4 md:px-6">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-bold text-[#316858] uppercase tracking-widest bg-[#b5efda]/40 px-3 py-1 rounded-full">
              Keynote Faculty & Speakers
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#00231b] mt-3 tracking-tight">
              Ecosystem Titans & Frontier Thinkers
            </h2>
            <p className="text-sm sm:text-base text-[#52605B] mt-2">
              Learn directly from operators who have founded, funded, and scaled high-growth ventures across Nigeria and the diaspora.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                name: 'Dr. Aisosa Edebiri',
                role: 'Managing Partner, Sahara Frontier Capital',
                topic: 'Sub-National Venture Economics & Early-Stage Syndicates',
                image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80'
              },
              {
                name: 'Osagie Egharevba',
                role: 'Founder & CEO, Benin Mobility Tech',
                topic: 'Building Clean Transport Infrastructure for Tier-2 Cities',
                image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'
              },
              {
                name: 'Engr. Osayande Ighodaro',
                role: 'Director of Technology, Edo State Innovation Hub',
                topic: 'Bridging Academic Research & High-Growth Commercial Startups',
                image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80'
              },
              {
                name: 'Nosa Igiehon',
                role: 'Principal, Great Benin Creative Fund',
                topic: 'Commercialising African Cultural IP and Digital Media',
                image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80'
              }
            ].map((spk, idx) => (
              <div key={idx} className="bg-[#FBF9F5] rounded-2xl overflow-hidden border border-[#E5DFD5] shadow-xs flex flex-col justify-between">
                <div className="relative h-60 overflow-hidden bg-slate-200">
                  <img
                    src={spk.image}
                    alt={spk.name}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#00231b]/90 via-transparent to-transparent" />
                  <div className="absolute bottom-3 left-4 right-4 text-white">
                    <h3 className="font-bold text-base">{spk.name}</h3>
                    <p className="text-[11px] text-[#b5efda] font-medium">{spk.role}</p>
                  </div>
                </div>

                <div className="p-4 space-y-2">
                  <span className="text-[10px] font-bold text-[#B45309] uppercase tracking-wider block">
                    Session Keynote
                  </span>
                  <p className="text-xs text-[#181d1b] font-medium leading-relaxed">
                    "{spk.topic}"
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. VENUE & HOST CITY SECTION */}
      <section id="bw-venue" className="py-20 bg-[#FBF9F5] border-b border-[#E5DFD5]">
        <div className="max-w-[1240px] mx-auto px-4 md:px-6">
          <div className="bg-white rounded-3xl p-6 sm:p-12 border border-[#E5DFD5] shadow-xs">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
              <div className="lg:col-span-6 space-y-5">
                <span className="text-xs font-bold text-[#B45309] uppercase tracking-widest bg-[#FEF3C7] px-3 py-1 rounded-full">
                  Host City & Venue
                </span>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-[#00231b] tracking-tight">
                  Victor Uwaifo Creative Hub & Edo Innovates Campus
                </h2>
                <p className="text-sm sm:text-base text-[#52605B] leading-relaxed">
                  Located along Airport Road in the cultural heart of Benin City, the Victor Uwaifo Creative Hub features state-of-the-art auditorium facilities, acoustic breakout halls, high-speed fiber connectivity, and outdoor networking plazas.
                </p>

                <div className="space-y-3 pt-2 text-xs sm:text-sm text-[#181d1b]">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[#F4EFE6] flex items-center justify-center shrink-0">
                      <MapPin className="w-4 h-4 text-[#00231b]" />
                    </div>
                    <span>Airport Road, GRA, Benin City, Edo State, Nigeria</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[#F4EFE6] flex items-center justify-center shrink-0">
                      <ShieldCheck className="w-4 h-4 text-emerald-700" />
                    </div>
                    <span>Full Security Perimeter & Dedicated Accreditation Desks</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[#F4EFE6] flex items-center justify-center shrink-0">
                      <Rocket className="w-4 h-4 text-[#B45309]" />
                    </div>
                    <span>Official Airport Shuttle Services for Confirmed Delegates</span>
                  </div>
                </div>

                <div className="pt-4 flex items-center gap-4">
                  <button
                    onClick={onOpenRegistration}
                    className="px-6 py-3 rounded-xl bg-[#00231b] hover:bg-[#0e3a2f] text-white text-xs sm:text-sm font-bold transition cursor-pointer"
                  >
                    Register for Live Physical Pass
                  </button>
                  <button
                    onClick={onOpenRegistration}
                    className="px-5 py-3 rounded-xl bg-white hover:bg-[#F4EFE6] text-[#00231b] border border-[#C8BFB0] text-xs sm:text-sm font-semibold transition cursor-pointer"
                  >
                    Virtual Global Stream Pass
                  </button>
                </div>
              </div>

              <div className="lg:col-span-6 relative rounded-2xl overflow-hidden shadow-lg border border-[#E5DFD5] h-80 sm:h-96">
                <img
                  src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1200&q=80"
                  alt="Victor Uwaifo Hub Auditorium"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#00231b]/80 via-transparent to-transparent flex items-end p-6">
                  <div className="text-white">
                    <span className="text-xs uppercase font-bold text-[#FEF3C7] tracking-wider">Main Plenary Hall</span>
                    <h3 className="text-xl font-bold">Victor Uwaifo Creative Hub Auditorium</h3>
                    <p className="text-xs text-slate-200 mt-1">Hosting opening keynotes, the ₦50M deal pitches, and gala night.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. FAQS */}
      <section id="bw-faq" className="py-20 bg-white border-b border-[#E5DFD5]">
        <div className="max-w-[900px] mx-auto px-4 md:px-6">
          <div className="text-center max-w-xl mx-auto mb-12">
            <span className="text-xs font-bold text-[#00231b] uppercase tracking-widest bg-[#00231b]/10 px-3 py-1 rounded-full">
              Frequently Asked Questions
            </span>
            <h2 className="text-3xl font-extrabold text-[#00231b] mt-3 tracking-tight">
              Everything You Need to Know
            </h2>
          </div>

          <div className="space-y-4">
            {[
              {
                q: 'Is registration free for participants?',
                a: 'Standard physical delegate accreditation and virtual global streaming are completely free for accepted participants, supported by the Edo State Innovation Network and Benin Tech Fest.'
              },
              {
                q: 'How do I pitch my company in the ₦50M Deal Syndicate room?',
                a: 'During the registration process, check the "Startup Pitch Applications & Investor Deal Rooms" box in Section C. Shortlisted founders are contacted by the investment committee for deck review.'
              },
              {
                q: 'What is the relationship between Óghowa Business Week and Óghowa Accelerator?',
                a: 'Óghowa Accelerator is the parent venture-building ecosystem that funds and builds startups year-round. Óghowa Business Week is our annual flagship conference convening the wider African innovation and investment community.'
              },
              {
                q: 'Can international delegates participate virtually?',
                a: 'Yes. All keynote debates and masterclasses are streamed live with interactive Q&A and virtual networking lounges for global delegates.'
              }
            ].map((faq, idx) => (
              <div key={idx} className="p-5 rounded-2xl bg-[#FBF9F5] border border-[#E5DFD5] space-y-2">
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

      {/* 9. PRE-FOOTER CALL TO ACTION */}
      <section className="py-16 sm:py-20 bg-gradient-to-r from-[#00231b] via-[#0e3a2f] to-[#00231b] text-white">
        <div className="max-w-[1000px] mx-auto px-4 text-center space-y-6">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-[#FEF3C7] text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Join 2,500+ Innovators in Benin City</span>
          </span>

          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
            Ready to Accelerate Your Venture or Network with African Giants?
          </h2>

          <p className="text-sm sm:text-base text-[#eaefeb] max-w-xl mx-auto leading-relaxed">
            Enroll today for Óghowa Business Week 2026. Secure your accreditation badge and receive full masterclass timetables.
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
              <span>Explore Mother Accelerator</span>
            </button>
          </div>
        </div>
      </section>

      {/* 10. DEDICATED BUSINESS WEEK FOOTER */}
      <footer className="w-full bg-[#F4EFE6] py-12 border-t border-[#E5DFD5]">
        <div className="max-w-[1240px] mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-[#E5DFD5]">
            <div className="md:col-span-2 space-y-4">
              <div className="flex items-center gap-2">
                <BusinessWeekLogo size="md" />
              </div>
              <p className="text-xs sm:text-sm text-[#52605B] max-w-md leading-relaxed">
                Óghowa Business Week is West Africa's frontline venture, tech, and economic policy summit, powered in direct institutional collaboration with Benin Tech Fest & Edo State Innovation Network.
              </p>
              <div className="flex items-center gap-2 text-xs text-[#316858] font-bold">
                <ShieldCheck className="w-4 h-4" />
                <span>Victor Uwaifo Creative Hub & Edo Innovates, Airport Road, Benin City</span>
              </div>
            </div>

            <div>
              <h4 className="text-xs font-bold text-[#00231b] uppercase tracking-wider mb-3">
                Summit Navigation
              </h4>
              <ul className="space-y-2 text-xs text-[#52605B]">
                <li><button onClick={() => scrollToSection('bw-overview')} className="hover:text-[#00231b]">Summit Overview</button></li>
                <li><button onClick={() => scrollToSection('bw-tracks')} className="hover:text-[#00231b]">Thematic Tracks</button></li>
                <li><button onClick={() => scrollToSection('bw-speakers')} className="hover:text-[#00231b]">Keynote Speakers</button></li>
                <li><button onClick={() => scrollToSection('bw-agenda')} className="hover:text-[#00231b]">5-Day Program</button></li>
                <li><button onClick={onOpenRegistration} className="text-[#B45309] font-bold hover:underline">Delegate Registration</button></li>
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-bold text-[#00231b] uppercase tracking-wider mb-3">
                Ecosystem & Mother Group
              </h4>
              <ul className="space-y-2 text-xs text-[#52605B]">
                <li><button onClick={onBackToAccelerator} className="hover:text-[#00231b]">Óghowa Accelerator Homepage</button></li>
                <li><button onClick={onOpenApply} className="hover:text-[#00231b]">Cohort 2026 Founder Applications</button></li>
                <li><span className="text-[#52605B]">In Collaboration with Benin Tech Fest</span></li>
                <li><span className="text-[#52605B]">Edo State Innovation Network</span></li>
              </ul>
            </div>
          </div>

          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#52605B]">
            <p>© 2026 Óghowa Business Week. All rights reserved.</p>
            <div className="flex items-center gap-4">
              <button onClick={onOpenRegistration} className="hover:text-[#00231b] font-bold">
                Register for Summit
              </button>
              <span>•</span>
              <button onClick={onBackToAccelerator} className="hover:text-[#00231b]">
                Back to Accelerator
              </button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
