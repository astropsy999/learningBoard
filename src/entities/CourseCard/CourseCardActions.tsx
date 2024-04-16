import React from 'react';
import { CourseData } from '../../app/data/store/courses';
import { useLearners } from '../../app/data/store/learners';
import AssignDatePicker from '../../features/DatePicker';
import {
  Box,
  CardActions,
  Checkbox,
  CircularProgress,
  FormControlLabel,
  Skeleton,
  Switch,
} from '@mui/material';

interface CourseCardActionsProps {
  courseLocked: boolean;
  handleLockUnlock: (
    e: React.MouseEvent<HTMLLabelElement, MouseEvent>,
    courseId: number,
    courseLocked: boolean,
  ) => void;
  courseItem: CourseData;
  globalLoading?: boolean;
  isCoursedateLoading?: boolean;
  isCourseCardLoading?: boolean;
  handleDateChange: (newDate: Object | null, itemId: number) => void;
  deadlineDate?: string | number;
  checked?: boolean;
  isLoading?: boolean;
}

export const CourseCardActions: React.FC<CourseCardActionsProps> = (props) => {
  const {
    checked,
    courseLocked,
    handleLockUnlock,
    courseItem,
    globalLoading,
    isCourseCardLoading,
    handleDateChange,
    deadlineDate,
    isLoading,
  } = props;

  const { currentUserData, onlyLearnerName, allLearners, selectedRowsData } =
    useLearners();

  return (
    <CardActions
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignContent: 'center',
      }}
    >
      <Box>
        {!isCourseCardLoading ? (
          <Checkbox color="info" checked={checked} />
        ) : (
          <CircularProgress size={33} color="info" />
        )}
      </Box>
      {currentUserData?.manager.level === 1 && (
        <Box>
          {isLoading ? (
            <CircularProgress size={30} color="info" />
          ) : (
            <FormControlLabel
              control={
                <Switch
                  checked={courseLocked}
                  color={courseLocked ? 'warning' : 'secondary'}
                />
              }
              label={courseLocked ? 'Разблокировать' : 'Блокировать'}
              onClick={(e: React.MouseEvent<HTMLLabelElement, MouseEvent>) =>
                handleLockUnlock(e, courseItem.id, courseLocked)
              }
            />
          )}
        </Box>
      )}
      <Box
        sx={{
          backgroundColor: !globalLoading
            ? !courseLocked
              ? 'lightskyblue'
              : 'lightcoral'
            : 'inherit',
          display: !checked ? 'none' : 'block',
          borderRadius: 1,
        }}
      >
        {!globalLoading ? (
          <AssignDatePicker
            onDateChange={(newDate) => handleDateChange(newDate, courseItem.id)}
            disabled={!checked}
            defaultValue={deadlineDate as string}
          />
        ) : (
          <Skeleton width={130} height={60} />
        )}
      </Box>
    </CardActions>
  );
};
