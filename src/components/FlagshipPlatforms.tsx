import React, { useState } from 'react';
import { ArrowRight, X, Calendar, Check, ExternalLink } from 'lucide-react';
import { FLAGSHIP_PLATFORMS } from '../data/mockData';

interface FlagshipPlatformsProps {
  onApplyForPlatform: (platformId: string) => void;
}

export const FlagshipPlatforms: React.FC<FlagshipPlatformsProps> = ({ onApplyForPlatform }) => {
  const [selectedPlatform, setSelectedPlatform] = useState<typeof FLAGSHIP_PLATFORMS[0] | null>(null);

  return (
    <section id="platforms" className="py-20 sm:py-24 bg-white border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0B1E48] tracking-tight">
            Flagship Platforms
          </h2>
          <p className="mt-3 text-base sm:text-lg text-slate-600 font-normal">
            Initiatives designed to turn ideas into high-impact businesses.
          </p>
        </div>

        {/* 6 Grid Cards with Photography matching the exact layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {FLAGSHIP_PLATFORMS.map((platform) => (
            <div
              key={platform.id}
              className="group bg-white rounded-xl border border-slate-200/90 overflow-hidden shadow-xs hover:shadow-xl hover:border-slate-300 transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                {/* Photo container */}
                <div className="relative h-48 overflow-hidden bg-slate-100">
                  <img
                    src={platform.image}
                    alt={platform.title}
                    loading="lazy"
                    decoding="async"
                    width={500}
                    height={200}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent" />
                  <span className="absolute bottom-3 left-3 text-xs font-semibold text-white bg-slate-900/80 backdrop-blur-xs px-2.5 py-1 rounded">
                    {platform.cohortSchedule}
                  </span>
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-[#0B1E48] mb-2 group-hover:text-rose-600 transition-colors">
                    {platform.title}
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    {platform.description}
                  </p>
                </div>
              </div>

              {/* Action Link matching the red "Learn More ->" in image */}
              <div className="px-6 pb-6 pt-2">
                <button
                  onClick={() => setSelectedPlatform(platform)}
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-rose-600 hover:text-rose-700 transition-colors cursor-pointer"
                >
                  <span>Learn More</span>
                  <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Platform Detail Modal */}
      {selectedPlatform && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-100">
            {/* Header Image */}
            <div className="relative h-56 bg-slate-900">
              <img
                src={selectedPlatform.image}
                alt={selectedPlatform.title}
                className="w-full h-full object-cover opacity-80"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
              <button
                onClick={() => setSelectedPlatform(null)}
                className="absolute top-4 right-4 p-2 rounded-full bg-black/40 text-white hover:bg-black/60 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="absolute bottom-4 left-6 right-6">
                <span className="text-xs font-bold text-rose-400 uppercase tracking-wider">Flagship Initiative</span>
                <h3 className="text-2xl font-bold text-white">{selectedPlatform.title}</h3>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 sm:p-8 space-y-6">
              <p className="text-slate-700 text-sm sm:text-base leading-relaxed">
                {selectedPlatform.description}
              </p>

              <div className="space-y-3">
                <h4 className="text-xs font-bold text-[#0B1E48] uppercase tracking-wider">
                  Program Highlights & Benefits
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {selectedPlatform.features.map((feature, idx) => (
                    <div key={idx} className="p-3 rounded-lg bg-slate-50 border border-slate-100 flex items-start gap-2 text-xs text-slate-700">
                      <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-100 flex items-center justify-between text-xs sm:text-sm text-blue-900">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-blue-600" />
                  <span className="font-semibold">Cohort Status: {selectedPlatform.cohortSchedule}</span>
                </div>
                <span className="text-blue-700 font-medium">Free for qualified ventures</span>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  onClick={() => setSelectedPlatform(null)}
                  className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 rounded-lg"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    setSelectedPlatform(null);
                    onApplyForPlatform(selectedPlatform.id);
                  }}
                  className="px-5 py-2 text-sm font-semibold text-white bg-[#DC2626] hover:bg-[#B91C1C] rounded-lg shadow-sm transition cursor-pointer"
                >
                  Apply for {selectedPlatform.title}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
