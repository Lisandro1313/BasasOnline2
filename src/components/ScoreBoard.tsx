import React, { useState } from 'react';
import { Player, RoundHistory } from '../types/game';

interface ScoreBoardProps {
  players: Player[];
  history: RoundHistory[];
}

export const ScoreBoard: React.FC<ScoreBoardProps> = ({ players, history }) => {
  const [expanded, setExpanded] = useState(false);
  
  const sortedPlayers = [...players].sort((a, b) => b.points - a.points);
  
  return (
    <div className="bg-white/10 p-4 rounded-lg">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-white font-semibold">Scoreboard</h2>
        <button 
          className="text-white text-sm bg-white/20 px-2 py-1 rounded hover:bg-white/30 transition-colors"
          onClick={() => setExpanded(!expanded)}
        >
          {expanded ? 'Collapse' : 'Expand'}
        </button>
      </div>
      
      <div className="mb-4">
        {sortedPlayers.map((player, index) => (
          <div 
            key={player.id}
            className={`flex justify-between p-2 rounded ${index === 0 ? 'bg-yellow-600/30' : 'bg-white/5'} mb-1`}
          >
            <div className="flex items-center">
              <div className="text-white w-5 mr-1">{index + 1}.</div>
              <div className="text-white">{player.name}</div>
            </div>
            <div className="text-white font-semibold">{player.points}</div>
          </div>
        ))}
      </div>
      
      {expanded && history.length > 0 && (
        <div className="bg-white/5 rounded p-2 max-h-60 overflow-y-auto">
          <h3 className="text-white text-sm font-semibold mb-2">Round History</h3>
          
          {history.map((round) => (
            <div key={round.roundNumber} className="mb-3 last:mb-0">
              <div className="text-white text-xs font-semibold bg-white/10 p-1 rounded mb-1">
                Round {round.roundNumber} - Trump: {round.trumpSuit}
              </div>
              
              <div className="text-xs">
                {round.playerResults.map((result) => {
                  const player = players.find(p => p.id === result.playerId);
                  const success = result.wonTricks === result.declaredTricks;
                  
                  return (
                    <div 
                      key={result.playerId} 
                      className={`flex justify-between p-1 
                        ${success ? 'text-green-300' : 'text-red-300'}`}
                    >
                      <div>{player?.name}</div>
                      <div className="flex gap-4">
                        <span>Bid: {result.declaredTricks}</span>
                        <span>Won: {result.wonTricks}</span>
                        <span className="font-semibold">+{result.roundPoints}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};