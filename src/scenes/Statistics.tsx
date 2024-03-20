import DownloadOutlinedIcon from '@mui/icons-material/DownloadOutlined';
import EmailIcon from '@mui/icons-material/Email';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import PointOfSaleIcon from '@mui/icons-material/PointOfSale';
import TrafficIcon from '@mui/icons-material/Traffic';
import { Box, Button, IconButton, Typography, useTheme } from '@mui/material';
import React from 'react';
import BarChart from '../components/BarChart';
import Header from '../components/Header';
import LineChart from '../components/LineChart';
import ProgressCircle from '../components/ProgressCircle';
import StatBox from '../components/StatBox';
import { mockTransactions } from '../data/mockData';
import { tokens } from '../theme';
import { DataGrid, GridColDef, GridColumnGroup, GridColumnGroupingModel } from '@mui/x-data-grid';

const Statistics = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  // const generateColumns = (categories) => {
  //   let columns = [
  //     { field: 'id', headerName: 'ID', width: 90 },
  //     { field: 'name', headerName: 'ФИО', width: 180 },
  //   ];
  
  //   categories.forEach((category) => {
  //     for (let i = 1; i <= 3; i++) {
  //       columns.push({
  //         field: `${category}_${i}`,
  //         headerName: `${i}`,
  //       });
  //     }
  //   });
  
  //   return columns;
  // };

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 90 },
    { field: 'name', headerName: 'ФИО', width: 180 },
    
    {
      field: '10_1',
      headerName: '1',
    },
    {
      field: '10_2',
      headerName: '2',
    },
    {
      field: '10_3',
      headerName: '3',
    },

    {
      field: '12_1',
      headerName: '1',
    },
    {
      field: '12_2',
      headerName: '2',
    },
    {
      field: '12_3',
      headerName: '3',
    },
 
  ];
  
  const rows = [
    { id: 1, name: 'Стужук Е.В.', '10_1': 5, '10_2': 8, '10_3':10, '12_1': 7, '12_2': 9, '12_3':11 },
    { id: 2, name: 'Гоман Д.А.', '10_1': 5, '10_2': 8, '10_3':10,'12_1': 7, '12_2': 9, '12_3':11 },

    
  ];
  
  const columnGroupingModel: GridColumnGroupingModel = [
  
        {
          groupId: 'Охрана труда. Первая помощь',
          children: [{ field: '10_1' }, { field: '10_2' }, {field:'10_3'}],
        },

        {
          groupId: 'Охрана труда. Нормативная база',
          children: [{ field: '12_1' }, { field: '12_2' }, {field:'12_3'}],
        },

  ];

 return  (
  <DataGrid
        rows={rows}
        columns={columns}
        disableRowSelectionOnClick
        columnGroupingModel={columnGroupingModel}
/>)
};

export default Statistics;
