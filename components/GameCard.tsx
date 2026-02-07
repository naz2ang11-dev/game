import React from 'react';
import { Team } from '../types';
import { Footprints } from 'lucide-react';

interface GameCardProps {
  team: 'RED' | 'BLUE';
  isActive: boolean;
  isAnimating: boolean;
}

export const GameCard: React.FC<GameCardProps> = ({ team, isActive, isAnimating }) => {
  const isRed = team === 'RED';
  
  // Base styles
  const containerBase = `
    relative w-full aspect-square max-w-[320px] rounded-[2.5rem] flex flex-col items-center justify-center transition-all duration-300 ease-in-out
  `;
  
  // Active vs Inactive styles
  const activeStyle = isRed 
    ? 'bg-red-600 shadow-xl shadow-red-200 scale-100 opacity-100 z-10 border-4 border-red-400/50' 
    : 'bg-blue-500 shadow-xl shadow-blue-200 scale-100 opacity-100 z-10 border-4 border-blue-400/50';

  const inactiveStyle = `bg-gray-100 shadow-inner scale-95 opacity-40 grayscale`;

  const appliedStyle = isActive ? activeStyle : inactiveStyle;

  return (
    <div className={`${containerBase} ${appliedStyle} ${isAnimating && isActive ? 'animate-pulse' : ''}`}>
      {/* Decorative Stars (Only visible when active for flavor) */}
      {isActive && (
        <>
          <span className="absolute top-8 left-6 text-yellow-300 text-4xl animate-bounce" style={{ animationDelay: '0s' }}>✦</span>
          <span className="absolute top-12 right-8 text-yellow-300 text-3xl animate-bounce" style={{ animationDelay: '0.2s' }}>✦</span>
        </>
      )}

      {/* Main Text */}
      <h2 className={`font-jua text-7xl md:text-8xl tracking-tight mb-6 ${isActive ? 'text-white drop-shadow-md' : 'text-gray-300'}`}>
        {isRed ? '빨강' : '파랑'}
      </h2>

      {/* Action Pill */}
      {isActive && (
        <div className={`
          flex items-center gap-2 px-6 py-3 rounded-full 
          ${isRed ? 'bg-red-700/50 text-red-50' : 'bg-blue-700/50 text-blue-50'}
          backdrop-blur-sm border border-white/20 shadow-sm
        `}>
          <Footprints className="w-5 h-5" />
          <span className="font-bold text-lg whitespace-nowrap">한 걸음 전진!</span>
        </div>
      )}
    </div>
  );
};
