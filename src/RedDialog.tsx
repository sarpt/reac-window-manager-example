import React, { FC } from 'react';
import { windowProps } from './WindowManager/commonTypes';

type props = {
  instanceKey: string,
} & windowProps;

export const RedDialog: FC<props> = ({ instanceKey, close }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <span>
        This dialog is red. Key {instanceKey}
      </span>
      <button onClick={() => close()}>Close</button>
    </div>
  );
};
