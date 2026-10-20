import React from 'react';

interface BusinessWeekLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const BusinessWeekLogo: React.FC<BusinessWeekLogoProps> = ({
  className = '',
  size = 'md'
}) => {
  const heightMap = {
    sm: 'h-9 sm:h-10',
    md: 'h-12 sm:h-14',
    lg: 'h-16 sm:h-20',
    xl: 'h-22 sm:h-28'
  };

  return (
    <div className={`inline-flex items-center select-none ${className}`}>
      <img
        src="/assets/aistudio/unnamed_f68d79ae.jpg"
        alt="Óghowa Business Week Logo"
        className={`${heightMap[size]} w-auto object-contain transition-transform duration-200 hover:scale-[1.02]`}
        loading="eager"
      />
    </div>
  );
};
