export interface Card {
  id: string;
  name: string;
  type: 'ingredient' | 'catalyst' | 'essence';
  rarity: 'common' | 'uncommon' | 'rare' | 'legendary';
}

export interface Spell {
  id: string;
  name: string;
  description: string;
  ingredients: string[];
  power: number;
  category: 'combat' | 'utility' | 'healing' | 'summoning';
  createdAt: Date;
}

export interface ScannedCard {
  id: string;
  scannedAt: Date;
}

export interface SpellGenerationRequest {
  cardIds: string[];
}

export interface SpellGenerationResponse {
  spell: Spell;
  success: boolean;
  message?: string;
}

// Tipos para el sistema de salas
export interface Player {
  id: string;
  name: string;
  icon: string;
  isHost: boolean;
  joinedAt: Date;
}

export interface Room {
  id: string;
  name: string;
  players: Player[];
  maxPlayers: number;
  createdAt: Date;
  isActive: boolean;
}

export interface RoomJoinRequest {
  roomName: string;
  playerName: string;
  icon: string;
}

export interface RoomCreateRequest {
  roomName: string;
  playerName: string;
  icon: string;
}

export interface RoomResponse {
  room: Room;
  success: boolean;
  message?: string;
}

// Tipos para iconos
export interface IconOption {
  id: string;
  path: string;
  type: 'mage' | 'witch' | 'cat';
  variant: string;
  isAvailable: boolean;
}

export type GameState = 'lobby' | 'playing' | 'finished'; 