import { Chip } from '@mui/material';
import React from 'react';
import { SelectedRowData } from '../scenes/MyLearners';
import { CourseData } from '../data/store/courses.store';

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

  let chipColor: 'error' | 'success';
  chipColor = isLocked ? 'error' : 'success';

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

  return <Chip label={chipLabel} color={chipColor} />;
};
