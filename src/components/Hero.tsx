import React, { useState, useEffect } from 'react';
import { ArrowRight, Calendar, MapPin, ChevronLeft, ChevronRight, Ticket, Sparkles } from 'lucide-react';
import { CarouselSlide } from '../types';
import { DEFAULT_CAROUSEL_EVENTS } from '../data/mockData';

interface HeroProps {
  onStartJourney: () => void;
  onExploreEcosystem: () => void;
  onOpenMentors: () => void;
  carouselEvents?: CarouselSlide[];
  onRegisterForEvent?: (slide: CarouselSlide) => void;
  onOpenBusinessWeek?: () => void;
  onRegisterForBusinessWeek?: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  onStartJourney,
  onExploreEcosystem,
  carouselEvents = DEFAULT_CAROUSEL_EVENTS,
  onRegisterForEvent,
  onOpenBusinessWeek,
  onRegisterForBusinessWeek
}) => {
  // Only display slides marked as isDisplayed
  const activeSlides = carouselEvents.filter((slide) => slide.isDisplayed !== false);
  const slides = activeSlides.length > 0 ? activeSlides : DEFAULT_CAROUSEL_EVENTS;

  const [currentSlideIndex, setCurrentSlideIndex] = useState<number>(0);
  const [isPaused, setIsPaused] = useState<boolean>(false);

  // Auto-advance carousel every 6 seconds if not paused
  useEffect(() => {
    if (isPaused || slides.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentSlideIndex((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [isPaused, slides.length]);

  const currentSlide = slides[currentSlideIndex] || slides[0];

  const handlePrev = () => {
    setCurrentSlideIndex((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const handleNext = () => {
    setCurrentSlideIndex((prev) => (prev + 1) % slides.length);
  };

  const handleRegisterClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (
      onRegisterForBusinessWeek &&
      (currentSlide?.id === 'event-startup-week' || currentSlide?.title?.toLowerCase().includes('business'))
    ) {
      onRegisterForBusinessWeek();
    } else if (
      onOpenBusinessWeek &&
      (currentSlide?.id === 'event-startup-week' || currentSlide?.title?.toLowerCase().includes('business'))
    ) {
      onOpenBusinessWeek();
    } else if (onRegisterForEvent && currentSlide) {
      onRegisterForEvent(currentSlide);
    } else {
      const el = document.getElementById('events');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative overflow-hidden bg-[#061226] text-white">
      {/* Background ambient lighting and soft radial glow blending */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-blue-600/15 rounded-full blur-[140px]" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-rose-600/15 rounded-full blur-[130px]" />
        {/* Subtle grid texture */}
        <div
          className="w-full h-full opacity-10"
          style={{
            backgroundImage: `radial-gradient(rgba(255, 255, 255, 0.15) 1px, transparent 1px)`,
            backgroundSize: '28px 28px'
          }}
        />
      </div>

      {/* Main Container */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-16 lg:pt-20 lg:pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
          {/* Left Column: Headline, Subhead, CTAs */}
          <div className="lg:col-span-6 space-y-6 z-10 text-center lg:text-left">
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

            {/* Primary Action Buttons */}
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

            {/* Fast Stats Highlight on Hero */}
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

          {/* Right Column: Hero Carousel blending seamlessly with background */}
          <div
            className="lg:col-span-6 relative z-10"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            {/* Blended Glowing Wrapper */}
            <div className="relative mx-auto max-w-lg lg:max-w-none">
              {/* Outer soft ambient gradient glow */}
              <div className="absolute -inset-2 bg-gradient-to-r from-blue-600/30 to-rose-600/30 rounded-3xl blur-2xl opacity-60" />

              {/* Carousel Container with background blend */}
              <div className="relative rounded-3xl overflow-hidden bg-gradient-to-b from-[#0B1E40]/90 to-[#061226]/95 border border-white/15 shadow-2xl backdrop-blur-xl">
                {/* Image Section with seamless blend masks */}
                <div className="relative h-64 sm:h-72 w-full overflow-hidden">
                  <img
                    src={currentSlide.imageUrl}
                    alt={currentSlide.title}
                    className="w-full h-full object-cover object-center transition-all duration-700 ease-out transform scale-100 hover:scale-105"
                    loading="eager"
                  />
                  {/* Seamless blending gradients: Top, Bottom, Sides smoothly fading into hero dark navy */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#061226] via-[#061226]/40 to-transparent pointer-events-none" />
                  <div className="absolute inset-0 bg-gradient-to-r from-[#061226]/60 via-transparent to-[#061226]/60 pointer-events-none" />
                  <div className="absolute inset-0 bg-blue-950/20 mix-blend-color pointer-events-none" />

                  {/* Badge & Seat Counter */}
                  <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900/80 border border-white/20 text-xs font-bold text-white backdrop-blur-md">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                      <span>{currentSlide.badge || 'Upcoming Event'}</span>
                    </span>

                    {currentSlide.seatsAvailable !== undefined && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-rose-950/80 border border-rose-500/40 text-[11px] font-bold text-rose-300 backdrop-blur-md">
                        <Ticket className="w-3 h-3" />
                        <span>{currentSlide.seatsAvailable} seats left</span>
                      </span>
                    )}
                  </div>

                  {/* Floating Date & Location on Image Bottom */}
                  <div className="absolute bottom-3 left-4 right-4 z-10 flex flex-wrap items-center gap-2 text-xs font-semibold text-slate-200">
                    <span className="bg-black/60 px-2.5 py-1 rounded-md border border-white/10 flex items-center gap-1.5 backdrop-blur-xs">
                      <Calendar className="w-3.5 h-3.5 text-rose-400" />
                      <span>{currentSlide.eventDate}</span>
                    </span>
                    <span className="bg-black/60 px-2.5 py-1 rounded-md border border-white/10 flex items-center gap-1.5 backdrop-blur-xs">
                      <MapPin className="w-3.5 h-3.5 text-blue-400" />
                      <span className="truncate max-w-[200px]">{currentSlide.location}</span>
                    </span>
                  </div>
                </div>

                {/* Content Section below image */}
                <div className="p-6 sm:p-7 space-y-4 bg-[#061226]">
                  <div>
                    <h3 className="text-xl sm:text-2xl font-black text-white leading-tight mb-2 hover:text-rose-400 transition-colors">
                      {currentSlide.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
                      {currentSlide.subtitle || currentSlide.description}
                    </p>
                  </div>

                  {/* Call-to-action & Navigation Row */}
                  <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-white/10">
                    {/* Register button */}
                    <button
                      onClick={handleRegisterClick}
                      className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#DC2626] to-[#EF4444] hover:from-[#B91C1C] hover:to-[#DC2626] text-white font-bold text-xs sm:text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <span>
                        {currentSlide?.title?.toLowerCase().includes('business')
                          ? 'Enter Business Week Portal'
                          : 'Register for Upcoming Event'}
                      </span>
                      <ArrowRight className="w-4 h-4" />
                    </button>

                    {/* Carousel Nav Controls & Dots */}
                    <div className="flex items-center gap-3">
                      {/* Dots indicator */}
                      <div className="flex items-center gap-1.5">
                        {slides.map((_, idx) => (
                          <button
                            key={idx}
                            onClick={() => setCurrentSlideIndex(idx)}
                            aria-label={`Go to slide ${idx + 1}`}
                            className={`h-2 rounded-full transition-all cursor-pointer ${
                              idx === currentSlideIndex
                                ? 'w-6 bg-rose-500'
                                : 'w-2 bg-white/20 hover:bg-white/40'
                            }`}
                          />
                        ))}
                      </div>

                      {/* Prev / Next Arrows */}
                      <div className="flex items-center gap-1">
                        <button
                          onClick={handlePrev}
                          aria-label="Previous slide"
                          className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                        >
                          <ChevronLeft className="w-4 h-4" />
                        </button>
                        <button
                          onClick={handleNext}
                          aria-label="Next slide"
                          className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                        >
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Audience Ribbon */}
      <div className="relative border-t border-white/10 bg-[#040C1A]/90 backdrop-blur-md py-3.5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-center gap-x-6 sm:gap-x-10 gap-y-2 text-xs font-bold tracking-widest text-slate-300 uppercase text-center">
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
