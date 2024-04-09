import LightbulbIcon from '@mui/icons-material/Lightbulb';
import { Box, Chip, Typography, useTheme } from '@mui/material';
import {
  DataGrid,
  GridColDef,
  GridColumnGroupingModel,
} from '@mui/x-data-grid';
import React, { useEffect, useState } from 'react';
import useSWR from 'swr';
import ProgressLine from '../shared/ui/ProgressLine';
import { useCourses } from '../app/data/store/courses';
import {
  AllStatisticsData,
  CourseAttempt,
  findMaxCourses,
} from '../shared/helpers/findMaxCoursesArrayInStat';
import { getCourseTitleById } from '../shared/helpers/getCourseTitleById';
import { fetchStatisctics } from '../app/api/api';
import { dataGridStyles } from '../app/styles/DataGrid.styles';
import { tokens } from '../app/theme';

const Statistics = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [coursesList, setCoursesList] = useState<CourseAttempt[]>([]);
  const { allCourses } = useCourses();
  const [statLoading, setStatLoading] = useState(true);

  const {
    data: rawStatistics,
    isLoading,
    error,
  } = useSWR('stat', fetchStatisctics);

  const ATTEMPTS = 3;

  useEffect(() => {
    const courses = findMaxCourses(rawStatistics);
    setCoursesList(courses!);
  }, [rawStatistics]);

  useEffect(() => {
    setStatLoading(isLoading);
    allCourses && allCourses.length > 0 && setStatLoading(false);
  }, [statLoading]);

  const columns: GridColDef[] = [
    // { field: 'id', headerName: 'ID', width: 90 },
    {
      field: 'name',
      headerName: 'ФИО',
      headerClassName: 'name-column--cell',
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
          renderHeader: () => (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
              }}
            >
              {/* <Chip
                label={`${attempt}`}
                sx={{ fontSize: '0.9rem', margin: '0 5px' }}
              /> */}
              {attempt}
            </div>
          ),
          disableColumnMenu: true,
          headerClassName: 'name-column--cell',
          cellClassName: 'name-cell',
          flex: 0.1,

          renderCell: ({ row }) => {
            const attempts = row?.courses?.filter(
              (c: AllStatisticsData) => c.id === course.id,
            )[0]?.attempts;
            const status = attempts && attempts[attempt - 1]?.status;
            return (
              <Typography
                color={status === 'passed' ? 'darkgreen' : 'red'}
                sx={{
                  fontSize: '1rem',
                  fontWeight: 'bold',
                }}
              >
                {attempts && attempts[attempt - 1]
                  ? attempts[attempt - 1].points
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
              {/* <Chip
                icon={<LightbulbIcon />}
                label={getCourseTitleById(course.id, allCourses!)!}
                sx={{ fontSize: '1rem', margin: '0 5px', fontWeight: 'bold' }}
              /> */}
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
            }}
          />
        ) : (
          <ProgressLine />
        )}
      </Box>
    </Box>
  );
};

export default Statistics;
