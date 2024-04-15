import { Tooltip } from '@mui/material';
import {
  GridColDef,
  GridFilterModel,
  GridSingleSelectColDef,
} from '@mui/x-data-grid';
import React, { useEffect, useMemo, useState } from 'react';
import { useCourses } from '../app/data/store/courses';
import { useLearners } from '../app/data/store/learners';
import { useCustomFilterOperators } from '../app/hooks/useCustomFilterOperator';
import { CoursesWithDeadline } from '../app/types/types.store';
import { LearnersGrid } from '../entities/LearnersGrid';
import { AssignedCourseChip } from '../features/AssignedCourseChip';
import { getHeaderNameByField } from '../shared/helpers/getHeaderNameByField';
import { getCurrentUserDivision } from '../app/api/api';
import { getDivisionUsersArrayByName } from '../shared/helpers/getDivisionUsersByName';

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
    setCurrentDivisionUsersList,
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
        quickFilterValues: [...currentUserDivisionName!, ...selectedValues],
      });
  }, [selectedValues, currentUserDivisionName]);

  useEffect(() => {
    if (allLearners && divisions && allCourses && currentUserDivisionName) {
      setIsLoading(false);
      const currentDivisionUsersList = getDivisionUsersArrayByName(
        allLearners,
        currentUserDivisionName,
      );
      setCurrentDivisionUsersList(currentDivisionUsersList as string[]);
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
      flex: 0.1,
      cellClassName: 'name-cell',
      filterOperators: filterOperators,
      headerAlign: 'center',
      align: 'left',
    },
    {
      field: 'position',
      headerName: 'Должность',
      type: 'string',
      headerAlign: 'center',
      flex: 0.1,
      filterOperators: filterOperators,
      align: 'left',
    },
    {
      field: 'division',
      headerName: 'Отдел',
      flex: 0.1,
      filterOperators,
      renderCell(params) {
        return params?.value?.length > 44
          ? `${params.value.slice(0, 44)}...`
          : params.value;
      },
      headerAlign: 'center',
      align: 'left',
      cellClassName: 'truncate-cell',
    },
    ...((allCourses
      ? allCourses!.map((course) => ({
          field: course.title,
          renderHeader: () => (
            <Tooltip title={course.title}>
              <div style={{ fontSize: '16px', fontWeight: 'bold' }}>
                {course.title}
              </div>
            </Tooltip>
          ),
          flex: 0.2,
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
