import { Box, Typography, useTheme } from '@mui/material';
import {
  DataGrid,
  GridColDef,
  GridColumnGroupingModel,
} from '@mui/x-data-grid';
import React from 'react';
import { useCourses } from '../app/data/store/courses';
import { useStatSortComparator } from '../app/hooks/useStatSortComparator';
import { useStatisticsData } from '../app/hooks/useStatisticsData';
import { dataGridStyles } from '../app/styles/DataGrid.styles';
import { AllStatisticsData } from '../shared/helpers/findMaxCoursesArrayInStat';
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
  const {
    coursesList,
    statLoading,
    showDetailedStat,
    setShowDetailedStat,
    statInfo,
    rawStatistics,
    isLoading,
    showDetailedStatistic,
  } = useStatisticsData();
  const sortComparator = useStatSortComparator();
  const theme = useTheme();
  const { allCourses } = useCourses();

  const ATTEMPTS = 3;

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

  function calculatePercent(points: number, totalPoints: number) {
    if (totalPoints === 0) {
      return 0;
    }
    return Number(((points / totalPoints) * 100).toFixed(0));
  }

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
          sortComparator,
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
