import React from 'react';

interface OghowaLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showTagline?: boolean;
  inverted?: boolean;
}

export const OghowaLogo: React.FC<OghowaLogoProps> = ({
  className = '',
  size = 'md',
}) => {
  // Height configurations
  const heightMap = {
    sm: 'h-8 sm:h-9',
    md: 'h-10 sm:h-12',
    lg: 'h-14 sm:h-16',
    xl: 'h-18 sm:h-20'
  };

  return (
    <div className={`inline-flex items-center select-none ${className}`}>
      <img
        src="/assets/aistudio/logo_1d35d165.png"
        alt="Óghowa Accelerator Logo"
        className={`${heightMap[size]} w-auto object-contain transition-transform duration-200 hover:scale-[1.02]`}
        loading="eager"
      />
    </div>
  );
};
