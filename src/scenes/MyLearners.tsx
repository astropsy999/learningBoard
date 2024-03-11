import React, { useCallback, useEffect, useMemo, useState } from 'react';
import AddToQueueIcon from '@mui/icons-material/AddToQueue';
import { Box, Button, Chip, Typography, useTheme } from '@mui/material';
import { DataGrid, GridColDef, useGridApiRef } from '@mui/x-data-grid';
import useSWR from 'swr';
import Header from '../components/Header';
import { mockDataTeam } from '../data/mockData';
import { useCourses } from '../data/store/courses.store';
import { useLearners } from '../data/store/learners.store';
import { fetchAllData, fetchAllLearners, getCurrentUserDivision } from '../services/api.service';
import { tokens } from '../theme';
import { CoursesToLearner } from './CoursesToLearner';
import { Course, Divisions } from '../data/types.store';

export type SelectedRowData = {
  id: number;
  name: string;
  position?: string;
  division?: string;
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
    setOnlyLearnerName, setSelectedRowsDataOnMyLearners, deSelectAll,
    allData, currentUserName 
  } = useLearners();

  const [isLoading, setIsLoading] = useState(true);
  const [allLearners, setAllLearners] = useState<any[]>([]);
  const [divisions, setDivisions] = useState<Divisions>();
  const [courses, setCourses] = useState<Course[]>([]);
  const [currentUserDivision, setCurrentUserDivision] = useState<string>();

  const { setSelectedCoursesToSave } = useCourses();
  const [selectedRows, setSelectedRows] = useState<
    SelectedRowData[] | undefined
  >([]);

  const apiRef = useGridApiRef();

  const getCurrentUserDivision = useCallback(() => {
    const currentLearner = allLearners?.filter(
      (learner) => learner?.name === currentUserName
    );

    return String(currentLearner[0]?.division);
  }, [allLearners, currentUserName]);



  useEffect(() => {
    if (allData) {
      setIsLoading(false)
      setAllLearners(allData.users)
      setDivisions(allData.divisions)
      setCourses(allData.courses)
      setCurrentUserDivision(getCurrentUserDivision())
    }
  }, [allData, allLearners, currentUserDivision, divisions, getCurrentUserDivision])




const filteredDivision = useMemo(() => {
    return {
      items: [
        {
          field: 'division',
          operator: 'contains',
          value: currentUserDivision,
        },
      ],
    };
  }, [currentUserDivision]);

  const unsetDivisionFilter = useMemo(() => {
    return {
      items: [
        {
          field: 'division',
          operator: '',
          value: currentUserDivision,
        },
      ],
    };
  }, [currentUserDivision]);

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
    deSelectAll();
  };

  const handleSelectionModelChange = (newSelection: Object[]) => {
    const selectedRowData: SelectedRowData[] = newSelection
      .map((rowId) => allLearners.find((row) => row.id === rowId))
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
      renderCell: ({row}) => {
        return divisions![row?.division]
      },
    },
    {
      field: 'courses',
      headerName: 'Обучающие материалы',
      flex: 1.5,
      renderCell: ({ row }) => {
        return row.courses.map((course: number) => {
          const courseTitle = courses.find((c) => c.id === course)?.title;
          if (courseTitle) {
            return (
              <Chip
                key={course}
                label={courseTitle}
                variant="outlined"
                sx={{ margin: '2px' }}
              />
            );
          } else {
            return null; 
          }
        });
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
       
         <DataGrid
            autoHeight={true}
            apiRef={apiRef}
            checkboxSelection
            disableRowSelectionOnClick
            rows={isLoading ? [] : allLearners!}
            columns={columns}
            loading={isLoading}
            onRowSelectionModelChange={handleSelectionModelChange}
            initialState={{
              filter: {
                filterModel: filteredDivision,
              },
            }}
          />
      
      </Box>
      <CoursesToLearner
        onOpen={COURSES_TO_LEARNERS_DIALOG}
        onClose={handleCoursesDialogClose}
      />
    </Box>
  );
};

export default MyLearners;
