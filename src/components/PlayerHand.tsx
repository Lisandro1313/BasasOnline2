import React from 'react';
import { Card as CardType } from '../types/game';
import { Card } from './Card';
import { isCardPlayable, sortCards } from '../utils/cardUtils';
import { useGameStore } from '../store/gameStore';

interface PlayerHandProps {
  playerId: string;
  hand: CardType[];
  isActive: boolean;
  onPlayCard: (cardId: string) => void;
}

export const PlayerHand: React.FC<PlayerHandProps> = ({ 
  playerId, 
  hand, 
  isActive, 
  onPlayCard 
}) => {
  const { game } = useGameStore();
  const { currentTrick, trumpSuit, phase } = game;
  
  // Sort cards by suit and value
  const sortedHand = sortCards(hand);
  
  return (
    <div className={`p-2 rounded-lg ${isActive ? 'bg-blue-100 animate-pulse' : 'bg-gray-50'}`}>
      <div className="flex flex-wrap justify-center gap-1">
        {sortedHand.map((card) => {
          const canPlay = 
            phase === 'playing' && 
            isActive && 
            isCardPlayable(card, hand, currentTrick, trumpSuit);
          
          return (
            <div key={card.id} className="transform hover:z-10">
              <Card
                card={card}
                isPlayable={canPlay}
                onClick={() => canPlay && onPlayCard(card.id)}
                size="md"
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};