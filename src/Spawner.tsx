import React, { useCallback, useContext, useEffect, useState } from 'react';

import { RedDialog } from './RedDialog';
import { BlueDialog } from './BlueDialog';
import { WindowManagerContext } from './WindowManager/context';
import { windowCreator } from './WindowManager/commonTypes';
import { GreenDialog } from './GreenDialog';

const redWindowCreator: windowCreator = (instanceKey) => ({
  body: (props) => <RedDialog instanceKey={instanceKey} {...props}/>,
  header: () => <span>The red dialog: {instanceKey}</span>,
});

const blueWindowCreator: windowCreator = (instanceKey) => ({
  body:  () => <BlueDialog instanceKey={instanceKey}/>,
  header: () => <span>Some title: {instanceKey}</span>,
});

export const Spawner = () => {
  const [greenWindowsKeys, setGreenWindowsKeys] = useState<string[]>([]);
  const windowsManager = useContext(WindowManagerContext);

  const closeAll = useCallback(() => {
    if (!windowsManager) return;

    windowsManager.close(windowsManager.instances.map(instance => instance.key));
  }, [windowsManager]);

  const greenWindowCreator = useCallback(() => {
    return {
      body:  () => <GreenDialog instancesCount={windowsManager?.instances.length ?? 0}/>,
      header: () => <span>Green dialog title</span>,
    };
  }, [windowsManager?.instances.length]);

  useEffect(() => {
    if (!windowsManager) return;

    const greenWindows = new Map<string, windowCreator>();
    for (const key of greenWindowsKeys) {
      greenWindows.set(key, greenWindowCreator);
    }

    windowsManager.update(greenWindows);
  }, [greenWindowCreator]);

  const openGreenWindow = useCallback(() => {
    if (!windowsManager) return;

    const onClose = (instanceKey: string) => { 
      const idx = greenWindowsKeys.findIndex(windowKey => windowKey === instanceKey);
      if (!idx) return;
      
      setGreenWindowsKeys([
        ...greenWindowsKeys.slice(0, idx),
        ...greenWindowsKeys.slice(idx + 1)
      ])
    };

    const key = windowsManager.open({ windowCreator: greenWindowCreator, onClose });
    setGreenWindowsKeys([...greenWindowsKeys, key]);
  }, [windowsManager?.open, greenWindowsKeys, setGreenWindowsKeys]);

  return (
    <div style={{ display: 'flex', flexDirection: 'row' }}>
      {
        windowsManager 
          ? (
            <>
              <button onClick={() => windowsManager.open({ windowCreator: redWindowCreator }) }>Show red dialog</button>
              <button onClick={() => windowsManager.open({ windowCreator: blueWindowCreator }) }>Show blue dialog</button>
              <button onClick={openGreenWindow}>Show green dialog</button>
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
