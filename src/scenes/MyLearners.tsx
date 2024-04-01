import { Autocomplete, Box, TextField } from '@mui/material';
import {
  DataGrid,
  GridColDef,
  GridFilterInputValueProps,
  GridFilterItem,
  GridFilterModel,
  GridFilterOperator,
  GridLogicOperator,
  GridSingleSelectColDef,
  getGridNumericOperators,
  getGridStringOperators,
  useGridApiRef,
} from '@mui/x-data-grid';
import React, { useEffect, useMemo, useState } from 'react';
import AssignEditButton from '../components/AssignEditBtn';
import { AssignedCourseChip } from '../components/AssignedCourseChip';
import CustomFilterInput from '../components/CustomFilterPanel';
import Header from '../components/Header';
import ProgressLine from '../components/ProgressLine';
import { useCourses } from '../data/store/courses.store';
import { useLearners } from '../data/store/learners.store';
import { CoursesWithDeadline } from '../data/types.store';
import { dataGridStyles } from '../styles/DataGrid.styles';
import { CoursesToLearner } from './CoursesDialog';

export type SelectedRowData = {
  id: number;
  name: string;
  position?: string;
  division?: string;
  access?: string;
  courses: CoursesWithDeadline[];
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

  const [isLoading, setIsLoading] = useState(true);
  const { setSelectedCoursesToSave, assignedCourses, setAssignedCourses } =
    useCourses();
  const [selectedRows, setSelectedRows] = useState<
    SelectedRowData[] | undefined
  >([]);

  const [lockedArr, setLockedArr] = useState<number[]>();
  const [selectedValues, setSelectedValues] = useState<string[]>([]);

  const [filterModel, setFilterModel] = useState<GridFilterModel>({
   items: [],
   quickFilterValues: [],
  });

  useEffect(() => {
    // Обновляем filterModel при изменении selectedValues
    if (currentUserDivisionName) setFilterModel({
      items: [],
      quickFilterValues: [...currentUserDivisionName!, ...selectedValues],
    });
  }, [selectedValues, currentUserDivisionName]);


  const apiRef = useGridApiRef();

  useEffect(() => {
    if (allLearners && divisions && allCourses && currentUserDivisionName) {
      setIsLoading(false);
    }
  }, [allCourses, allData, allLearners, currentUserDivisionName, divisions]);

  // const filteredDivision = useMemo(() => {
  //   return {
  //     items: [
  //       {
  //         field: 'division',
  //         operator: 'isAnyOf',
  //         value: [currentUserDivisionName],
  //       },
  //     ],
  //   };
  // }, [currentUserDivisionName]);

  // const filteredPosition = () => {
  //   return {
  //     items: [
  //       {
  //         field: 'position',
  //         operator: 'isAnyOf',
  //         value: selectedValues,
  //       },
  //     ],
  //   };
  // };

//  const unsetDivisionFilter = useMemo(() => {
//     return {
//       items: [
//         {
//           field: 'division',
//           operator: '',
//           value: currentUserDivisionName,
//         },
//       ],
//     };
//   }, [currentUserDivisionName]);

  const isSelectedUser = selectedRows!.length > 0;

  // const handleFilterModelChange = () => {
  //   !isLoading && apiRef.current.setFilterModel(filterModel);
  // };

  // useEffect(() => {
  //   handleFilterModelChange();
  // }, [filterModel]);

  const handleCoursesDialogOpen = (row: SelectedRowData) => {
    openCoursesDialog(true);
    setOnlyLearnerName(row.name);
    const assignedArr = row?.courses?.map((course) => ({
      id: +Object.keys(course)[0],
      deadline: course.deadline,
    }));

    setLockedArr(row?.courses_exclude);

    setAssignedCourses(assignedArr);
  };

  // useEffect(() => {
  //   !isLoading && apiRef.current.setFilterModel(filteredPosition());
  // }, [selectedValues]);

  // useEffect(() => {
  //   switch (turnOffDivisionFilter) {
  //     case true:
  //       !isLoading && apiRef.current.setFilterModel(unsetDivisionFilter);
  //       break;
  //     default:
  //       !isLoading && apiRef.current.setFilterModel(filteredDivision);
  //       break;
  //   }
  // }, [apiRef, filteredDivision, turnOffDivisionFilter, unsetDivisionFilter]);

  const handleCoursesDialogClose = () => {
    openCoursesDialog(false);
    setOnlyLearnerName('');
    setSelectedCoursesToSave([]);
    deSelectAll();
    setAssignedCourses([]);
    setLockedArr([]);
  };

  const handleSelectionModelChange = (newSelection: Object[]) => {
    const selectedRowData: SelectedRowData[] = newSelection
      .map((rowId) => allLearners?.find((row) => row.id === rowId))
      .filter((row) => !!row) as SelectedRowData[];

    setSelectedRows(selectedRowData);
    setSelectedRowsDataOnMyLearners(selectedRowData);
  };

  const filterPositionOperators: GridFilterOperator<any, string, string>[] = [{
        label: 'Должность',
        value: 'isAnyOf',
        getApplyFilterFn: (filterItem: GridFilterItem) => {
          if (!filterItem.field || !filterItem.value || !filterItem.operator) {
            return null;
          }

          if (selectedValues.length === 0) {
            return (value: string) => true;
          }

          return (value: string) => {
            return selectedValues?.includes(value);
          };
        },
        InputComponent:  CustomFilterInput,
        InputComponentProps: {
          onChange: (selectedValue: string[]) => {
            console.log('selectedValue: ', selectedValue);
            setSelectedValues(selectedValue);
            // setFilterModel({ items: [{ field: 'position', operator: 'isAnyOf', value: selectedValues }] });
          },
        },
      }
];

 
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
      filterOperators: filterPositionOperators,
    },
    {
      field: 'division',
      headerName: 'Подразделение',
      flex: 0.5,
      headerClassName: 'name-column--cell',
    },
    ...((allCourses
      ? allCourses!.map((course) => ({
          field: course.title,
          headerName: course.title,
          flex: 0.3,
          renderCell: ({ row }) => (
            <AssignedCourseChip row={row} course={course} />
          ),
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
          <AssignEditButton
            hasCourses={hasCourses}
            handleCoursesDialogOpen={() => handleCoursesDialogOpen(row)}
            isSelectedUser={isSelectedUser}
          />
        );
      },
      disableColumnMenu: true,
    },
  ];

  // const onChangeFilterModel = (
  //   newModel: GridFilterModel,
  // ) => {
  //   console.log('🚀 ~ onChangeFilterModel ~ newModel:', newModel);

  //   if (newModel.items) {
  //     setFilterModel(newModel);
  //   }
  // };

  return (
    <Box m="20px" pt={2}>
      <Header title="Ученики" subtitle="" />

      <Box m="10px 0 0 0" sx={dataGridStyles.root}>
        {!isLoading ? (
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
                filterModel: filterModel
              },
              sorting: {
                sortModel: [{ field: 'name', sort: 'asc' }],
              },
            }}
            // filterModel={filterModel}
            // onFilterModelChange={(newModel) =>
            //   onChangeFilterModel(newModel)
            // }
          />
        ) : (
          <ProgressLine />
        )}
      </Box>
      <CoursesToLearner
        onOpen={coursesToLearnersDialog}
        onClose={handleCoursesDialogClose}
        assignedCourses={assignedCourses}
        lockedCourses={lockedArr}
      />
    </Box>
  );
};

export default MyLearners;
