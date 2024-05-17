import { Bounce, toast } from 'react-toastify';
import configApi from '../config';
import { mockDataCourses, mockDataTeam } from '../data/mockData';
import { AllData, CoursesWithDeadline, ILearner } from '../types/store';
import { url } from './endpoints.api';

export type ToUpdateUser = {
  id: number;
  courses: CoursesWithDeadline[];
};

export type CourseToLock = {
  id: number;
  users: number[];
};

export const getDetailedStatisctics = async (
  userId: number,
  courseId: number,
) => {
  const response = await fetch(
    configApi.srv +
      url.getDetailedUserStatisctics +
      `?user=${userId}&course=${courseId}`,
    {
      credentials: 'include',
    },
  );
  const data = await response.json();
  return data[0].data;
};

export const fetchStatisctics = async () => {
  const response = await fetch(configApi.srv + url.getUsersStatistics, {
    credentials: 'include',
  });
  const data = await response.json();
  return data[0].data;
};
export const fetchStatiscticsBestTry = async () => {
  const response = await fetch(configApi.srv + url.getUsersStatisticsBestTry, {
    credentials: 'include',
  });
  const data = await response.json();
  return data[0].data;
};

export const fetchAllData = async (): Promise<AllData | undefined> => {
  let allData;
  try {
    await fetch(configApi.srv + url.learnController, {
      credentials: 'include',
    })
      .then((response) => response.json())
      .then((data: any) => {
        if (data[0].data.type === 'error') {
          toast.error(data[0].data.message, {
            position: 'top-center',
            autoClose: 15000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: 'colored',
            transition: Bounce,
          });
        }
        allData = data[0].data;
      });

    return allData;
  } catch (e: Error | any) {
    toast.error(e.message, {
      position: 'top-center',
      autoClose: 15000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: false,
      draggable: false,
      progress: undefined,
      theme: 'colored',
      transition: Bounce,
    });
    throw new Error(e.message);
  }
};

export const lockCourses = async (dataToLock: CourseToLock[]) => {
  try {
    const response = await fetch(configApi.srv + url.lockCoursesEndpoint, {
      method: 'POST',
      cache: 'no-cache',
      credentials: 'include',
      body: JSON.stringify(dataToLock),
    });

    // Получение обновленных данных с сервера после обновления
    const lockedData = await response.json();

    // Возвращаем обновленные данные
    return lockedData;
  } catch (error: Error | any) {
    toast.error('Ошибка при сохранении данных', {
      position: 'top-right',
      autoClose: 1500,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: false,
      draggable: false,
      progress: undefined,
      theme: 'colored',
      transition: Bounce,
    });
  }
};

export const updateAllData = async (dataToUpdate: ToUpdateUser[]) => {
  try {
    const response = await fetch(configApi.srv + url.updateDataEndpoint, {
      method: 'POST',
      cache: 'no-cache',
      credentials: 'include',
      body: JSON.stringify(dataToUpdate),
    });

    // Получение обновленных данных с сервера после обновления
    const updatedData = await response.json();

    // Возвращаем обновленные данные
    return updatedData;
  } catch (error: Error | any) {
    toast.error('Ошибка при сохранении данных', {
      position: 'top-right',
      autoClose: 1500,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: false,
      draggable: false,
      progress: undefined,
      theme: 'colored',
      transition: Bounce,
    });
  }
};

export const fetchAllLearners = async () => {
  // Имитируем асинхронный запрос с задержкой
  await new Promise((resolve) => setTimeout(resolve, 1000));

  return mockDataTeam;
};
export const fetchAllCourses = async () => {
  // Имитируем асинхронный запрос с задержкой
  await new Promise((resolve) => setTimeout(resolve, 1000));

  return mockDataCourses;
};

export const filterLearners = (division: string, allLearners: ILearner[]) => {
  return allLearners.filter((learner) => learner.division === '');
};

export const getCurrentUserDivision = (
  currentUserName: string,
  allLearners: ILearner[],
) => {
  const currentLearner = allLearners?.filter(
    (learner) => learner?.name === currentUserName,
  );
  return currentLearner[0]?.division;
};
