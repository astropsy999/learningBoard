import { Box, Card, CardContent, Skeleton, Stack } from '@mui/material';
import React from 'react';
import { DetailedAttemptStat } from '../app/types/stat';
import { DetailedStatCardItem } from './DetailedStatCardItem';

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
          <DetailedStatCardItem
            itemTitle={'Дата/Время'}
            value={time_finished}
            isLoading={isLoading}
          />
          <DetailedStatCardItem
            itemTitle={'Вопросов отвечено'}
            value={`${passed} / ${count_questions}`}
            isLoading={isLoading}
          />

          <DetailedStatCardItem
            itemTitle="Набрано баллов"
            value={`${points_scored} / ${total_points} (${passed_percent}%)`}
            isLoading={isLoading}
          />
          <DetailedStatCardItem
            itemTitle="Проходной балл"
            value={`${passing_score} (${passing_score_percent}%)`}
            isLoading={isLoading}
          />
          <DetailedStatCardItem
            itemTitle="Затрачено времени"
            value={time_spent_format}
            isLoading={isLoading}
          />

          <DetailedStatCardItem
            itemTitle="Результат"
            value={status}
            isLoading={isLoading}
            color={isPassed ? 'green' : 'red'}
          />
        </Box>
      </CardContent>
    </Card>
  );
};
