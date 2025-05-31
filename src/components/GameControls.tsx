import React from 'react';
import { GamePhase } from '../types/game';

interface GameControlsProps {
  phase: GamePhase;
  allPlayersDeclared: boolean;
  onFinishBidding: () => void;
  onFinishRound: () => void;
  onResetGame: () => void;
}

export const GameControls: React.FC<GameControlsProps> = ({
  phase,
  allPlayersDeclared,
  onFinishBidding,
  onFinishRound,
  onResetGame
}) => {
  return (
    <div className="bg-white/10 p-4 rounded-lg">
      <h2 className="text-white font-semibold mb-2">Game Controls</h2>
      
      <div className="flex gap-2">
        {phase === 'bidding' && allPlayersDeclared && (
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            onClick={onFinishBidding}
          >
            Start Playing
          </button>
        )}
        
        {phase === 'scoring' && (
          <button
            className="bg-green-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-700 transition-colors"
            onClick={onFinishRound}
          >
            Next Round
          </button>
        )}
        
        {phase === 'gameOver' && (
          <button
            className="bg-yellow-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-yellow-700 transition-colors"
            onClick={onResetGame}
          >
            New Game
          </button>
        )}
        
        <button
          className="bg-red-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-red-700 transition-colors"
          onClick={onResetGame}
        >
          Reset Game
        </button>
      </div>
    </div>
  );
};