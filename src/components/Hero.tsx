import React, { useState, useEffect } from 'react';
import {
  ArrowRight,
  Calendar,
  MapPin,
  ChevronLeft,
  ChevronRight,
  Ticket,
  Sparkles,
  Clock,
  ShieldCheck,
  TrendingUp,
  Building,
  Rocket
} from 'lucide-react';
import { CarouselSlide, BusinessWeekConfig } from '../types';
import { DEFAULT_CAROUSEL_EVENTS } from '../data/mockData';

interface HeroProps {
  onStartJourney: () => void;
  onExploreEcosystem: () => void;
  onOpenMentors?: () => void;
  carouselEvents?: CarouselSlide[];
  onRegisterForEvent?: (slide: CarouselSlide) => void;
  onOpenBusinessWeek?: () => void;
  onRegisterForBusinessWeek?: () => void;
  config?: BusinessWeekConfig;
}

// Target Date: November 16, 2026 at 09:00:00 WAT (UTC+1)
const SUMMIT_START_TIME = new Date('2026-11-16T09:00:00+01:00').getTime();
const TOTAL_PHYSICAL_SEATS = 500;

export const Hero: React.FC<HeroProps> = ({
  onStartJourney,
  onExploreEcosystem,
  carouselEvents = DEFAULT_CAROUSEL_EVENTS,
  onRegisterForEvent,
  onOpenBusinessWeek,
  onRegisterForBusinessWeek,
  config
}) => {
  const activeSlides = carouselEvents.filter((slide) => slide.isDisplayed !== false);
  const slides = activeSlides.length > 0 ? activeSlides : DEFAULT_CAROUSEL_EVENTS;

  const [currentSlideIndex, setCurrentSlideIndex] = useState<number>(0);
  const [isPaused, setIsPaused] = useState<boolean>(false);

  // Accurate real-time countdown to Nov 16, 2026 09:00:00 WAT
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

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

  // Live vacant seats calculation
  const totalRegistered = 342 + (config?.delegates?.length || 0);
  const vacantSeats = Math.max(0, TOTAL_PHYSICAL_SEATS - totalRegistered);

  // Auto-advance carousel
  useEffect(() => {
    if (isPaused || slides.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentSlideIndex((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [isPaused, slides.length]);

  return (
    <section className="relative overflow-hidden bg-[#061226] text-white">
      {/* Background ambient lighting and subtle grid texture */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-blue-600/15 rounded-full blur-[140px]" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-rose-600/15 rounded-full blur-[130px]" />
        <div
          className="w-full h-full opacity-10"
          style={{
            backgroundImage: `radial-gradient(rgba(255, 255, 255, 0.15) 1px, transparent 1px)`,
            backgroundSize: '28px 28px'
          }}
        />
      </div>

      {/* Main Hero Container */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-16 lg:pt-20 lg:pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
          {/* Left Column: Headline, Subhead, CTAs, Stats */}
          <div className="lg:col-span-7 space-y-6 z-10 text-center lg:text-left">
            {/* Top Tag Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-900/50 border border-blue-400/30 text-blue-200 text-xs sm:text-sm font-semibold tracking-wide uppercase backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
              <span>The Venture Building Ecosystem for Africa</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-[3.5rem] font-extrabold tracking-tight text-white leading-[1.12]">
              Building Africa's <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-100 to-rose-200">
                Innovation Economy.
              </span>
            </h1>

            {/* Subhead */}
            <p className="text-base sm:text-lg text-slate-300 max-w-xl leading-relaxed mx-auto lg:mx-0 font-normal">
              Óghowa is a venture-building ecosystem that discovers, builds, funds, and scales world-class businesses through innovation, partnerships, and strategic capital.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-1">
              <button
                onClick={onStartJourney}
                className="px-6 py-3.5 text-sm sm:text-base font-bold text-white bg-[#DC2626] hover:bg-[#B91C1C] active:scale-98 rounded-xl shadow-lg shadow-rose-900/40 hover:shadow-xl transition-all flex items-center gap-2 cursor-pointer"
              >
                <span>Start Your Journey</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={onExploreEcosystem}
                className="px-6 py-3.5 text-sm sm:text-base font-medium text-white bg-white/10 hover:bg-white/15 border border-white/20 hover:border-white/40 rounded-xl backdrop-blur-md transition-all flex items-center gap-2 cursor-pointer"
              >
                <span>Explore the Ecosystem</span>
              </button>
            </div>

            {/* Fast Stats Highlight */}
            <div className="pt-6 grid grid-cols-3 gap-4 border-t border-white/10 text-left max-w-md mx-auto lg:mx-0">
              <div>
                <p className="text-2xl font-black text-white">100+</p>
                <p className="text-xs text-slate-400 font-medium">Ventures Built</p>
              </div>
              <div>
                <p className="text-2xl font-black text-rose-400">₦500M+</p>
                <p className="text-xs text-slate-400 font-medium">Capital Pool</p>
              </div>
              <div>
                <p className="text-2xl font-black text-white">5,000+</p>
                <p className="text-xs text-slate-400 font-medium">Entrepreneurs</p>
              </div>
            </div>
          </div>

          {/* Right Column: High-Impact Óghowa Business Week Spotlight Card */}
          <div className="lg:col-span-5 z-10">
            <div className="bg-gradient-to-br from-[#0B1E3D] via-[#0D254C] to-[#0A1A33] rounded-3xl p-6 sm:p-7 border border-blue-400/30 shadow-2xl space-y-5 relative overflow-hidden backdrop-blur-md">
              {/* Decorative background glow */}
              <div className="absolute top-0 right-0 -mr-16 -mt-16 w-48 h-48 bg-rose-500/10 rounded-full blur-2xl pointer-events-none" />

              {/* Card Header & Badge */}
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 text-xs font-bold border border-amber-400/30">
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                  Óghowa Business Week 2026
                </span>
                <span className="text-[11px] font-semibold text-slate-300 bg-white/10 px-2.5 py-1 rounded-full">
                  Benin City, Edo
                </span>
              </div>

              {/* Event Title & Theme */}
              <div className="space-y-1">
                <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                  Innovation for Economic Transformation
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-light">
                  In collaboration with Benin Tech Fest. Keynotes, masterclasses, startup pitches and networking with founders & investors.
                </p>
              </div>

              {/* Real-Time Live Countdown */}
              <div className="bg-[#061224]/80 p-4 rounded-2xl border border-blue-400/20">
                <div className="flex items-center justify-between text-xs text-slate-400 mb-2.5">
                  <span className="flex items-center gap-1.5 font-bold uppercase tracking-wider text-slate-300">
                    <Clock className="w-3.5 h-3.5 text-amber-400" />
                    Commences In
                  </span>
                  <span className="text-amber-400 font-mono text-[11px]">Nov 16, 2026</span>
                </div>

                <div className="grid grid-cols-4 gap-2 text-center">
                  <div className="bg-[#0A1A33] p-2.5 rounded-xl border border-slate-700">
                    <span className="block text-xl font-black text-white font-mono">{String(timeLeft.days).padStart(2, '0')}</span>
                    <span className="text-[9px] uppercase font-bold text-slate-400">Days</span>
                  </div>
                  <div className="bg-[#0A1A33] p-2.5 rounded-xl border border-slate-700">
                    <span className="block text-xl font-black text-white font-mono">{String(timeLeft.hours).padStart(2, '0')}</span>
                    <span className="text-[9px] uppercase font-bold text-slate-400">Hours</span>
                  </div>
                  <div className="bg-[#0A1A33] p-2.5 rounded-xl border border-slate-700">
                    <span className="block text-xl font-black text-white font-mono">{String(timeLeft.minutes).padStart(2, '0')}</span>
                    <span className="text-[9px] uppercase font-bold text-slate-400">Mins</span>
                  </div>
                  <div className="bg-[#0A1A33] p-2.5 rounded-xl border border-slate-700">
                    <span className="block text-xl font-black text-rose-400 font-mono">{String(timeLeft.seconds).padStart(2, '0')}</span>
                    <span className="text-[9px] uppercase font-bold text-slate-400">Secs</span>
                  </div>
                </div>
              </div>

              {/* Live Vacant Seats Status */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10 text-xs">
                <span className="text-slate-300 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                  Vacant Physical Seats:
                </span>
                <span className="font-extrabold text-rose-300">
                  {vacantSeats} remaining of {TOTAL_PHYSICAL_SEATS}
                </span>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center gap-2.5 pt-1">
                <button
                  onClick={onRegisterForBusinessWeek}
                  className="w-full sm:flex-1 py-3 px-4 rounded-xl font-bold text-xs bg-rose-600 hover:bg-rose-700 text-white shadow-lg shadow-rose-900/30 transition flex items-center justify-center gap-1.5 cursor-pointer active:scale-98"
                >
                  <Ticket className="w-4 h-4" />
                  <span>Register for Pass</span>
                </button>

                <button
                  onClick={onOpenBusinessWeek}
                  className="w-full sm:w-auto py-3 px-4 rounded-xl font-semibold text-xs bg-white/10 hover:bg-white/20 text-white border border-white/20 transition flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span>Explore Summit</span>
                  <ArrowRight className="w-3.5 h-3.5 text-blue-300" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
