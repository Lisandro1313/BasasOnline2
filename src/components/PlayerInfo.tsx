import React from 'react';
import { Player } from '../types/game';

interface PlayerInfoProps {
  player: Player;
  isActive: boolean;
  showBidding: boolean;
  showTricks: boolean;
}

export const PlayerInfo: React.FC<PlayerInfoProps> = ({
  player,
  isActive,
  showBidding,
  showTricks
}) => {
  return (
    <div 
      className={`p-3 rounded-lg flex items-center justify-between
        ${isActive 
          ? 'bg-blue-600 text-white shadow-lg border-2 border-yellow-300' 
          : 'bg-white/10 text-white'
        }
        transition-all duration-300`}
    >
      <div className="flex items-center">
        <div 
          className={`h-8 w-8 rounded-full flex items-center justify-center mr-2 
            ${isActive ? 'bg-yellow-300 text-blue-600' : 'bg-white/20 text-white'}`}
        >
          {player.name.charAt(0).toUpperCase()}
        </div>
        <div>
          <div className="font-semibold">{player.name}</div>
          <div className="text-xs opacity-80">Total: {player.points} pts</div>
        </div>
      </div>
      
      <div className="flex gap-2">
        {showBidding && (
          <div className="bg-white/20 px-2 py-1 rounded text-xs">
            Bid: {player.declaredTricks}
          </div>
        )}
        
        {showTricks && (
          <div className="bg-white/20 px-2 py-1 rounded text-xs">
            Won: {player.wonTricks}
          </div>
        )}
      </div>
    </div>
  );
};