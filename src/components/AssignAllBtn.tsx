import { Button } from '@mui/material';
import React from 'react';
import PlaylistAddIcon from '@mui/icons-material/PlaylistAdd';
import { useLearners } from '../data/store/learners.store';

export const RenderAssignAllButton = () => {
  const { openCoursesDialog, selectedRowsData } = useLearners();
  const handleAssignAll = () => {
    openCoursesDialog(true);
  };
  return (
    <Button
      variant="contained"
      color="secondary"
      startIcon={<PlaylistAddIcon />}
      onClick={() => handleAssignAll()}
    >
      {selectedRowsData.length > 1 ? 'Массовое редактирование' : 'Редактировать'}
    </Button>
  );
};
