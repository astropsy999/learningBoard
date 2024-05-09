import { useTheme } from '@mui/material';
import {
  GridColDef,
  GridColumnGroupingModel,
  GridFilterItem,
  GridFilterModel,
} from '@mui/x-data-grid';
import React, { useEffect, useMemo, useState } from 'react';
import { CourseData, useCourses } from '../app/store/courses';
import { useLearners } from '../app/store/learners';
import CustomFilterInput from '../entities/CustomFilter/CustomFilterPanel';
import { StatisticsGrid } from '../entities/StatisticsGrid';
import StatCell from '../entities/StatisticsGrid/StatCell';
import { useStatSortComparator } from '../entities/StatisticsGrid/hooks/useStatSortComparator';
import { useStatisticsData } from '../entities/StatisticsGrid/hooks/useStatisticsData';
import { getCourseTitleById } from '../shared/helpers/getCourseTitleById';
import { getDivisionUsersArrayByName } from '../shared/helpers/getDivisionUsersByName';
import { CourseAttempt } from '../app/types/stat';

const Statistics = () => {
  const {
    coursesList,
    statLoading,
    showDetailedStat,
    setShowDetailedStat,
    statInfo,
    isLoading,
    showDetailedStatistic,
  } = useStatisticsData();

  const sortComparator = useStatSortComparator();
  const theme = useTheme();
  const { allCourses } = useCourses();
  const { allLearners, currentUserDivisionName } = useLearners();

  const [columns, setColumns] = useState<GridColDef[]>([]);
  const [columnsGroupingModel, setColumnsGroupingModel] =
    useState<GridColumnGroupingModel>([]);

  // const ATTEMPTS = 3;
  const statSubcolumns = [
    { field: 'result', headerName: 'Результат' },
    { field: 'status', headerName: 'Статус' },
    { field: 'date', headerName: 'Дата' },
  ];

  const [selectedValues, setSelectedValues] = useState<string[]>([]);
  const [selectedField, setSelectedField] = useState<string>('name');
  const [filterLabel, setFilterLabel] = useState<string>('');
  const [filterModel, setFilterModel] = useState<GridFilterModel>();

  useEffect(() => {
    if (allLearners && currentUserDivisionName) {
      const currDivUsersList = getDivisionUsersArrayByName(
        allLearners,
        currentUserDivisionName
      );
      setSelectedValues(currDivUsersList as string[]);
    }
  }, [currentUserDivisionName, allLearners]);

  const renderHeaderGroup = (courseTitle: string) => (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        fontWeight: 'bold',
      }}
    >
      {courseTitle}
    </div>
  );

  const generateColumnsGrouping = (
    coursesList: CourseAttempt[],
    allCourses: CourseData[]
  ) => {
    return coursesList
      ?.map(({ id }) => {
        const courseTitle = getCourseTitleById(id, allCourses);

        if (!courseTitle) {
          console.error(`Course title not found for ID: ${id}`);
          return null;
        }

        const children = statSubcolumns.map(({ field, headerName }) => ({
          field: `${id}_${field}`,
          headerName,
        }));

        return {
          groupId: courseTitle,
          renderHeaderGroup: () => renderHeaderGroup(courseTitle),
          children,
        };
      })
      .filter(Boolean); // Filter out any null entries
  };

  // Memoize the columns grouping generation to avoid unnecessary recomputation
  const newColumnsGrouping = useMemo(() => {
    return generateColumnsGrouping(coursesList, allCourses!);
  }, [coursesList, allCourses]);

  useEffect(() => {
    if (newColumnsGrouping && newColumnsGrouping?.length) {
      setColumnsGroupingModel(newColumnsGrouping as GridColumnGroupingModel);
    }
  }, [coursesList, allCourses, setColumnsGroupingModel]);

  // const filterOperators =

  const onChangeFilterModel = (newModel: GridFilterModel) => {
    if (newModel.items) {
      setFilterLabel('ФИО');
      setSelectedField(newModel.items[0]?.field! || 'name');
    }
    if (!newModel.items[0]?.value) {
      setSelectedValues([]);
    }
  };

  useEffect(() => {
    // if (coursesList?.length > 1) {
    const newColumns: GridColDef[] = [
      {
        field: 'name',
        headerName: 'ФИО',
        cellClassName: 'name-cell',
        flex: 0.3,
        filterOperators: [
          {
            value: 'isAnyOf',
            getApplyFilterFn: (filterItem: GridFilterItem) => {
              if (
                !filterItem.field ||
                !filterItem.value ||
                !filterItem.operator
              ) {
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
                console.log('selectedValue: ', selectedValue);

                setSelectedValues(selectedValue);
              },
              filterLabel: 'ФИО',
              field: 'name',
              selectedOptions: selectedValues,
            },
          },
        ],
      },
    ];

    const generateSubcolumns = (course: any) => {
      return statSubcolumns?.forEach((subCol) => {
        const { headerName, field } = subCol;
        const subField = `${course.id}_${field}`;
        newColumns.push({
          field: subField,
          headerName,
          renderHeader: () => <>{headerName}</>,
          disableColumnMenu: true,
          headerClassName: 'name-column--cell',
          cellClassName: 'name-cell',
          flex: 0.1,
          valueGetter: (value, row) => row,
          sortComparator,
          renderCell: ({ row }) => (
            <StatCell
              row={row}
              course={course}
              subColumnData={subCol}
              handleCellClick={handleCellClick}
            />
          ),
        });
      });
    };

    // Добавляем дополнительные столбцы для каждого курса и каждого подстолбца
    coursesList?.forEach((course) => {
      generateSubcolumns(course);
    });

    setColumns(newColumns); // Обновляем состояние столбцов
    // }
  }, [coursesList, columnsGroupingModel, selectedValues]);

  const handleCellClick = (
    courseId: number,
    userId: number,
    userName: string,
    status: string,
    unixDate: number,
    points: number,
    totalPoints: number,
    percent: string,
    passingScore: number,
    timeSpent: string
  ) => {
    return () => {
      showDetailedStatistic(
        courseId,
        userId,
        userName,
        status,
        unixDate,
        points,
        totalPoints,
        percent,
        passingScore,
        timeSpent
      );
    };
  };

  return (
    <StatisticsGrid
      columns={columns}
      columnGroupingModel={columnsGroupingModel}
      statInfo={statInfo}
      setShowDetailedStat={setShowDetailedStat}
      showDetailedStat={showDetailedStat}
      onChangeFilterModel={onChangeFilterModel}
      selectedValues={selectedValues}
      selectedField={selectedField}
    />
  );
};

export default Statistics;
