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
  showTagline = true,
  inverted = false
}) => {
  // Height configurations
  const heightMap = {
    sm: 'h-8',
    md: 'h-11',
    lg: 'h-14',
    xl: 'h-18'
  };

  const blueColor = inverted ? '#60A5FA' : '#0022E6';
  const redColor = inverted ? '#F87171' : '#E01D1D';
  const ringColor = '#0022E6';

  return (
    <div className={`inline-flex items-center gap-2.5 select-none ${className}`}>
      {/* Exact Crest / Benin Bronze Queen Idia Emblem from the user's uploaded logo */}
      <svg
        viewBox="0 0 100 105"
        className={`${heightMap[size]} w-auto shrink-0`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-label="Óghowa Emblem"
      >
        {/* Top blue bar element of the logo */}
        <rect x="22" y="4" width="56" height="13" rx="2" fill={ringColor} />

        {/* Outer Circular Blue Ring */}
        <circle cx="50" cy="58" r="42" fill={ringColor} />

        {/* White Inner Gap Ring */}
        <circle cx="50" cy="58" r="30" fill="#FFFFFF" />

        {/* Inner Blue Border for the Benin Bronze portrait */}
        <circle cx="50" cy="58" r="28" fill="#F8F3EA" />

        {/* Top arc text: Óghowa */}
        <path id="topArc" d="M 24 54 A 26 26 0 0 1 76 54" fill="none" />
        <text fill="#FFFFFF" fontSize="8.5" fontWeight="800" letterSpacing="0.8">
          <textPath href="#topArc" startOffset="50%" textAnchor="middle">
            Óghowa
          </textPath>
        </text>

        {/* Bottom arc text: OUR OWN */}
        <path id="bottomArc" d="M 23 60 A 26 26 0 0 0 77 60" fill="none" />
        <text fill="#FFFFFF" fontSize="7.5" fontWeight="900" letterSpacing="0.5">
          <textPath href="#bottomArc" startOffset="50%" textAnchor="middle">
            OUR OWN
          </textPath>
        </text>

        {/* Queen Idia / Benin Bronze Mask Illustration */}
        <g transform="translate(32, 38)">
          {/* Crown / Lattice Headdress with beaded spikes */}
          <path
            d="M 6 12 C 6 6, 12 3, 18 3 C 24 3, 30 6, 30 12 Z"
            fill="#B87333"
            stroke="#633917"
            strokeWidth="1"
          />
          {/* Crown reticulated decorative bands */}
          <line x1="8" y1="7" x2="28" y2="7" stroke="#E5A866" strokeWidth="1" />
          <line x1="10" y1="10" x2="26" y2="10" stroke="#8C4F1A" strokeWidth="1" />
          <circle cx="12" cy="4.5" r="1.2" fill="#E5A866" />
          <circle cx="18" cy="3.5" r="1.2" fill="#E5A866" />
          <circle cx="24" cy="4.5" r="1.2" fill="#E5A866" />

          {/* Mask Oval Face Contour */}
          <path
            d="M 8 12 Q 5 24 9 32 Q 13 37 18 38 Q 23 37 27 32 Q 31 24 28 12 Z"
            fill="url(#bronzeGradient)"
            stroke="#5A2E0D"
            strokeWidth="1.2"
          />

          {/* Scarification lines on forehead (Benin traditional marks) */}
          <line x1="16.5" y1="13" x2="16.5" y2="16.5" stroke="#5A2E0D" strokeWidth="1" />
          <line x1="19.5" y1="13" x2="19.5" y2="16.5" stroke="#5A2E0D" strokeWidth="1" />

          {/* Stylized Almond Eyes */}
          <ellipse cx="13" cy="20" rx="3" ry="2" fill="#2E1605" />
          <ellipse cx="23" cy="20" rx="3" ry="2" fill="#2E1605" />
          <circle cx="13.5" cy="19.5" r="0.7" fill="#E5A866" />
          <circle cx="23.5" cy="19.5" r="0.7" fill="#E5A866" />

          {/* Nose bridge */}
          <path d="M 18 17 L 16.5 25 L 19.5 25 Z" fill="#99571F" />

          {/* Full Carved Benin Lips */}
          <ellipse cx="18" cy="29" rx="3.5" ry="1.6" fill="#5A2E0D" />
          <line x1="15" y1="29" x2="21" y2="29" stroke="#E5A866" strokeWidth="0.6" />

          {/* Neck Beaded Choker Collar */}
          <path
            d="M 12 37 Q 18 39 24 37 L 25 41 Q 18 43 11 41 Z"
            fill="#804312"
            stroke="#4A250A"
            strokeWidth="0.8"
          />
          <line x1="13" y1="39" x2="23" y2="39" stroke="#E5A866" strokeWidth="0.8" strokeDasharray="1.5,1" />
        </g>

        {/* Gradients */}
        <defs>
          <linearGradient id="bronzeGradient" x1="8" y1="12" x2="28" y2="38" gradientUnits="userSpaceOnUse">
            <stop stopColor="#DCA165" />
            <stop offset="0.4" stopColor="#B36829" />
            <stop offset="0.8" stopColor="#8A4A19" />
            <stop offset="1" stopColor="#54290B" />
          </linearGradient>
        </defs>
      </svg>

      {/* Brand Typography matching user image: "ÒGHOWA" in bold blue serif + "Our own" in red italic */}
      <div className="flex flex-col justify-center leading-none">
        <span
          className="font-serif font-black tracking-tight uppercase"
          style={{
            color: blueColor,
            fontSize: size === 'sm' ? '1.25rem' : size === 'lg' ? '2.1rem' : size === 'xl' ? '2.6rem' : '1.65rem',
            letterSpacing: '-0.02em',
            lineHeight: 0.95
          }}
        >
          ÒGHOWA
        </span>

        {showTagline && (
          <span
            className="font-serif italic font-bold tracking-tight text-right -mt-0.5"
            style={{
              color: redColor,
              fontSize: size === 'sm' ? '0.7rem' : size === 'lg' ? '1.05rem' : size === 'xl' ? '1.25rem' : '0.88rem',
              letterSpacing: '-0.01em'
            }}
          >
            Our own
          </span>
        )}
      </div>
    </div>
  );
};
