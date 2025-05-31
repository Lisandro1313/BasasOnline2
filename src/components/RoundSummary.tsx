import React from 'react';
import { Player, RoundHistory } from '../types/game';

interface RoundSummaryProps {
  players: Player[];
  roundNumber: number;
  cardsPerRound: number;
  history: RoundHistory[];
}

export const RoundSummary: React.FC<RoundSummaryProps> = ({
  players,
  roundNumber,
  cardsPerRound,
  history
}) => {
  // Calculate total rounds based on current round and history
  const totalRounds = Math.max(roundNumber, history.length);
  
  // Create an array of all rounds (past, present, and future)
  const rounds = Array.from({ length: totalRounds }, (_, i) => ({
    roundNumber: i + 1,
    cards: 5 + i,
    history: history.find(h => h.roundNumber === i + 1)
  }));
  
  return (
    <div className="bg-white/10 p-4 rounded-lg">
      <h2 className="text-white font-semibold mb-4">Resumen de Rondas</h2>
      
      <div className="overflow-x-auto">
        <table className="w-full text-white text-sm">
          <thead>
            <tr className="border-b border-white/20">
              <th className="text-left py-2">Ronda</th>
              <th className="text-center">Cartas</th>
              {players.map(player => (
                <th key={player.id} className="text-center">
                  {player.name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rounds.map(round => {
              const isCurrentRound = round.roundNumber === roundNumber;
              const isPastRound = round.history !== undefined;
              
              return (
                <tr 
                  key={round.roundNumber}
                  className={`
                    border-b border-white/10
                    ${isCurrentRound ? 'bg-blue-500/20' : ''}
                    ${!isPastRound ? 'text-white/50' : ''}
                  `}
                >
                  <td className="py-2">{round.roundNumber}</td>
                  <td className="text-center">{round.cards}</td>
                  {players.map(player => {
                    const result = round.history?.playerResults.find(
                      r => r.playerId === player.id
                    );
                    
                    if (!result) {
                      return <td key={player.id} className="text-center">-</td>;
                    }
                    
                    const success = result.wonTricks === result.declaredTricks;
                    
                    return (
                      <td 
                        key={player.id} 
                        className={`text-center ${success ? 'text-green-300' : 'text-red-300'}`}
                      >
                        {result.declaredTricks}/{result.wonTricks} (+{result.roundPoints})
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};