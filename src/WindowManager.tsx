import React, { useState, createContext, useCallback } from 'react';
import { ReactElement, FC } from 'react';
import { DraggableEventHandler } from 'react-draggable';
import { Rnd, RndResizeCallback } from 'react-rnd';

export type window = {
  body: (key: string, props: windowProps) => ReactElement,
  footer?: (key: string) => ReactElement,
  header: (key: string) => ReactElement,
  initialSize?: { width: number | string, height: number | string },
  initialPosition?: { x: number, y: number }
};

type windowInstance = {
  key: string,
  position: {
    x: number,
    y: number
  },
  size: {
    width: number | string,
    height: number | string
  },
  windowRecipe: window,
};

type ctx = {
  open: (window: window) => void,
  close: (keys: string[]) => void,
  instances: windowInstance[],
} | undefined;

export const WindowManagerContext = createContext<ctx>(undefined);

export type windowProps = {
  close: () => void
};

type windowInstanceUpdate = Partial<windowInstance>;

type onDragEventhandler = DraggableEventHandler extends (...args: infer A) => infer R
  ? (key: string, ...args: A) => R
  : never;

type onResizeEventhandler = RndResizeCallback extends (...args: infer A) => infer R
  ? (key: string, ...args: A) => R
  : never;

function updateWindowInstances(key: string, instances: windowInstance[], data: windowInstanceUpdate): windowInstance[] {
  const idx = instances.findIndex(instance => instance.key === key);
  if (idx < 0) return [];

  const updatedInstance = Object.assign(
    {},
    instances[idx],
    { ...data }
  );
  return [
    ...instances.slice(0, idx),
    updatedInstance,
    ...instances.slice(idx + 1)
  ];
}

const defaultPosition = { x: 0, y: 0 };
const defaultSize = { width: 480, height: 360 };

export type props = {};
export const WindowManager: FC<props> = ({ children }) => {
  const [windowInstances, setWindowInstances] = useState<windowInstance[]>([]);
  const [lastId, setLastId] = useState<number>(0);
  const [focuedWindow, setFocusedWindow] = useState<string | undefined>();

  const open = useCallback((window: window) => {
    const key = `${lastId}`;
    setWindowInstances([
      ...windowInstances,
      {
        key,
        position: window.initialPosition ?? defaultPosition,
        size: window.initialSize ?? defaultSize,
        windowRecipe: window,
      }
    ]);
    setLastId(lastId+1);

    return key;
  }, [windowInstances, setWindowInstances, lastId, setLastId]);

  const close = useCallback((keys: string[]) => {
    const openWindowInstances = windowInstances
      .filter(instance => keys.every(key => instance.key !== key));

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
      <WindowManagerContext.Provider value={{ open, close, instances: windowInstances }}>
        {
          children
        }
      </WindowManagerContext.Provider>
      {
        windowInstances.map((windowInstance, idx) => {
          return (
            <Rnd
              key={idx}
              cancel='div.wmBody'
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
                  <div style={{ flexGrow: 1 }}>{windowInstance.windowRecipe.header(windowInstance.key)}</div>
                  <button onClick={() => close([windowInstance.key])}>close</button>
                </div>
                <div className='wmBody' style={{ overflow: 'scroll', flexGrow: 1, cursor: 'default', margin: '2px' }}>
                  {windowInstance.windowRecipe.body(windowInstance.key, { close: () => close([windowInstance.key]) })}
                </div>
                {
                  windowInstance.windowRecipe.footer
                    ? <div style={{ height: '20px'}}>{windowInstance.windowRecipe.footer(windowInstance.key)}</div>
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
