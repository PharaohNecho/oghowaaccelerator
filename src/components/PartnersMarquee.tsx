import React from 'react';
import { PARTNERS_LIST } from '../data/mockData';
import { PartnerItem } from '../types';

interface PartnersMarqueeProps {
  partners?: PartnerItem[];
  onOpenAdmin?: () => void;
}

export const PartnersMarquee: React.FC<PartnersMarqueeProps> = ({
  partners = PARTNERS_LIST
}) => {
  // Only display partners that have isDisplayed !== false
  const activePartners = partners.filter((p) => p.isDisplayed !== false);

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

        {/* Partners Badges Row */}
        <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 md:gap-8 opacity-85 hover:opacity-100 transition-opacity">
          {activePartners.map((partner) => (
            <div
              key={partner.id || partner.name}
              className="flex items-center gap-2.5 px-4 py-2.5 rounded-lg border border-slate-200/80 bg-slate-50/70 hover:bg-white hover:border-slate-300 hover:shadow-xs transition-all group cursor-default"
            >
              <div className="w-7 h-7 rounded-full bg-[#0B1E48]/10 text-[#0B1E48] flex items-center justify-center font-bold text-xs group-hover:bg-rose-600 group-hover:text-white transition-colors">
                {partner.name.charAt(0)}
              </div>
              <div>
                <span className="text-xs sm:text-sm font-bold text-slate-800 tracking-tight block">
                  {partner.name}
                </span>
                <span className="text-[10px] text-slate-500 font-medium block">
                  {partner.category}
                </span>
              </div>
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
