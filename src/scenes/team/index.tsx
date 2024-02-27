import AdminPanelSettingsOutlinedIcon from '@mui/icons-material/AdminPanelSettingsOutlined';
import LockOpenOutlinedIcon from '@mui/icons-material/LockOpenOutlined';
import SecurityOutlinedIcon from '@mui/icons-material/SecurityOutlined';
import { Box, Typography, useTheme } from '@mui/material';
import { DataGrid, GridColumns, GridOverlay } from '@mui/x-data-grid';
import React, { useEffect, useState } from 'react';
import Skeleton from 'react-loading-skeleton';
// import { AllUsersData } from '../../../types';
import Header from '../../components/Header';
import { mockDataTeam } from '../../data/mockData';
// import { useUsers } from '../../data/store';
import { tokens } from '../../theme';

const Team = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [loading, setLoading] = useState(false);

  // const { allUsersData, getAllUsers } = useUsers();

  // Вызов функции для получения всех пользователей при монтировании компонента
  useEffect(() => {
    // Base.Request.send(configApi.srv + url.GetAllUsers, (data) => {
    //   console.log('🚀 ~ Base.Request.send ~ data:', data); //<=== сюда ничего не приходит😢
    // });
  }, []);

  const columns: GridColumns = [
    { field: 'id', headerName: 'ID' },
    {
      field: 'name',
      headerName: 'ФИО',
      flex: 1,
      cellClassName: 'name-column--cell',
    },
    {
      field: 'age',
      headerName: 'Age',
      type: 'number',
      headerAlign: 'left',
      align: 'left',
    },
    {
      field: 'phone',
      headerName: 'Phone Number',
      flex: 1,
    },
    {
      field: 'email',
      headerName: 'Email',
      flex: 1,
    },
    {
      field: 'accessLevel',
      headerName: 'Access Level',
      flex: 1,
      renderCell: ({ row: { access } }) => {
        return (
          <Box
            sx={{
              width: '60%',
              m: '0 auto',
              p: '5px',
              display: 'flex',
              justifyContent: 'center',
              backgroundColor: () => {
                return access === 'admin'
                  ? colors.greenAccent[600]
                  : access === 'manager'
                  ? colors.greenAccent[700]
                  : colors.greenAccent[700];
              },
              borderRadius: '4px',
            }}
          >
            {access === 'admin' && <AdminPanelSettingsOutlinedIcon />}
            {access === 'manager' && <SecurityOutlinedIcon />}
            {access === 'user' && <LockOpenOutlinedIcon />}
            <Typography color={colors.grey[100]} sx={{ ml: '5px' }}>
              {access}
            </Typography>
          </Box>
        );
      },
    },
  ];

  const SkeletonOverlay = () => (
    <GridOverlay>
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
        }}
      >
        <Skeleton height={'100%'} style={{ opacity: '0.7' }} />
      </div>
    </GridOverlay>
  );

  return (
    <Box m="20px">
      <Header title="МОИ УЧЕНИКИ" subtitle="Список учеников" />
      <Box
        m="40px 0 0 0"
        height="75vh"
        sx={{
          '& .MuiDataGrid-root': {
            border: 'none',
          },
          '& .MuiDataGrid-cell': {
            borderBottom: 'none',
          },
          '& .name-column--cell': {
            color: colors.greenAccent[300],
          },
          '& .MuiDataGrid-columnHeaders': {
            backgroundColor: colors.blueAccent[700],
            borderBottom: 'none',
          },
          '& .MuiDataGrid-virtualScroller': {
            backgroundColor: colors.primary[400],
          },
          '& .MuiDataGrid-footerContainer': {
            borderTop: 'none',
            backgroundColor: colors.blueAccent[700],
          },
          '& .MuiCheckbox-root': {
            color: `${colors.greenAccent[200]} !important`,
          },
        }}
      >
        <DataGrid
          checkboxSelection
          rows={mockDataTeam}
          columns={columns}
          components={{
            LoadingOverlay: SkeletonOverlay,
          }}
          loading={loading}
        />
        <Skeleton />
      </Box>
    </Box>
  );
};

export default Team;
