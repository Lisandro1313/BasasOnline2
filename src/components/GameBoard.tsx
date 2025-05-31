import React from 'react';
import { useGameStore } from '../store/gameStore';
import { PlayerHand } from './PlayerHand';
import { TrickArea } from './TrickArea';
import { TrumpDisplay } from './TrumpDisplay';
import { PlayerInfo } from './PlayerInfo';
import { ScoreBoard } from './ScoreBoard';
import { BiddingPanel } from './BiddingPanel';
import { GameControls } from './GameControls';
import { RoundSummary } from './RoundSummary';

export const GameBoard: React.FC = () => {
  const { game, playCard, declareTricks, finishBidding, finishRound, resetGame } = useGameStore();
  const { 
    players, 
    trumpSuit, 
    trumpCard, 
    phase, 
    roundNumber, 
    currentTrick, 
    activePlayerIndex,
    cardsPerRound,
    history
  } = game;
  
  const handlePlayCard = (playerId: string, cardId: string) => {
    if (phase === 'playing') {
      playCard(playerId, cardId);
    }
  };
  
  const handleDeclareTricks = (playerId: string, count: number) => {
    if (phase === 'bidding') {
      declareTricks(playerId, count);
    }
  };
  
  // Get current player
  const currentPlayer = players[activePlayerIndex];
  
  // Calculate total declared bids for validation
  const totalDeclaredBids = players.reduce((sum, p) => sum + p.declaredTricks, 0);
  
  // Check if all players have made their bids
  const allPlayersDeclared = phase === 'bidding' && players.every(p => p.declaredTricks !== null);
  
  return (
    <div className="min-h-screen bg-green-800 p-4 flex flex-col">
      <div className="bg-white/10 text-white p-4 rounded-lg mb-4">
        <h1 className="text-2xl font-bold text-center">Las Basas</h1>
        <div className="flex justify-between items-center mt-2">
          <div>
            <span className="font-semibold">Ronda:</span> {roundNumber}/{game.totalRounds}
          </div>
          <div>
            <span className="font-semibold">Cartas:</span> {cardsPerRound}
          </div>
          <div>
            <span className="font-semibold">Fase:</span> {
              phase === 'bidding' ? 'Apuestas' :
              phase === 'playing' ? 'Jugando' :
              phase === 'scoring' ? 'Puntuación' :
              phase === 'gameOver' ? 'Fin del Juego' : 'Preparación'
            }
          </div>
        </div>
      </div>
      
      <div className="flex-1 flex flex-col lg:flex-row gap-4">
        {/* Left side - Players and Round Summary */}
        <div className="lg:w-1/4 flex flex-col gap-4">
          <div className="bg-white/5 p-4 rounded-lg flex flex-col gap-4">
            {players.map((player) => (
              <PlayerInfo 
                key={player.id}
                player={player}
                isActive={player.isActive}
                showBidding={phase === 'bidding' || phase === 'playing' || phase === 'scoring'}
                showTricks={phase === 'playing' || phase === 'scoring'}
              />
            ))}
          </div>
          
          <RoundSummary 
            players={players}
            roundNumber={roundNumber}
            cardsPerRound={cardsPerRound}
            history={history}
          />
        </div>
        
        {/* Center - Game area */}
        <div className="lg:w-2/4 flex flex-col gap-4">
          <TrumpDisplay trumpSuit={trumpSuit} trumpCard={trumpCard} />
          <TrickArea currentTrick={currentTrick} players={players} />
          
          {phase === 'bidding' && currentPlayer && (
            <BiddingPanel
              player={currentPlayer}
              maxBid={cardsPerRound}
              totalDeclaredBids={totalDeclaredBids}
              onDeclareTricks={(count) => handleDeclareTricks(currentPlayer.id, count)}
            />
          )}
          
          <GameControls
            phase={phase}
            allPlayersDeclared={allPlayersDeclared}
            onFinishBidding={finishBidding}
            onFinishRound={finishRound}
            onResetGame={resetGame}
          />
        </div>
        
        {/* Right side - Current player's hand and score */}
        <div className="lg:w-1/4 flex flex-col gap-4">
          <ScoreBoard players={players} history={history} />
          
          {currentPlayer && (
            <div className="bg-white/5 p-4 rounded-lg">
              <h3 className="text-white font-semibold mb-2">Tu Mano</h3>
              <PlayerHand
                playerId={currentPlayer.id}
                hand={currentPlayer.hand}
                isActive={currentPlayer.isActive && phase === 'playing'}
                onPlayCard={(cardId) => handlePlayCard(currentPlayer.id, cardId)}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};