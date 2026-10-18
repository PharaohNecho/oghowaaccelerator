import React from 'react';
import { PARTNERS_LIST } from '../data/mockData';

export const PartnersMarquee: React.FC = () => {
  return (
    <section id="partners" className="py-16 sm:py-20 bg-white border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0B1E48] tracking-tight">
            Our Partners
          </h2>
          <p className="mt-2 text-sm text-slate-500 font-normal">
            Backed by visionary governments, global technology giants, and premier financial institutions.
          </p>
        </div>

        {/* Partners Badges Row matching image logo line */}
        <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-8 md:gap-10 opacity-80 hover:opacity-100 transition-opacity">
          {PARTNERS_LIST.map((partner) => (
            <div
              key={partner.name}
              className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-slate-200/80 bg-slate-50/50 hover:bg-white hover:border-slate-300 hover:shadow-xs transition-all group cursor-default"
            >
              {/* Partner initial emblem */}
              <div className="w-6 h-6 rounded-full bg-[#0B1E48]/10 text-[#0B1E48] flex items-center justify-center font-bold text-[10px] group-hover:bg-rose-500 group-hover:text-white transition-colors">
                {partner.label.charAt(0)}
              </div>
              <span className="text-xs sm:text-sm font-bold text-slate-700 tracking-tight">
                {partner.name}
              </span>
            </div>
          ))}
        </div>

        {/* Co-Investment & Support Note */}
        <div className="mt-12 text-center text-xs text-slate-400">
          <span>Official ecosystem innovation partners supporting technical credits, venture grants, and state pilot programs.</span>
        </div>
      </div>
    </section>
  );
};
