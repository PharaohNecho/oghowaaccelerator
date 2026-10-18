import React, { useState } from 'react';
import { Compass, Wrench, BarChart2, Coins, Globe2, Award, ChevronRight, CheckCircle2 } from 'lucide-react';
import { JOURNEY_STEPS } from '../data/mockData';

interface JourneyProps {
  onStartApplication: () => void;
}

export const Journey: React.FC<JourneyProps> = ({ onStartApplication }) => {
  const [activeStage, setActiveStage] = useState<number>(3); // Default to 'Fund' (step 4, index 3) matching red highlight!

  const getStepIcon = (iconName: string, isHighlighted: boolean, isSelected: boolean) => {
    const iconClass = isHighlighted ? 'text-white' : isSelected ? 'text-white' : 'text-slate-700';
    switch (iconName) {
      case 'Compass':
        return <Compass className={`w-5 h-5 ${iconClass}`} />;
      case 'Wrench':
        return <Wrench className={`w-5 h-5 ${iconClass}`} />;
      case 'BarChart2':
        return <BarChart2 className={`w-5 h-5 ${iconClass}`} />;
      case 'Coins':
        return <Coins className={`w-5 h-5 ${iconClass}`} />;
      case 'Globe2':
        return <Globe2 className={`w-5 h-5 ${iconClass}`} />;
      case 'Award':
        return <Award className={`w-5 h-5 ${iconClass}`} />;
      default:
        return <Compass className={`w-5 h-5 ${iconClass}`} />;
    }
  };

  const selectedStep = JOURNEY_STEPS[activeStage];

  return (
    <section id="journey" className="py-20 sm:py-24 bg-slate-50/60 border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0B1E48] tracking-tight">
            The Óghowa Journey
          </h2>
          <p className="mt-3 text-base sm:text-lg text-slate-600 font-normal">
            We support entrepreneurs throughout their entire venture lifecycle—from idea to impact.
          </p>
        </div>

        {/* Step progression line (Horizontal in desktop, scroll/grid in mobile) */}
        <div className="relative mb-12">
          {/* Connector Line behind circles */}
          <div className="hidden lg:block absolute top-7 left-12 right-12 h-0.5 bg-slate-200 z-0" />

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 relative z-10">
            {JOURNEY_STEPS.map((step, index) => {
              const isSelected = activeStage === index;
              const isFundStep = step.highlight; // The red highlighted step in the original image

              return (
                <button
                  key={step.title}
                  onClick={() => setActiveStage(index)}
                  className={`text-center flex flex-col items-center group focus:outline-hidden p-3 rounded-xl transition-all ${
                    isSelected ? 'bg-white shadow-md ring-1 ring-slate-200' : 'hover:bg-white/60'
                  }`}
                >
                  {/* Circular step badge */}
                  <div
                    className={`relative w-14 h-14 rounded-full flex items-center justify-center mb-4 transition-transform duration-200 group-hover:scale-105 shadow-sm ${
                      isFundStep
                        ? 'bg-[#DC2626] ring-4 ring-rose-100'
                        : isSelected
                        ? 'bg-[#0B1E48] ring-4 ring-slate-100'
                        : 'bg-white border-2 border-slate-200 text-slate-700'
                    }`}
                  >
                    {getStepIcon(step.icon, isFundStep, isSelected)}

                    {/* Step number subscript */}
                    <span
                      className={`absolute -bottom-1 -right-1 text-[10px] font-bold px-1.5 py-0.2 rounded-full ${
                        isFundStep ? 'bg-white text-rose-600 shadow-xs' : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {step.number}
                    </span>
                  </div>

                  {/* Title */}
                  <h3
                    className={`text-base font-bold transition-colors ${
                      isFundStep ? 'text-[#DC2626]' : isSelected ? 'text-[#0B1E48]' : 'text-slate-800'
                    }`}
                  >
                    {step.title}
                  </h3>

                  {/* Short summary matching image */}
                  <p className="mt-2 text-xs text-slate-500 leading-relaxed text-center line-clamp-3">
                    {step.summary}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Stage Detail Box */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-100">
            <div className="flex items-center gap-4">
              <span className="text-3xl font-black text-rose-600">
                Phase {selectedStep.number}
              </span>
              <div>
                <h4 className="text-xl sm:text-2xl font-bold text-[#0B1E48]">
                  {selectedStep.title}: Detailed Program Framework
                </h4>
                <p className="text-sm text-slate-600 mt-0.5">
                  {selectedStep.summary}
                </p>
              </div>
            </div>

            <button
              onClick={onStartApplication}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#0B1E48] hover:bg-[#153474] text-white text-sm font-semibold transition-colors self-start md:self-auto cursor-pointer"
            >
              <span>Apply for this Track</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="pt-6 grid grid-cols-1 md:grid-cols-12 gap-6">
            <div className="md:col-span-8">
              <h5 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                Operational Overview & Ecosystem Support
              </h5>
              <p className="text-slate-700 text-sm sm:text-base leading-relaxed">
                {selectedStep.details}
              </p>

              <div className="mt-6 flex flex-wrap gap-2 text-xs text-slate-600">
                <span className="font-semibold text-slate-900">Key Deliverables:</span>
                <span className="bg-slate-100 px-2.5 py-1 rounded-md">Weekly Office Hours</span>
                <span className="bg-slate-100 px-2.5 py-1 rounded-md">Dedicated Advisor Assigned</span>
                <span className="bg-slate-100 px-2.5 py-1 rounded-md">Vetted Capital Introductions</span>
                <span className="bg-slate-100 px-2.5 py-1 rounded-md">Edo Innovates Sandbox Access</span>
              </div>
            </div>

            <div className="md:col-span-4 bg-slate-50 p-5 rounded-xl border border-slate-100 space-y-3">
              <h5 className="text-xs font-bold text-[#0B1E48] uppercase tracking-wider">
                Founder Milestones
              </h5>
              <div className="space-y-2 text-xs text-slate-600">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Problem-Solution Fit audit signed off</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Verified pilot data & user retention metrics</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Institutional investment deck & data room prep</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
