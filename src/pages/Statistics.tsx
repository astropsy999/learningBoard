import { useTheme } from '@mui/material';
import {
  GridColDef,
  GridColumnGroupingModel,
  GridFilterModel
} from '@mui/x-data-grid';
import React, { useEffect, useState } from 'react';
import { useCourses } from '../app/data/store/courses';
import { useLearners } from '../app/data/store/learners';
import { useCustomFilterOperators } from '../app/hooks/useCustomFilterOperator';
import { useStatSortComparator } from '../app/hooks/useStatSortComparator';
import { useStatisticsData } from '../app/hooks/useStatisticsData';
import { StatisticsGrid } from '../entities/StatisticsGrid';
import StatCell from '../entities/StatisticsGrid/StatCell';
import { getCourseTitleById } from '../shared/helpers/getCourseTitleById';

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
  const { currentDivisionUsersList, setCurrentDivisionUsersList } = useLearners()
  const [filterValue, setFilterValue] = useState(currentDivisionUsersList);


  // const ATTEMPTS = 3;
  const statSubcolumns = [
    {field: 'result', headerName: 'Результат'}, 
    {field: 'status', headerName: 'Статус'}, 
    {field: 'date', headerName: 'Дата'}
  ];

  useEffect(() => {
    setFilterValue(currentDivisionUsersList);
  }, [currentDivisionUsersList]);

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

  const columns: GridColDef[] = [
    {
      field: 'name',
      headerName: 'ФИО',
      cellClassName: 'name-cell',
      flex: 0.3,
      filterOperators: useCustomFilterOperators(
        currentDivisionUsersList, setCurrentDivisionUsersList, 'ФИО', 'name'
      )
    },
  ];

  !isLoading &&
    !statLoading &&
    coursesList?.forEach((course) => {
      for (let subCol = 0; subCol <= statSubcolumns.length-1; subCol++) {
        const subColumnData = statSubcolumns[subCol];
        const subField = subColumnData.field;
        columns.push({
          field: `${course.id}_${subField}`,
          headerName: `${subColumnData.headerName}`,
          renderHeader: () => <>{subColumnData.headerName}</>,
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
              subColumnData={subColumnData}
              handleCellClick={handleCellClick}
            />
          ),
        });
      }
    });

  const columnGroupingModel: GridColumnGroupingModel | undefined =
    !isLoading && !statLoading
      ? coursesList?.map((course) => ({
          groupId: getCourseTitleById(course.id, allCourses!)!,
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
              {getCourseTitleById(course.id, allCourses!)!}
            </div>
          ),
          children: statSubcolumns.map((subCol) => ({
            field: `${course.id}_${subCol.field}`,
            headerName: subCol.headerName,
          })),
        }))
      : [];

      const onChangeFilterModel = (newModel: GridFilterModel) => {
        if (!newModel.items[0].value) {
          setCurrentDivisionUsersList([]);
        }
      };

  return (
   <StatisticsGrid 
      columns={columns}
      columnGroupingModel={columnGroupingModel}
      filterValue={filterValue}
      onChangeFilterModel={onChangeFilterModel} 
      statInfo={statInfo}
      setShowDetailedStat={setShowDetailedStat}
      showDetailedStat={showDetailedStat}
      />
      
  );
};

export default Statistics;
