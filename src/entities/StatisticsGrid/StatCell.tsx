import React from 'react';
import { Typography } from '@mui/material';
import {
  AllStatisticsData,
  AllStatisticsDataBestTry,
  CourseAttempt,
} from '../../app/types/stat';
import { formatDate } from '../../shared/helpers/formatDateStr';

export interface StatCellProps {
  row: AllStatisticsDataBestTry;
  course: CourseAttempt;
  subColumnData: { field: string; headerName: string };
  handleCellClick: any;
}

const StatCell: React.FC<StatCellProps> = ({
  row,
  course,
  subColumnData,
  handleCellClick,
}) => {
  const attempts = row?.courses;

  const status = attempts && attempts[0]?.result?.state;
  const totalPoints = row?.courses[0]?.points;
  const points = attempts && attempts[0]?.result?.points;
  const percent = attempts && attempts[0]?.result?.percent;
  const localStatus = status ? 'Пройден' : 'Не пройден';
  const dateStr = attempts && attempts[0]?.datetime_finished;
  const date = formatDate(dateStr);
  const passingScore = totalPoints * 0.7;
  const timeSpent = '9:99';
  const perStr = `${percent}%`;

  const displayContent =
    subColumnData.field === 'result'
      ? `${points}/${totalPoints} - ${percent}%`
      : subColumnData.field === 'status'
      ? `${localStatus}`
      : subColumnData.field === 'date'
      ? `${date}`
      : '-';

  return (
    <Typography
      color={status ? 'darkgreen' : 'red'}
      sx={{ cursor: 'pointer' }}
      onClick={handleCellClick(
        course.id,
        row.id,
        row.name,
        status,
        points,
        totalPoints,
        perStr,
        passingScore,
        timeSpent
      )}
    >
      {attempts && attempts[0] ? displayContent : '-'}
    </Typography>
  );
};

export default StatCell;
