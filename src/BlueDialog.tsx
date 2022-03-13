import React, { FC } from 'react';

type props = {
  instanceKey: string,
};

export const BlueDialog: FC<props> = ({ instanceKey }) => {
  return (
    <div>
      This dialog is blue. Key {instanceKey}
    </div>
  );
};
