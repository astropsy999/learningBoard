import { Box, Button, Chip, Typography, useTheme } from '@mui/material';
import { DataGrid, GridColDef, useGridApiRef } from '@mui/x-data-grid';
import React, { useEffect, useMemo, useState } from 'react';
// import { AllUsersData } from '../../../types';
import Header from '../../components/Header';
import { mockDataTeam } from '../../data/mockData';
// import { useUsers } from '../../data/store';
import AddToQueueIcon from '@mui/icons-material/AddToQueue';
import { useQuery } from '@tanstack/react-query';
import { useLearners } from '../../data/store/learners.store';
import { fetchAllLearners } from '../../services/learners.service';
import { tokens } from '../../theme';
import { CoursesToLearner } from '../coursestolearner/CoursesToLearner';
import { useCourses } from '../../data/store/courses.store';

export type SelectedRowData = {
  id: number;
  name: string;
  position?: string;
  division?: string;
  email: string;
  age: number;
  phone: string;
  access?: string;
  courses: string[];
};

const MyLearners = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const {
    COURSES_TO_LEARNERS_DIALOG,
    openCoursesDialog,
    turnOffDivisionFilter,
  } = useLearners();
  const { setOnlyLearnerName, setSelectedRowsDataOnMyLearners } = useLearners();
  const { setSelectedCoursesToSave } = useCourses();
  const [selectedRows, setSelectedRows] = useState<
    SelectedRowData[] | undefined
  >([]);

  const apiRef = useGridApiRef();

  const { data, isLoading, isError } = useQuery({
    queryKey: ['allLearners'],
    queryFn: fetchAllLearners,
  });

  const filteredDivision = useMemo(() => {
    return {
      items: [
        {
          field: 'division',
          operator: 'contains',
          value: 'ОИТ',
        },
      ],
    };
  }, []);

  const unsetDivisionFilter = useMemo(() => {
    return {
      items: [
        {
          field: 'division',
          operator: '',
          value: 'ОИТ',
        },
      ],
    };
  }, []);

  const handleCoursesDialogOpen = (learnerName: string) => {
    openCoursesDialog(true);
    setOnlyLearnerName(learnerName);
  };

  const isSelectedUser = selectedRows!.length > 0;

  useEffect(() => {
    if (turnOffDivisionFilter) {
      apiRef.current.setFilterModel(unsetDivisionFilter);
    } else {
      apiRef.current.setFilterModel(filteredDivision);
    }
  }, [apiRef, filteredDivision, turnOffDivisionFilter, unsetDivisionFilter]);

  const handleCoursesDialogClose = () => {
    openCoursesDialog(false);
    setOnlyLearnerName('');
    setSelectedCoursesToSave([]);
  };

  const handleSelectionModelChange = (newSelection: Object[]) => {
    const selectedRowData: SelectedRowData[] = newSelection
      .map((rowId) => mockDataTeam.find((row) => row.id === rowId))
      .filter((row) => !!row) as SelectedRowData[];

    setSelectedRows(selectedRowData);
    setSelectedRowsDataOnMyLearners(selectedRowData);
  };

  const columns: GridColDef[] = [
    {
      field: 'id',
      headerName: 'ID',
      flex: 0.1,
      headerClassName: 'name-column--cell',
    },
    {
      field: 'name',
      headerName: 'ФИО',
      flex: 1.2,
      headerClassName: 'name-column--cell',
    },
    {
      field: 'position',
      headerName: 'Должность',
      type: 'string',
      headerAlign: 'left',
      flex: 0.8,
      align: 'left',
      headerClassName: 'name-column--cell',
    },
    {
      field: 'division',
      headerName: 'Подразделение',
      flex: 1,
      headerClassName: 'name-column--cell',
    },
    {
      field: 'courses',
      headerName: 'Обучающие материалы',
      flex: 1.5,
      renderCell: ({ row }) => {
        return row.courses.map((course: string) => (
          <Chip
            key={course}
            label={course}
            variant="outlined"
            sx={{ margin: '2px' }}
          />
        ));
      },
      headerClassName: 'name-column--cell',
    },
    {
      field: 'addCourses',
      headerName: 'Назначение',
      flex: 0.6,
      headerClassName: 'name-column--cell',
      renderCell: ({ row }) => {
        const hasCourses = row.courses.length;
        return (
          <>
            <Button
              variant="contained"
              color={!hasCourses ? 'info' : 'secondary'}
              startIcon={<AddToQueueIcon />}
              onClick={() => handleCoursesDialogOpen(row.name)}
              disabled={isSelectedUser}
            >
              {!hasCourses ? 'Назначить' : 'Добавить'}
            </Button>
          </>
        );
      },
      disableColumnMenu: true,
    },
  ];

  return (
    <Box m="20px" pt={2}>
      <Header title="" subtitle="" />

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
            backgroundColor: colors.blueAccent[800],
            fontWeight: 'bold',
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
          '& .MuiDataGrid-columnHeaderCheckbox': {
            backgroundColor: colors.blueAccent[800],
          },
        }}
      >
        {isError ? (
          <Typography variant="body1">Ошибка при загрузке данных...</Typography>
        ) : (
          <DataGrid
            autoHeight={true}
            apiRef={apiRef}
            checkboxSelection
            disableRowSelectionOnClick
            rows={isLoading ? [] : data!}
            columns={columns}
            loading={isLoading}
            onRowSelectionModelChange={handleSelectionModelChange}
            initialState={{
              filter: {
                filterModel: filteredDivision,
              },
            }}
          />
        )}
      </Box>
      <CoursesToLearner
        onOpen={COURSES_TO_LEARNERS_DIALOG}
        onClose={handleCoursesDialogClose}
      />
    </Box>
  );
};

export default MyLearners;
