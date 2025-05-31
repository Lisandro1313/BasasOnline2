import React, { useState } from 'react';
import { useGameStore } from '../store/gameStore';

export const SetupScreen: React.FC = () => {
  const { setupGame } = useGameStore();
  
  const [playerCount, setPlayerCount] = useState(3);
  const [playerNames, setPlayerNames] = useState<string[]>(Array(6).fill(''));
  const [rounds, setRounds] = useState(8);
  
  const handleNameChange = (index: number, name: string) => {
    const newNames = [...playerNames];
    newNames[index] = name;
    setPlayerNames(newNames);
  };
  
  const handleStartGame = () => {
    const activePlayerNames = playerNames.slice(0, playerCount);
    const validNames = activePlayerNames.map((name, index) => 
      name.trim() ? name.trim() : `Jugador ${index + 1}`
    );
    
    setupGame(validNames, rounds);
  };
  
  return (
    <div className="min-h-screen bg-green-800 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-lg">
        <h1 className="text-2xl font-bold text-center mb-6">Las Basas</h1>
        
        <div className="mb-6">
          <label className="block text-gray-700 font-semibold mb-2">
            Número de Jugadores
          </label>
          <div className="flex gap-2">
            {[3, 4, 5, 6].map((num) => (
              <button
                key={num}
                className={`flex-1 py-2 rounded-md transition-colors
                  ${playerCount === num 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                onClick={() => setPlayerCount(num)}
              >
                {num}
              </button>
            ))}
          </div>
        </div>
        
        <div className="mb-6">
          <label className="block text-gray-700 font-semibold mb-2">
            Nombres de Jugadores
          </label>
          <div className="space-y-2">
            {Array.from({ length: playerCount }).map((_, index) => (
              <input
                key={index}
                type="text"
                placeholder={`Jugador ${index + 1}`}
                value={playerNames[index]}
                onChange={(e) => handleNameChange(index, e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            ))}
          </div>
        </div>
        
        <div className="mb-8">
          <label className="block text-gray-700 font-semibold mb-2">
            Número de Rondas
          </label>
          <div className="flex items-center">
            <input
              type="range"
              min={3}
              max={13}
              value={rounds}
              onChange={(e) => setRounds(parseInt(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <span className="ml-4 w-8 text-center font-semibold">{rounds}</span>
          </div>
          <p className="text-sm text-gray-500 mt-1">
            Cada ronda suma una carta (comenzando con 5)
          </p>
        </div>
        
        <button
          className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors"
          onClick={handleStartGame}
        >
          Comenzar Juego
        </button>
      </div>
    </div>
  );
};