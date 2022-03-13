import React, { FC } from 'react';

type props = {
  instancesCount: number,
};

export const GreenDialog: FC<props> = ({ instancesCount }) => {
  return (
    <div>
      This dialog is green. Window instances count is: {instancesCount}
    </div>
  );
};
