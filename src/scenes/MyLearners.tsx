import AddToQueueIcon from '@mui/icons-material/AddToQueue';
import { Box, Button, Chip, CircularProgress, useTheme } from '@mui/material';
import { DataGrid, GridColDef, useGridApiRef } from '@mui/x-data-grid';
import React, { MouseEvent, useEffect, useMemo, useState } from 'react';
import Header from '../components/Header';
import { useCourses } from '../data/store/courses.store';
import { useLearners } from '../data/store/learners.store';
import { tokens } from '../theme';
import { CoursesToLearner } from './CoursesDialog';
import { updateAllData } from '../services/api.service';
import CancelIcon from '@mui/icons-material/Cancel';
import { toast } from 'react-toastify';
import { useSWRConfig } from 'swr';

export type SelectedRowData = {
  id: number;
  name: string;
  position?: string;
  division?: string;
  access?: string;
  courses: {
    id: number;
    title: string;
  }[];
  isDelLoading: boolean;
};

const MyLearners = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const {
    coursesToLearnersDialog,
    openCoursesDialog,
    turnOffDivisionFilter,
    setOnlyLearnerName,
    setSelectedRowsDataOnMyLearners,
    deSelectAll,
    allData,
    allLearners,
    divisions,
    currentUserDivisionName,
  } = useLearners();
  const { allCourses } = useCourses();

  const { mutate } = useSWRConfig();

  const [isLoading, setIsLoading] = useState(true);
  const { setSelectedCoursesToSave } = useCourses();
  const [selectedRows, setSelectedRows] = useState<
    SelectedRowData[] | undefined
  >([]);
  const [rowDelLoading, setRowDelLoading] = useState<{ [id: number]: boolean }>(
    {},
  );

  const apiRef = useGridApiRef();

  useEffect(() => {
    if (allLearners && divisions && allCourses && currentUserDivisionName) {
      setIsLoading(false);
    }
  }, [allCourses, allData, allLearners, currentUserDivisionName, divisions]);

  const filteredDivision = useMemo(() => {
    return {
      items: [
        {
          field: 'division',
          operator: 'contains',
          value: currentUserDivisionName,
        },
      ],
    };
  }, [currentUserDivisionName]);

  const unsetDivisionFilter = useMemo(() => {
    return {
      items: [
        {
          field: 'division',
          operator: '',
          value: currentUserDivisionName,
        },
      ],
    };
  }, [currentUserDivisionName]);

  const handleCoursesDialogOpen = (row: SelectedRowData) => {
    openCoursesDialog(true);
    setOnlyLearnerName(row.name);
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
      .map((rowId) => allLearners?.find((row) => row.id === rowId))
      .filter((row) => !!row) as SelectedRowData[];

    setSelectedRows(selectedRowData);
    setSelectedRowsDataOnMyLearners(selectedRowData);
  };

  const deleteSingleCourseFromLearner = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    row: SelectedRowData,
  ) => {
    setRowDelLoading((prevState) => ({ ...prevState, [row.id]: true }));
    const itemId =
      event?.currentTarget.parentElement?.getAttribute('data-item-id');

    let updatedData = [];
    updatedData.push({
      id: row.id,
      courses: row.courses
        .filter((course) => Object.keys(course)[0] !== itemId)
        .map((course) => +Object.keys(course)[0]),
    });

    updateAllData(updatedData).then((response) => {
      if (response) {
        mutate('allData').then(() => {
          toast.success('Материал успешно удален', {
            autoClose: 1000,
          });
          setRowDelLoading((prevState) => ({ ...prevState, [row.id]: false }));
        });
      }
    });
  };

  const columns: GridColDef[] = [
    // {
    //   field: 'id',
    //   headerName: 'ID',
    //   flex: 0.1,
    //   headerClassName: 'name-column--cell',
    // },
    {
      field: 'name',
      headerName: 'ФИО',
      flex: 0.5,
      headerClassName: 'name-column--cell',
      cellClassName: 'name-cell',
    },
    {
      field: 'position',
      headerName: 'Должность',
      type: 'string',
      headerAlign: 'left',
      flex: 0.3,
      align: 'left',
      headerClassName: 'name-column--cell',
    },
    {
      field: 'division',
      headerName: 'Подразделение',
      flex: 0.5,
      headerClassName: 'name-column--cell',
    },
    {
      field: 'courses',
      headerName: 'Обучающие материалы',
      flex: 1.5,
      renderCell: ({ row }) => {
        return row.courses.map((course: { [id: number]: string }) => {
          const courseTitle = Object.values(course)[0];
          const courseId = Object.keys(course)[0];
          if (courseTitle) {
            return (
              <Chip
                key={`${row.id}+${courseId}`}
                label={courseTitle}
                variant="outlined"
                sx={{ margin: '2px' }}
                onDelete={(event) => deleteSingleCourseFromLearner(event, row)}
                deleteIcon={
                  rowDelLoading[row.id] ? (
                    <CircularProgress size={20} />
                  ) : (
                    <CancelIcon />
                  )
                }
                data-item-id={courseId}
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
              onClick={() => handleCoursesDialogOpen(row)}
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
          '& .name-cell': {
            fontWeight: 'bold',
            fontSize: '0.9rem',
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
          key={Date.now()}
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
        onOpen={coursesToLearnersDialog}
        onClose={handleCoursesDialogClose}
      />
    </Box>
  );
};

export default MyLearners;
