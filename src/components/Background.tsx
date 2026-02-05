import React from 'react';

export const Background: React.FC = () => {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      {/* Base gradient */}
      <div className="absolute inset-0 bg-gradient-radial from-neura-dark via-neura-darker to-black" />
      
      {/* Animated gradient orbs */}
      <div className="absolute top-1/4 -left-1/4 w-[600px] h-[600px] bg-neura-cyan/10 rounded-full blur-[120px] animate-pulse-glow" />
      <div className="absolute bottom-1/4 -right-1/4 w-[500px] h-[500px] bg-neura-blue/10 rounded-full blur-[100px] animate-pulse-glow" style={{ animationDelay: '1s' }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-neura-purple/5 rounded-full blur-[150px]" />
      
      {/* Grid pattern */}
      <div 
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(0, 212, 255, 0.3) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 212, 255, 0.3) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
        }}
      />
      
      {/* Floating particles */}
      {Array.from({ length: 20 }).map((_, i) => (
        <div
          key={i}
          className="particle"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 6}s`,
            animationDuration: `${6 + Math.random() * 4}s`,
          }}
        />
      ))}
      
      {/* Hexagon pattern overlay */}
      <svg className="absolute inset-0 w-full h-full opacity-[0.02]">
        <defs>
          <pattern id="hexagons" width="50" height="43.4" patternUnits="userSpaceOnUse" patternTransform="scale(2)">
            <polygon 
              points="25,0 50,14.4 50,43.4 25,57.7 0,43.4 0,14.4" 
              fill="none" 
              stroke="#00D4FF" 
              strokeWidth="0.5"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#hexagons)" />
      </svg>
    </div>
  );
};
