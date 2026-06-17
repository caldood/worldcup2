import { useEffect, useReducer, type ReactNode } from 'react';
import { gameReducer, initialState, loadState, saveState } from './gameReducer';
import { GameContext } from './context';

export function GameProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(gameReducer, initialState, () => loadState());

  useEffect(() => {
    saveState(state);
  }, [state]);

  return <GameContext.Provider value={{ state, dispatch }}>{children}</GameContext.Provider>;
}
