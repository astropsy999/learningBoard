import { Box, Card, CardContent, Skeleton, Stack } from '@mui/material';
import React from 'react';
import { DetailedAttemptStat } from '../app/types/stat';

interface DetailedBestAttemptCardProps {
  data: DetailedAttemptStat;
  isLoading: boolean;
}

export const DetailedBestAttemptCard: React.FC<DetailedBestAttemptCardProps> = (
  props,
) => {
  const { data, isLoading } = props;
  const {
    passing_score_percent,
    passed_percent,
    time_finished,
    passed,
    count_questions,
    passing_score,
    total_points,
    points_scored,
    time_spent_format,
  } = data;

  const isPassed = passed_percent >= passing_score_percent;
  const status = isPassed ? 'Пройдено' : 'Не пройдено';

  const statusColor = isPassed ? '#E7FCE8' : '#FFE8E6';

  return (
    <Card>
      <CardContent
        sx={{ backgroundColor: isLoading ? 'grey' : statusColor }}
        // onLoad={isLoading}
      >
        <Box p={1}>
          <Box>
            Дата/Время: <b>{time_finished}</b>
          </Box>
          <Box>
            Вопросов отвечено:{' '}
            <b>
              {passed} / {count_questions}
            </b>
          </Box>
          <Box>
            Набрано баллов:{' '}
            <b>
              {points_scored} / {total_points} ({passed_percent}%)
            </b>
          </Box>
          <Box>
            Проходной балл:{' '}
            <b>
              {passing_score} ({passing_score_percent}%)
            </b>
          </Box>
          <Box>
            Затрачено времени: <b>{time_spent_format}</b>
          </Box>
          <Stack direction="row">
            <Box>Результат: </Box>
            <Box
              color={isPassed ? 'success.main' : 'error.main'}
              fontWeight="bold"
              ml={1}
            >
              {status}
            </Box>
          </Stack>
        </Box>
      </CardContent>
    </Card>
  );
};
