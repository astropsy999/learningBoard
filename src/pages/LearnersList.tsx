import LightbulbIcon from '@mui/icons-material/Lightbulb';
import { Box, Chip, useTheme } from '@mui/material';
import {
  DataGrid,
  GridColDef,
  GridFilterItem,
  GridFilterModel,
  GridFilterOperator,
  GridSingleSelectColDef,
  useGridApiRef,
} from '@mui/x-data-grid';
import React, { useEffect, useMemo, useState } from 'react';
import { AssignedCourseChip } from '../features/AssignedCourseChip';
import CustomFilterInput from '../entities/CustomFilter/CustomFilterPanel';
import ProgressLine from '../shared/ui/ProgressLine';
import { useCourses } from '../app/data/store/courses';
import { useLearners } from '../app/data/store/learners';
import { CoursesWithDeadline } from '../app/types/types.store';
import { getHeaderNameByField } from '../shared/helpers/getHeaderNameByField';
import { dataGridStyles } from '../app/styles/DataGrid.styles';
import { CoursesToLearner } from '../widgets/AssignCoursesDialog';

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
    setIsMassEditMode,
  } = useLearners();

  const { allCourses } = useCourses();

  const [isLoading, setIsLoading] = useState(true);
  const {
    setSelectedCoursesToSave,
    assignedCourses,
    setAssignedCourses,
    setMassAssignedCourses,
  } = useCourses();
  const [selectedRows, setSelectedRows] = useState<
    SelectedRowData[] | undefined
  >([]);

  const [lockedArr, setLockedArr] = useState<number[]>();
  const [selectedValues, setSelectedValues] = useState<string[]>([]);

  const [filterModel, setFilterModel] = useState<GridFilterModel>();
  const [filterLabel, setFilterLabel] = useState<string>('');
  const [selectedField, setSelectedField] = useState<string>('division');

  useEffect(() => {
    if (currentUserDivisionName)
      setFilterModel({
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

  useEffect(() => {
    if (!turnOffDivisionFilter && currentUserDivisionName) {
      setSelectedValues([currentUserDivisionName]);
    }

    if (turnOffDivisionFilter) {
      setSelectedValues([]);
    }
  }, [
    turnOffDivisionFilter,
    currentUserDivisionName,
    apiRef,
    isLoading,
    unsetDivisionFilter,
  ]);

  const handleCoursesDialogClose = () => {
    openCoursesDialog(false);
    setOnlyLearnerName('');
    setSelectedCoursesToSave([]);
    deSelectAll();
    setAssignedCourses([]);
    setLockedArr([]);
    setIsMassEditMode(false);
    setMassAssignedCourses([]);
  };

  const handleSelectionModelChange = (newSelection: Object[]) => {
    const selectedRowData: SelectedRowData[] = newSelection
      .map((rowId) => allLearners?.find((row) => row.id === rowId))
      .filter((row) => !!row) as SelectedRowData[];

    setSelectedRows(selectedRowData);
    setSelectedRowsDataOnMyLearners(selectedRowData);
    setIsMassEditMode(true);
  };

  const filterOperators: GridFilterOperator<any, string, string>[] = [
    {
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
      InputComponent: CustomFilterInput,
      InputComponentProps: {
        onChange: (selectedValue: string[]) => {
          setSelectedValues(selectedValue);
        },
        filterLabel,
        field: selectedField,
        selectedOptions: selectedValues,
      },
    },
  ];

  const columns: GridColDef[] = [
    {
      field: 'name',
      headerName: 'ФИО',
      flex: 0.3,
      headerClassName: 'name-column--cell',
      cellClassName: 'name-cell',
      filterOperators: filterOperators,
      headerAlign: 'center',
    },
    {
      field: 'position',
      headerName: 'Должность',
      type: 'string',
      headerAlign: 'center',
      flex: 0.2,
      align: 'left',
      headerClassName: 'name-column--cell',
      filterOperators: filterOperators,
    },
    {
      field: 'division',
      headerName: 'Подразделение',
      flex: 0.3,
      headerClassName: 'name-column--cell',
      filterOperators,
      headerAlign: 'center',
    },
    ...((allCourses
      ? allCourses!.map((course) => ({
          field: course.title,
          // headerName: course.title,
          renderHeader: () => (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
              }}
            >
              <Chip
                icon={<LightbulbIcon />}
                label={course.title}
                sx={{ fontSize: '0.9rem', margin: '0 5px' }}
              />
            </div>
          ),
          flex: 0.3,
          renderCell: ({ row }) => (
            <AssignedCourseChip row={row} course={course} />
          ),
          headerClassName: 'name-column--cell header-course',
          type: 'singleSelect',
          filterable: false,
          sortable: false,
        }))
      : []) as GridSingleSelectColDef<any, any, any>[]),
  ];

  const onChangeFilterModel = (newModel: GridFilterModel) => {
    if (newModel.items) {
      setFilterLabel(getHeaderNameByField(newModel.items[0].field!, columns)!);
      setSelectedField(newModel.items[0].field!);
    }
    if (!newModel.items[0].value) {
      setSelectedValues([]);
    }
  };

  return (
    <Box m="20px" pt={2}>
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
              sorting: {
                sortModel: [{ field: 'name', sort: 'asc' }],
              },
            }}
            filterModel={{
              items: [
                {
                  field: selectedField,
                  operator: 'isAnyOf',
                  value: selectedValues,
                },
              ],
            }}
            onFilterModelChange={(newModel) => onChangeFilterModel(newModel)}
            sx={{
              '&.MuiDataGrid-root--densityStandard .MuiDataGrid-cell': {
                py: '3px',
              },
              '& .MuiDataGrid-colCell, & .MuiDataGrid-cell': {
                borderRight: `1px solid lightgrey`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
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
