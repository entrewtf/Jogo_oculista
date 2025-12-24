import React from 'react';
import { Direction } from '../types';
import { ROTATION_MAP } from '../constants';

interface OptotypeProps {
  direction: Direction;
  isActive?: boolean;
  status: 'pending' | 'correct' | 'wrong' | 'current';
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

const Optotype: React.FC<OptotypeProps> = ({ direction, isActive, status, size = 'md' }) => {
  const rotation = ROTATION_MAP[direction];
  
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-20 h-20',
    xl: 'w-32 h-32',
  };

  // Status colors
  let colorClass = 'fill-white';
  let containerClass = 'transition-all duration-200 rounded-lg p-2';

  if (status === 'correct') {
    colorClass = 'fill-green-500';
    containerClass += ' opacity-50';
  } else if (status === 'wrong') {
    colorClass = 'fill-red-500';
    containerClass += ' opacity-50';
  } else if (isActive) {
    colorClass = 'fill-amber-500';
    containerClass += ' bg-neutral-800 ring-2 ring-amber-500 shadow-[0_0_20px_rgba(245,158,11,0.2)] scale-110 z-10';
  } else {
    colorClass = 'fill-neutral-400';
  }

  return (
    <div 
      className={`${containerClass} flex items-center justify-center`}
    >
      <svg 
        viewBox="0 0 100 100" 
        className={`${sizeClasses[size]} transition-transform duration-300 ease-out`}
        style={{ transform: `rotate(${rotation}deg)` }}
      >
        {/* Simplified Snellen E path */}
        <path 
          d="M20 20 H80 V35 H35 V42.5 H70 V57.5 H35 V65 H80 V80 H20 V20 Z" 
          className={colorClass}
        />
      </svg>
    </div>
  );
};

export default Optotype;