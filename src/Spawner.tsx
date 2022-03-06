import React, { useCallback, useContext } from 'react';
import { WindowManagerContext, windowCreator } from './WindowManager';

import { RedDialog } from './RedDialog';
import { BlueDialog } from './BlueDialog';

const redWindowCreator: windowCreator = (instanceKey) => ({
  body: (props) => <RedDialog instanceKey={instanceKey} {...props}/>,
  header: () => <span>The red dialog: {instanceKey}</span>,
});

const blueWindowCreator: windowCreator = (instanceKey) => ({
  body:  () => <BlueDialog instanceKey={instanceKey}/>,
  header: () => <span>Some title: {instanceKey}</span>,
});

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
              <button onClick={() => windowsManager.open(redWindowCreator) }>Show red dialog</button>
              <button onClick={() => windowsManager.open(blueWindowCreator) }>Show blue dialog</button>
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
