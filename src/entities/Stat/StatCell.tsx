import React from 'react';
import { Typography } from '@mui/material';
import { AllStatisticsData, CourseAttempt } from '../../app/types/stat.types';



interface StatCellProps {
    row: AllStatisticsData ;
    course: CourseAttempt;
    subColumnData: {field: string, headerName: string};
    handleCellClick: any;
}


const StatCell: React.FC<StatCellProps> = ({ row, course, subColumnData, handleCellClick }) => {
    function calculatePercent(points: number, totalPoints: number) {
        if (totalPoints === 0) {
            return 0;
        }
        return Number(((points / totalPoints) * 100).toFixed(0));
        }

  const attempts = row?.courses?.filter((c) => c.id === course.id)[0]?.attempts;
  const status = attempts && attempts[0]?.status;
  const totalPoints = row?.courses?.filter((c) => c.id === course.id)[0]?.total_points;
  const points = attempts && attempts[0]?.points;
  const percent = calculatePercent(points, totalPoints);
  const localStatus = status === 'passed' ? 'Пройден' : 'Не пройден';
  const unixDate = attempts && attempts[0]?.date;
  const date = new Date(unixDate * 1000).toLocaleDateString('ru-RU');
  const passingScore = totalPoints * 0.7;
  const timeSpent = '9:99';
  const perStr = `${percent}%`;



const displayContent =
    subColumnData.field === 'result' ? `${points}/${totalPoints} - ${percent}%` :
    subColumnData.field === 'status' ? `${localStatus}` :
    subColumnData.field === 'date' ? `${date}` :
    '-';

    return (
        <Typography
        color={status === 'passed' ? 'darkgreen' : 'red'}
        sx={{ cursor: 'pointer' }}
        onClick={handleCellClick(
            course.id,
            row.id,
            row.name,
            status,
            unixDate,
            points,
            totalPoints,
            perStr,
            passingScore,
            timeSpent,
        )}
        >
        {attempts && attempts[0] ? displayContent : '-'}
        </Typography>
);
};

export default StatCell;
