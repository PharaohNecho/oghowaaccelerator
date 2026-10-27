import React from 'react';
import { motion } from 'framer-motion';
import { Rocket, Coins, Users, Handshake, Layers, CalendarDays } from 'lucide-react';
import { IMPACT_METRICS } from '../data/mockData';

export const ImpactStats: React.FC = () => {
  const getImpactIcon = (iconName: string) => {
    switch (iconName) {
      case 'Rocket':
        return <Rocket className="w-6 h-6 text-rose-500" />;
      case 'Coins':
        return <Coins className="w-6 h-6 text-emerald-500" />;
      case 'Users':
        return <Users className="w-6 h-6 text-blue-500" />;
      case 'Handshake':
        return <Handshake className="w-6 h-6 text-indigo-500" />;
      case 'Layers':
        return <Layers className="w-6 h-6 text-amber-500" />;
      case 'CalendarDays':
        return <CalendarDays className="w-6 h-6 text-rose-500" />;
      default:
        return <Rocket className="w-6 h-6 text-rose-500" />;
    }
  };

  return (
    <section className="py-20 sm:py-24 bg-white border-b border-slate-100 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0B1E48] tracking-tight">
            Our Impact
          </h2>
          <p className="mt-2 text-sm sm:text-base text-slate-500">
            Real outcomes powering venture creation across Edo State and Sub-Saharan Africa.
          </p>
        </motion.div>

        {/* 6 Metrics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 sm:gap-8">
          {IMPACT_METRICS.map((metric, idx) => (
            <motion.div
              key={metric.label}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.45, delay: idx * 0.07, ease: 'easeOut' }}
              className="p-6 rounded-xl bg-slate-50/70 border border-slate-200/80 hover:border-slate-300 transition-all text-center flex flex-col items-center group hover:bg-white hover:shadow-lg"
            >
              <div className="w-12 h-12 rounded-full bg-white shadow-xs flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                {getImpactIcon(metric.icon)}
              </div>
              <p className="text-2xl sm:text-3xl font-extrabold text-[#0B1E48] tracking-tight mb-1">
                {metric.value}
              </p>
              <p className="text-xs sm:text-sm font-medium text-slate-500">
                {metric.label}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
