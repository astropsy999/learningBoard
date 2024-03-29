import { Box, Typography, useTheme } from '@mui/material';
import {
  DataGrid,
  GridColDef,
  GridColumnGroupingModel,
} from '@mui/x-data-grid';
import React, { useEffect, useMemo, useState } from 'react';
import { tokens } from '../theme';
import useSWR from 'swr';
import { fetchStatisctics } from '../services/api.service';
import ProgressLine from '../components/ProgressLine';
import { dataGridStyles } from '../styles/DataGrid.styles';
import Header from '../components/Header';
import {
  AllStatisticsData,
  CourseAttempt,
  findMaxCourses,
} from '../helpers/findMaxCoursesArrayInStat';
import { useCourses } from '../data/store/courses.store';
import { getCourseTitleById } from '../helpers/getCourseTitleById';

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

  const columns: GridColDef[] = useMemo(() => {
    const initialColumns = [
      {
        field: 'name',
        headerName: 'ФИО',
        headerClassName: 'name-column--cell',
        cellClassName: 'name-cell',
        flex: 0.3,
      },
    ];

    if (!isLoading && !statLoading) {
      const newColumns: GridColDef[] = [];

      coursesList?.forEach((course) => {
        for (let attempt = 1; attempt <= ATTEMPTS; attempt++) {
          newColumns.push({
            field: `${course.id}_${attempt}`,
            headerName: `${attempt}`,
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
                <Typography color={status === 'passed' ? 'green' : 'red'}>
                  {attempts && attempts[attempt - 1]
                    ? attempts[attempt - 1].points
                    : '-'}
                </Typography>
              );
            },
          });
        }
      });

      return [...initialColumns, ...newColumns];
    } else {
      return initialColumns;
    }
  }, [isLoading, statLoading, coursesList, ATTEMPTS]);

  const columnGroupingModel: GridColumnGroupingModel | undefined =
    useMemo(() => {
      if (!isLoading && !statLoading) {
        return coursesList?.map((course) => ({
          groupId: getCourseTitleById(course.id, allCourses!)!,
          children: [
            { field: `${course.id}_1` },
            { field: `${course.id}_2` },
            { field: `${course.id}_3` },
          ],
        }));
      } else {
        return undefined;
      }
    }, [isLoading, statLoading, coursesList, allCourses]);

  return (
    <Box m="20px" pt={2}>
      <Header title="Статистика" subtitle="" />
      <Box m="10px 0 0 0" sx={dataGridStyles.root}>
        {!isLoading || !statLoading ? (
          <DataGrid
            rows={isLoading || statLoading ? [] : rawStatistics}
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
                borderRight: `1px solid ${theme.palette.divider}`, // Добавление вертикальной черты
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
