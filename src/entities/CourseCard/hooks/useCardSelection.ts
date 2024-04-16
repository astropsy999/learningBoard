import { useState } from 'react';

export const useCardSelection = () => {
  const [checked, setChecked] = useState(false);

  const handleCardClick = () => {
    setChecked(!checked);
  };

  return { checked, handleCardClick };
};
