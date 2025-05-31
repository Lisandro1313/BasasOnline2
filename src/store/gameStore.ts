import { create } from 'zustand';
import { GameState, Player, Card, Suit, GamePhase, RoundHistory } from '../types/game';
import { createDeck, shuffleDeck, dealCards, determineTrickWinner, isCardPlayable } from '../utils/cardUtils';

interface GameStore {
  game: GameState;
  setupGame: (playerNames: string[], maxRounds: number) => void;
  startNewRound: () => void;
  declareTricks: (playerId: string, count: number) => void;
  finishBidding: () => void;
  playCard: (playerId: string, cardId: string) => void;
  finishTrick: () => void;
  calculateScores: () => void;
  finishRound: () => void;
  resetGame: () => void;
}

const initialState: GameState = {
  players: [],
  deck: [],
  discardPile: [],
  trumpSuit: null,
  trumpCard: null,
  currentTrick: {
    cards: [],
    leadSuit: null,
    winnerId: null
  },
  dealerIndex: 0,
  activePlayerIndex: 0,
  roundNumber: 0,
  totalRounds: 0,
  cardsPerRound: 0,
  phase: 'setup',
  history: [],
  winner: null,
  humanPlayerId: null
};

// AI helper functions
const calculateAIBid = (player: Player, trumpSuit: Suit | null, cardsPerRound: number, totalDeclaredBids: number): number => {
  let strongCards = 0;
  
  player.hand.forEach(card => {
    // Count high cards (10 or higher)
    if (card.value >= 10) strongCards++;
    // Count trump suit cards as stronger
    if (card.suit === trumpSuit) strongCards += 0.5;
  });
  
  // Basic bid calculation
  let bid = Math.round(strongCards);
  
  // Ensure bid doesn't make total equal to cardsPerRound
  if (bid + totalDeclaredBids === cardsPerRound) {
    bid = Math.random() > 0.5 ? bid + 1 : bid - 1;
  }
  
  // Keep bid within valid range
  return Math.max(0, Math.min(bid, cardsPerRound));
};

const selectAICard = (
  hand: Card[],
  currentTrick: { cards: { card: Card; playerId: string }[]; leadSuit: Suit | null },
  trumpSuit: Suit | null
): Card => {
  // Get playable cards
  const playableCards = hand.filter(card => 
    isCardPlayable(card, hand, currentTrick, trumpSuit)
  );
  
  // If first to play
  if (currentTrick.cards.length === 0) {
    // Play highest trump if available
    const highestTrump = playableCards
      .filter(c => c.suit === trumpSuit)
      .sort((a, b) => b.value - a.value)[0];
    
    if (highestTrump) return highestTrump;
    
    // Otherwise play highest card
    return playableCards.sort((a, b) => b.value - a.value)[0];
  }
  
  // If following
  const leadSuit = currentTrick.leadSuit as Suit;
  const highestInTrick = currentTrick.cards
    .reduce((highest, current) => 
      current.card.value > highest.value ? current.card : highest,
      currentTrick.cards[0].card
    );
  
  // Try to win with lowest winning card
  const winningCards = playableCards
    .filter(card => {
      if (card.suit === trumpSuit && highestInTrick.suit !== trumpSuit) return true;
      if (card.suit === leadSuit && highestInTrick.suit === leadSuit) {
        return card.value > highestInTrick.value;
      }
      return false;
    })
    .sort((a, b) => a.value - b.value);
  
  if (winningCards.length > 0) return winningCards[0];
  
  // If can't win, play lowest card
  return playableCards.sort((a, b) => a.value - b.value)[0];
};

export const useGameStore = create<GameStore>((set, get) => ({
  game: initialState,
  
  setupGame: (playerNames, maxRounds) => {
    const humanPlayerId = 'player-0';
    const players: Player[] = playerNames.map((name, index) => ({
      id: `player-${index}`,
      name,
      hand: [],
      declaredTricks: 0,
      wonTricks: 0,
      points: 0,
      isActive: index === 1, // Player to the right of dealer starts
      isHuman: index === 0 // Only first player is human
    }));
    
    set({
      game: {
        ...initialState,
        players,
        totalRounds: maxRounds,
        phase: 'dealing',
        humanPlayerId
      }
    });
    
    get().startNewRound();
  },
  
  startNewRound: () => {
    const { game } = get();
    const newRoundNumber = game.roundNumber + 1;
    
    if (newRoundNumber > game.totalRounds) {
      const winner = [...game.players].sort((a, b) => b.points - a.points)[0];
      set({
        game: {
          ...game,
          phase: 'gameOver',
          winner
        }
      });
      return;
    }
    
    const cardsPerRound = Math.min(10, 5 + newRoundNumber - 1);
    const newDeck = shuffleDeck(createDeck());
    const { playerHands, remainingDeck } = dealCards(newDeck, game.players.length, cardsPerRound);
    const trumpCard = remainingDeck.shift() || null;
    const trumpSuit = trumpCard?.suit || null;
    
    const updatedPlayers = game.players.map((player, index) => ({
      ...player,
      hand: playerHands[index],
      declaredTricks: 0,
      wonTricks: 0,
      isActive: index === (game.dealerIndex + 1) % game.players.length
    }));
    
    const newDealerIndex = (game.dealerIndex + 1) % game.players.length;
    const newActivePlayerIndex = (newDealerIndex + 1) % game.players.length;
    
    set({
      game: {
        ...game,
        players: updatedPlayers,
        deck: remainingDeck,
        discardPile: trumpCard ? [trumpCard] : [],
        trumpSuit,
        trumpCard,
        currentTrick: {
          cards: [],
          leadSuit: null,
          winnerId: null
        },
        dealerIndex: newDealerIndex,
        activePlayerIndex: newActivePlayerIndex,
        roundNumber: newRoundNumber,
        cardsPerRound,
        phase: 'bidding'
      }
    });
    
    // If AI player is active, make their bid
    const { players, activePlayerIndex: activeIdx } = get().game;
    if (!players[activeIdx].isHuman) {
      setTimeout(() => {
        const totalDeclaredBids = players.reduce((sum, p) => sum + p.declaredTricks, 0);
        const aiBid = calculateAIBid(players[activeIdx], trumpSuit, cardsPerRound, totalDeclaredBids);
        get().declareTricks(players[activeIdx].id, aiBid);
      }, 1000);
    }
  },
  
  declareTricks: (playerId, count) => {
    const { game } = get();
    
    const updatedPlayers = game.players.map(player => {
      if (player.id === playerId) {
        return {
          ...player,
          declaredTricks: count,
          isActive: false
        };
      }
      return player;
    });
    
    let nextActiveIndex = (game.activePlayerIndex + 1) % game.players.length;
    while (
      updatedPlayers[nextActiveIndex].declaredTricks !== 0 && 
      nextActiveIndex !== game.activePlayerIndex
    ) {
      nextActiveIndex = (nextActiveIndex + 1) % game.players.length;
    }
    
    const allDeclared = updatedPlayers.every(p => p.declaredTricks !== 0);
    
    if (allDeclared) {
      nextActiveIndex = (game.dealerIndex + 1) % game.players.length;
    }
    
    updatedPlayers[nextActiveIndex].isActive = true;
    
    set({
      game: {
        ...game,
        players: updatedPlayers,
        activePlayerIndex: nextActiveIndex
      }
    });
    
    // If next player is AI and not all have declared, make their bid
    if (!allDeclared && !updatedPlayers[nextActiveIndex].isHuman) {
      setTimeout(() => {
        const totalDeclaredBids = updatedPlayers.reduce((sum, p) => sum + p.declaredTricks, 0);
        const aiBid = calculateAIBid(
          updatedPlayers[nextActiveIndex],
          game.trumpSuit,
          game.cardsPerRound,
          totalDeclaredBids
        );
        get().declareTricks(updatedPlayers[nextActiveIndex].id, aiBid);
      }, 1000);
    }
  },
  
  finishBidding: () => {
    const { game } = get();
    const allDeclared = game.players.every(p => p.declaredTricks !== 0);
    
    if (allDeclared) {
      const updatedPlayers = game.players.map((player, index) => ({
        ...player,
        isActive: index === (game.dealerIndex + 1) % game.players.length
      }));
      
      const newState = {
        ...game,
        phase: 'playing',
        activePlayerIndex: (game.dealerIndex + 1) % game.players.length,
        players: updatedPlayers
      };
      
      set({ game: newState });
      
      // If AI player is active, make their play
      const activePlayer = updatedPlayers[newState.activePlayerIndex];
      if (!activePlayer.isHuman) {
        setTimeout(() => {
          const selectedCard = selectAICard(
            activePlayer.hand,
            newState.currentTrick,
            newState.trumpSuit
          );
          get().playCard(activePlayer.id, selectedCard.id);
        }, 1000);
      }
    }
  },
  
  playCard: (playerId, cardId) => {
    const { game } = get();
    
    const playerIndex = game.players.findIndex(p => p.id === playerId);
    if (playerIndex === -1 || playerIndex !== game.activePlayerIndex) return;
    
    const player = game.players[playerIndex];
    const cardIndex = player.hand.findIndex(c => c.id === cardId);
    if (cardIndex === -1) return;
    
    const card = player.hand[cardIndex];
    const updatedHand = [...player.hand];
    updatedHand.splice(cardIndex, 1);
    
    const updatedTrick = { ...game.currentTrick };
    updatedTrick.cards.push({ card, playerId });
    
    if (updatedTrick.cards.length === 1) {
      updatedTrick.leadSuit = card.suit;
    }
    
    const updatedPlayers = [...game.players];
    updatedPlayers[playerIndex] = {
      ...player,
      hand: updatedHand,
      isActive: false
    };
    
    const nextActiveIndex = (game.activePlayerIndex + 1) % game.players.length;
    const trickComplete = updatedTrick.cards.length === game.players.length;
    
    if (!trickComplete) {
      updatedPlayers[nextActiveIndex].isActive = true;
    }
    
    const newState = {
      ...game,
      players: updatedPlayers,
      currentTrick: updatedTrick,
      activePlayerIndex: nextActiveIndex
    };
    
    set({ game: newState });
    
    if (trickComplete) {
      get().finishTrick();
    } else if (!updatedPlayers[nextActiveIndex].isHuman) {
      // If next player is AI, make their play
      setTimeout(() => {
        const aiPlayer = updatedPlayers[nextActiveIndex];
        const selectedCard = selectAICard(
          aiPlayer.hand,
          newState.currentTrick,
          newState.trumpSuit
        );
        get().playCard(aiPlayer.id, selectedCard.id);
      }, 1000);
    }
  },
  
  finishTrick: () => {
    const { game } = get();
    
    const leadSuit = game.currentTrick.leadSuit as Suit;
    const winnerId = determineTrickWinner(
      game.currentTrick.cards,
      leadSuit,
      game.trumpSuit
    );
    
    const updatedPlayers = game.players.map(player => ({
      ...player,
      wonTricks: player.id === winnerId ? player.wonTricks + 1 : player.wonTricks,
      isActive: player.id === winnerId
    }));
    
    const winnerIndex = updatedPlayers.findIndex(p => p.id === winnerId);
    const allCardsPlayed = updatedPlayers.every(p => p.hand.length === 0);
    
    const updatedDiscardPile = [
      ...game.discardPile,
      ...game.currentTrick.cards.map(c => c.card)
    ];
    
    const newState = {
      ...game,
      players: updatedPlayers,
      activePlayerIndex: winnerIndex,
      currentTrick: {
        cards: [],
        leadSuit: null,
        winnerId: null
      },
      discardPile: updatedDiscardPile,
      phase: allCardsPlayed ? 'scoring' : 'playing'
    };
    
    set({ game: newState });
    
    if (allCardsPlayed) {
      get().calculateScores();
    } else if (!updatedPlayers[winnerIndex].isHuman) {
      // If AI player won the trick, make their next play
      setTimeout(() => {
        const aiPlayer = updatedPlayers[winnerIndex];
        const selectedCard = selectAICard(
          aiPlayer.hand,
          newState.currentTrick,
          newState.trumpSuit
        );
        get().playCard(aiPlayer.id, selectedCard.id);
      }, 1000);
    }
  },
  
  calculateScores: () => {
    const { game } = get();
    
    const playerResults = game.players.map(player => {
      let roundPoints = 0;
      
      if (player.wonTricks === player.declaredTricks) {
        roundPoints = 10 + (player.wonTricks * 3);
      } else {
        roundPoints = player.wonTricks;
      }
      
      return {
        playerId: player.id,
        declaredTricks: player.declaredTricks,
        wonTricks: player.wonTricks,
        roundPoints
      };
    });
    
    const updatedPlayers = game.players.map(player => {
      const result = playerResults.find(r => r.playerId === player.id);
      return {
        ...player,
        points: player.points + (result?.roundPoints || 0)
      };
    });
    
    const roundHistory: RoundHistory = {
      roundNumber: game.roundNumber,
      trumpSuit: game.trumpSuit as Suit,
      playerResults
    };
    
    set({
      game: {
        ...game,
        players: updatedPlayers,
        history: [...game.history, roundHistory],
        phase: 'scoring'
      }
    });
  },
  
  finishRound: () => {
    get().startNewRound();
  },
  
  resetGame: () => {
    set({ game: initialState });
  }
}));