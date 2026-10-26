import React from 'react';
import { PARTNERS_LIST } from '../data/mockData';
import { PartnerItem } from '../types';
import { ExternalLink, Handshake } from 'lucide-react';

interface PartnersMarqueeProps {
  partners?: PartnerItem[];
  onOpenAdmin?: () => void;
}

export const PartnersMarquee: React.FC<PartnersMarqueeProps> = ({
  partners = PARTNERS_LIST,
  onOpenAdmin
}) => {
  // Only display partners that have isDisplayed !== false
  const activePartners = partners.filter((p) => p.isDisplayed !== false);

  const isImageUrl = (val?: string) => {
    if (!val) return false;
    return val.startsWith('http://') || val.startsWith('https://') || val.startsWith('/') || val.startsWith('data:image');
  };

  return (
    <section id="partners" className="py-16 sm:py-20 bg-white border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 border border-rose-200/60 text-rose-700 text-xs font-bold uppercase tracking-wider mb-2">
            <Handshake className="w-3.5 h-3.5" />
            <span>Institutional Backing</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0B1E48] tracking-tight">
            Our Partners
          </h2>
          <p className="mt-2 text-sm text-slate-500 font-normal max-w-2xl mx-auto">
            Backed by visionary governments, global technology leaders, and premier financial institutions advancing economic transformation.
          </p>
        </div>

        {/* Partners Badges & Logos Row */}
        <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 md:gap-8">
          {activePartners.map((partner) => {
            const hasImage = isImageUrl(partner.logoUrl) || isImageUrl(partner.logo);
            const imageSrc = partner.logoUrl || (isImageUrl(partner.logo) ? partner.logo : undefined);

            const CardContent = (
              <div className="flex items-center gap-3 px-4 py-2.5 rounded-xl border border-slate-200/80 bg-slate-50/70 hover:bg-white hover:border-[#0B1E48]/30 hover:shadow-md transition-all group cursor-pointer">
                {hasImage && imageSrc ? (
                  <div className="w-8 h-8 rounded-lg overflow-hidden bg-white p-1 border border-slate-200 shrink-0 flex items-center justify-center">
                    <img
                      src={imageSrc}
                      alt={partner.name}
                      className="w-full h-full object-contain"
                      onError={(e) => {
                        // Fallback to text initials if image fails
                        e.currentTarget.style.display = 'none';
                        const parent = e.currentTarget.parentElement;
                        if (parent) {
                          parent.innerHTML = `<span class="text-xs font-bold text-[#0B1E48]">${partner.name.charAt(0)}</span>`;
                        }
                      }}
                    />
                  </div>
                ) : (
                  <div className="w-8 h-8 rounded-lg bg-[#0B1E48]/10 text-[#0B1E48] flex items-center justify-center font-black text-xs group-hover:bg-[#DC2626] group-hover:text-white transition-colors shrink-0">
                    {partner.logo && !partner.logo.startsWith('http') ? partner.logo.slice(0, 2) : partner.name.charAt(0)}
                  </div>
                )}

                <div className="text-left">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs sm:text-sm font-bold text-slate-800 tracking-tight block group-hover:text-[#0B1E48] transition-colors">
                      {partner.name}
                    </span>
                    {partner.websiteUrl && (
                      <ExternalLink className="w-3 h-3 text-slate-400 group-hover:text-[#DC2626] transition-colors shrink-0 opacity-0 group-hover:opacity-100" />
                    )}
                  </div>
                  <span className="text-[10px] text-slate-500 font-medium block">
                    {partner.category}
                  </span>
                </div>
              </div>
            );

            return partner.websiteUrl ? (
              <a
                key={partner.id || partner.name}
                href={partner.websiteUrl}
                target="_blank"
                rel="noopener noreferrer"
                title={`Visit ${partner.name}`}
              >
                {CardContent}
              </a>
            ) : (
              <div key={partner.id || partner.name}>
                {CardContent}
              </div>
            );
          })}
        </div>

        {/* Co-Investment & Support Note */}
        <div className="mt-12 text-center text-xs text-slate-400">
          <span>Official ecosystem innovation partners supporting technical credits, venture grants, and state pilot programs.</span>
        </div>
      </div>
    </section>
  );
};

