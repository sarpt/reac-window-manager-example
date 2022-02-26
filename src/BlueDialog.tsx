import React, { FC } from 'react';

type props = {
  instanceKey: string,
};

export const BlueDialog: FC<props> = ({ instanceKey }) => {
  return (
    <div style={{ width: '700px', height: '300px' }}>
      This dialog is blue. Key {instanceKey}
    </div>
  );
};