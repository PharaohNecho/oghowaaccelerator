import React, { useState, useRef, useEffect } from 'react';
import {
  Compass,
  Sparkles,
  Rocket,
  ChevronDown,
  Menu,
  X,
  Layers,
  Award,
  Building,
  TrendingUp,
  Cpu,
  GraduationCap,
  Calendar,
  FileText,
  Users,
  ArrowRight
} from 'lucide-react';
import { OghowaLogo } from './OghowaLogo';

interface NavbarProps {
  activeView: 'home' | 'apply' | 'dashboard' | 'admin' | 'mentors' | 'news' | 'business-week' | 'business-week-register';
  setActiveView: (view: 'home' | 'apply' | 'dashboard' | 'admin' | 'mentors' | 'news' | 'business-week' | 'business-week-register') => void;
  onOpenApply: () => void;
  onOpenAuth: () => void;
  currentUser?: {
    name: string;
    email: string;
    role: string;
  } | null;
  appStatus?: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeView,
  setActiveView,
  onOpenApply,
  onOpenAuth,
  currentUser,
  appStatus
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [mobileAccordion, setMobileAccordion] = useState<string | null>(null);
  const navRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const scrollToSection = (sectionId: string) => {
    setActiveView('home');
    setActiveDropdown(null);
    setMobileMenuOpen(false);
    setTimeout(() => {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  const toggleMobileAccordion = (section: string) => {
    setMobileAccordion(mobileAccordion === section ? null : section);
  };

  return (
    <>
      {/* 1. TOP ANNOUNCEMENT & UTILITY BAR (Clean, no superadmin login shown to visitors) */}
      <div className="bg-[#061224] text-xs text-slate-300 py-2 px-4 border-b border-slate-800 relative z-50">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-2">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-semibold text-white">Cohort 2026 Applications Open:</span>
            <span className="text-slate-400 hidden sm:inline">
              Up to ₦25,000,000 in equity-free capital & venture backing.
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                setActiveView('business-week');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="hover:text-amber-200 text-amber-300 font-bold transition-colors flex items-center gap-1.5 cursor-pointer bg-amber-950/60 px-3 py-0.5 rounded-full border border-amber-500/40 text-[11px]"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
              <span>Óghowa Business Week 2026</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. MAIN HEADER NAVIGATION WITH RICH DROPDOWNS */}
      <header ref={navRef} className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Brand Logo */}
            <button
              onClick={() => {
                setActiveView('home');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="flex items-center group text-left focus:outline-hidden cursor-pointer hover:opacity-90 transition-opacity"
            >
              <OghowaLogo size="md" />
            </button>

            {/* Desktop Navigation Links with Rich Dropdowns */}
            <nav className="hidden lg:flex items-center space-x-1 font-medium text-slate-700 text-sm">
              {/* Programs Dropdown */}
              <div
                className="relative"
                onMouseEnter={() => setActiveDropdown('programs')}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <button
                  onClick={() => scrollToSection('platforms')}
                  className={`px-3 py-2 rounded-lg flex items-center gap-1 transition-colors cursor-pointer ${
                    activeDropdown === 'programs' ? 'text-rose-600 bg-rose-50/50' : 'hover:text-rose-600'
                  }`}
                >
                  <span>Programs</span>
                  <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${activeDropdown === 'programs' ? 'rotate-180 text-rose-600' : 'text-slate-400'}`} />
                </button>

                {activeDropdown === 'programs' && (
                  <div className="absolute top-full left-0 w-80 bg-white rounded-2xl shadow-xl border border-slate-200/90 py-3 px-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                    <button
                      onClick={() => scrollToSection('platforms')}
                      className="w-full text-left p-3 rounded-xl hover:bg-slate-50 transition flex items-start gap-3 group cursor-pointer"
                    >
                      <div className="w-9 h-9 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center shrink-0 group-hover:bg-rose-600 group-hover:text-white transition">
                        <Rocket className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-900 group-hover:text-rose-600 transition">Incubation & Venture Studio</p>
                        <p className="text-[11px] text-slate-500 mt-0.5">Ideation, entity formation and rapid MVP sprint</p>
                      </div>
                    </button>

                    <button
                      onClick={() => scrollToSection('platforms')}
                      className="w-full text-left p-3 rounded-xl hover:bg-slate-50 transition flex items-start gap-3 group cursor-pointer"
                    >
                      <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 group-hover:bg-blue-600 group-hover:text-white transition">
                        <TrendingUp className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-900 group-hover:text-rose-600 transition">Acceleration & Scale</p>
                        <p className="text-[11px] text-slate-500 mt-0.5">Traction, customer acquisition & hiring infrastructure</p>
                      </div>
                    </button>

                    <button
                      onClick={() => scrollToSection('platforms')}
                      className="w-full text-left p-3 rounded-xl hover:bg-slate-50 transition flex items-start gap-3 group cursor-pointer"
                    >
                      <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 group-hover:bg-emerald-600 group-hover:text-white transition">
                        <Award className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-900 group-hover:text-rose-600 transition">Capital & Deal Syndicate</p>
                        <p className="text-[11px] text-slate-500 mt-0.5">Up to ₦25,000,000 in equity-free capital & investor matching</p>
                      </div>
                    </button>

                    <button
                      onClick={() => scrollToSection('platforms')}
                      className="w-full text-left p-3 rounded-xl hover:bg-slate-50 transition flex items-start gap-3 group cursor-pointer"
                    >
                      <div className="w-9 h-9 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center shrink-0 group-hover:bg-purple-600 group-hover:text-white transition">
                        <Building className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-900 group-hover:text-rose-600 transition">Corporate Innovation & Pilots</p>
                        <p className="text-[11px] text-slate-500 mt-0.5">Connecting startups with enterprise real-sector partners</p>
                      </div>
                    </button>
                  </div>
                )}
              </div>

              {/* Ecosystem Dropdown */}
              <div
                className="relative"
                onMouseEnter={() => setActiveDropdown('ecosystem')}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <button
                  onClick={() => scrollToSection('ecosystem')}
                  className={`px-3 py-2 rounded-lg flex items-center gap-1 transition-colors cursor-pointer ${
                    activeDropdown === 'ecosystem' ? 'text-rose-600 bg-rose-50/50' : 'hover:text-rose-600'
                  }`}
                >
                  <span>Ecosystem</span>
                  <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${activeDropdown === 'ecosystem' ? 'rotate-180 text-rose-600' : 'text-slate-400'}`} />
                </button>

                {activeDropdown === 'ecosystem' && (
                  <div className="absolute top-full left-0 w-80 bg-white rounded-2xl shadow-xl border border-slate-200/90 py-3 px-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                    <button
                      onClick={() => scrollToSection('ecosystem')}
                      className="w-full text-left p-3 rounded-xl hover:bg-slate-50 transition flex items-start gap-3 group cursor-pointer"
                    >
                      <div className="w-9 h-9 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center shrink-0 group-hover:bg-rose-600 group-hover:text-white transition">
                        <Users className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-900 group-hover:text-rose-600 transition">Who We Serve</p>
                        <p className="text-[11px] text-slate-500 mt-0.5">Founders, Investors, Corporates, Government & Universities</p>
                      </div>
                    </button>

                    <button
                      onClick={() => {
                        setActiveView('mentors');
                        setActiveDropdown(null);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="w-full text-left p-3 rounded-xl hover:bg-slate-50 transition flex items-start gap-3 group cursor-pointer"
                    >
                      <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 group-hover:bg-blue-600 group-hover:text-white transition">
                        <GraduationCap className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-900 group-hover:text-rose-600 transition">Mentors Network</p>
                        <p className="text-[11px] text-slate-500 mt-0.5">40+ vetted venture partners, CTOs, and proven founders</p>
                      </div>
                    </button>

                    <button
                      onClick={() => scrollToSection('infrastructure')}
                      className="w-full text-left p-3 rounded-xl hover:bg-slate-50 transition flex items-start gap-3 group cursor-pointer"
                    >
                      <div className="w-9 h-9 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 group-hover:bg-amber-600 group-hover:text-white transition">
                        <Cpu className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-900 group-hover:text-rose-600 transition">Innovation Infrastructure</p>
                        <p className="text-[11px] text-slate-500 mt-0.5">Physical hubs, sovereign cloud stack & engineering labs</p>
                      </div>
                    </button>

                    <button
                      onClick={() => scrollToSection('partners')}
                      className="w-full text-left p-3 rounded-xl hover:bg-slate-50 transition flex items-start gap-3 group cursor-pointer"
                    >
                      <div className="w-9 h-9 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center shrink-0 group-hover:bg-teal-600 group-hover:text-white transition">
                        <Building className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-900 group-hover:text-rose-600 transition">Strategic Partners</p>
                        <p className="text-[11px] text-slate-500 mt-0.5">Edo Innovates, Bank of Industry, MDEST & Gates Foundation</p>
                      </div>
                    </button>
                  </div>
                )}
              </div>

              {/* Our Portfolio Dropdown (Explicitly named Our Portfolio Companies) */}
              <div
                className="relative"
                onMouseEnter={() => setActiveDropdown('portfolio')}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <button
                  onClick={() => scrollToSection('ventures')}
                  className={`px-3 py-2 rounded-lg flex items-center gap-1 transition-colors cursor-pointer ${
                    activeDropdown === 'portfolio' ? 'text-rose-600 bg-rose-50/50' : 'hover:text-rose-600'
                  }`}
                >
                  <span>Our Portfolio</span>
                  <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${activeDropdown === 'portfolio' ? 'rotate-180 text-rose-600' : 'text-slate-400'}`} />
                </button>

                {activeDropdown === 'portfolio' && (
                  <div className="absolute top-full left-0 w-80 bg-white rounded-2xl shadow-xl border border-slate-200/90 py-3 px-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                    <button
                      onClick={() => scrollToSection('ventures')}
                      className="w-full text-left p-3 rounded-xl hover:bg-slate-50 transition flex items-start gap-3 group cursor-pointer"
                    >
                      <div className="w-9 h-9 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center shrink-0 group-hover:bg-rose-600 group-hover:text-white transition">
                        <Layers className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-900 group-hover:text-rose-600 transition">All Portfolio Companies</p>
                        <p className="text-[11px] text-slate-500 mt-0.5">Explore our backed ventures driving African transformation</p>
                      </div>
                    </button>

                    <button
                      onClick={() => scrollToSection('ventures')}
                      className="w-full text-left p-3 rounded-xl hover:bg-slate-50 transition flex items-start gap-3 group cursor-pointer"
                    >
                      <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 group-hover:bg-blue-600 group-hover:text-white transition">
                        <GraduationCap className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-900 group-hover:text-rose-600 transition">EdTech: Ugbekun SMP & MyEduRide</p>
                        <p className="text-[11px] text-slate-500 mt-0.5">Transforming school management & student transportation</p>
                      </div>
                    </button>

                    <button
                      onClick={() => scrollToSection('ventures')}
                      className="w-full text-left p-3 rounded-xl hover:bg-slate-50 transition flex items-start gap-3 group cursor-pointer"
                    >
                      <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 group-hover:bg-emerald-600 group-hover:text-white transition">
                        <Sparkles className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-900 group-hover:text-rose-600 transition">HealthTech: Cyona Medicare</p>
                        <p className="text-[11px] text-slate-500 mt-0.5">Digital clinical triage, health records & telemedicine</p>
                      </div>
                    </button>
                  </div>
                )}
              </div>

              {/* Events Dropdown */}
              <div
                className="relative"
                onMouseEnter={() => setActiveDropdown('events')}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <button
                  onClick={() => scrollToSection('events')}
                  className={`px-3 py-2 rounded-lg flex items-center gap-1 transition-colors cursor-pointer ${
                    activeDropdown === 'events' ? 'text-rose-600 bg-rose-50/50' : 'hover:text-rose-600'
                  }`}
                >
                  <span>Events</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse ml-0.5" />
                  <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${activeDropdown === 'events' ? 'rotate-180 text-rose-600' : 'text-slate-400'}`} />
                </button>

                {activeDropdown === 'events' && (
                  <div className="absolute top-full left-0 w-84 bg-white rounded-2xl shadow-xl border border-slate-200/90 py-3 px-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                    <button
                      onClick={() => {
                        setActiveView('business-week');
                        setActiveDropdown(null);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="w-full text-left p-3 rounded-xl bg-amber-50/80 hover:bg-amber-100/80 transition flex items-start gap-3 group cursor-pointer border border-amber-200/60 mb-1"
                    >
                      <div className="w-9 h-9 rounded-lg bg-amber-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                        <Calendar className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <p className="text-xs font-bold text-slate-900 group-hover:text-amber-800 transition">Óghowa Business Week 2026</p>
                          <span className="px-1.5 py-0.2 bg-amber-200 text-amber-900 text-[9px] font-bold rounded-sm">FLAGSHIP</span>
                        </div>
                        <p className="text-[11px] text-amber-800 mt-0.5">November 16–21, 2026 • Innovation for Economic Transformation</p>
                      </div>
                    </button>

                    <button
                      onClick={() => scrollToSection('events')}
                      className="w-full text-left p-3 rounded-xl hover:bg-slate-50 transition flex items-start gap-3 group cursor-pointer"
                    >
                      <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 group-hover:bg-blue-600 group-hover:text-white transition">
                        <Award className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-900 group-hover:text-rose-600 transition">Demo Day & Syndicate Pitches</p>
                        <p className="text-[11px] text-slate-500 mt-0.5">Pre-screened cohort startups pitch directly to investors</p>
                      </div>
                    </button>

                    <button
                      onClick={() => scrollToSection('events')}
                      className="w-full text-left p-3 rounded-xl hover:bg-slate-50 transition flex items-start gap-3 group cursor-pointer"
                    >
                      <div className="w-9 h-9 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center shrink-0 group-hover:bg-rose-600 group-hover:text-white transition">
                        <Building className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-900 group-hover:text-rose-600 transition">Corporate Governance & Legal Clinics</p>
                        <p className="text-[11px] text-slate-500 mt-0.5">Investor readiness, cap-table diligence and compliance</p>
                      </div>
                    </button>
                  </div>
                )}
              </div>

              {/* About Dropdown (Clean, no superadmin link) */}
              <div
                className="relative"
                onMouseEnter={() => setActiveDropdown('about')}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <button
                  onClick={() => scrollToSection('about')}
                  className={`px-3 py-2 rounded-lg flex items-center gap-1 transition-colors cursor-pointer ${
                    activeDropdown === 'about' ? 'text-rose-600 bg-rose-50/50' : 'hover:text-rose-600'
                  }`}
                >
                  <span>About</span>
                  <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${activeDropdown === 'about' ? 'rotate-180 text-rose-600' : 'text-slate-400'}`} />
                </button>

                {activeDropdown === 'about' && (
                  <div className="absolute top-full left-0 w-80 bg-white rounded-2xl shadow-xl border border-slate-200/90 py-3 px-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                    <button
                      onClick={() => scrollToSection('journey')}
                      className="w-full text-left p-3 rounded-xl hover:bg-slate-50 transition flex items-start gap-3 group cursor-pointer"
                    >
                      <div className="w-9 h-9 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center shrink-0 group-hover:bg-rose-600 group-hover:text-white transition">
                        <Compass className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-900 group-hover:text-rose-600 transition">The Óghowa Journey</p>
                        <p className="text-[11px] text-slate-500 mt-0.5">Discover, Build, Validate, and Fund bold African ideas</p>
                      </div>
                    </button>

                    <button
                      onClick={() => {
                        setActiveView('news');
                        setActiveDropdown(null);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="w-full text-left p-3 rounded-xl hover:bg-slate-50 transition flex items-start gap-3 group cursor-pointer"
                    >
                      <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 group-hover:bg-blue-600 group-hover:text-white transition">
                        <FileText className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-900 group-hover:text-rose-600 transition">News & Press Releases</p>
                        <p className="text-[11px] text-slate-500 mt-0.5">Latest announcements, cohort milestones and ecosystem updates</p>
                      </div>
                    </button>
                  </div>
                )}
              </div>
            </nav>

            {/* Action CTAs: Óghowa Business Week & Join Cohort 2026 (No demo user profile shown) */}
            <div className="hidden sm:flex items-center space-x-3">
              <button
                onClick={() => {
                  setActiveView('business-week');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="px-3.5 py-2.5 rounded-xl text-xs font-bold bg-[#0B1E48] hover:bg-[#061224] text-white border border-blue-400/30 shadow-xs transition flex items-center gap-1.5 cursor-pointer"
              >
                <Calendar className="w-3.5 h-3.5 text-amber-300" />
                <span>Óghowa Business Week</span>
              </button>

              <button
                onClick={() => {
                  setActiveView('apply');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="px-5 py-2.5 text-xs font-bold text-white bg-[#DC2626] hover:bg-[#B91C1C] active:scale-98 rounded-xl shadow-md shadow-rose-900/20 hover:shadow-lg transition-all flex items-center space-x-1.5 cursor-pointer"
              >
                <span>Join Cohort 2026</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Mobile Menu Hamburger Button */}
            <div className="flex lg:hidden items-center gap-2">
              <button
                onClick={() => {
                  setActiveView('business-week');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="px-2.5 py-1.5 rounded-lg text-xs font-bold bg-[#0B1E48] text-white flex items-center gap-1"
              >
                <span>Business Week</span>
              </button>

              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-xl text-slate-700 hover:text-slate-900 hover:bg-slate-100 focus:outline-hidden transition cursor-pointer"
                aria-label="Toggle mobile navigation menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* 3. MOBILE MENU DRAWER (Accordion Dropdowns, completely removed from visitors' eyes) */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white border-t border-slate-200 shadow-2xl animate-in slide-in-from-top-4 duration-200 max-h-[85vh] overflow-y-auto">
            <div className="px-4 pt-3 pb-6 space-y-2">
              {/* Programs Accordion */}
              <div className="border-b border-slate-100 pb-2">
                <button
                  onClick={() => toggleMobileAccordion('programs')}
                  className="w-full flex items-center justify-between py-2 text-sm font-bold text-slate-800"
                >
                  <span>Programs</span>
                  <ChevronDown className={`w-4 h-4 transition-transform ${mobileAccordion === 'programs' ? 'rotate-180 text-rose-600' : 'text-slate-400'}`} />
                </button>
                {mobileAccordion === 'programs' && (
                  <div className="pl-3 py-1 space-y-1.5 bg-slate-50/70 rounded-xl mt-1 text-xs text-slate-600">
                    <button onClick={() => scrollToSection('platforms')} className="block w-full text-left py-1.5 font-medium hover:text-rose-600">
                      • Incubation & Venture Studio
                    </button>
                    <button onClick={() => scrollToSection('platforms')} className="block w-full text-left py-1.5 font-medium hover:text-rose-600">
                      • Acceleration & Scale
                    </button>
                    <button onClick={() => scrollToSection('platforms')} className="block w-full text-left py-1.5 font-medium hover:text-rose-600">
                      • Capital & Deal Syndicate (₦25M)
                    </button>
                    <button onClick={() => scrollToSection('platforms')} className="block w-full text-left py-1.5 font-medium hover:text-rose-600">
                      • Corporate Innovation & Pilots
                    </button>
                  </div>
                )}
              </div>

              {/* Ecosystem Accordion */}
              <div className="border-b border-slate-100 pb-2">
                <button
                  onClick={() => toggleMobileAccordion('ecosystem')}
                  className="w-full flex items-center justify-between py-2 text-sm font-bold text-slate-800"
                >
                  <span>Ecosystem</span>
                  <ChevronDown className={`w-4 h-4 transition-transform ${mobileAccordion === 'ecosystem' ? 'rotate-180 text-rose-600' : 'text-slate-400'}`} />
                </button>
                {mobileAccordion === 'ecosystem' && (
                  <div className="pl-3 py-1 space-y-1.5 bg-slate-50/70 rounded-xl mt-1 text-xs text-slate-600">
                    <button onClick={() => scrollToSection('ecosystem')} className="block w-full text-left py-1.5 font-medium hover:text-rose-600">
                      • Who We Serve
                    </button>
                    <button
                      onClick={() => {
                        setActiveView('mentors');
                        setMobileMenuOpen(false);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="block w-full text-left py-1.5 font-medium hover:text-rose-600"
                    >
                      • Mentors Network
                    </button>
                    <button onClick={() => scrollToSection('infrastructure')} className="block w-full text-left py-1.5 font-medium hover:text-rose-600">
                      • Innovation Infrastructure
                    </button>
                    <button onClick={() => scrollToSection('partners')} className="block w-full text-left py-1.5 font-medium hover:text-rose-600">
                      • Strategic Partners
                    </button>
                  </div>
                )}
              </div>

              {/* Our Portfolio Accordion */}
              <div className="border-b border-slate-100 pb-2">
                <button
                  onClick={() => toggleMobileAccordion('portfolio')}
                  className="w-full flex items-center justify-between py-2 text-sm font-bold text-slate-800"
                >
                  <span>Our Portfolio</span>
                  <ChevronDown className={`w-4 h-4 transition-transform ${mobileAccordion === 'portfolio' ? 'rotate-180 text-rose-600' : 'text-slate-400'}`} />
                </button>
                {mobileAccordion === 'portfolio' && (
                  <div className="pl-3 py-1 space-y-1.5 bg-slate-50/70 rounded-xl mt-1 text-xs text-slate-600">
                    <button onClick={() => scrollToSection('ventures')} className="block w-full text-left py-1.5 font-medium hover:text-rose-600">
                      • All Portfolio Companies
                    </button>
                    <button onClick={() => scrollToSection('ventures')} className="block w-full text-left py-1.5 font-medium hover:text-rose-600">
                      • EdTech: Ugbekun SMP & MyEduRide
                    </button>
                    <button onClick={() => scrollToSection('ventures')} className="block w-full text-left py-1.5 font-medium hover:text-rose-600">
                      • HealthTech: Cyona Medicare
                    </button>
                  </div>
                )}
              </div>

              {/* Events Accordion */}
              <div className="border-b border-slate-100 pb-2">
                <button
                  onClick={() => toggleMobileAccordion('events')}
                  className="w-full flex items-center justify-between py-2 text-sm font-bold text-slate-800"
                >
                  <span className="flex items-center gap-1.5">
                    <span>Events</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
                  </span>
                  <ChevronDown className={`w-4 h-4 transition-transform ${mobileAccordion === 'events' ? 'rotate-180 text-rose-600' : 'text-slate-400'}`} />
                </button>
                {mobileAccordion === 'events' && (
                  <div className="pl-3 py-1 space-y-1.5 bg-slate-50/70 rounded-xl mt-1 text-xs text-slate-600">
                    <button
                      onClick={() => {
                        setActiveView('business-week');
                        setMobileMenuOpen(false);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="block w-full text-left py-1.5 font-bold text-[#0B1E48] hover:text-rose-600"
                    >
                      ★ Óghowa Business Week 2026 (Nov 16–21)
                    </button>
                    <button onClick={() => scrollToSection('events')} className="block w-full text-left py-1.5 font-medium hover:text-rose-600">
                      • Demo Day & Syndicate Pitches
                    </button>
                    <button onClick={() => scrollToSection('events')} className="block w-full text-left py-1.5 font-medium hover:text-rose-600">
                      • Corporate Governance & Legal Clinics
                    </button>
                  </div>
                )}
              </div>

              {/* About Accordion */}
              <div className="border-b border-slate-100 pb-2">
                <button
                  onClick={() => toggleMobileAccordion('about')}
                  className="w-full flex items-center justify-between py-2 text-sm font-bold text-slate-800"
                >
                  <span>About</span>
                  <ChevronDown className={`w-4 h-4 transition-transform ${mobileAccordion === 'about' ? 'rotate-180 text-rose-600' : 'text-slate-400'}`} />
                </button>
                {mobileAccordion === 'about' && (
                  <div className="pl-3 py-1 space-y-1.5 bg-slate-50/70 rounded-xl mt-1 text-xs text-slate-600">
                    <button onClick={() => scrollToSection('journey')} className="block w-full text-left py-1.5 font-medium hover:text-rose-600">
                      • The Óghowa Journey
                    </button>
                    <button
                      onClick={() => {
                        setActiveView('news');
                        setMobileMenuOpen(false);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="block w-full text-left py-1.5 font-medium hover:text-rose-600"
                    >
                      • News & Press Releases
                    </button>
                  </div>
                )}
              </div>

              {/* Action Buttons in Mobile Drawer */}
              <div className="pt-4 space-y-2.5">
                <button
                  onClick={() => {
                    setActiveView('business-week');
                    setMobileMenuOpen(false);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="w-full py-3 rounded-xl bg-[#0B1E48] hover:bg-[#061224] text-white font-bold text-xs shadow-md flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Calendar className="w-4 h-4 text-amber-300" />
                  <span>Óghowa Business Week 2026 Portal</span>
                </button>

                <button
                  onClick={() => {
                    setActiveView('apply');
                    setMobileMenuOpen(false);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="w-full py-3 rounded-xl bg-[#DC2626] hover:bg-[#B91C1C] text-white font-bold text-xs shadow-md flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Apply for Cohort 2026</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}
      </header>
    </>
  );
};
