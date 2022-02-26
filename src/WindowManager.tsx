import React, { useState, createContext, useCallback } from 'react';
import { ReactElement, FC } from 'react';
import { DraggableData, Rnd } from 'react-rnd';

type ctx = {
  open: (key: string) => void,
} | undefined;

export const WindowManagerContext = createContext<ctx>(undefined);

type windowInstance = { variant: string, key: string, position: { x: number, y: number } };
type props = { windows: Map<string, (key: string) => ReactElement> };

export const WindowManager: FC<props> = ({ windows, children }) => {
  const [windowInstances, setWindowInstance] = useState<windowInstance[]>([]);
  const [lastId, setLastId] = useState<number>(0);
  const [focuedWindow, setFocusedWindow] = useState<string | undefined>();

  const open = useCallback((variant: string) => {
    setWindowInstance([...windowInstances, { variant, key: `${lastId}`, position: { x: 0, y: 0 } }]);
    setLastId(lastId+1);
  }, [windowInstances, setWindowInstance, lastId, setLastId]);

  const close = useCallback((key: string) => {
    const idx = windowInstances.findIndex(instance => instance.key === key);
    if (idx < 0) return;

    setWindowInstance([...windowInstances.slice(0, idx), ...windowInstances.slice(idx + 1)]);
  }, [windowInstances, setWindowInstance]);

  const onDragStop = useCallback((key: string, data: DraggableData) => {
    const idx = windowInstances.findIndex(instance => instance.key === key);
    if (idx < 0) return;

    const updatedInstance = Object.assign(
      {},
      windowInstances[idx],
      { position: { x: data.x, y: data.y }}
    );
    const updatedWindowInstances = [
      ...windowInstances.slice(0, idx),
      updatedInstance,
      ...windowInstances.slice(idx + 1)
    ];
    setWindowInstance(updatedWindowInstances);
  }, [windowInstances, setWindowInstance]);

  return (
    <>
      <WindowManagerContext.Provider value={{ open }}>
        {
          children
        }
      </WindowManagerContext.Provider>
      {
        windowInstances.map((windowInstance, idx) => {
          const instance = windows.get(windowInstance.variant);
          if (!instance) return <></>;

          return (
            <Rnd
              key={idx}
              cancel='div.wmBody'
              style={{
                zIndex: windowInstance.key === focuedWindow ? 9999 : undefined,
              }}
              onDrag={() => setFocusedWindow(windowInstance.key)}
              onDragStop={(_ev, data) => onDragStop(windowInstance.key, data)}
              onClick={() => setFocusedWindow(windowInstance.key)}
              position={{ x: windowInstance.position.x, y: windowInstance.position.y }}
            >
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  backgroundColor: 'white',
                  borderStyle: 'solid',
                  borderColor: 'black',
                  borderWidth: '1px',
                  width: '100%',
                  height: '100%',
                }}
              >
                <div style={{ backgroundColor: 'lavender' }}>
                  <button onClick={() => close(windowInstance.key)}>close</button>
                </div>
                <div className='wmBody' style={{ overflow: 'scroll', flexGrow: 1, cursor: 'default', margin: '2px' }}>
                  {instance(windowInstance.key)}
                </div>
                <div style={{ height: '20px'}}>Footer</div>
              </div>
            </Rnd>
          )
        })
      }
    </>
  );
};
