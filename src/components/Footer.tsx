import React, { useState } from 'react';
import { ArrowRight, Linkedin, Twitter, Instagram, Youtube, Mail, MapPin, CheckCircle, Info } from 'lucide-react';
import { OghowaLogo } from './OghowaLogo';

interface FooterProps {
  onOpenApply: () => void;
  onNavigate: (view: 'home' | 'portal' | 'mentors' | 'news' | 'business-week' | 'business-week-register') => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenApply, onNavigate }) => {
  const [partnerNotice, setPartnerNotice] = useState<string>('');

  const showNotice = (msg: string) => {
    setPartnerNotice(msg);
    setTimeout(() => setPartnerNotice(''), 4000);
  };

  return (
    <footer className="bg-[#06142B] text-white relative">
      {/* Non-blocking Notice Toast */}
      {partnerNotice && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#0B1E48] text-white border border-blue-400/40 p-4 rounded-2xl shadow-2xl flex items-center gap-3 max-w-md animate-in slide-in-from-bottom-3 duration-200">
          <Info className="w-5 h-5 text-blue-400 shrink-0" />
          <p className="text-xs text-slate-200 leading-relaxed">{partnerNotice}</p>
        </div>
      )}

      {/* Pre-footer Call to Action matching image banner */}
      <div className="border-b border-white/10 py-16 sm:py-20 bg-gradient-to-r from-[#071733] via-[#091E42] to-[#0A2452]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center sm:text-left flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="max-w-2xl space-y-3">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Africa's Next Great Venture Could Start Here.
            </h2>
            <p className="text-sm sm:text-base text-slate-300 font-normal leading-relaxed">
              Whether you're building a startup, investing in innovation, shaping policy or partnering for impact, Óghowa provides the ecosystem to turn ambition into lasting success.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 shrink-0">
            <button
              onClick={onOpenApply}
              className="px-6 py-3.5 text-sm sm:text-base font-bold text-white bg-[#DC2626] hover:bg-[#B91C1C] rounded-lg shadow-lg shadow-rose-950/40 transition-all flex items-center gap-2 cursor-pointer"
            >
              <span>Join Óghowa</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => showNotice("Thank you for your interest in partnering! Contact partnership@oghowa.africa for institutional collaboration.")}
              className="px-6 py-3.5 text-sm sm:text-base font-medium text-white bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg backdrop-blur-xs transition cursor-pointer"
            >
              <span>Become a Partner</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Col 1: Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="inline-block bg-white px-3.5 py-1.5 rounded-xl shadow-xs">
              <OghowaLogo size="sm" />
            </div>

            <p className="text-xs sm:text-sm text-slate-400 max-w-sm leading-relaxed">
              Óghowa is a venture-building ecosystem that discovers, builds, funds and scales world-class African businesses through frontier innovation, state partnerships, and catalytic capital.
            </p>

            <div className="pt-2 text-xs text-slate-400 space-y-1.5">
              <p className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-rose-400" />
                <span>Benin City, Edo State, Nigeria</span>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-blue-400" />
                <span>ventures@oghowa.africa</span>
              </p>
            </div>
          </div>

          {/* Col 2: Platform */}
          <div>
            <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-4">
              Platform
            </h3>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>
                <button onClick={() => onNavigate('home')} className="hover:text-white transition-colors cursor-pointer">
                  Ecosystem
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('portal')} className="hover:text-white transition-colors cursor-pointer">
                  Programs & Cohorts
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('business-week')} className="hover:text-white transition-colors cursor-pointer text-amber-300 font-semibold">
                  Óghowa Business Week 2026
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('mentors')} className="hover:text-white transition-colors cursor-pointer">
                  Mentors Network
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('portal')} className="hover:text-white transition-colors cursor-pointer">
                  Capital Syndicate
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Resources */}
          <div>
            <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-4">
              Resources
            </h3>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>
                <button onClick={() => onNavigate('news')} className="hover:text-white transition-colors cursor-pointer">
                  Success Stories
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('business-week')} className="hover:text-white transition-colors cursor-pointer">
                  Business Week Events
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('news')} className="hover:text-white transition-colors">
                  News & Insights
                </button>
              </li>
              <li>
                <button
                  onClick={() => showNotice("Óghowa Startup Toolkit: Templates for Financial Models, Term Sheets & SAFE agreements available to cohort founders.")}
                  className="hover:text-white transition-colors text-left"
                >
                  Startup Toolkit
                </button>
              </li>
              <li>
                <button
                  onClick={() => showNotice("FAQ: Applications are rolling. No fee to apply. Both tech and tech-enabled ventures are welcome.")}
                  className="hover:text-white transition-colors text-left"
                >
                  FAQs
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Company & Follow Us */}
          <div>
            <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-4">
              Company
            </h3>
            <ul className="space-y-2.5 text-xs text-slate-400 mb-6">
              <li><button onClick={() => onNavigate('home')} className="hover:text-white transition-colors">About Us</button></li>
              <li><button onClick={() => showNotice("Contact us at contact@oghowa.africa")} className="hover:text-white transition-colors">Contact</button></li>
              <li><button onClick={() => showNotice("Privacy Policy: All startup intellectual property and founder submissions remain 100% strictly confidential.")} className="hover:text-white transition-colors">Privacy Policy</button></li>
              <li><button onClick={() => showNotice("Terms of Use: Powered by Óghowa Accelerator.")} className="hover:text-white transition-colors">Terms of Use</button></li>
            </ul>

            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">
              Follow Us
            </h4>
            <div className="flex items-center gap-2">
              <a href="#linkedin" onClick={(e) => e.preventDefault()} className="w-8 h-8 rounded-lg bg-white/10 hover:bg-[#0077B5] flex items-center justify-center transition-colors">
                <Linkedin className="w-4 h-4 text-white" />
              </a>
              <a href="#twitter" onClick={(e) => e.preventDefault()} className="w-8 h-8 rounded-lg bg-white/10 hover:bg-slate-700 flex items-center justify-center transition-colors">
                <Twitter className="w-4 h-4 text-white" />
              </a>
              <a href="#instagram" onClick={(e) => e.preventDefault()} className="w-8 h-8 rounded-lg bg-white/10 hover:bg-[#E1306C] flex items-center justify-center transition-colors">
                <Instagram className="w-4 h-4 text-white" />
              </a>
              <a href="#youtube" onClick={(e) => e.preventDefault()} className="w-8 h-8 rounded-lg bg-white/10 hover:bg-[#FF0000] flex items-center justify-center transition-colors">
                <Youtube className="w-4 h-4 text-white" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-10 mt-10 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© 2026 Óghowa Accelerator. All rights reserved.</p>
          <p>Building Africa's Innovation Economy from Edo State to the World.</p>
        </div>
      </div>
    </footer>
  );
};
