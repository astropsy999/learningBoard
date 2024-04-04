import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import LockPersonIcon from '@mui/icons-material/LockPerson';
import { Box, Button, Chip } from '@mui/material';
import { DataGrid, GridColDef, GridRowSpacingParams } from '@mui/x-data-grid';
import React, { useEffect, useState } from 'react';
import { Bounce, toast } from 'react-toastify';
import { mutate } from 'swr';
import { BlockCourseFor } from '../components/BlockCourseFor';
import Header from '../components/Header';
import { useCourses } from '../data/store/courses.store';
import { useLearners } from '../data/store/learners.store';
import { Course } from '../data/types.store';
import { lockCourses } from '../services/api.service';
import { dataGridStyles } from '../styles/DataGrid.styles';
import { truncateDescription } from '../helpers/truncateDescriptions';
import { SelectedRowData } from './MyLearners';

interface LockedData {
  [key: number]: string[];
}

const CoursesList = () => {
  const { allCourses } = useCourses();
  const {
    allLearners,
    selectedLearnersToLockCourse,
    setSelectedLearnersToLockCourse,
    currentUserData,
  } = useLearners();
  const [isLoading, setIsLoading] = useState(true);
  const [isLockLoading, setIsLockLoading] = useState(false);
  const [lockedData, setLockedData] = useState<LockedData[]>([]);
  const [lockedUsers, setLockedUsers] = useState<string[]>([]);
  const [onBlockLearnersMode, setOnBlockLearnersMode] = useState<{
    [id: number]: boolean;
  }>({});
  const [managerLevel, setManagerLevel] = useState<number>(0);

  useEffect(() => {
    if (allCourses && allLearners && currentUserData) {
      setManagerLevel(currentUserData.manager.level);
      setIsLoading(false);
    }
  }, [allCourses, allLearners, currentUserData]);

  useEffect(() => {
    const getLearnersWithLockedCourses = () => {
      const learnersWithLocked = allLearners?.filter(
        (learner) => learner?.courses_exclude?.length !== 0,
      );
      const transformedDataOfLocked = learnersWithLocked!.reduce(
        (acc: any[], curr) => {
          curr?.courses_exclude?.forEach((courseId) => {
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
    };
    if (!isLoading) getLearnersWithLockedCourses();
  }, [allCourses, allLearners, isLoading]);

  useEffect(() => {
    // Проверяем, включен ли режим блокировки, если нет, то очищаем массив lockedUsers
    if (!Object.values(onBlockLearnersMode).some((value) => value)) {
      setSelectedLearnersToLockCourse([]);
    }
  }, [onBlockLearnersMode, setSelectedLearnersToLockCourse]);

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

  const saveLockedUsers = async (id: number) => {
    setIsLockLoading(true);

    const learnersToLockIDs: number[] = [];

    selectedLearnersToLockCourse?.forEach((learner) => {
      if (typeof learner === 'object' && learner !== null) {
        learnersToLockIDs.push(learner.id!);
      }
      return null;
    });

    const lockedLearnersToSend = [
      {
        id,
        users: learnersToLockIDs,
      },
    ];

    const result = await lockCourses(lockedLearnersToSend);
    mutate('allData').then(() => {
      toast.success(result[0].data.message, {
        position: 'top-right',
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: 'colored',
        transition: Bounce,
      });
      setIsLockLoading(false);
      setOnBlockLearnersMode((prev) => ({
        ...prev,
        [id]: !prev[id],
      }));
    });

    return lockedLearnersToSend;
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
      flex: 0.4,
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
      renderCell: ({ row }: any) => {
        return truncateDescription(row.description);
      },
    },
    {
      field: 'locked',
      headerName: 'Заблокировано для:',
      flex: 1,
      headerClassName: 'name-column--cell',
      cellClassName: 'center--cell',

      renderCell: ({ row }: any) => {
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
                />,
              );
            });
          }
        });
        if (onBlockLearnersMode[row.id])
          return (
            <BlockCourseFor
              lockedUsers={lockedUsers}
              isLoading={isLockLoading}
            />
          );
        return chips.length > 0 ? chips : '';
      },
    },
    managerLevel === 1
      ? {
          field: 'lockCourses',
          headerName: 'Блокировка',
          flex: 0.2,
          headerClassName: 'name-column--cell',
          cellClassName: 'center--cell',

          renderCell: ({ row }: any) => {
            const isAnyButtonLocked = Object.keys(onBlockLearnersMode).some(
              (id) => onBlockLearnersMode[+id] && id !== row.id,
            );
            return (
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                  gap: '3px',
                }}
              >
                {!onBlockLearnersMode[row.id] ? (
                  <Button
                    variant="contained"
                    color={'warning'}
                    disabled={isAnyButtonLocked}
                    startIcon={<LockPersonIcon />}
                    onClick={(event) => chooseLearnersToLockCourse(event, row)}
                  ></Button>
                ) : (
                  <Button
                    variant="contained"
                    color={'warning'}
                    startIcon={<CloseIcon />}
                    onClick={() => {
                      setOnBlockLearnersMode((prev) => ({
                        ...prev,
                        [row.id]: !prev[row.id],
                      }));
                      setLockedUsers([]);
                    }}
                  ></Button>
                )}
                {onBlockLearnersMode[row.id] && (
                  <Button
                    variant="contained"
                    color={'secondary'}
                    startIcon={<CheckIcon />}
                    onClick={() => {
                      saveLockedUsers(row.id);
                    }}
                  ></Button>
                )}
              </Box>
            );
          },
          disableColumnMenu: true,
        }
      : null,
  ].filter(Boolean) as GridColDef[];

  return (
    <Box m="20px" pt={2}>
      <Box m="40px 0 0 0" height="75vh" sx={dataGridStyles.root}>
        <DataGrid
          autoHeight={true}
          rows={isLoading ? [] : allCourses!}
          columns={columns}
          loading={isLoading}
          getRowHeight={() => 'auto'}
          sx={{
            '&.MuiDataGrid-root--densityCompact .MuiDataGrid-cell': {
              py: '8px',
            },
            '&.MuiDataGrid-root--densityStandard .MuiDataGrid-cell': {
              py: '15px',
            },
            '&.MuiDataGrid-root--densityComfortable .MuiDataGrid-cell': {
              py: '22px',
            },
          }}
        />
      </Box>
    </Box>
  );
};

export default CoursesList;
