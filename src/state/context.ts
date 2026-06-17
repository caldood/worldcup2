import { createContext } from 'react';
import type { GameAction } from './gameReducer';
import type { GameState } from '../types';

export interface GameContextValue {
  state: GameState;
  dispatch: React.Dispatch<GameAction>;
}

export const GameContext = createContext<GameContextValue | null>(null);
