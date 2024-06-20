import { Badge, Box, Card, CardContent } from '@mui/material';
import React from 'react';
import { DetailedAttemptStat, StatInfoType } from '../app/types/stat';
import { DetailedStatCardItem } from './DetailedStatCardItem';

interface DetailedBestAttemptCardProps {
  data: DetailedAttemptStat;
  oldData?: StatInfoType;
  isLoading: boolean;
}

export const DetailedBestAttemptCard: React.FC<DetailedBestAttemptCardProps> = (
  props
) => {
  const { data, isLoading, oldData } = props;
  console.log('data: ', data);

  let isPassed;

  if (data) {
    isPassed = data.passed_percent >= data.passing_score_percent;
  } else {
    isPassed = oldData?.status === 'passed';
  }
  const status = isPassed ? 'Пройдено' : 'Не пройдено';

  const statusColor = isPassed ? '#E7FCE8' : '#FFE8E6';

  const date = new Date(oldData!.unixDate * 1000).toLocaleDateString('ru-RU');
  const time = new Date(oldData!.unixDate * 1000).toLocaleTimeString('ru-RU', {
    hour: '2-digit',
    minute: '2-digit',
  });

  const oldPercentage = Math.round(
    (oldData!.points / oldData!.totalPoints) * 100
  );

  return (
    <Card>
      <CardContent
        sx={{
          backgroundColor: isLoading ? 'lightgrey' : statusColor,
          opacity: isLoading ? 0.8 : 1,
        }}
      >
        <Box p={1}>
          <Badge
            color="secondary"
            badgeContent={'Лучшая попытка'}
            sx={{
              whiteSpace: 'nowrap',
              alignContent: 'right',
              marginLeft: '90%',
              opacity: 0.8,
            }}
          />

          <DetailedStatCardItem
            itemTitle={'Дата/Время'}
            value={data?.time_finished || date + ' ' + time}
            isLoading={isLoading}
          />
          <DetailedStatCardItem
            itemTitle={'Вопросов отвечено'}
            value={`${data?.answered_questions} / ${data?.count_questions}`}
            isLoading={isLoading}
          />

          <DetailedStatCardItem
            itemTitle="Набрано баллов"
            value={`${data?.points_scored || oldData!.points} / ${
              data?.total_points || oldData!.totalPoints
            } (${data?.passed_percent || oldPercentage}%)`}
            isLoading={isLoading}
          />
          <DetailedStatCardItem
            itemTitle="Проходной балл"
            value={`${
              data?.passing_score || Math.floor(oldData!.passingScore)
            } (${data?.passing_score_percent || 70}%)`}
            isLoading={isLoading}
          />
          <DetailedStatCardItem
            itemTitle="Затрачено времени"
            value={data?.time_spent_format || ''}
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
