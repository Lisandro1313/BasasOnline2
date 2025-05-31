// Types for game entities
export type Suit = 'hearts' | 'diamonds' | 'clubs' | 'spades';
export type CardValue = 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14; // 11=J, 12=Q, 13=K, 14=A

export interface Card {
  suit: Suit;
  value: CardValue;
  id: string; // Unique identifier for the card
}

export interface Player {
  id: string;
  name: string;
  hand: Card[];
  declaredTricks: number;
  wonTricks: number;
  points: number;
  isActive: boolean;
  isHuman: boolean;
}

export interface Trick {
  cards: { card: Card; playerId: string }[];
  leadSuit: Suit | null;
  winnerId: string | null;
}

export interface GameState {
  players: Player[];
  deck: Card[];
  discardPile: Card[];
  trumpSuit: Suit | null;
  trumpCard: Card | null;
  currentTrick: Trick;
  dealerIndex: number;
  activePlayerIndex: number;
  roundNumber: number;
  totalRounds: number;
  cardsPerRound: number;
  phase: GamePhase;
  history: RoundHistory[];
  winner: Player | null;
  humanPlayerId: string | null;
}

export type GamePhase = 
  | 'setup' 
  | 'dealing'
  | 'bidding'
  | 'playing'
  | 'scoring'
  | 'gameOver';

export interface RoundHistory {
  roundNumber: number;
  trumpSuit: Suit;
  playerResults: {
    playerId: string;
    declaredTricks: number;
    wonTricks: number;
    roundPoints: number;
  }[];
}

// Game settings
export interface GameSettings {
  playerCount: number;
  startingCards: number;
  maxRounds: number;
}