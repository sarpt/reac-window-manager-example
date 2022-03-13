import React, { useState, useCallback } from 'react';
import { FC } from 'react';
import { Rnd } from 'react-rnd';
import { WindowManagerContext } from './context';
import { bodyClass, bodySelector, defaultPosition, defaultSize } from './consts';
import { windowCreator, initial, onDragEventhandler, onResizeEventhandler, windowInstance } from './commonTypes';
import { updateWindowInstances, windowInstanceUpdate } from './functions/updateWindowInstance';

type props = {};

export const WindowManager: FC<props> = ({ children }) => {
  const [windowInstances, setWindowInstances] = useState<windowInstance[]>([]);
  const [lastId, setLastId] = useState<number>(0);
  const [focuedWindow, setFocusedWindow] = useState<string | undefined>();

  const open = useCallback(({ windowCreator, initial, onClose }: {windowCreator: windowCreator, initial?: initial, onClose?: (instanceKey: string) => void }) => {
    const key = `${lastId}`;
    setWindowInstances([
      ...windowInstances,
      {
        key,
        position: initial?.position ?? defaultPosition,
        size: initial?.size ?? defaultSize,
        windowCreator: windowCreator,
        onClose: onClose, 
      }
    ]);
    setLastId(lastId+1);

    return key;
  }, [windowInstances, setWindowInstances, lastId, setLastId]);

  const update = useCallback((windows: Map<string, windowCreator>) => {
    const updatedWindowInstances: windowInstance[] = [...windowInstances];

    for (const [key, windowCreator] of windows) {
      const windowInstance = updatedWindowInstances.find(instance => instance.key === key);
      if (!windowInstance) continue;

      Object.assign(windowInstance, { windowCreator });
    }

    setWindowInstances(updatedWindowInstances);
  }, [windowInstances, setWindowInstances]);

  const close = useCallback((keys: string[]) => {
    const openWindowInstances: windowInstance[] = [];

    for (const windowInstance of windowInstances) {
      if (keys.every(key => windowInstance.key !== key)) {
        openWindowInstances.push(windowInstance);
        continue;
      }

      if (windowInstance.onClose) windowInstance.onClose(windowInstance.key);
    }

    setWindowInstances(openWindowInstances);
  }, [windowInstances, setWindowInstances]);

  const onDragStop = useCallback<onDragEventhandler>((key, _ev, data) => {
    const instanceUpdate: windowInstanceUpdate = {
      position: { x: data.x, y: data.y }
    }

    const updatedWindowInstances = updateWindowInstances(key, windowInstances, instanceUpdate);
    setWindowInstances(updatedWindowInstances);
  }, [windowInstances, setWindowInstances]);

  const onResizeStop = useCallback<onResizeEventhandler>((key, _ev, _dir, ref, _delta, position) => {
    const instanceUpdate: windowInstanceUpdate = {
      size: {
        width: ref.offsetWidth,
        height: ref.offsetHeight
      },
      position
    };

    const updatedWindowInstances = updateWindowInstances(key, windowInstances, instanceUpdate);
    setWindowInstances(updatedWindowInstances);
  }, [windowInstances, setWindowInstances])

  return (
    <>
      <WindowManagerContext.Provider value={{ open, update, close, instances: windowInstances }}>
        {
          children
        }
      </WindowManagerContext.Provider>
      {
        windowInstances.map((windowInstance, idx) => {
          const window = windowInstance.windowCreator(windowInstance.key);

          return (
            <Rnd
              key={idx}
              cancel={bodySelector}
              style={{
                zIndex: windowInstance.key === focuedWindow ? Number.MAX_SAFE_INTEGER : undefined,
              }}
              onDrag={() => setFocusedWindow(windowInstance.key)}
              onDragStop={(...args) => onDragStop(windowInstance.key, ...args)}
              onResizeStop={(...args) => onResizeStop(windowInstance.key, ...args )}
              onClick={() => setFocusedWindow(windowInstance.key)}
              position={windowInstance.position}
              size={windowInstance.size}
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
                <div style={{ display: 'flex', flexDirection: 'row', backgroundColor: 'lavender', height: '25px' }}>
                  <div style={{ flexGrow: 1 }}>{window.header()}</div>
                  <button onClick={() => close([windowInstance.key])}>close</button>
                </div>
                <div className={bodyClass} style={{ overflow: 'scroll', flexGrow: 1, cursor: 'default', margin: '2px' }}>
                  {window.body({ close: () => close([windowInstance.key]) })}
                </div>
                {
                  window.footer
                    ? <div style={{ height: '20px'}}>{window.footer()}</div>
                    : <></>
                }
              </div>
            </Rnd>
          )
        })
      }
    </>
  );
};
