import { Box, Skeleton } from '@mui/material';
import React from 'react';

interface DetailedStatCardItemProps {
  value: string;
  itemTitle: string;
  isLoading?: boolean;
  color?: string;
}

export const DetailedStatCardItem = (props: DetailedStatCardItemProps) => {
  const { itemTitle, value, isLoading, color } = props;

  return (
    <Box display={'flex'} flexDirection={'row'} ml={1} alignItems={'center'}>
      {itemTitle}:{' '}
      {!isLoading ? (
        <Box ml={1} fontWeight={'bold'} color={color}>
          {value}
        </Box>
      ) : (
        <Box ml={1}>
          <Skeleton width={100} height={20} />
        </Box>
      )}
    </Box>
  );
};
