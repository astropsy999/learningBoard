import AddToQueueIcon from '@mui/icons-material/AddToQueue';
import EditCalendarIcon from '@mui/icons-material/EditCalendar';
import { Box, Button, Chip, LinearProgress, Skeleton } from '@mui/material';
import {
  DataGrid,
  GridColDef,
  GridFilterItem,
  GridFilterOperator,
  GridFilterPanel,
  GridSingleSelectColDef,
  GridSlots,
  GridToolbarContainer,
  GridToolbarFilterButton,
  getGridNumericOperators,
  useGridApiRef,
} from '@mui/x-data-grid';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import Header from '../components/Header';
import { useCourses } from '../data/store/courses.store';
import { useLearners } from '../data/store/learners.store';
import { CoursesWithDeadline } from '../data/types.store';
import { dataGridStyles } from '../styles/DataGrid.styles';
import { CoursesToLearner } from './CoursesDialog';
import ProgressLine from '../components/ProgressLine';
import CustomFilterPanel from '../components/CustomFilterPanel';

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
  const [filteredDivisionValue, setFilteredDivisionValue] = useState<string[]>([]);

  
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

  const filterPosition = useMemo(()=>{
    return {
      items: [
        {
          field: 'position',
          operator: 'isAnyOf',
          value: selectedValues
        }
      ]
    }
  },[selectedValues])

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
    const assignedArr = row?.courses?.map((course) => ({
      id: +Object.keys(course)[0],
      deadline: course.deadline,
    }));

    setLockedArr(row?.courses_exclude);

    setAssignedCourses(assignedArr);
  };

  useEffect(() => {
    switch (turnOffDivisionFilter) {
      case true:
        !isLoading && apiRef.current.setFilterModel(unsetDivisionFilter);
        break;
      default:
        !isLoading && apiRef.current.setFilterModel(filteredDivision);
        break;
    }
  }, [apiRef, filteredDivision, turnOffDivisionFilter, unsetDivisionFilter]);

  useEffect(() => {
    !isLoading && apiRef.current.setFilterModel(filterPosition);
  }, [selectedValues]);

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


  const filterPositionOperators = useMemo(() => {
    return getGridNumericOperators()
      // .filter((operator) => operator.value === 'isAnyOf')
      .map((operator) => ({
        ...operator,
        getApplyFilterFn: (filterItem: GridFilterItem) => {
          if (!filterItem.field  || !filterItem.operator) {
            return null;
          }
  
          if (selectedValues.length === 0) {
            return (value: string) => true;
          }
  
          return (value: string) => {
            return selectedValues.includes(value);
          };
        },
        InputComponent: operator.InputComponent ? CustomFilterPanel : undefined,
        InputComponentProps: {
          onChange: (selectedValue: React.SetStateAction<string[]>) => {
            setSelectedValues(selectedValue);
          },
        },
      }));
  }, [selectedValues]);

  const filterDivisionView = useMemo(() => {
      return getGridNumericOperators()
      .map(operator => ({
        ...operator,
        getApplyFilterFn: (filterItem: GridFilterItem) => {
          if (!filterItem.field  || !filterItem.operator) {
            return null;
          }
  
          if (selectedValues.length === 0) {
            return (value: string) => true;
          }
  
          return (value: string) => {
            return filteredDivisionValue.includes(value);
          };
        },
        InputComponent: operator.InputComponent ? CustomFilterPanel : undefined,
        InputComponentProps: {
          onChange: (selectedValue: React.SetStateAction<string[]>) => {
            console.log('selectedValue: ', selectedValue);
            setFilteredDivisionValue(selectedValue);
          },
        },
      }))
  },[filteredDivisionValue])

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
              startIcon={
                !hasCourses ? <AddToQueueIcon /> : <EditCalendarIcon />
              }
              onClick={() => handleCoursesDialogOpen(row)}
              disabled={isSelectedUser}
            >
              {/* {!hasCourses ? 'Назначить' : 'Редактировать'} */}
            </Button>
          </>
        );
      },
      disableColumnMenu: true,
    },
  ];

  // Обработчик события клика на элементе "Фильтр"
  const handleFilterBtnClick = (event: MouseEvent) => {
    const target = event.target as HTMLElement; // Приведение типа для event.target
    // Получение координат элемента, на котором произошел клик
    const rect = target.getBoundingClientRect();
    console.log('rect: ', rect);
    const x = rect.left + window.scrollX;
    const y = rect.top + window.scrollY;
  
    const filterClickEvent = new CustomEvent('filterClick', {
      detail: { x, y }, 
    });
  
    document.dispatchEvent(filterClickEvent);
  };
  
  const filterElement = document.querySelector('.MuiListItemText-primary') as HTMLElement;
  console.log('filterElement: ', filterElement);
  
  // Добавление обработчика события клика на элемент "Фильтр"
  filterElement?.addEventListener('click', handleFilterBtnClick);


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
                filterModel: !turnOffDivisionFilter
                  ? filteredDivision
                  : undefined,
              },
              sorting: {
                sortModel: [{ field: 'name', sort: 'asc' }],
              },
            }}
         
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
