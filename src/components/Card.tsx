import React from 'react';
import { Card as CardType, Suit } from '../types/game';
import { getCardValueDisplay, getSuitEmoji, getSuitColor } from '../utils/cardUtils';

interface CardProps {
  card: CardType;
  isPlayable?: boolean;
  onClick?: () => void;
  faceDown?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const Card: React.FC<CardProps> = ({ 
  card, 
  isPlayable = true, 
  onClick, 
  faceDown = false,
  size = 'md'
}) => {
  const { suit, value } = card;
  
  const suitEmoji = getSuitEmoji(suit);
  const valueDisplay = getCardValueDisplay(value);
  const suitColor = getSuitColor(suit);
  
  // Size classes
  const sizeClasses = {
    sm: 'w-12 h-16 text-xs',
    md: 'w-16 h-22 text-sm',
    lg: 'w-20 h-28 text-base'
  };
  
  const handleClick = () => {
    if (isPlayable && onClick) {
      onClick();
    }
  };
  
  if (faceDown) {
    return (
      <div 
        className={`${sizeClasses[size]} bg-blue-800 rounded-md border-2 border-white shadow-md 
          flex items-center justify-center cursor-default transition-transform`}
      >
        <div className="bg-white/10 rounded-sm w-3/4 h-3/4 flex items-center justify-center">
          <span className="text-white font-bold">♠♥♦♣</span>
        </div>
      </div>
    );
  }
  
  return (
    <div 
      className={`${sizeClasses[size]} bg-white rounded-md border-2 
        ${isPlayable ? 'border-gray-300 hover:border-blue-500 cursor-pointer' : 'border-gray-200 opacity-90 cursor-default'} 
        shadow-md flex flex-col p-1 select-none transition-all
        ${isPlayable ? 'hover:-translate-y-1' : ''}`}
      onClick={handleClick}
    >
      <div className="flex justify-between items-center mb-1">
        <span className={`${suitColor} font-bold`}>{valueDisplay}</span>
        <span className={`${suitColor}`}>{suitEmoji}</span>
      </div>
      
      <div className={`grow flex items-center justify-center ${suitColor} text-xl`}>
        {suitEmoji}
      </div>
      
      <div className="flex justify-between items-center mt-1 rotate-180">
        <span className={`${suitColor} font-bold`}>{valueDisplay}</span>
        <span className={`${suitColor}`}>{suitEmoji}</span>
      </div>
    </div>
  );
};