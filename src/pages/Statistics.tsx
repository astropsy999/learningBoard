import {
  DataGrid,
  GridColDef,
  GridColumnGroupingModel,
  GridFilterModel,
} from '@mui/x-data-grid';
import React, { useEffect, useState } from 'react';
import { useCourses } from '../app/data/store/courses';
import { useStatSortComparator } from '../app/hooks/useStatSortComparator';
import { useStatisticsData } from '../app/hooks/useStatisticsData';
import { dataGridStyles } from '../app/styles/DataGrid.styles';
import { getCourseTitleById } from '../shared/helpers/getCourseTitleById';
import ProgressLine from '../shared/ui/ProgressLine';
import { DetailedStatDialog } from '../widgets/DetailedStatDialog';
import { useCustomFilterOperators } from '../app/hooks/useCustomFilterOperator';
import { useLearners } from '../app/data/store/learners';
import { Box, Typography, useTheme } from '@mui/material';
import { AllStatisticsData } from '../app/types/stat.types';

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
  const { currentDivisionUsersList, setCurrentDivisionUsersList } = useLearners()
  const [filterValue, setFilterValue] = useState(currentDivisionUsersList);


  // const ATTEMPTS = 3;
  const statSubcolumns = [{field: 'result', headerName: 'Результат'}, {field: 'status', headerName: 'Статус'}, {field: 'date', headerName: 'Дата'}];

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
      filterOperators: useCustomFilterOperators(
        currentDivisionUsersList, setCurrentDivisionUsersList, 'ФИО', 'name'
      )
    },
  ];

  !isLoading &&
    !statLoading &&
    coursesList?.forEach((course) => {
      for (let subCol = 0; subCol <= statSubcolumns.length-1; subCol++) {

        const subColumnData = statSubcolumns[subCol]
        const subField = subColumnData?.field
        columns.push({
          field: `${course.id}_${subField}`,
          headerName: `${subColumnData?.headerName}`,
          renderHeader: () => <>{subColumnData?.headerName}</>,
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

            const status = attempts && attempts[0]?.status;

            const totalPoints = row?.courses?.filter(
              (c: AllStatisticsData) => c.id === course.id,
            )[0]?.total_points;

            const points = attempts && attempts[0]?.points;
            const percent = calculatePercent(points, totalPoints);
            const localStatus = status === 'passed' ? 'Пройден' : 'Не пройден';
            const unixDate = attempts && attempts[0]?.date;
            const date = new Date(unixDate * 1000).toLocaleDateString('ru-RU');
            const passingScore = totalPoints * 0.7;
            const timeSpent = '9:99';
            const perStr = `${percent}%`;

            const displayContent =
            subField === 'result' ? `${points}/${totalPoints} - ${percent}%` :
            subField === 'status' ? `${localStatus}` :
            subField === 'date' ? `${date}` :
            '-';

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
                {attempts && attempts[0]
                  ? displayContent : '-'}
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
            filterModel={{
              items: [
                {
                  field: 'name',
                  operator: 'isAnyOf',
                  value: filterValue,
                },
              ],
            }}
            onFilterModelChange={(newModel) => onChangeFilterModel(newModel)}
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
