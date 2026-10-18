import React from 'react';
import { ShieldAlert, Compass, Sparkles, Rocket, Clock, User } from 'lucide-react';
import { OghowaLogo } from './OghowaLogo';

interface NavbarProps {
  activeView: 'home' | 'apply' | 'dashboard' | 'admin' | 'mentors' | 'news';
  setActiveView: (view: 'home' | 'apply' | 'dashboard' | 'admin' | 'mentors' | 'news') => void;
  onOpenApply: () => void;
  onOpenAuth: () => void;
  currentUser: {
    name: string;
    email: string;
    role: string;
  };
  appStatus: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeView,
  setActiveView,
  onOpenApply,
  onOpenAuth,
  currentUser,
  appStatus
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const scrollToSection = (sectionId: string) => {
    setActiveView('home');
    setMobileMenuOpen(false);
    setTimeout(() => {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  return (
    <>
      {/* 1. TOP ANNOUNCEMENT & SYSTEM BAR */}
      <div className="bg-[#061224] text-xs text-slate-300 py-2 px-4 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-2">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-semibold text-white">Cohort 2026 Applications Open:</span>
            <span className="text-slate-400 hidden sm:inline">
              Up to ₦25,000,000 in equity-free capital & venture backing.
            </span>
          </div>

          <div className="flex items-center gap-3 sm:gap-4">
            <button
              onClick={() => setActiveView('admin')}
              className={`hover:text-rose-400 transition-colors flex items-center gap-1.5 cursor-pointer ${
                activeView === 'admin' ? 'text-rose-400 font-bold' : 'text-slate-400'
              }`}
            >
              <ShieldAlert className="w-3.5 h-3.5 text-rose-500" />
              <span>Superadmin Portal</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. MAIN HEADER NAVIGATION (Matching Exact Reference with Uploaded Logo) */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Uploaded Logo for Óghowa */}
            <button
              onClick={() => setActiveView('home')}
              className="flex items-center group text-left focus:outline-hidden cursor-pointer hover:opacity-90 transition-opacity"
            >
              <OghowaLogo size="md" />
            </button>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center space-x-7 text-sm font-medium text-slate-700">
              <button
                onClick={() => scrollToSection('platforms')}
                className="hover:text-rose-600 transition-colors cursor-pointer"
              >
                Programs
              </button>
              <button
                onClick={() => scrollToSection('ecosystem')}
                className="hover:text-rose-600 transition-colors cursor-pointer"
              >
                Ecosystem
              </button>
              <button
                onClick={() => scrollToSection('ventures')}
                className="hover:text-rose-600 transition-colors cursor-pointer"
              >
                Ventures
              </button>
              <button
                onClick={() => scrollToSection('platforms')}
                className="hover:text-rose-600 transition-colors cursor-pointer"
              >
                Capital
              </button>
              <button
                onClick={() => scrollToSection('partners')}
                className="hover:text-rose-600 transition-colors cursor-pointer"
              >
                Partners
              </button>
              <button
                onClick={() => scrollToSection('events')}
                className="hover:text-rose-600 transition-colors cursor-pointer flex items-center gap-1"
              >
                <span>Events</span>
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
              </button>
              <button
                onClick={() => setActiveView('mentors')}
                className={`transition-colors cursor-pointer ${
                  activeView === 'mentors' ? 'text-rose-600 font-bold' : 'hover:text-rose-600'
                }`}
              >
                Mentors
              </button>
              <button
                onClick={() => setActiveView('news')}
                className={`transition-colors cursor-pointer ${
                  activeView === 'news' ? 'text-rose-600 font-bold' : 'hover:text-rose-600'
                }`}
              >
                News
              </button>
            </nav>

            {/* Action CTAs: Join Óghowa (Red) & Dashboard */}
            <div className="hidden sm:flex items-center space-x-3">
              <button
                onClick={() => setActiveView('apply')}
                className="px-5 py-2.5 rounded-md text-sm font-semibold bg-[#D82A2A] hover:bg-[#ba2222] active:scale-98 text-white shadow-md shadow-red-500/20 transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Rocket className="w-4 h-4" />
                <span>Join Óghowa</span>
              </button>

              <button
                onClick={() => setActiveView('dashboard')}
                className={`px-4 py-2 rounded-md text-sm font-semibold border transition cursor-pointer ${
                  activeView === 'dashboard'
                    ? 'bg-[#0B1E48] text-white border-[#0B1E48]'
                    : 'border-slate-300 hover:border-slate-400 text-slate-700 bg-slate-50'
                }`}
              >
                Applicant Dashboard
              </button>
            </div>

            {/* Mobile hamburger button */}
            <div className="flex lg:hidden items-center gap-2">
              <button
                onClick={() => setActiveView('apply')}
                className="px-3 py-1.5 text-xs font-semibold text-white bg-[#D82A2A] rounded-md"
              >
                Join
              </button>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 focus:outline-hidden"
                aria-label="Toggle Navigation Menu"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  {mobileMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white border-b border-slate-200 px-4 pt-2 pb-6 space-y-3 shadow-xl">
            <div className="grid grid-cols-2 gap-2 pt-2 pb-3 border-b border-slate-100">
              <button
                onClick={() => { setActiveView('home'); setMobileMenuOpen(false); }}
                className={`p-2.5 rounded-lg text-left text-xs font-bold ${activeView === 'home' ? 'bg-slate-100 text-[#0B1E48]' : 'text-slate-700'}`}
              >
                Home
              </button>
              <button
                onClick={() => { setActiveView('apply'); setMobileMenuOpen(false); }}
                className={`p-2.5 rounded-lg text-left text-xs font-bold ${activeView === 'apply' ? 'bg-rose-50 text-rose-600' : 'text-slate-700'}`}
              >
                Apply to Cohort
              </button>
              <button
                onClick={() => { setActiveView('dashboard'); setMobileMenuOpen(false); }}
                className={`p-2.5 rounded-lg text-left text-xs font-bold ${activeView === 'dashboard' ? 'bg-rose-50 text-rose-600' : 'text-slate-700'}`}
              >
                Applicant Dashboard
              </button>
              <button
                onClick={() => { setActiveView('admin'); setMobileMenuOpen(false); }}
                className={`p-2.5 rounded-lg text-left text-xs font-bold ${activeView === 'admin' ? 'bg-slate-900 text-rose-400' : 'text-slate-700'}`}
              >
                Superadmin Portal
              </button>
              <button
                onClick={() => { setActiveView('mentors'); setMobileMenuOpen(false); }}
                className="p-2.5 rounded-lg text-left text-xs font-bold text-slate-700"
              >
                Mentors
              </button>
              <button
                onClick={() => { setActiveView('news'); setMobileMenuOpen(false); }}
                className="p-2.5 rounded-lg text-left text-xs font-bold text-slate-700"
              >
                News & Feed
              </button>
            </div>

            <div className="space-y-1 text-xs">
              <button
                onClick={() => scrollToSection('platforms')}
                className="w-full text-left px-3 py-2 text-slate-700 hover:bg-slate-50 rounded-md"
              >
                Flagship Platforms
              </button>
              <button
                onClick={() => scrollToSection('ecosystem')}
                className="w-full text-left px-3 py-2 text-slate-700 hover:bg-slate-50 rounded-md"
              >
                Who We Serve
              </button>
              <button
                onClick={() => scrollToSection('events')}
                className="w-full text-left px-3 py-2 text-slate-700 hover:bg-slate-50 rounded-md"
              >
                Business Startup Week Countdown
              </button>
              <button
                onClick={() => scrollToSection('partners')}
                className="w-full text-left px-3 py-2 text-slate-700 hover:bg-slate-50 rounded-md"
              >
                Institutional Partners
              </button>
            </div>
          </div>
        )}
      </header>
    </>
  );
};
