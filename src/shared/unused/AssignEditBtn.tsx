import Button from '@mui/material/Button';
import AddToQueueIcon from '@mui/icons-material/AddToQueue';
import EditCalendarIcon from '@mui/icons-material/EditCalendar';
import React from 'react';

interface AssignEditBtnProps {
  hasCourses: boolean;
  isSelectedUser: boolean;
  handleCoursesDialogOpen: () => void;
}

const AssignEditButton: React.FC<AssignEditBtnProps> = ({
  hasCourses,
  handleCoursesDialogOpen,
  isSelectedUser,
}) => {
  return (
    <Button
      variant="contained"
      color={!hasCourses ? 'info' : 'secondary'}
      startIcon={!hasCourses ? <AddToQueueIcon /> : <EditCalendarIcon />}
      onClick={handleCoursesDialogOpen}
      disabled={isSelectedUser}
    >
      {/* {!hasCourses ? 'Назначить' : 'Редактировать'} */}
    </Button>
  );
};

export default AssignEditButton;
