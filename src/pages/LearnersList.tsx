import { Badge, Tooltip } from '@mui/material';
import {
  GridColDef,
  GridFilterModel,
  GridSingleSelectColDef,
} from '@mui/x-data-grid';
import React, { useEffect, useMemo, useState } from 'react';
import { useCourses } from '../app/store/courses';
import { useLearners } from '../app/store/learners';
import { SelectedRowData } from '../app/types/store';
import { useCustomFilterOperators } from '../entities/CustomFilter/hooks/useCustomFilterOperator';
import { LearnersGrid } from '../entities/LearnersGrid';
import { AssignedCourseChip } from '../features/AssignedCourseChip';
import { getHeaderNameByField } from '../shared/helpers/getHeaderNameByField';

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

  useEffect(() => {
    if (currentUserDivisionName)
      setFilterModel({
        items: [],
        // quickFilterValues: [...currentUserDivisionName!, ...selectedValues],
      });
  }, [selectedValues, currentUserDivisionName]);

  useEffect(() => {
    if (allLearners && divisions && allCourses) {
      setIsLoading(false);
    }
  }, [allCourses, allData, allLearners, divisions]);

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
      .map((rowId) => allLearners?.find((row: any) => row.id === rowId))
      .filter((row) => !!row) as SelectedRowData[];

    setSelectedRows(selectedRowData);
    setSelectedRowsDataOnMyLearners(selectedRowData);
    setIsMassEditMode(true);
  };

  const filterOperators = useCustomFilterOperators(
    selectedValues,
    setSelectedValues,
    filterLabel,
    selectedField,
  );

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
      flex: 1,
      cellClassName: 'name-cell',
      filterOperators: filterOperators,
      headerAlign: 'center',
      align: 'center',
    },
    {
      field: 'position',
      headerName: 'Должность',
      type: 'string',
      headerAlign: 'center',
      flex: 1,
      filterOperators: filterOperators,
      align: 'center',
    },
    {
      field: 'division',
      headerName: 'Отдел',
      flex: 1,
      filterOperators,
      headerAlign: 'center',
      align: 'center',
      cellClassName: 'truncate-cell',
    },
    ...((allCourses
      ? allCourses!.map((course) => ({
          field: course.title,
          renderHeader: () => (
            <Tooltip title={course.title}>
              <div style={{ fontSize: '16px', fontWeight: 'bold' }}>
                {window.innerWidth <= 1280 && course.title.length > 15
                  ? course.title.substring(0, 15) + '...'
                  : course.title}
              </div>
            </Tooltip>
          ),
          flex: 1,
          headerAlign: 'center',
          renderCell: ({ row }) => (
                <AssignedCourseChip row={row} course={course} />
          ),

          type: 'singleSelect',
          filterable: false,
          sortable: false,
          align: 'center',
        }))
      : []) as GridSingleSelectColDef<any, any, any>[]),
  ];

  return (
    <LearnersGrid
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
