
import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  withText?: boolean;
}

const Logo: React.FC<LogoProps> = ({ size = 'md', withText = true }) => {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  return (
    <div className="flex items-center">
      <div className={`${sizeClasses[size]} relative`}>
        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="50" cy="50" r="45" stroke="currentColor" strokeWidth="10" />
          <circle cx="50" cy="50" r="30" stroke="currentColor" strokeWidth="10" />
          <circle cx="50" cy="50" r="15" stroke="currentColor" strokeWidth="10" />
        </svg>
      </div>
      {withText && (
        <span className="ml-3 font-display font-bold text-xl md:text-2xl">World Wide Wax</span>
      )}
    </div>
  );
};

export default Logo;
