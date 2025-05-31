import React from 'react';
import { Player } from '../types/game';
import { useGameStore } from '../store/gameStore';

interface GameOverScreenProps {
  winner: Player;
  players: Player[];
}

export const GameOverScreen: React.FC<GameOverScreenProps> = ({ winner, players }) => {
  const { resetGame } = useGameStore();
  
  // Sort players by points (descending)
  const sortedPlayers = [...players].sort((a, b) => b.points - a.points);
  
  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-lg">
        <h1 className="text-2xl font-bold text-center mb-2">Game Over!</h1>
        
        <div className="flex items-center justify-center mb-6">
          <div className="bg-yellow-100 border-4 border-yellow-500 rounded-lg p-4 text-center">
            <div className="text-lg font-semibold">Winner</div>
            <div className="text-3xl font-bold text-yellow-700">{winner.name}</div>
            <div className="text-xl font-semibold text-yellow-600">{winner.points} points</div>
          </div>
        </div>
        
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-2">Final Scores</h2>
          <div className="bg-gray-100 rounded-lg p-2">
            {sortedPlayers.map((player, index) => (
              <div 
                key={player.id}
                className={`flex justify-between items-center p-2 rounded
                  ${index === 0 ? 'bg-yellow-100' : index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
              >
                <div className="flex items-center">
                  <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center mr-2">
                    {index + 1}
                  </div>
                  <span className="font-medium">{player.name}</span>
                </div>
                <span className="font-bold">{player.points}</span>
              </div>
            ))}
          </div>
        </div>
        
        <div className="flex gap-2">
          <button
            className="flex-1 bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors"
            onClick={resetGame}
          >
            New Game
          </button>
        </div>
      </div>
    </div>
  );
};