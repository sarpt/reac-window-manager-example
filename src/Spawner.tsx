import React, { useCallback, useContext } from 'react';
import { WindowManagerContext } from './WindowManager';

export const Spawner = () => {
  const windowsManager = useContext(WindowManagerContext);

  const openRed = useCallback(() => {
    if (!windowsManager) return;

    windowsManager.open('red');
  }, [windowsManager])

  const openBlue = useCallback(() => {
    if (!windowsManager) return;

    windowsManager.open('blue');
  }, [windowsManager])

  return (
    <div style={{ display: 'flex', flexDirection: 'row' }}>
      <button onClick={() => openRed() }>Show red dialog</button>
      <button onClick={() => openBlue() }>Show blue dialog</button>
    </div>
  );
};
