import { ReactElement } from "react";

import { DraggableEventHandler } from 'react-draggable';
import { RndResizeCallback } from 'react-rnd';

export type windowCreator = (key: string) => window;

export type window = {
  body: (props: windowProps) => ReactElement,
  footer?: () => ReactElement,
  header: () => ReactElement,
};

export type initial = {
  size?: { width: number | string, height: number | string },
  position?: { x: number, y: number }
}

export type windowProps = {
  close: () => void
};

export type onDragEventhandler = DraggableEventHandler extends (...args: infer A) => infer R
  ? (key: string, ...args: A) => R
  : never;

export type onResizeEventhandler = RndResizeCallback extends (...args: infer A) => infer R
  ? (key: string, ...args: A) => R
  : never;


export type windowInstance = {
  key: string,
  position: {
    x: number,
    y: number
  },
  size: {
    width: number | string,
    height: number | string
  },
  windowCreator: windowCreator,
  onClose?: (instanceKey: string) => void,
};
