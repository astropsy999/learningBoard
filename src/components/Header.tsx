import { Typography, Box, useTheme } from '@mui/material';
import { tokens } from '../theme';
import { FC } from 'react';
import React from 'react';

interface HeaderProps {
  title: string;
  subtitle: string;
}

const Header: FC<HeaderProps> = ({ title, subtitle }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  return (
    <Box mb="30px">
      <Typography
        variant="h2"
        color={'#1C666D'}
        fontWeight="bold"
        sx={{ m: '0 0 5px 0' }}
      >
        {title}
      </Typography>
      <Typography variant="h5" color={colors.greenAccent[400]}>
        {subtitle}
      </Typography>
    </Box>
  );
};

export default Header;
