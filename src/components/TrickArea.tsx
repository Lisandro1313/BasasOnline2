import React from 'react';
import { Card } from './Card';
import { Trick, Player } from '../types/game';

interface TrickAreaProps {
  currentTrick: Trick;
  players: Player[];
}

export const TrickArea: React.FC<TrickAreaProps> = ({ currentTrick, players }) => {
  const getPlayerName = (playerId: string) => {
    const player = players.find(p => p.id === playerId);
    return player?.name || 'Unknown';
  };
  
  return (
    <div className="bg-green-900 p-4 rounded-lg min-h-40">
      <h2 className="text-white font-semibold mb-2">Current Trick</h2>
      
      {currentTrick.cards.length === 0 ? (
        <div className="flex items-center justify-center h-32 text-white/70">
          No cards played yet
        </div>
      ) : (
        <div className="flex flex-wrap justify-center gap-4">
          {currentTrick.cards.map(({ card, playerId }) => (
            <div key={card.id} className="flex flex-col items-center">
              <Card card={card} isPlayable={false} size="md" />
              <span className="text-white text-sm mt-1">{getPlayerName(playerId)}</span>
            </div>
          ))}
        </div>
      )}
      
      {currentTrick.leadSuit && (
        <div className="mt-4 text-white text-sm">
          Lead suit: <span className="font-semibold">{currentTrick.leadSuit}</span>
        </div>
      )}
    </div>
  );
};