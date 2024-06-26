import { Typography, Box, useTheme } from '@mui/material';
import { tokens } from '../../app/theme';
import { FC } from 'react';
import React from 'react';

interface HeaderProps {
  title: string;
  subtitle: string;
  icon?: React.ReactNode;
}

const Header: FC<HeaderProps> = ({ title, subtitle, icon }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  return (
    <Box>
      <Typography
        variant="h3"
        color={'#1C666D'}
        fontWeight="bold"
        textTransform={'uppercase'}
        sx={{ m: '0 0 5px 0', opacity: '0.7' }}
      >
        {title}
      </Typography>
      <Typography variant="h5" color={colors.greenAccent[400]}>
        {subtitle}
      </Typography>
      <Box>{icon}</Box>
    </Box>
  );
};

export default Header;
