import React, { useCallback, useContext } from 'react';
import { WindowManagerContext } from './WindowManager';

export const Spawner = () => {
  const windowsManager = useContext(WindowManagerContext);

  const closeAll = useCallback(() => {
    if (!windowsManager) return;

    windowsManager.close(windowsManager.instances.map(instance => instance.key));
  }, [windowsManager]);

  return (
    <div style={{ display: 'flex', flexDirection: 'row' }}>
      {
        windowsManager?.windows.map((variant, idx) => {
          return (
            <button key={idx} onClick={() => windowsManager.open(variant) }>Show {variant} dialog</button>
          );
        })
      }
      <div>
        Opened windows: {windowsManager?.instances.length}
      </div>
      <button onClick={closeAll}>Close all</button>
    </div>
  );
};
