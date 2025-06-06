
import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  color?: string;
}

const Logo: React.FC<LogoProps> = ({ size = 'md', color = '#3B82F6' }) => {
  // Calculate size dimensions based on prop
  const dimensions = {
    sm: { width: 24, height: 24 },
    md: { width: 32, height: 32 },
    lg: { width: 48, height: 48 },
  }[size];

  return (
    <svg 
      width={dimensions.width} 
      height={dimensions.height} 
      viewBox="0 0 24 24" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Flow diagram shape */}
      <path 
        d="M4 5C4 4.44772 4.44772 4 5 4H19C19.5523 4 20 4.44772 20 5V7C20 7.55228 19.5523 8 19 8H5C4.44772 8 4 7.55228 4 7V5Z" 
        fill={color} 
      />
      <path 
        d="M4 11C4 10.4477 4.44772 10 5 10H12C12.5523 10 13 10.4477 13 11V13C13 13.5523 12.5523 14 12 14H5C4.44772 14 4 13.5523 4 13V11Z" 
        fill={color} 
      />
      <path 
        d="M4 17C4 16.4477 4.44772 16 5 16H9C9.55228 16 10 16.4477 10 17V19C10 19.5523 9.55228 20 9 20H5C4.44772 20 4 19.5523 4 19V17Z" 
        fill={color} 
      />
      <path 
        d="M16 14C15.4477 14 15 13.5523 15 13V11C15 10.4477 15.4477 10 16 10H19C19.5523 10 20 10.4477 20 11V13C20 13.5523 19.5523 14 19 14H16Z" 
        fill={color} 
      />
      <path 
        d="M13 17C13 16.4477 13.4477 16 14 16H19C19.5523 16 20 16.4477 20 17V19C20 19.5523 19.5523 20 19 20H14C13.4477 20 13 19.5523 13 19V17Z" 
        fill={color} 
      />
      {/* Connection lines */}
      <path 
        d="M12 8V10" 
        stroke={color} 
        strokeWidth="2" 
        strokeLinecap="round"
      />
      <path 
        d="M7 14V16" 
        stroke={color} 
        strokeWidth="2" 
        strokeLinecap="round"
      />
      <path 
        d="M17 14V16" 
        stroke={color} 
        strokeWidth="2" 
        strokeLinecap="round"
      />
    </svg>
  );
};

export default Logo;
