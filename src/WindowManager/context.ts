import { createContext } from 'react';
import { windowInstance, windowCreator, initial } from './commonTypes';

type ctx = {
  open: (windowCreator: windowCreator, initial?: initial) => void,
  close: (keys: string[]) => void,
  instances: windowInstance[],
} | undefined;

export const WindowManagerContext = createContext<ctx>(undefined);
