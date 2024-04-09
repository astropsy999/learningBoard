import LightbulbIcon from '@mui/icons-material/Lightbulb';
import { Chip, Tooltip } from '@mui/material';
import {
  GridColDef,
  GridFilterItem,
  GridFilterModel,
  GridFilterOperator,
  GridSingleSelectColDef,
} from '@mui/x-data-grid';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useCourses } from '../app/data/store/courses';
import { useLearners } from '../app/data/store/learners';
import { CoursesWithDeadline } from '../app/types/types.store';
import CustomFilterInput from '../entities/CustomFilter/CustomFilterPanel';
import { LearnersGrid } from '../entities/LearnersGrid';
import { AssignedCourseChip } from '../features/AssignedCourseChip';
import { getHeaderNameByField } from '../shared/helpers/getHeaderNameByField';

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

const LearnersList = () => {
  const {
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

  const [headerHeight, setHeaderHeight] = useState(0);
  const [tableHeight, setTableHeight] = useState(0);
  const [isHeaderFixed, setIsHeaderFixed] = useState(false);

  const tableRef = useRef(null);

  useEffect(() => {
    const header = document.querySelector('.MuiDataGrid-colCell');
    if (header) {
      setHeaderHeight(header.clientHeight);
    }
  }, []);

  useEffect(() => {
    const table = tableRef?.current as any;
    if (table) {
      const tableHeight = table.clientHeight;
      setTableHeight(tableHeight);

      const windowHeight = window.innerHeight;
      if (tableHeight > windowHeight) {
        setIsHeaderFixed(true);
        const virtualScrollerContent = document.querySelector(
          '.MuiDataGrid-virtualScrollerContent',
        ) as any;
        if (virtualScrollerContent) {
          virtualScrollerContent.style.marginTop = `${headerHeight}px`;
        }
      }
    }
  }, [headerHeight]);

  useEffect(() => {
    if (currentUserDivisionName)
      setFilterModel({
        items: [],
        quickFilterValues: [...currentUserDivisionName!, ...selectedValues],
      });
  }, [selectedValues, currentUserDivisionName]);

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

  const onChangeFilterModel = (newModel: GridFilterModel) => {
    if (newModel.items) {
      setFilterLabel(getHeaderNameByField(newModel.items[0].field!, columns)!);
      setSelectedField(newModel.items[0].field!);
    }
    if (!newModel.items[0].value) {
      setSelectedValues([]);
    }
  };

  const columns: GridColDef[] = [
    {
      field: 'name',
      headerName: 'ФИО',
      flex: 0.3,
      // headerClassName: 'name-column--cell',
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
      // align: 'left',
      // headerClassName: 'name-column--cell',
      filterOperators: filterOperators,
    },
    {
      field: 'division',
      headerName: 'Отдел',
      flex: 0.3,
      // headerClassName: 'name-column--cell',
      filterOperators,
      headerAlign: 'center',
    },
    ...((allCourses
      ? allCourses!.map((course) => ({
          field: course.title,
          // headerName: course.title,
          renderHeader: () => (
            <Tooltip title={course.title}>
              <div
              // style={{
              //   display: 'flex',
              //   alignItems: 'center',
              //   justifyContent: 'center',
              //   width: '100%',
              // }}
              >
                {course.title}
                {/* <Chip
                  icon={<LightbulbIcon />}
                  label={course.title}
                  sx={{ fontSize: '0.9rem', margin: '0 5px' }}
                /> */}
              </div>
            </Tooltip>
          ),
          flex: 0.3,
          headerAlign: 'center',
          renderCell: ({ row }) => (
            <AssignedCourseChip row={row} course={course} />
          ),
          // headerClassName: 'name-column--cell header-course',
          type: 'singleSelect',
          filterable: false,
          sortable: false,
        }))
      : []) as GridSingleSelectColDef<any, any, any>[]),
  ];

  return (
    <LearnersGrid
      // ref={tableRef}
      isLoading={isLoading}
      columns={columns}
      handleSelectionModelChange={handleSelectionModelChange}
      selectedField={selectedField}
      selectedValues={selectedValues}
      onChangeFilterModel={onChangeFilterModel}
      handleCoursesDialogClose={handleCoursesDialogClose}
      lockedArr={lockedArr!}
    />
  );
};

export default LearnersList;
