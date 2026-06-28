import React from 'react';

const Logo = ({ className = "h-8 w-8" }) => {
  return (
    <svg 
      className={`${className} transition-all duration-300`} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2.5" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      {/* Background Heart with soft gradient opacity */}
      <path 
        d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" 
        className="fill-current text-purple-500/10 stroke-current text-purple-500/20 dark:text-purple-400/10 dark:stroke-purple-400/20" 
      />
      {/* Heartbeat pulse overlay */}
      <path 
        d="M3.5 10.5h2.5l2-4.5 3 10 2-8 2 4.5h4.5" 
        stroke="url(#logo-pulse-grad)" 
        strokeWidth="2.5" 
        className="drop-shadow-[0_0_6px_rgba(168,85,247,0.4)]" 
      />
      <defs>
        <linearGradient id="logo-pulse-grad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#3b82f6" />
          <stop offset="50%" stopColor="#a855f7" />
          <stop offset="100%" stopColor="#ec4899" />
        </linearGradient>
      </defs>
    </svg>
  );
};

export default Logo;
