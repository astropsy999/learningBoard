import { Divider, Typography, colors } from '@mui/material';
import React, { FC } from 'react';

interface MenuSeparProps {
  separName?: string;
}

export const MenuSeparator: FC<MenuSeparProps> = ({ separName }) => {
  return (
    <Typography
      variant="h6"
      color={colors.grey[300]}
      sx={{ m: '15px 0 5px 20px' }}
    >
      {separName} || <Divider />
    </Typography>
  );
};
