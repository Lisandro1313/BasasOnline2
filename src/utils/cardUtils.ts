import { Card, CardValue, Suit } from '../types/game';

// Create a full deck of cards
export const createDeck = (): Card[] => {
  const suits: Suit[] = ['hearts', 'diamonds', 'clubs', 'spades'];
  const values: CardValue[] = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14];
  
  const deck: Card[] = [];
  
  for (const suit of suits) {
    for (const value of values) {
      deck.push({
        suit,
        value,
        id: `${suit}-${value}`
      });
    }
  }
  
  return deck;
};

// Shuffle a deck of cards using Fisher-Yates algorithm
export const shuffleDeck = (deck: Card[]): Card[] => {
  const shuffled = [...deck];
  
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  
  return shuffled;
};

// Deal cards to players
export const dealCards = (deck: Card[], playerCount: number, cardsPerPlayer: number): {
  playerHands: Card[][],
  remainingDeck: Card[]
} => {
  const playerHands: Card[][] = Array(playerCount).fill(null).map(() => []);
  const deckCopy = [...deck];
  
  // Deal cards to each player
  for (let i = 0; i < cardsPerPlayer; i++) {
    for (let j = 0; j < playerCount; j++) {
      if (deckCopy.length > 0) {
        const card = deckCopy.shift()!;
        playerHands[j].push(card);
      }
    }
  }
  
  return {
    playerHands,
    remainingDeck: deckCopy
  };
};

// Get the string representation of a card value
export const getCardValueDisplay = (value: CardValue): string => {
  switch (value) {
    case 11: return 'J';
    case 12: return 'Q';
    case 13: return 'K';
    case 14: return 'A';
    default: return value.toString();
  }
};

// Get the emoji for a card suit
export const getSuitEmoji = (suit: Suit): string => {
  switch (suit) {
    case 'hearts': return '♥';
    case 'diamonds': return '♦';
    case 'clubs': return '♣';
    case 'spades': return '♠';
  }
};

// Get the color for a card suit
export const getSuitColor = (suit: Suit): string => {
  return suit === 'hearts' || suit === 'diamonds' ? 'text-red-600' : 'text-gray-900';
};

// Check if a card is playable based on the current trick
export const isCardPlayable = (
  card: Card,
  hand: Card[],
  currentTrick: { cards: { card: Card; playerId: string }[], leadSuit: Suit | null },
  trumpSuit: Suit | null
): boolean => {
  // If this is the first card played in the trick, any card is playable
  if (currentTrick.cards.length === 0 || currentTrick.leadSuit === null) {
    return true;
  }
  
  // Check if player has any cards of the lead suit
  const hasLeadSuit = hand.some(c => c.suit === currentTrick.leadSuit);
  
  // If player has lead suit, they must play a card of that suit
  if (hasLeadSuit) {
    return card.suit === currentTrick.leadSuit;
  }
  
  // If player doesn't have lead suit but has trump suit, they must play trump
  const hasTrumpSuit = trumpSuit !== null && hand.some(c => c.suit === trumpSuit);
  
  if (hasTrumpSuit && trumpSuit !== currentTrick.leadSuit) {
    return card.suit === trumpSuit;
  }
  
  // If player has neither lead suit nor trump suit, they can play any card
  return true;
};

// Determine the winner of a trick
export const determineTrickWinner = (
  cards: { card: Card; playerId: string }[],
  leadSuit: Suit,
  trumpSuit: Suit | null
): string => {
  // Filter cards by trump suit if any were played
  const trumpCards = trumpSuit ? cards.filter(c => c.card.suit === trumpSuit) : [];
  
  if (trumpCards.length > 0) {
    // Find highest trump card
    return trumpCards.reduce((highest, current) => 
      current.card.value > highest.card.value ? current : highest
    ).playerId;
  } else {
    // Find highest card of lead suit
    const leadSuitCards = cards.filter(c => c.card.suit === leadSuit);
    return leadSuitCards.reduce((highest, current) => 
      current.card.value > highest.card.value ? current : highest
    ).playerId;
  }
};

// Sort cards by suit and value
export const sortCards = (cards: Card[]): Card[] => {
  const suitOrder: Record<Suit, number> = {
    'hearts': 0,
    'diamonds': 1,
    'clubs': 2,
    'spades': 3
  };
  
  return [...cards].sort((a, b) => {
    // First sort by suit
    if (suitOrder[a.suit] !== suitOrder[b.suit]) {
      return suitOrder[a.suit] - suitOrder[b.suit];
    }
    
    // Then sort by value
    return a.value - b.value;
  });
};