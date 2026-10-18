import React from 'react';
import { Rocket, TrendingUp, Building2, Landmark, GraduationCap, Users2, ArrowRight } from 'lucide-react';
import { WHO_WE_SERVE_DATA } from '../data/mockData';

interface WhoWeServeProps {
  onSelectAudience: (audienceId: string) => void;
}

export const WhoWeServe: React.FC<WhoWeServeProps> = ({ onSelectAudience }) => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Rocket':
        return <Rocket className="w-6 h-6 text-rose-600" />;
      case 'TrendingUp':
        return <TrendingUp className="w-6 h-6 text-blue-600" />;
      case 'Building2':
        return <Building2 className="w-6 h-6 text-indigo-600" />;
      case 'Landmark':
        return <Landmark className="w-6 h-6 text-amber-600" />;
      case 'GraduationCap':
        return <GraduationCap className="w-6 h-6 text-emerald-600" />;
      case 'Users2':
        return <Users2 className="w-6 h-6 text-cyan-600" />;
      default:
        return <Rocket className="w-6 h-6 text-rose-600" />;
    }
  };

  return (
    <section id="ecosystem" className="py-20 sm:py-24 bg-white border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0B1E48] tracking-tight">
            Who We Serve
          </h2>
          <p className="mt-3 text-base sm:text-lg text-slate-600 font-normal">
            A platform for every player in the innovation economy.
          </p>
        </div>

        {/* 6 Grid Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {WHO_WE_SERVE_DATA.map((item) => (
            <div
              key={item.id}
              onClick={() => onSelectAudience(item.id)}
              className="group relative bg-white rounded-xl border border-slate-200/90 p-8 shadow-xs hover:shadow-xl hover:border-slate-300 transition-all duration-300 flex flex-col justify-between cursor-pointer"
            >
              <div>
                {/* Circular Icon with gentle tint */}
                <div className={`w-14 h-14 rounded-full ${item.bgColor} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 ring-1 ring-slate-900/5`}>
                  {getIcon(item.iconName)}
                </div>

                {/* Title */}
                <h3 className="text-xl font-bold text-[#0B1E48] mb-2 group-hover:text-rose-600 transition-colors">
                  {item.title}
                </h3>

                {/* Description */}
                <p className="text-sm text-slate-600 leading-relaxed">
                  {item.description}
                </p>
              </div>

              {/* Action Link */}
              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center gap-1.5 text-sm font-semibold text-rose-600 group-hover:text-rose-700">
                <span>{item.actionLabel}</span>
                <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
