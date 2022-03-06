import React, { useCallback, useContext } from 'react';
import { WindowManagerContext, window } from './WindowManager';

import { RedDialog } from './RedDialog';
import { BlueDialog } from './BlueDialog';

const redWindow: window = {
  body: (instanceKey, props) => <RedDialog instanceKey={instanceKey} {...props}/>,
  header: (instanceKey) => <span>The red dialog: {instanceKey}</span>,
};

const blueWindow: window = {
  body:  (instanceKey) => <BlueDialog instanceKey={instanceKey}/>,
  header: (instanceKey) => <span>Some title: {instanceKey}</span>,
};

export const Spawner = () => {
  const windowsManager = useContext(WindowManagerContext);

  const closeAll = useCallback(() => {
    if (!windowsManager) return;

    windowsManager.close(windowsManager.instances.map(instance => instance.key));
  }, [windowsManager]);

  return (
    <div style={{ display: 'flex', flexDirection: 'row' }}>
      {
        windowsManager 
          ? (
            <>
              <button onClick={() => windowsManager.open(redWindow) }>Show red dialog</button>
              <button onClick={() => windowsManager.open(blueWindow) }>Show blue dialog</button>
            </>
          )
          : <></>
      }
      <div>
        Opened windows: {windowsManager?.instances.length}
      </div>
      <button onClick={closeAll}>Close all</button>
    </div>
  );
};
