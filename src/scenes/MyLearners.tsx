import AddToQueueIcon from '@mui/icons-material/AddToQueue';
import { Box, Button, Chip } from '@mui/material';
import {
  DataGrid,
  GridColDef,
  GridFilterOperator,
  useGridApiRef,
} from '@mui/x-data-grid';
import React, { MouseEvent, useEffect, useMemo, useState } from 'react';
import { toast } from 'react-toastify';
import { useSWRConfig } from 'swr';
import Header from '../components/Header';
import { useCourses } from '../data/store/courses.store';
import { useLearners } from '../data/store/learners.store';
import { updateAllData } from '../services/api.service';
import { dataGridStyles } from '../styles/DataGrid.styles';
import { CoursesToLearner } from './CoursesDialog';

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
  courses_exclude: number[];
  isDelLoading: boolean;
};

const MyLearners = () => {
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
  const [rowDelLoading, setRowDelLoading] = useState<{
    [key: string]: boolean;
  }>({});
  const [assignedCourses, setAssignedCourses] = useState<number[]>([]);

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

  const isSelectedUser = selectedRows!.length > 0;

  const handleCoursesDialogOpen = (row: SelectedRowData) => {
    openCoursesDialog(true);
    setOnlyLearnerName(row.name);
    const assignedArr = row?.courses?.map((course) => +Object.keys(course)[0]);
    setAssignedCourses(assignedArr);
  };

  // const [filterModel, setFilterModel] = useState(null);

  // const handleFilterModelChange = (model: any) => {
  //   setFilterModel(model);
  // };

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
    setAssignedCourses([]);
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
    courseId: number,
  ) => {
    setRowDelLoading((prevState) => ({
      ...prevState,
      [`${row.id}-${courseId}`]: true,
    }));
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
          setRowDelLoading((prevState) => ({
            ...prevState,
            [`${row.id}-${courseId}`]: false,
          }));
        });
      }
    });
  };

  // const customDivisionFilterOperator: GridFilterOperator<any, number> = {
  //   label: 'From',
  //   value: 'from',
  //   getApplyFilterFn: (filterItem, column) => {
  //     if (!filterItem.field || !filterItem.value || !filterItem.operator) {
  //       return null;
  //     }

  //     return (value, row, column, apiRef) => {
  //       return Number(value) >= Number(filterItem.value);
  //     };
  //   },
  //   // InputComponent: RatingInputValue,
  //   // InputComponentProps: { type: 'number' },
  // };

  const columns: GridColDef[] = [
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
      // filterOperators: [],
    },
    {
      field: 'courses',
      headerName: 'Обучающие материалы',
      flex: 1.5,
      renderCell: ({ row }) => {
        return row.courses.map((course: { [id: number]: string }) => {
          const courseTitle = Object.values(course)[0];
          const courseId = Object.keys(course)[0];
          const isLocked = row.courses_exclude.includes(+courseId);

          if (courseTitle && !isLocked) {
            return (
              <Chip
                key={`${row.id}+${courseId}`}
                label={courseTitle}
                variant="outlined"
                sx={{
                  margin: '2px',
                  transition: 'opacity 3s ease-in-out',
                  opacity: rowDelLoading[`${row.id}-${courseId}`] ? 0 : 1,
                  background: 'white',
                }}
                // onDelete={(event) =>
                //   deleteSingleCourseFromLearner(event, row, +courseId)
                // }
                // deleteIcon={
                //   rowDelLoading[`${row.id}-${courseId}`] ? (
                //     <CircularProgress size={20} />
                //   ) : (
                //     <CancelIcon />
                //   )
                // }
                data-item-id={courseId}
              />
            );
          } else if (courseTitle && isLocked) {
            return (
              <Chip
                key={`${row.id}+${courseId}`}
                label={courseTitle}
                variant="outlined"
                color="error"
                sx={{
                  margin: '2px',
                  transition: 'opacity 3s ease-in-out',
                  opacity: 0.5,
                  background: 'lightred',
                }}
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
      <Header title="Ученики" subtitle="" />

      <Box m="10px 0 0 0" height="75vh" sx={dataGridStyles.root}>
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
          // filterModel={filterModel!}
          // onFilterModelChange={handleFilterModelChange}
        />
      </Box>
      <CoursesToLearner
        onOpen={coursesToLearnersDialog}
        onClose={handleCoursesDialogClose}
        assignedCourses={assignedCourses}
      />
    </Box>
  );
};

export default MyLearners;
