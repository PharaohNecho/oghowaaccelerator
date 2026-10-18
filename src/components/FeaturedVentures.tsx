import React, { useState } from 'react';
import { ArrowRight, Sparkles, Building, ExternalLink, X, CheckCircle } from 'lucide-react';
import { FEATURED_VENTURES } from '../data/mockData';
import { Venture } from '../types';

export const FeaturedVentures: React.FC = () => {
  const [activeVenture, setActiveVenture] = useState<Venture | null>(null);

  return (
    <section className="py-20 sm:py-24 bg-slate-50/50 border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0B1E48] tracking-tight">
            Featured Ventures
          </h2>
          <p className="mt-3 text-base sm:text-lg text-slate-600 font-normal">
            Innovative companies building the future with Óghowa.
          </p>
        </div>

        {/* 4 Cards Grid matching image */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {FEATURED_VENTURES.map((venture) => (
            <div
              key={venture.id}
              className="bg-white rounded-xl border border-slate-200/90 p-6 shadow-xs hover:shadow-xl hover:border-slate-300 transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                {/* Venture Logo Icon / Badge */}
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-11 h-11 rounded-lg ${venture.badgeColor} text-white font-bold flex items-center justify-center text-sm shadow-xs`}>
                    {venture.logoText}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-[#0B1E48] group-hover:text-rose-600 transition-colors">
                      {venture.name}
                    </h3>
                    <p className="text-xs font-semibold text-rose-600 uppercase tracking-wide">
                      {venture.sector}
                    </p>
                  </div>
                </div>

                {/* Description */}
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-4">
                  {venture.description}
                </p>

                {/* Key Metrics Snippet */}
                <div className="grid grid-cols-2 gap-2 py-3 border-y border-slate-100 text-xs">
                  <div>
                    <p className="text-slate-400 text-[10px] uppercase font-semibold">{venture.metrics[0]?.label}</p>
                    <p className="font-bold text-slate-800">{venture.metrics[0]?.value}</p>
                  </div>
                  <div>
                    <p className="text-slate-400 text-[10px] uppercase font-semibold">{venture.metrics[1]?.label}</p>
                    <p className="font-bold text-emerald-700">{venture.metrics[1]?.value}</p>
                  </div>
                </div>
              </div>

              {/* Action Link */}
              <div className="pt-4">
                <button
                  onClick={() => setActiveVenture(venture)}
                  className="inline-flex items-center gap-1 text-xs sm:text-sm font-semibold text-rose-600 hover:text-rose-700 transition-colors cursor-pointer"
                >
                  <span>{venture.stage === 'Upcoming' ? 'Explore Pipeline' : 'Visit Venture'}</span>
                  <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Venture Detail Modal */}
      {activeVenture && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl p-6 sm:p-8 border border-slate-100">
            <button
              onClick={() => setActiveVenture(null)}
              className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-4 mb-6">
              <div className={`w-14 h-14 rounded-xl ${activeVenture.badgeColor} text-white font-extrabold text-lg flex items-center justify-center shadow-md`}>
                {activeVenture.logoText}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-2xl font-bold text-[#0B1E48]">{activeVenture.name}</h3>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                    {activeVenture.stage}
                  </span>
                </div>
                <p className="text-sm font-medium text-rose-600">{activeVenture.sector} · {activeVenture.cohort}</p>
              </div>
            </div>

            <p className="text-slate-700 text-sm sm:text-base leading-relaxed mb-6">
              {activeVenture.description}
            </p>

            <div className="space-y-4 mb-6">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Audited Traction & Scale
              </h4>
              <div className="grid grid-cols-3 gap-3">
                {activeVenture.metrics.map((m, idx) => (
                  <div key={idx} className="p-3 bg-slate-50 rounded-lg text-center border border-slate-100">
                    <p className="text-lg font-bold text-[#0B1E48]">{m.value}</p>
                    <p className="text-[11px] text-slate-500 font-medium">{m.label}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2 mb-6">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Ecosystem Highlights
              </h4>
              {activeVenture.highlights.map((h, i) => (
                <div key={i} className="flex items-center gap-2 text-xs text-slate-600">
                  <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{h}</span>
                </div>
              ))}
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
              <button
                onClick={() => setActiveVenture(null)}
                className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 rounded-lg"
              >
                Close
              </button>
              <button
                onClick={() => {
                  alert(`Connecting with ${activeVenture.name} founders & investor relations.`);
                  setActiveVenture(null);
                }}
                className="px-5 py-2 text-sm font-semibold text-white bg-[#DC2626] hover:bg-[#B91C1C] rounded-lg shadow-xs flex items-center gap-1.5 cursor-pointer"
              >
                <span>Request Investor Intro</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
