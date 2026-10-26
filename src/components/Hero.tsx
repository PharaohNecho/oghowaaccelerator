import React, { useState, useEffect } from 'react';
import {
  ArrowRight,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Ticket,
  Sparkles,
  MapPin,
  Clock,
  Layers,
  Award,
  TrendingUp,
  ShieldCheck,
  CheckCircle2
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
const SLIDE_DURATION_MS = 6000;

export const Hero: React.FC<HeroProps> = ({
  onStartJourney,
  onExploreEcosystem,
  carouselEvents = DEFAULT_CAROUSEL_EVENTS,
  onRegisterForEvent,
  onOpenBusinessWeek,
  onRegisterForBusinessWeek,
  config
}) => {
  // Only display slides marked as isDisplayed !== false
  const activeSlides = (carouselEvents && carouselEvents.length > 0)
    ? carouselEvents.filter((slide) => slide.isDisplayed !== false)
    : DEFAULT_CAROUSEL_EVENTS;
  const slides = activeSlides.length > 0 ? activeSlides : DEFAULT_CAROUSEL_EVENTS;

  const [currentSlideIndex, setCurrentSlideIndex] = useState<number>(0);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [slideAnimKey, setSlideAnimKey] = useState<number>(0);
  const [slideProgress, setSlideProgress] = useState<number>(0);

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

  // Live vacant seats calculation (Strictly without demo/mock offsets)
  const totalRegistered = config?.delegates?.length || 0;
  const vacantSeats = Math.max(0, TOTAL_PHYSICAL_SEATS - totalRegistered);

  // Smooth slide timer & progress bar
  useEffect(() => {
    if (isPaused || slides.length <= 1) return;

    const intervalTime = 50; // update progress every 50ms
    const step = (intervalTime / SLIDE_DURATION_MS) * 100;

    const progressTimer = setInterval(() => {
      setSlideProgress((prev) => {
        if (prev >= 100) {
          setCurrentSlideIndex((oldIdx) => (oldIdx + 1) % slides.length);
          setSlideAnimKey((k) => k + 1);
          return 0;
        }
        return prev + step;
      });
    }, intervalTime);

    return () => clearInterval(progressTimer);
  }, [isPaused, slides.length]);

  const goToSlide = (idx: number) => {
    setCurrentSlideIndex(idx);
    setSlideAnimKey((k) => k + 1);
    setSlideProgress(0);
  };

  const handlePrev = () => {
    setCurrentSlideIndex((prev) => (prev - 1 + slides.length) % slides.length);
    setSlideAnimKey((k) => k + 1);
    setSlideProgress(0);
  };

  const handleNext = () => {
    setCurrentSlideIndex((prev) => (prev + 1) % slides.length);
    setSlideAnimKey((k) => k + 1);
    setSlideProgress(0);
  };

  const currentSlide = slides[currentSlideIndex] || slides[0];
  const isBusinessWeekSlide =
    currentSlide?.id === 'event-startup-week' ||
    currentSlide?.title?.toLowerCase().includes('business week') ||
    currentSlide?.title?.toLowerCase().includes('summit');

  return (
    <section
      className="relative overflow-hidden bg-[#061224] text-white"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* FULL-WIDTH DYNAMIC HERO SLIDER */}
      <div className="relative min-h-[620px] sm:min-h-[680px] lg:min-h-[740px] flex items-center overflow-hidden">
        {/* Animated Background Visuals Layer (Cross-fading with Ken-Burns motion) */}
        {slides.map((slide, idx) => {
          const isActive = idx === currentSlideIndex;
          return (
            <div
              key={slide.id || idx}
              className={`absolute inset-0 z-0 transition-opacity duration-1000 ease-in-out ${
                isActive ? 'opacity-100' : 'opacity-0 pointer-events-none'
              }`}
            >
              <img
                src={slide.imageUrl}
                alt={slide.title}
                className={`w-full h-full object-cover object-center transform transition-transform duration-[8000ms] ease-out brightness-[0.72] contrast-105 ${
                  isActive ? 'scale-105 sm:scale-110' : 'scale-100'
                }`}
              />
              {/* Deep atmospheric overlay matching oghowa.metaspaceconsult.com */}
              <div className="absolute inset-0 bg-gradient-to-r from-[#061224] via-[#061224]/85 to-[#061224]/50" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#061224] via-transparent to-[#061224]/70" />
              <div className="absolute inset-0 bg-radial-at-c from-transparent via-[#061224]/20 to-[#061224]/75" />
            </div>
          );
        })}

        {/* Dynamic Slide Content Container */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 w-full">
          <div
            key={slideAnimKey}
            className="max-w-3xl space-y-6 text-left animate-in fade-in slide-in-from-bottom-6 duration-700 fill-mode-both"
          >
            {/* Slide Badge Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose-950/70 border border-rose-500/40 text-rose-200 text-xs sm:text-sm font-semibold tracking-wide uppercase backdrop-blur-md shadow-lg">
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
              <span>{currentSlide.badge || 'Venture Ecosystem'}</span>
              <span className="text-slate-400">•</span>
              <span className="text-slate-200">Victor Uwaifo Creative Hub</span>
            </div>

            {/* Main Animated Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.12]">
              {currentSlide.title}
            </h1>

            {/* Subtitle / Dynamic Narrative */}
            <p className="text-base sm:text-lg lg:text-xl text-slate-200 font-normal leading-relaxed max-w-2xl">
              {currentSlide.subtitle || currentSlide.description}
            </p>

            {/* Business Week Event Bar with accurate live participant counter & timer */}
            {isBusinessWeekSlide && (
              <div className="p-4 sm:p-5 rounded-2xl bg-[#0B1E48]/85 border border-blue-400/30 backdrop-blur-md max-w-2xl space-y-3 shadow-2xl">
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-2 text-slate-200 font-semibold">
                    <Calendar className="w-4 h-4 text-rose-400" />
                    <span>{currentSlide.eventDate || 'November 16 – 21, 2026'}</span>
                    <span className="text-slate-400">•</span>
                    <span className="text-amber-300">Victor Uwaifo Creative Hub</span>
                  </div>

                  <span className="text-rose-300 font-bold bg-rose-950/70 px-2.5 py-1 rounded-full border border-rose-500/30">
                    Capacity: 500 Participants • {vacantSeats} Seats Vacant
                  </span>
                </div>

                {/* Accurate Countdown Timer Ticker */}
                <div className="grid grid-cols-4 gap-2 pt-1 text-center">
                  <div className="bg-[#061224] p-2 rounded-xl border border-slate-700">
                    <span className="block text-xl sm:text-2xl font-black text-white font-mono">
                      {String(timeLeft.days).padStart(2, '0')}
                    </span>
                    <span className="text-[9px] uppercase font-bold text-slate-400">Days</span>
                  </div>
                  <div className="bg-[#061224] p-2 rounded-xl border border-slate-700">
                    <span className="block text-xl sm:text-2xl font-black text-white font-mono">
                      {String(timeLeft.hours).padStart(2, '0')}
                    </span>
                    <span className="text-[9px] uppercase font-bold text-slate-400">Hours</span>
                  </div>
                  <div className="bg-[#061224] p-2 rounded-xl border border-slate-700">
                    <span className="block text-xl sm:text-2xl font-black text-white font-mono">
                      {String(timeLeft.minutes).padStart(2, '0')}
                    </span>
                    <span className="text-[9px] uppercase font-bold text-slate-400">Mins</span>
                  </div>
                  <div className="bg-[#061224] p-2 rounded-xl border border-slate-700">
                    <span className="block text-xl sm:text-2xl font-black text-rose-400 font-mono">
                      {String(timeLeft.seconds).padStart(2, '0')}
                    </span>
                    <span className="text-[9px] uppercase font-bold text-slate-400">Secs</span>
                  </div>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              {isBusinessWeekSlide ? (
                <>
                  <button
                    onClick={onRegisterForBusinessWeek}
                    className="px-7 py-3.5 text-sm sm:text-base font-bold text-white bg-[#DC2626] hover:bg-[#B91C1C] active:scale-98 rounded-xl shadow-lg shadow-rose-900/40 hover:shadow-xl transition-all flex items-center gap-2 cursor-pointer"
                  >
                    <Ticket className="w-4 h-4 text-white" />
                    <span>Register for Pass</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <button
                    onClick={onOpenBusinessWeek}
                    className="px-6 py-3.5 text-sm sm:text-base font-medium text-white bg-white/10 hover:bg-white/20 border border-white/20 hover:border-white/40 rounded-xl backdrop-blur-md transition-all flex items-center gap-2 cursor-pointer"
                  >
                    <span>Explore 4-Day Program</span>
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={onStartJourney}
                    className="px-7 py-3.5 text-sm sm:text-base font-bold text-white bg-[#DC2626] hover:bg-[#B91C1C] active:scale-98 rounded-xl shadow-lg shadow-rose-900/40 hover:shadow-xl transition-all flex items-center gap-2 cursor-pointer"
                  >
                    <span>Start Your Journey</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <button
                    onClick={onExploreEcosystem}
                    className="px-6 py-3.5 text-sm sm:text-base font-medium text-white bg-white/10 hover:bg-white/20 border border-white/20 hover:border-white/40 rounded-xl backdrop-blur-md transition-all flex items-center gap-2 cursor-pointer"
                  >
                    <span>Explore the Ecosystem</span>
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Carousel Arrow Controls */}
        {slides.length > 1 && (
          <>
            <button
              onClick={handlePrev}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-black/40 hover:bg-black/70 text-white flex items-center justify-center border border-white/20 backdrop-blur-md transition cursor-pointer shadow-lg hover:scale-105 active:scale-95"
              aria-label="Previous slide"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            <button
              onClick={handleNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-black/40 hover:bg-black/70 text-white flex items-center justify-center border border-white/20 backdrop-blur-md transition cursor-pointer shadow-lg hover:scale-105 active:scale-95"
              aria-label="Next slide"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </>
        )}

        {/* Slide Counter & Indicators Container with Live Progress Bar */}
        {slides.length > 1 && (
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2">
            <div className="flex items-center gap-2.5 bg-black/40 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/15 shadow-md">
              <span className="text-[11px] font-mono font-bold text-slate-300">
                0{currentSlideIndex + 1} / 0{slides.length}
              </span>
              <div className="flex items-center gap-2">
                {slides.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => goToSlide(idx)}
                    className={`relative h-2 rounded-full overflow-hidden transition-all duration-300 cursor-pointer ${
                      currentSlideIndex === idx ? 'w-10 bg-white/30' : 'w-2.5 bg-white/30 hover:bg-white/60'
                    }`}
                    aria-label={`Go to slide ${idx + 1}`}
                  >
                    {currentSlideIndex === idx && (
                      <div
                        className="h-full bg-rose-500 rounded-full transition-all duration-75"
                        style={{ width: `${slideProgress}%` }}
                      />
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* FAST STATS TICKER STRIP BELOW SLIDER */}
      <div className="border-t border-slate-800 bg-[#071733]/90 backdrop-blur-md py-6 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div className="space-y-1">
            <p className="text-3xl font-black text-white">100+</p>
            <p className="text-xs text-slate-300 font-medium">Ventures Built</p>
          </div>
          <div className="space-y-1">
            <p className="text-3xl font-black text-rose-400">₦500M+</p>
            <p className="text-xs text-slate-300 font-medium">Capital Pool</p>
          </div>
          <div className="space-y-1">
            <p className="text-3xl font-black text-white">5,000+</p>
            <p className="text-xs text-slate-300 font-medium">Entrepreneurs Supported</p>
          </div>
          <div className="space-y-1">
            <p className="text-3xl font-black text-emerald-400">94%</p>
            <p className="text-xs text-slate-300 font-medium">Survival Rate</p>
          </div>
        </div>
      </div>
    </section>
  );
};
