import { Box, Button, Typography, useTheme } from '@mui/material';
import { DataGrid, GridColumns, GridOverlay } from '@mui/x-data-grid';
import React, { useState } from 'react';
import Skeleton from 'react-loading-skeleton';
// import { AllUsersData } from '../../../types';
import Header from '../../components/Header';
import { mockDataTeam } from '../../data/mockData';
// import { useUsers } from '../../data/store';
import AddToQueueIcon from '@mui/icons-material/AddToQueue';
import { useUsers } from '../../data/store';
import { tokens } from '../../theme';
import { CoursesToLearner } from '../coursestolearner/CoursesToLearner';

type SelectedRowData = {
  id: number;
  name: string;
  email: string;
  age: number;
  phone: string;
  access: string;
  courses: string[];
};

const MyLearners = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [loading, setLoading] = useState(false);
  const { COURSES_TO_LEARNERS_DIALOG, openCoursesDialog } = useUsers();
  const [learnerName, setLearnerName] = useState('');
  const [selectedRows, setSelectedRows] = useState<
    (SelectedRowData | undefined)[]
  >([]);

  const handleCoursesDialogOpen = (learnerName: string) => {
    // setDialogOpen(true);
    openCoursesDialog(true);
    setLearnerName(learnerName);
  };

  const { setSelectedRowsDataOnMyLearners } = useUsers();

  const isSelectedUser = selectedRows.length > 0;

  const handleCoursesDialogClose = () => {
    // setDialogOpen(false);
    openCoursesDialog(false);
  };

  const handleSelectionModelChange = (newSelection: Object[]) => {
    const selectedRowData = newSelection.map((rowId) => {
      return mockDataTeam.find((row) => row.id === rowId); // Примерный метод поиска строки в данных
    });
    console.log('🚀 ~ selectedRowData ~ selectedRowData:', selectedRowData);
    setSelectedRows(selectedRowData);
    setSelectedRowsDataOnMyLearners(selectedRowData);
  };

  const { allUsers, setAllUsers } = useUsers();

  // useEffect(() => {
  //   const fetchAllUsers = async () => {
  //     try {
  //       setAllUsers(await getAllUsers());
  //     } catch (error) {
  //       console.log('error: ', error);
  //     }
  //   };

  //   fetchAllUsers();
  // }, [setAllUsers]);

  // useEffect(() => {
  //   console.log('allUsers: ', allUsers);
  // }, [allUsers]);

  const columns: GridColumns = [
    { field: 'id', headerName: 'ID' },
    {
      field: 'name',
      headerName: 'ФИО',
      flex: 1,
      cellClassName: 'name-column--cell',
    },
    {
      field: 'position',
      headerName: 'Должность',
      type: 'string',
      headerAlign: 'left',
      align: 'left',
    },
    {
      field: 'division',
      headerName: 'Подразделение',
      flex: 1,
    },
    {
      field: 'courses',
      headerName: 'Обучение',
      flex: 1,
      renderCell: ({ row }) => {
        // Предполагая, что курсы хранятся в массиве `courses` объектов
        const coursesList = row.courses
          .map((course: string) => course)
          .join(', ');
        return <Typography>{coursesList}</Typography>;
      },
    },
    {
      field: 'addCourses',
      headerName: 'Назначение',
      flex: 1,
      renderCell: ({ row }) => {
        const hasCourses = row.courses.length;
        return (
          <>
            <Button
              variant="contained"
              color="secondary"
              startIcon={<AddToQueueIcon />}
              onClick={() => handleCoursesDialogOpen(row.name)}
              disabled={isSelectedUser}
            >
              {!hasCourses ? 'Назначить' : 'Добавить'}
            </Button>
          </>
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
        m="10px 0 0 0"
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
            backgroundColor: colors.blueAccent[800],
            borderBottom: 'none',
          },
          '& .MuiDataGrid-virtualScroller': {
            backgroundColor: colors.primary[400],
          },
          '& .MuiDataGrid-footerContainer': {
            borderTop: 'none',
            backgroundColor: colors.blueAccent[800],
          },
          '& .MuiCheckbox-root': {
            color: `${colors.greenAccent[200]} !important`,
          },
        }}
      >
        <DataGrid
          checkboxSelection
          disableSelectionOnClick
          rows={mockDataTeam}
          columns={columns}
          components={{
            LoadingOverlay: SkeletonOverlay,
          }}
          loading={loading}
          onSelectionModelChange={handleSelectionModelChange}
        />
        <Skeleton />
      </Box>
      <CoursesToLearner
        onOpen={COURSES_TO_LEARNERS_DIALOG}
        onClose={handleCoursesDialogClose}
        name={learnerName}
      />
    </Box>
  );
};

export default MyLearners;
