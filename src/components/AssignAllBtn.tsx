import { Button } from '@mui/material';
import React from 'react';
import PlaylistAddIcon from '@mui/icons-material/PlaylistAdd';
import { useUsers } from '../data/store';

export const RenderAssignAllButton = () => {
  const { openCoursesDialog } = useUsers();
  const handleAssignAll = () => {
    openCoursesDialog(true);
  };
  return (
    <Button
      variant="contained"
      color="info"
      startIcon={<PlaylistAddIcon />}
      onClick={() => handleAssignAll()}
    >
      Назначить выбранным
    </Button>
  );
};
