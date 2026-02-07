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
  // Increased max-w from 320px to 450px for much bigger buttons
  const containerBase = `
    relative w-full aspect-square max-w-[450px] rounded-[3rem] flex flex-col items-center justify-center transition-all duration-300 ease-in-out
  `;
  
  // Active vs Inactive styles
  const activeStyle = isRed 
    ? 'bg-red-600 shadow-xl shadow-red-200 scale-100 opacity-100 z-10 border-8 border-red-400/50' 
    : 'bg-blue-500 shadow-xl shadow-blue-200 scale-100 opacity-100 z-10 border-8 border-blue-400/50';

  const inactiveStyle = `bg-gray-100 shadow-inner scale-95 opacity-40 grayscale`;

  const appliedStyle = isActive ? activeStyle : inactiveStyle;

  return (
    <div className={`${containerBase} ${appliedStyle} ${isAnimating && isActive ? 'animate-pulse' : ''}`}>
      {/* Decorative Stars (Only visible when active for flavor) */}
      {isActive && (
        <>
          <span className="absolute top-10 left-8 text-yellow-300 text-5xl animate-bounce" style={{ animationDelay: '0s' }}>✦</span>
          <span className="absolute top-16 right-10 text-yellow-300 text-4xl animate-bounce" style={{ animationDelay: '0.2s' }}>✦</span>
        </>
      )}

      {/* Main Text - Increased size */}
      <h2 className={`font-jua text-8xl md:text-9xl tracking-tight mb-8 ${isActive ? 'text-white drop-shadow-md' : 'text-gray-300'}`}>
        {isRed ? '빨강' : '파랑'}
      </h2>

      {/* Action Pill - Slightly bigger */}
      {isActive && (
        <div className={`
          flex items-center gap-3 px-8 py-4 rounded-full 
          ${isRed ? 'bg-red-700/50 text-red-50' : 'bg-blue-700/50 text-blue-50'}
          backdrop-blur-sm border-2 border-white/20 shadow-sm
        `}>
          <Footprints className="w-6 h-6" />
          <span className="font-bold text-xl whitespace-nowrap">한 걸음 전진!</span>
        </div>
      )}
    </div>
  );
};