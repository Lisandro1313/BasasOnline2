import React from 'react';
import { useGameStore } from './store/gameStore';
import { GameBoard } from './components/GameBoard';
import { SetupScreen } from './components/SetupScreen';
import { GameOverScreen } from './components/GameOverScreen';

function App() {
  const { game } = useGameStore();
  const { phase, players, winner } = game;
  
  return (
    <div className="min-h-screen bg-gray-100">
      {phase === 'setup' ? (
        <SetupScreen />
      ) : (
        <GameBoard />
      )}
      
      {phase === 'gameOver' && winner && (
        <GameOverScreen winner={winner} players={players} />
      )}
    </div>
  );
}

export default App;