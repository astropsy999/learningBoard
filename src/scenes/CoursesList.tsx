import { Box, Button, Chip, useTheme } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { tokens } from '../theme';
import Header from '../components/Header';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { useCourses } from '../data/store/courses.store';
import LockPersonIcon from '@mui/icons-material/LockPerson';
import { useLearners } from '../data/store/learners.store';
import { dataGridStyles } from '../styles/DataGrid.styles';
import { BlockCourseFor } from '../components/BlockCourseFor';
import { Course } from '../data/types.store';

interface LockedData {
  [key: number]: string[];
}

const CoursesList = () => {
  const { allCourses } = useCourses();
  const { allLearners } = useLearners();
  const [isLoading, setIsLoading] = useState(true);
  const [lockedData, setLockedData] = useState<LockedData[]>([]);
  const [lockedUsers, setLockedUsers] = useState<string[]>([]);
  const [onBlockLearnersMode, setOnBlockLearnersMode] = useState<{
    [id: number]: boolean;
  }>({});

  useEffect(() => {
    if (allCourses && allLearners) {
      setIsLoading(false);
    }
  }, [allCourses, allLearners]);

  useEffect(() => {
    const getLearnersWithLockedCourses = () => {
      const learnersWithLocked = allLearners?.filter(
        (learner) => learner?.courses_exclude.length !== 0,
      );
      const transformedDataOfLocked = learnersWithLocked!.reduce(
        (acc: any[], curr) => {
          curr.courses_exclude.forEach((courseId) => {
            if (acc.some((item) => item[courseId])) {
              const existingItem = acc.find((item) => item[courseId]);
              existingItem && existingItem[courseId].push(curr.name);
            } else {
              const newItem = { [courseId]: [curr.name] };
              acc.push(newItem);
            }
          });
          return acc;
        },
        [],
      );

      setLockedData(transformedDataOfLocked);
      // return transformedDataOfLocked
    };
    if (!isLoading) getLearnersWithLockedCourses();
  }, [allCourses, allLearners, isLoading]);

  useEffect(() => {
    // Проверяем, включен ли режим блокировки, если нет, то очищаем массив lockedUsers
    if (!Object.values(onBlockLearnersMode).some((value) => value)) {
      setLockedUsers([]);
    }
  }, [onBlockLearnersMode]);

  const handleSelectionCoursesChange = () => {};
  const chooseLearnersToLockCourse = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    row: Course,
  ) => {
    setOnBlockLearnersMode((prev) => ({
      ...prev,
      [row.id]: !prev[row.id],
    }));

    const hasLockedUsers = lockedData?.filter((item) => item[row.id])[0];
    const lockedUsers: string[] = hasLockedUsers && hasLockedUsers[row.id];

    if (lockedUsers) {
      setLockedUsers(lockedUsers);
    }
  };

  const columns: GridColDef[] = [
    {
      field: 'id',
      headerName: 'ID',
      flex: 0.1,
      headerClassName: 'name-column--cell',
      cellClassName: 'center--cell',
    },
    {
      field: 'title',
      headerName: 'Название курса',
      flex: 0.5,
      headerClassName: 'name-column--cell',
      cellClassName: 'name-cell center--cell',
    },
    {
      field: 'description',
      headerName: 'Описание курса',
      headerAlign: 'left',
      align: 'left',
      flex: 0.5,
      headerClassName: 'name-column--cell',
    },
    {
      field: 'locked',
      headerName: 'Заблокировано для:',
      flex: 1,
      headerClassName: 'name-column--cell',
      cellClassName: 'center--cell',

      renderCell: ({ row }) => {
        if (lockedData.length === 0) return;

        const chips: JSX.Element[] = [];
        lockedData.forEach((element) => {
          const courseId = +Object.keys(element)[0];
          if (courseId === row.id) {
            element[row.id].forEach((value) => {
              chips.push(
                <Chip
                  key={`${row.id}-${value}`}
                  label={value}
                  variant="outlined"
                  sx={{
                    margin: '2px',
                    transition: 'opacity 3s ease-in-out',
                    background: 'white',
                  }}
                  onDelete={() => {}}
                  // deleteIcon={
                  //   rowDelLoading[`${row.id}-${courseId}`] ? (
                  //     <CircularProgress size={20} />
                  //   ) : (
                  //     <CancelIcon />
                  //   )
                  // }
                  // data-item-id={courseId}
                />,
              );
            });
          }
        });
        if (onBlockLearnersMode[row.id])
          return <BlockCourseFor lockedUsers={lockedUsers} />;
        return chips.length > 0 ? chips : '';
      },
    },

    {
      field: 'lockCourses',
      headerName: 'Блокировка',
      flex: 0.2,
      headerClassName: 'name-column--cell',
      cellClassName: 'center--cell',

      renderCell: ({ row }) => {
        return (
          <>
            <Button
              variant="contained"
              color={'error'}
              startIcon={<LockPersonIcon />}
              onClick={(event) => chooseLearnersToLockCourse(event, row)}
            ></Button>
          </>
        );
      },
      disableColumnMenu: true,
    },
  ];

  return (
    <Box m="20px">
      <Header title="Курсы" subtitle="Список обучающих материалов" />
      <Box m="40px 0 0 0" height="75vh" sx={dataGridStyles.root}>
        <DataGrid
          autoHeight={true}
          //   apiRef={apiRef}
          checkboxSelection
          disableRowSelectionOnClick
          rows={isLoading ? [] : allCourses!}
          columns={columns}
          loading={isLoading}
          onRowSelectionModelChange={handleSelectionCoursesChange}
          getRowHeight={() => 'auto'}
        />
      </Box>
    </Box>
  );
};

export default CoursesList;
