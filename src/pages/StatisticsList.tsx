import { useTheme } from '@mui/material';
import {
  GridColDef,
  GridColumnGroupingModel,
  GridFilterModel,
} from '@mui/x-data-grid';
import React, { useEffect, useState } from 'react';
import { useCourses } from '../app/store/courses';
import { useLearners } from '../app/store/learners';
import { useCustomFilterOperators } from '../entities/CustomFilter/hooks/useCustomFilterOperator';
import { StatisticsGrid } from '../entities/StatisticsGrid';
import StatCell from '../entities/StatisticsGrid/StatCell';
import { useStatSortComparator } from '../entities/StatisticsGrid/hooks/useStatSortComparator';
import { useStatisticsData } from '../entities/StatisticsGrid/hooks/useStatisticsData';
import { getCourseTitleById } from '../shared/helpers/getCourseTitleById';
import { getDivisionUsersArrayByName } from '../shared/helpers/getDivisionUsersByName';

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
  const {
    currentDivisionUsersList,
    setCurrentDivisionUsersList,
    // allLearners,
    // currentUserDivisionName,
  } = useLearners();


  const [columns, setColumns] = useState<GridColDef[]>([]);
  const [columnsGroupingModel, setColumnsGroupingModel] =
    useState<GridColumnGroupingModel>([]);

  // const ATTEMPTS = 3;
  const statSubcolumns = [
    { field: 'result', headerName: 'Результат' },
    { field: 'status', headerName: 'Статус' },
    { field: 'date', headerName: 'Дата' },
  ];

  

  useEffect(() => {
    const newColumnsGrouping = coursesList?.map(({ id }) => {
      const courseTitle = getCourseTitleById(id, allCourses!)!;

      const children = statSubcolumns?.map(({ field, headerName }) => ({
        field: `${id}_${field}`,
        headerName,
      }));

      return {
        groupId: courseTitle!,
        renderHeaderGroup: () => (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '100%',
              fontWeight: 'bold',
            }}
          >
            {courseTitle!}
          </div>
        ),
        children,
      };
    });

    allCourses &&
      coursesList &&
      newColumnsGrouping?.length &&
      setColumnsGroupingModel(newColumnsGrouping);
  }, [coursesList, statLoading, isLoading, statInfo, allCourses]);

  const filterOperators = useCustomFilterOperators(
    currentDivisionUsersList,
    setCurrentDivisionUsersList,
    'ФИО',
    'name',
  );

  const onChangeFilterModel = (newModel: GridFilterModel) => {
    if (!newModel?.items[0]?.value) {
      setCurrentDivisionUsersList([]);
    }
  };

  useEffect(() => {
    // Создаем столбцы только если coursesList не равен undefined
    if (coursesList?.length > 1) {
      const newColumns: GridColDef[] = [
        {
          field: 'name',
          headerName: 'ФИО',
          cellClassName: 'name-cell',
          flex: 0.3,
          filterOperators,
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
    }
  }, [
    coursesList,
    currentDivisionUsersList,
    setCurrentDivisionUsersList,
    columnsGroupingModel,
  ]);

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
    timeSpent: string,
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
        timeSpent,
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
      />
  );
};

export default Statistics;
