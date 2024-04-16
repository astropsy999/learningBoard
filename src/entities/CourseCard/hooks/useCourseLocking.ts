import { useState } from 'react';
import { Lock, LockOpen } from '@mui/icons-material';

export const useCourseLocking = (initialLockState: boolean) => {
  const [courseLocked, setCourseLocked] = useState(initialLockState);

  const handleLockUnlock = () => {
    setCourseLocked(!courseLocked);
  };

  return { courseLocked, handleLockUnlock };
};
