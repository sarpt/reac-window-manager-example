import React, { FC } from 'react';

type props = {
  instanceKey: string,
};

export const RedDialog: FC<props> = ({ instanceKey }) => {
  return (
    <div style={{ width: '300px', height: '200px' }}>
      This dialog is red. Key {instanceKey}
    </div>
  );
};
