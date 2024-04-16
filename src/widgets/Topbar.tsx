import SchoolIcon from '@mui/icons-material/School';
import { Box, Button } from '@mui/material';
import React, { FC, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import useSWR from 'swr';
import { useCourses } from '../app/store/courses';
import { useLearners } from '../app/store/learners';
import { AllData } from '../app/types/store.types';
import { fetchAllData } from '../app/api/api';
import { RenderAssignAllButton } from '../features/AssignAllBtn';
import SplitButton from '../features/SplitButton';
import QueryStatsIcon from '@mui/icons-material/QueryStats';
import Header from '../shared/ui/Header';

interface TopbarProps {
  setIsSidebar?: React.Dispatch<React.SetStateAction<boolean>>;
}

const Topbar: FC<TopbarProps> = () => {
  const {
    selectedRowsData,
    setCurrentUserData,
    setCurrentUserName,
    currentUserName,
    allData: allDataFromStore,
    setAllData,
    setCurrentUserDivisionName,
    setAllLearners,
    setDivisions,
  } = useLearners();

  const { setAllCourses } = useCourses();

  const isAssignAllButton = selectedRowsData.length > 0;

  const {
    data: allData,
    isLoading: isLoadingAllData,
    error,
  } = useSWR<AllData | undefined>('allData', fetchAllData);

  const locationHeaderNames: { [key: string]: string } = {
    '/': 'Сотрудники',
    '/courses': 'Курсы',
    '/stat': 'Статистика',
  };

  useEffect(() => {
    if (!isLoadingAllData && !error && allData) {
      const { users, divisions, courses, currentUserInfo } = allData;

      const courseTitlesById: { [key: number]: string } = {};
      courses?.forEach((course) => {
        courseTitlesById[course.id] = course.title;
      });

      setCurrentUserData(currentUserInfo);
      setCurrentUserName(currentUserInfo?.name);

      // Заполняем поля position, division и courses у каждого пользователя
      const learnersWithData = users.map((user) => ({
        ...user,
        division: user.division
          ? divisions[user.division].short_name
          : undefined,
        courses: user.courses.map((courseId) => ({
          [courseId.id]: courseTitlesById[courseId.id],
          deadline: courseId.deadline,
        })),
      }));

      // Устанавливаем обновленный массив с данными пользователя
      setAllLearners(learnersWithData);
      setDivisions(allData?.divisions);
      setAllCourses(allData?.courses);
      setAllData(allData);
      if (allDataFromStore) {
        const userDivisionId = currentUserInfo.division;

        setCurrentUserDivisionName(
          allDataFromStore?.divisions[userDivisionId].short_name,
        );
      }
    }
  }, [
    isLoadingAllData,
    error,
    allData,
    setAllData,
    setCurrentUserDivisionName,
    currentUserName,
    allDataFromStore,
    setAllLearners,
    setDivisions,
    setAllCourses,
    setCurrentUserData,
    setCurrentUserName,
  ]);

  const location = useLocation();

  return (
    <Box
      display="flex"
      justifyContent="space-between"
      alignItems="center"
      p={1}
      position={'fixed'}
      width={'100%'}
      boxShadow={
        '0px 2px 4px -1px rgba(0,0,0,0.2),0px 4px 5px 0px rgba(0,0,0,0.14),0px 1px 10px 0px rgba(0,0,0,0.12)'
      }
      // bgcolor={'linear-gradient(to right, #FFFFFF 0%, #C0D2E6 80%)'}
      sx={{
        background: 'linear-gradient(to right, #FFFFFF 0%, #C0D2E6 100%)',
        // backgroundColor: 'linear-gradient(0deg, blue, green 40%, red)',
      }}
    >
      <Box ml={4} sx={{ display: 'flex', gap: '16px', marginLeft: '20px' }}>
        {isAssignAllButton && <RenderAssignAllButton />}
        <Link to={'/'}>
          <SplitButton />
        </Link>
        <Link to="/courses">
          <Button
            variant={
              location.pathname === '/courses' ? 'contained' : 'outlined'
            }
            color="primary"
            startIcon={<SchoolIcon />}
          >
            Курсы
          </Button>
        </Link>
        {!isAssignAllButton ? (
          <Link to={'/stat'}>
            <Button
              variant={location.pathname === '/stat' ? 'contained' : 'outlined'}
              startIcon={<QueryStatsIcon />}
              color="primary"
            >
              Статистика
            </Button>
          </Link>
        ) : (
          <Button startIcon={<QueryStatsIcon />} color="primary" disabled>
            Статистика
          </Button>
        )}
      </Box>
      <Box mr={10}>
        <Header title={locationHeaderNames[location.pathname]} subtitle={''} />
      </Box>
    </Box>
  );
};

export default Topbar;
