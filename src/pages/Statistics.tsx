import { Box, Typography, useTheme } from '@mui/material';
import {
  DataGrid,
  GridColDef,
  GridColumnGroupingModel,
  GridComparatorFn,
  GridSortCellParams,
} from '@mui/x-data-grid';
import React, { useEffect, useState } from 'react';
import useSWR from 'swr';
import { fetchStatisctics } from '../app/api/api';
import { useCourses } from '../app/data/store/courses';
import { dataGridStyles } from '../app/styles/DataGrid.styles';
import {
  AllStatisticsData,
  CourseAttempt,
  findMaxCourses,
} from '../shared/helpers/findMaxCoursesArrayInStat';
import { getCourseTitleById } from '../shared/helpers/getCourseTitleById';
import ProgressLine from '../shared/ui/ProgressLine';
import { DetailedStatDialog } from '../widgets/DetailedStatDialog';

export type StatInfoType = {
  course: number;
  user: number;
  userName: string;
  status: string;
  unixDate: number;
  points: number;
  totalPoints: number;
  percent: string;
  passingScore: number;
  timeSpent: string;
};

const Statistics = () => {
  const theme = useTheme();
  const [coursesList, setCoursesList] = useState<CourseAttempt[]>([]);
  const { allCourses } = useCourses();
  const [statLoading, setStatLoading] = useState(true);
  const [showDetailedStat, setShowDetailedStat] = useState(false);
  const [statInfo, setStatInfo] = useState<StatInfoType>({
    course: 0,
    user: 0,
    userName: '',
    status: '',
    unixDate: 0,
    points: 0,
    totalPoints: 0,
    percent: '',
    passingScore: 0,
    timeSpent: '',
  });

  const { data: rawStatistics, isLoading } = useSWR('stat', fetchStatisctics);

  const ATTEMPTS = 3;

  useEffect(() => {
    const courses = findMaxCourses(rawStatistics);
    setCoursesList(courses!);
  }, [rawStatistics]);

  useEffect(() => {
    setStatLoading(isLoading);
    allCourses && allCourses.length > 0 && setStatLoading(false);
  }, [statLoading]);

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

  const showDetailedStatistic = (
    course: number,
    user: number,
    userName: string,
    status: string,
    unixDate: number,
    points: number,
    totalPoints: number,
    percent: string,
    passingScore: number,
    timeSpent: string,
  ) => {
    setShowDetailedStat(() => !showDetailedStat);

    const getStatInfo = {
      user,
      course,
      userName,
      status,
      unixDate,
      points,
      totalPoints,
      percent,
      passingScore,
      timeSpent,
    };
    setStatInfo(getStatInfo!);
  };

  function calculatePercent(points: number, totalPoints: number) {
    if (totalPoints === 0) {
      return 0;
    }
    return Number(((points / totalPoints) * 100).toFixed(0));
  }

  const sortComparator: GridComparatorFn<any> = (
    v1,
    v2,
    cellParams1,
    cellParams2,
  ) => {
    const courseId = +cellParams1?.field?.split('_')[0];
    const getVal = (cellParams: GridSortCellParams) =>
      cellParams?.value?.courses?.filter(
        (v: CourseAttempt) => v.id === courseId,
      )[0]?.attempts[0]?.points;

    const getTotalVal = (cellParams: GridSortCellParams) =>
      +cellParams?.value?.courses?.find(
        (c: AllStatisticsData) => c.id === courseId,
      )?.total_points;

    const val1 = getVal(cellParams1);
    const val2 = getVal(cellParams2);
    const totalVal1 = getTotalVal(cellParams1);
    const totalVal2 = getTotalVal(cellParams2);

    const percentA = calculatePercent(val1, totalVal1);
    const percentB = calculatePercent(val2, totalVal2);

    return percentA - percentB;
  };

  const columns: GridColDef[] = [
    {
      field: 'name',
      headerName: 'ФИО',
      cellClassName: 'name-cell',
      flex: 0.3,
    },
  ];

  !isLoading &&
    !statLoading &&
    coursesList?.forEach((course) => {
      for (let attempt = 1; attempt <= ATTEMPTS; attempt++) {
        columns.push({
          field: `${course.id}_${attempt}`,
          headerName: `Попытка ${attempt}`,
          renderHeader: () => <>{attempt}</>,
          disableColumnMenu: true,
          headerClassName: 'name-column--cell',
          cellClassName: 'name-cell',
          flex: 0.1,
          valueGetter: (value, row) => row,
          sortComparator: sortComparator,
          renderCell: ({ row }) => {
            const attempts = row?.courses?.filter(
              (c: AllStatisticsData) => c.id === course.id,
            )[0]?.attempts;
            const status = attempts && attempts[attempt - 1]?.status;
            const totalPoints = row?.courses?.filter(
              (c: AllStatisticsData) => c.id === course.id,
            )[0]?.total_points;
            const points = attempts && attempts[attempt - 1]?.points;
            const percent = calculatePercent(points, totalPoints);
            const localStatus = status === 'passed' ? 'Пройден' : 'Не пройден';
            const unixDate = attempts && attempts[attempt - 1]?.date;
            const date = new Date(unixDate * 1000).toLocaleDateString('ru-RU');
            const passingScore = totalPoints * 0.7;
            const timeSpent = '9:99';
            const perStr = `${percent}%`;

            return (
              <Typography
                color={status === 'passed' ? 'darkgreen' : 'red'}
                sx={{
                  fontSize: '1rem',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                }}
                onClick={handleCellClick(
                  course.id,
                  row.id,
                  row.name,
                  status,
                  unixDate,
                  points,
                  totalPoints,
                  perStr,
                  passingScore,
                  timeSpent,
                )}
              >
                {attempts && attempts[attempt - 1]
                  ? `${points}/${totalPoints} - ${percent}% - ${localStatus} - ${date} `
                  : '-'}
              </Typography>
            );
          },
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
          children: [
            { field: `${course.id}_1` },
            { field: `${course.id}_2` },
            { field: `${course.id}_3` },
          ],
        }))
      : [];

  return (
    <Box m="20px" pt={2}>
      <Box m="10px 0 0 0" sx={dataGridStyles.root}>
        {!isLoading || !statLoading ? (
          <DataGrid
            rows={!isLoading ? rawStatistics || [] : []}
            columns={columns}
            disableRowSelectionOnClick
            columnGroupingModel={columnGroupingModel}
            autoHeight={true}
            getRowHeight={() => 'auto'}
            initialState={{
              sorting: {
                sortModel: [{ field: 'name', sort: 'asc' }],
              },
            }}
            sx={{
              '&.MuiDataGrid-root--densityStandard .MuiDataGrid-cell': {
                py: '3px',
              },
              '& .MuiDataGrid-colCell, & .MuiDataGrid-cell': {
                borderRight: `1px solid ${theme.palette.divider}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              },
              '& .MuiDataGrid-main': {
                marginTop: '0.2em',
              },
              '& .MuiDataGrid-columnHeader, & .MuiDataGrid-columnHeaderRow, & .MuiDataGrid-columnHeaderTitleContainerContent, & .MuiDataGrid-columnHeaderDraggableContainer, & .MuiDataGrid-columnHeaders':
                {
                  maxHeight: '30px !important',
                },
              '& .MuiDataGrid-columnHeaderTitleContainer': {
                marginLeft: '22px !important',
              },
            }}
          />
        ) : (
          <ProgressLine />
        )}
        <DetailedStatDialog
          open={showDetailedStat}
          setOpen={setShowDetailedStat}
          selectedStatInfo={statInfo}
        />
      </Box>
    </Box>
  );
};

export default Statistics;
