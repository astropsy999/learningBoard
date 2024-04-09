import { Box } from '@mui/material';
import Header from '../../ui/Header';
import PieChart from './PieChart';
import React from 'react';

const Pie = () => {
  return (
    <Box m="20px">
      <Header title="Pie Chart" subtitle="Simple Pie Chart" />
      <Box height="75vh">
        <PieChart />
      </Box>
    </Box>
  );
};

export default Pie;
