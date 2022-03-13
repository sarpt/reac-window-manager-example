import { createContext } from 'react';
import { windowInstance, windowCreator, initial } from './commonTypes';

type ctx = {
  open: (args: { windowCreator: windowCreator, initial?: initial, onClose?: (instanceKey: string) => void }) => string,
  close: (keys: string[]) => void,
  instances: windowInstance[],
  update: (windows: Map<string, windowCreator>) => void,
} | undefined;

export const WindowManagerContext = createContext<ctx>(undefined);
