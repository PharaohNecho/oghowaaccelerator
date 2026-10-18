import React from 'react';
import { Sparkles, ArrowRight, Compass, Users } from 'lucide-react';

interface HeroProps {
  onStartJourney: () => void;
  onExploreEcosystem: () => void;
  onOpenMentors: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  onStartJourney,
  onExploreEcosystem,
  onOpenMentors
}) => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[#061226] via-[#091D42] to-[#0D2B60] text-white">
      {/* Background visual motifs and ambient lighting */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-blue-500/30 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 -right-20 w-96 h-96 bg-rose-600/20 rounded-full blur-3xl"></div>
        {/* Subtle grid pattern */}
        <div
          className="w-full h-full"
          style={{
            backgroundImage: `radial-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px)`,
            backgroundSize: '32px 32px'
          }}
        />
      </div>

      {/* Main Container */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-20 lg:pt-24 lg:pb-28">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Headline, Pill, Description, CTAs */}
          <div className="lg:col-span-7 space-y-7 z-10 text-center lg:text-left">
            {/* Top Tag Pill matching image */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-900/60 border border-blue-400/30 text-blue-200 text-xs sm:text-sm font-semibold tracking-wide uppercase backdrop-blur-xs">
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
              <span>The Venture Building Ecosystem for Africa</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.12]">
              Building Africa's <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-100 to-rose-200">
                Innovation Economy.
              </span>
            </h1>

            {/* Subhead matching image */}
            <p className="text-base sm:text-lg text-slate-300 max-w-2xl leading-relaxed mx-auto lg:mx-0 font-normal">
              Óghowa is a venture-building ecosystem that discovers, builds, funds and scales world-class businesses through innovation, partnerships, and strategic capital.
            </p>

            {/* Primary Action Buttons */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
              <button
                onClick={onStartJourney}
                className="px-6 py-3.5 text-base font-bold text-white bg-[#DC2626] hover:bg-[#B91C1C] active:scale-98 rounded-lg shadow-lg shadow-rose-900/30 hover:shadow-xl transition-all flex items-center gap-2 cursor-pointer"
              >
                <span>Start Your Journey</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={onExploreEcosystem}
                className="px-6 py-3.5 text-base font-medium text-white bg-white/10 hover:bg-white/15 border border-white/20 hover:border-white/40 rounded-lg backdrop-blur-xs transition-all flex items-center gap-2 cursor-pointer"
              >
                <span>Explore the Ecosystem</span>
              </button>
            </div>

            {/* Fast Stats Highlight on hero */}
            <div className="pt-6 grid grid-cols-3 gap-4 border-t border-white/10 text-left max-w-lg mx-auto lg:mx-0">
              <div>
                <p className="text-2xl font-bold text-white">100+</p>
                <p className="text-xs text-slate-400">Ventures Built</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-rose-400">₦500M+</p>
                <p className="text-xs text-slate-400">Capital Pool</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-white">5,000+</p>
                <p className="text-xs text-slate-400">Entrepreneurs</p>
              </div>
            </div>
          </div>

          {/* Right Column: Visual Composite matching the image (African entrepreneurs, summits, monument) */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              {/* Outer decorative glow */}
              <div className="absolute -inset-1.5 bg-gradient-to-r from-blue-600 to-rose-600 rounded-2xl blur-lg opacity-40"></div>

              {/* Main Feature Card with photographic montage */}
              <div className="relative rounded-2xl overflow-hidden bg-slate-900 border border-white/15 shadow-2xl">
                {/* Conference & Founders Photo */}
                <div className="relative h-64 sm:h-72 overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=650&q=70"
                    alt="African Founders & Innovation Leaders at Óghowa Summit"
                    loading="eager"
                    fetchPriority="high"
                    decoding="async"
                    width={650}
                    height={300}
                    className="w-full h-full object-cover object-center"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent"></div>

                  {/* Badge over photo */}
                  <div className="absolute top-4 left-4 bg-slate-900/80 backdrop-blur-md px-3 py-1 rounded-md border border-white/10 text-xs font-semibold text-white flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                    <span>Cohort 2026-B Now Open</span>
                  </div>

                  <div className="absolute bottom-4 left-4 right-4">
                    <span className="text-xs font-bold text-rose-400 uppercase tracking-wider">Benin City & West Africa Hub</span>
                    <h3 className="text-lg font-bold text-white leading-tight">
                      Empowering Frontier Builders from Idea to Global Scale
                    </h3>
                  </div>
                </div>

                {/* Sub-card details */}
                <div className="p-4 sm:p-5 bg-slate-900/95 space-y-3">
                  <div className="flex items-center justify-between text-xs text-slate-400 pb-3 border-b border-white/10">
                    <span className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span>
                      Next Pitch Day: November 2026
                    </span>
                    <span className="text-rose-400 font-medium">₦50M Ticket Sizes</span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="p-2.5 rounded-lg bg-white/5 border border-white/5">
                      <p className="text-slate-400">Venture Studio</p>
                      <p className="text-white font-semibold">Dedicated Engineering</p>
                    </div>
                    <div className="p-2.5 rounded-lg bg-white/5 border border-white/5">
                      <p className="text-slate-400">Mentorship</p>
                      <p className="text-white font-semibold">Top Pan-African Tech Leads</p>
                    </div>
                  </div>

                  <button
                    onClick={onOpenMentors}
                    className="w-full py-2 px-3 text-center text-xs font-semibold text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 rounded-lg transition-colors flex items-center justify-center gap-1.5"
                  >
                    <span>Browse 50+ Verified Mentors</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Ticker Bar matching the exact image text */}
      <div className="relative border-t border-white/15 bg-[#051022]/80 backdrop-blur-md py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-center gap-x-6 sm:gap-x-10 gap-y-2 text-xs sm:text-sm font-bold tracking-widest text-slate-300 uppercase text-center">
            <span className="hover:text-white transition-colors cursor-default">Founders</span>
            <span className="text-slate-600 font-light">•</span>
            <span className="hover:text-white transition-colors cursor-default">Investors</span>
            <span className="text-slate-600 font-light">•</span>
            <span className="hover:text-white transition-colors cursor-default">Corporates</span>
            <span className="text-slate-600 font-light">•</span>
            <span className="hover:text-white transition-colors cursor-default">Government</span>
            <span className="text-slate-600 font-light">•</span>
            <span className="hover:text-white transition-colors cursor-default">Universities</span>
            <span className="text-slate-600 font-light">•</span>
            <span className="hover:text-white transition-colors cursor-default">Development Partners</span>
          </div>
        </div>
      </div>
    </section>
  );
};
