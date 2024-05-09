import { Box, Button } from '@mui/material';
import React from 'react';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import LockPersonIcon from '@mui/icons-material/LockPerson';
import { Course } from '../app/types/store';
interface LockCoursesButtonProps {
  row: any;
  isAnyButtonLocked: boolean;
  onBlockLearnersMode: { [id: number]: boolean };
  chooseLearnersToLockCourse: (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    row: Course,
  ) => void;
  setOnBlockLearnersMode: any;
  setLockedUsers: (prev: string[]) => void;
  saveLockedUsers: (id: number) => void;
}

export const LockCoursesButton: React.FC<LockCoursesButtonProps> = (props) => {
  const {
    row,
    isAnyButtonLocked,
    onBlockLearnersMode,
    chooseLearnersToLockCourse,
    setOnBlockLearnersMode,
    setLockedUsers,
    saveLockedUsers,
  } = props;

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '3px',
      }}
    >
      {!onBlockLearnersMode[row.id] ? (
        <Button
          variant="contained"
          color={'warning'}
          disabled={isAnyButtonLocked}
          startIcon={<LockPersonIcon />}
          onClick={(event) => chooseLearnersToLockCourse(event, row)}
        ></Button>
      ) : (
        <Button
          variant="contained"
          color={'warning'}
          startIcon={<CloseIcon />}
          onClick={() => {
            setOnBlockLearnersMode((prev: any) => ({
              ...prev,
              [row.id]: !prev[row.id],
            }));
            setLockedUsers([]);
          }}
        ></Button>
      )}
      {onBlockLearnersMode[row.id] && (
        <Button
          variant="contained"
          color={'secondary'}
          startIcon={<CheckIcon />}
          onClick={() => {
            saveLockedUsers(row.id);
          }}
        ></Button>
      )}
    </Box>
  );
};
