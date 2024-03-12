import SchoolIcon from '@mui/icons-material/School';
import { Box, Button } from '@mui/material';
import React, { FC, useEffect } from 'react';
import { Link } from 'react-router-dom';
import useSWR from 'swr';
import { useLearners } from '../data/store/learners.store';
import { AllData, CurrentUserData, Divisions, User } from '../data/types.store';
import { fetchAllData, getCurrentUserData } from '../services/api.service';
import { RenderAssignAllButton } from './AssignAllBtn';
import SplitButton from './SplitButton';
import { useCourses } from '../data/store/courses.store';

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
    data,
    isLoading,
    error: isError,
  } = useSWR<CurrentUserData | undefined>(
    'currentUserData',
    getCurrentUserData,
  );

  // const getCurrentUserDivisionName = (
  //   userName: string,
  //   usersDataTable: User[],
  //   divisionsData: Divisions,
  // ) => {
  //   const userDivisionId = usersDataTable?.find(
  //     (user) => user?.name === userName,
  //   )?.division;
  //   return divisionsData[userDivisionId!];
  // };

  useEffect(() => {
    if (!isLoading && !isError && data) {
      setCurrentUserData(data);
      setCurrentUserName(data.Name);
    }
  }, [data, isLoading, isError, setCurrentUserData, setCurrentUserName]);

  const {
    data: allData,
    isLoading: isLoadingAllData,
    error,
  } = useSWR<AllData | undefined>('allData', fetchAllData);

  useEffect(() => {
    if (!isLoadingAllData && !error && allData) {
      const { users, divisions, courses } = allData;

      const courseTitlesById: { [key: number]: string } = {};
      courses.forEach((course) => {
        courseTitlesById[course.id] = course.title;
      });

      // Заполняем поля position, division и courses у каждого пользователя
      const learnersWithData = users.map((user) => ({
        ...user,
        division: user.division ? divisions[user.division] : undefined,
        courses: user.courses.map((courseId) => ({
          [courseId]: courseTitlesById[courseId],
        })),
      }));

      // Устанавливаем обновленный массив с данными пользователя
      setAllLearners(learnersWithData);
      setDivisions(allData?.divisions);
      setAllCourses(allData?.courses);
      setAllData(allData);
      if (allDataFromStore) {
        const userDivisionId = allDataFromStore?.users.find(
          (user) => user?.name === currentUserName || '',
        )?.division;

        setCurrentUserDivisionName(
          allDataFromStore?.divisions[+userDivisionId!],
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
  ]);

  return (
    <Box
      display="flex"
      justifyContent="space-between"
      alignItems="center"
      p={2}
      position={'fixed'}
      bgcolor={'whitesmoke'}
      width={'100%'}
      boxShadow={
        '0px 2px 4px -1px rgba(0,0,0,0.2),0px 4px 5px 0px rgba(0,0,0,0.14),0px 1px 10px 0px rgba(0,0,0,0.12)'
      }
    >
      <Box ml={4} sx={{ display: 'flex', gap: '16px', marginLeft: '20px' }}>
        {isAssignAllButton && <RenderAssignAllButton />}

        <Link to={'/'}>
          <SplitButton />
        </Link>
        {!isAssignAllButton ? (
          <Link to={'/stat'}>
            <Button variant="outlined" startIcon={<SchoolIcon />}>
              Статистика
            </Button>
          </Link>
        ) : (
          <Button variant="outlined" startIcon={<SchoolIcon />} disabled>
            Статистика
          </Button>
        )}
      </Box>
    </Box>
  );
};

export default Topbar;
