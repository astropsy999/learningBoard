import AddToQueueIcon from '@mui/icons-material/AddToQueue';
import { Box, Button, Chip } from '@mui/material';
import {
  DataGrid,
  GridColDef,
  GridSingleSelectColDef,
  useGridApiRef,
} from '@mui/x-data-grid';
import React, { useEffect, useMemo, useState } from 'react';
import { useSWRConfig } from 'swr';
import Header from '../components/Header';
import { useCourses } from '../data/store/courses.store';
import { useLearners } from '../data/store/learners.store';
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
          operator: 'isAnyOf',
          value: [currentUserDivisionName],
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

  const columns: GridColDef[] = [
    {
      field: 'name',
      headerName: 'ФИО',
      flex: 0.3,
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
    ...((allCourses
      ? allCourses!.map((course) => ({
          field: course.title,
          headerName: course.title,
          flex: 0.3,
          renderCell: ({ row }) => {
            const isLocked = row.courses_exclude.includes(course.id);

            const deadline = row.courses.find(
              (c: { hasOwnProperty: (arg0: number) => any }) =>
                c.hasOwnProperty(course.id),
            )?.deadline;

            let chipColor: 'error' | 'success';
            chipColor = isLocked ? 'error' : 'success';

            let chipLabel;
            switch (deadline) {
              case undefined:
                return null;
              case null:
                chipLabel = 'Без срока';
                break;
              default:
                chipLabel = new Date(deadline * 1000).toLocaleDateString(
                  'ru-RU',
                );
                break;
            }

            return <Chip label={chipLabel} color={chipColor} />;
          },
          headerClassName: 'name-column--cell',
          type: 'singleSelect',
        }))
      : []) as GridSingleSelectColDef<any, any, any>[]),

    {
      field: 'addCourses',
      headerName: 'Назначение',
      flex: 0.3,
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
          columns={isLoading ? [] : columns}
          loading={isLoading}
          onRowSelectionModelChange={handleSelectionModelChange}
          initialState={{
            filter: {
              filterModel: filteredDivision,
            },
            sorting: {
              sortModel: [{ field: 'name', sort: 'asc' }],
            },
          }}
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
function useDemoData(arg0: {
  dataSet: string;
  visibleFields: string[];
  rowLength: number;
}): { data: any } {
  throw new Error('Function not implemented.');
}
