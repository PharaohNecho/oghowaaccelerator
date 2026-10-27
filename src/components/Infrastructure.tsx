import React from 'react';
import { motion } from 'framer-motion';
import {
  Cloud,
  Cpu,
  CreditCard,
  ShieldCheck,
  LineChart,
  Truck,
  Users,
  Megaphone,
  Code2,
  Lock,
  Building,
  Network
} from 'lucide-react';
import { INFRASTRUCTURE_ITEMS } from '../data/mockData';

export const Infrastructure: React.FC = () => {
  const getInfraIcon = (iconName: string) => {
    const iconClass = "w-6 h-6 text-white group-hover:text-rose-400 transition-colors";
    switch (iconName) {
      case 'Cloud':
        return <Cloud className={iconClass} />;
      case 'Cpu':
        return <Cpu className={iconClass} />;
      case 'CreditCard':
        return <CreditCard className={iconClass} />;
      case 'ShieldCheck':
        return <ShieldCheck className={iconClass} />;
      case 'LineChart':
        return <LineChart className={iconClass} />;
      case 'Truck':
        return <Truck className={iconClass} />;
      case 'Users':
        return <Users className={iconClass} />;
      case 'Megaphone':
        return <Megaphone className={iconClass} />;
      case 'Code2':
        return <Code2 className={iconClass} />;
      case 'Lock':
        return <Lock className={iconClass} />;
      case 'Building':
        return <Building className={iconClass} />;
      case 'Network':
        return <Network className={iconClass} />;
      default:
        return <Cloud className={iconClass} />;
    }
  };

  return (
    <section className="py-16 sm:py-20 bg-[#091E48] text-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="text-center max-w-3xl mx-auto mb-14"
        >
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Infrastructure That Builds Businesses
          </h2>
          <p className="mt-2.5 text-sm sm:text-base text-blue-200/80 font-normal">
            We provide access to critical infrastructure so founders can build and scale faster.
          </p>
        </motion.div>

        {/* 12 Infrastructure Items Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 sm:gap-6">
          {INFRASTRUCTURE_ITEMS.map((item, idx) => (
            <motion.div
              key={item.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.4, delay: idx * 0.04, ease: 'easeOut' }}
              className="group p-5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 transition-all duration-200 flex flex-col items-center text-center cursor-default"
            >
              <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                {getInfraIcon(item.icon)}
              </div>
              <span className="text-xs sm:text-sm font-medium text-slate-200 group-hover:text-white transition-colors">
                {item.name}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
