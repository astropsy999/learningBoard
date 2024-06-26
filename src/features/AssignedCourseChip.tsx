import { Chip } from '@mui/material';
import React from 'react';

import { CourseData } from '../app/store/courses';
import { SelectedRowData } from '../app/types/store';

interface AssignedCourseChipProps {
  row: SelectedRowData;
  course: CourseData;
}

export const AssignedCourseChip: React.FC<AssignedCourseChipProps> = ({
  row,
  course,
}) => {
  const isLocked = row.courses_exclude.includes(course.id);

  const deadline = row.courses.find(
    (c: { hasOwnProperty: (arg0: number) => any }) =>
      c.hasOwnProperty(course.id),
  )?.deadline;

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

  return (
    <Chip
      label={chipLabel}
      color={chipColor}
      variant="outlined"
      sx={{ fontSize: '14px', fontWeight: 'bold' }}
    />
  );
};
