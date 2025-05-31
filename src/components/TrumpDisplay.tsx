import React from 'react';
import { Card as CardType, Suit } from '../types/game';
import { Card } from './Card';
import { getSuitEmoji, getSuitColor } from '../utils/cardUtils';

interface TrumpDisplayProps {
  trumpSuit: Suit | null;
  trumpCard: CardType | null;
}

export const TrumpDisplay: React.FC<TrumpDisplayProps> = ({ trumpSuit, trumpCard }) => {
  if (!trumpSuit) {
    return (
      <div className="bg-white/5 p-4 rounded-lg flex items-center justify-center">
        <span className="text-white">No trump suit selected yet</span>
      </div>
    );
  }
  
  const suitEmoji = getSuitEmoji(trumpSuit);
  const suitColor = getSuitColor(trumpSuit);
  
  return (
    <div className="bg-white/10 p-4 rounded-lg">
      <h2 className="text-white font-semibold mb-2">Trump Suit</h2>
      
      <div className="flex items-center gap-4">
        <div className="bg-white p-2 rounded-lg flex items-center">
          <span className={`text-2xl ${suitColor}`}>{suitEmoji}</span>
          <span className="ml-2 font-semibold capitalize">{trumpSuit}</span>
        </div>
        
        {trumpCard && (
          <div className="flex items-center">
            <span className="text-white mr-2">Trump Card:</span>
            <Card card={trumpCard} isPlayable={false} size="sm" />
          </div>
        )}
      </div>
    </div>
  );
};