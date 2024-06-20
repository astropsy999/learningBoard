import React, { useEffect } from 'react';
import { useTheme } from '@mui/material';
import { useCourses } from '../app/store/courses';
import { useLearners } from '../app/store/learners';
import { useStatisticsData } from '../entities/StatisticsGrid/hooks/useStatisticsData';
import { getDivisionUsersArrayByName } from '../shared/helpers/getDivisionUsersByName';
import { StatisticsGrid } from '../entities/StatisticsGrid';
import { useFilterModel } from '../entities/CustomFilter/hooks/useFilterModel';
import { useGenerateColumns } from '../entities/StatisticsGrid/hooks/useGenerateColumns';
import { GridColumnGroup } from '@mui/x-data-grid';

const Statistics = () => {
  const {
    coursesList,
    statInfo,
    setShowDetailedStat,
    showDetailedStat,
    showDetailedStatistic,
  } = useStatisticsData();
  const theme = useTheme();
  const { allCourses } = useCourses();
  const { allLearners, currentUserDivisionName } = useLearners();

  const {
    selectedValues,
    setSelectedValues,
    selectedField,
    onChangeFilterModel,
  } = useFilterModel();

  useEffect(() => {
    if (allLearners && currentUserDivisionName) {
      const currDivUsersList = getDivisionUsersArrayByName(
        allLearners,
        currentUserDivisionName
      );
      setSelectedValues(currDivUsersList as string[]);
    }
  }, [currentUserDivisionName, allLearners, setSelectedValues]);

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

  const { columns, columnsGroupingModel } = useGenerateColumns(
    coursesList,
    allCourses!,
    handleCellClick,
    selectedValues,
    setSelectedValues
  );

  return (
    <StatisticsGrid
      columns={columns}
      columnGroupingModel={columnsGroupingModel as GridColumnGroup[]}
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
