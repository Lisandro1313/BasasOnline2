import React, { useState, useEffect } from 'react';
import { Player } from '../types/game';

interface BiddingPanelProps {
  player: Player;
  maxBid: number;
  totalDeclaredBids: number;
  onDeclareTricks: (count: number) => void;
}

export const BiddingPanel: React.FC<BiddingPanelProps> = ({ 
  player, 
  maxBid,
  totalDeclaredBids,
  onDeclareTricks 
}) => {
  const [bidAmount, setBidAmount] = useState(0);
  
  // Create an array of possible bids from 0 to maxBid
  const possibleBids = Array.from({ length: maxBid + 1 }, (_, i) => i);
  
  // Check if this bid would make the total equal to maxBid (not allowed)
  const isInvalidBid = (bid: number) => {
    return totalDeclaredBids + bid === maxBid;
  };
  
  const handleBid = () => {
    if (!isInvalidBid(bidAmount)) {
      onDeclareTricks(bidAmount);
    }
  };
  
  return (
    <div className="bg-white/10 p-4 rounded-lg">
      <h2 className="text-white font-semibold mb-2">Tu Apuesta</h2>
      
      <div className="mb-4">
        <p className="text-white text-sm mb-2">
          ¿Cuántas bazas crees que ganarás en esta ronda?
        </p>
        
        <div className="flex flex-wrap gap-2 mb-4">
          {possibleBids.map((bid) => {
            const invalid = isInvalidBid(bid);
            return (
              <button
                key={bid}
                className={`w-10 h-10 rounded-full flex items-center justify-center
                  ${bidAmount === bid 
                    ? 'bg-yellow-400 text-gray-900 font-bold'
                    : invalid
                      ? 'bg-red-400/50 text-white/50 cursor-not-allowed'
                      : 'bg-white/20 text-white hover:bg-white/30'
                  }
                  transition-colors`}
                onClick={() => !invalid && setBidAmount(bid)}
                disabled={invalid}
              >
                {bid}
              </button>
            );
          })}
        </div>
        
        {isInvalidBid(bidAmount) && (
          <p className="text-red-300 text-sm mb-2">
            La suma total de bazas declaradas no puede ser igual al número de cartas
          </p>
        )}
      </div>
      
      <button
        className={`w-full py-2 rounded-lg font-semibold transition-colors
          ${isInvalidBid(bidAmount)
            ? 'bg-gray-500 cursor-not-allowed'
            : 'bg-blue-600 hover:bg-blue-700'
          } text-white`}
        onClick={handleBid}
        disabled={isInvalidBid(bidAmount)}
      >
        Confirmar Apuesta
      </button>
    </div>
  );
};