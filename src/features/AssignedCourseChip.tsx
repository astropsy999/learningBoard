import {
  Box,
  Button,
  ButtonGroup,
  Chip,
  CircularProgress,
  IconButton,
  Popover,
  Typography,
} from '@mui/material';
import React, { useState, useEffect } from 'react';

import { CourseData } from '../app/store/courses';
import { SelectedRowData } from '../app/types/store';

import LockResetIcon from '@mui/icons-material/LockReset';
import CheckIcon from '@mui/icons-material/Check';
import { deleteAttempt } from '../app/api/api';

interface AssignedCourseChipProps {
  row: SelectedRowData;
  course: CourseData;
}

export const AssignedCourseChip: React.FC<AssignedCourseChipProps> = ({
  row,
  course,
}) => {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

  const [popoverData, setPopoverData] = useState<{
    userId: number | null;
    userName: string | null;
    courseId: number | null;
    courseTitle: string | null;
  }>({
    userId: null,
    userName: null,
    courseId: null,
    courseTitle: null,
  });

  const [loading, setLoading] = useState(false);
  const [resetSuccessfulCourses, setResetSuccessfulCourses] = useState<{
    [key: number]: boolean;
  }>({});
  const [showResetIcon, setShowResetIcon] = useState<{
    [key: number]: boolean;
  }>({});

  const isLocked = row.courses_exclude.includes(course.id);

  const deadline = row.courses.find(
    (c: { hasOwnProperty: (arg0: number) => any }) =>
      c.hasOwnProperty(course.id)
  )?.deadline;

  const availability = row.courses.find(
    (c: { hasOwnProperty: (arg0: number) => any }) =>
      c.hasOwnProperty(course.id)
  )?.availability;

  useEffect(() => {
    setShowResetIcon((prev) => ({
      ...prev,
      [course.id]: !availability,
    }));
  }, [availability, course.id]);

  let chipColor: 'error' | 'secondary';
  chipColor = isLocked ? 'error' : 'secondary';

  let chipLabel;
  switch (deadline) {
    case undefined:
      return null;
    case null:
      chipLabel = 'Без срока';
      break;
    default:
      chipLabel = new Date(deadline * 1000).toLocaleDateString('ru-RU');
      break;
  }

  if (chipLabel === null) {
    return null;
  }

  const resetAttempts = (userId: number, courseId: number) => {
    setLoading(true);
    deleteAttempt(userId, courseId).then(() => {
      setLoading(false);
      setResetSuccessfulCourses((prev) => ({
        ...prev,
        [courseId]: true,
      }));
      setTimeout(() => {
        setShowResetIcon((prev) => ({
          ...prev,
          [courseId]: false,
        }));
        setResetSuccessfulCourses((prev) => ({
          ...prev,
          [courseId]: false,
        }));
      }, 2000); // Убираем значок через 2 секунды
      setAnchorEl(null);
    });
  };

  const handleClick = (
    event: React.MouseEvent<HTMLButtonElement>,
    row: SelectedRowData,
    course: CourseData
  ) => {
    const userId = row.id;
    const courseId = course.id;
    const userName = row.name;
    const courseTitle = course.title;

    setPopoverData({ userId, userName, courseId, courseTitle });
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  return (
    <Box m="5px" display="flex" justifyContent="center" alignItems="center">
      <Chip
        label={chipLabel}
        color={chipColor}
        variant="outlined"
        sx={{ fontSize: '14px', fontWeight: 'bold' }}
      />
      {showResetIcon[course.id] && (
        <IconButton
          color="warning"
          size="large"
          title="Попытки исчерпаны! Нажмите для сброса"
          onClick={(event) => handleClick(event, row, course)}
        >
          {resetSuccessfulCourses[course.id] ? (
            <CheckIcon color="success" fontSize="large" />
          ) : (
            <LockResetIcon color="warning" fontSize="large" />
          )}
        </IconButton>
      )}

      <Popover id={id} open={open} anchorEl={anchorEl} onClose={handleClose}>
        <Box sx={{ p: 2 }} width={250}>
          <Typography>
            Сбросить попытки у<br /> <b>{popoverData.userName}</b> для{' '}
            <b>{popoverData.courseTitle}</b>?
          </Typography>
          <Box display="flex" justifyContent="flex-end" mt={2}>
            <ButtonGroup disableElevation variant="contained">
              <Button
                color="success"
                onClick={() =>
                  resetAttempts(popoverData.userId!, popoverData.courseId!)
                }
              >
                {loading && <CircularProgress size={16} />}
                <Box ml={1}>Да</Box>
              </Button>
              <Button color="error" onClick={handleClose}>
                Отмена
              </Button>
            </ButtonGroup>
          </Box>
        </Box>
      </Popover>
    </Box>
  );
};
