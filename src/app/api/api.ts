import { Bounce, toast } from 'react-toastify';
import configApi from '../config';
import { mockDataCourses, mockDataTeam } from '../data/mockData';
import { AllData, CoursesWithDeadline } from '../types/store';
import { url } from './endpoints.api';

export type ToUpdateUser = {
  id: number;
  courses: CoursesWithDeadline[];
};

export type CourseToLock = {
  id: number;
  users: number[];
};

/**
 * Fetches detailed statistics for a user on a specific course.
 *
 * @param {number} userId - The ID of the user.
 * @param {number} courseId - The ID of the course.
 * @return {Promise<Object>} A promise that resolves to the detailed statistics data of the user on the course.
 */
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

/**
 * Fetches statistics for users (deprecated).
 *
 * @return {Promise<Object>} The data of the user statistics.
 */
export const fetchStatisctics = async () => {
  const response = await fetch(configApi.srv + url.getUsersStatistics, {
    credentials: 'include',
  });
  const data = await response.json();
  return data[0].data;
};

/**
 * Fetches the best try statistics for users.
 *
 * @return {Promise<Object>} The data of the best try statistics.
 */
export const fetchStatiscticsBestTry = async () => {
  const response = await fetch(configApi.srv + url.getUsersStatisticsBestTry, {
    credentials: 'include',
  });
  const data = await response.json();
  return data[0].data;
};

/**
 * Fetches all data from the learnController endpoint. This data is for all users table.
 *
 * @return {Promise<AllData | undefined>} A promise that resolves to the fetched data or undefined if an error occurs.
 * @throws {Error} If an error occurs during the fetch.
 */
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
/**
 * Locks the specified courses by sending a POST request to the server.
 *
 * @param {CourseToLock[]} dataToLock - An array of courses to lock, including the course ID and the user IDs to lock the course for.
 * @return {Promise<any>} A promise that resolves to the locked data returned by the server.
 * @throws {Error} If there is an error while making the POST request or parsing the response.
 */
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

/**
 * Updates all data with the provided data to update.
 *
 * @param {ToUpdateUser[]} dataToUpdate - The data to update.
 * @return {Promise<any>} The updated data from the server.
 */
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
/**
 * A function that fetches all learners asynchronously with a delay (mock).
 *
 * @return {Promise<any>} The mock data for all learners.
 */
export const fetchAllLearners = async () => {
  // Имитируем асинхронный запрос с задержкой
  await new Promise((resolve) => setTimeout(resolve, 1000));

  return mockDataTeam;
};

/**
 * Fetches all courses asynchronously (mock).
 *
 * @return {Promise<any>} A promise that resolves to the fetched courses.
 */
export const fetchAllCourses = async () => {
  // Имитируем асинхронный запрос с задержкой
  await new Promise((resolve) => setTimeout(resolve, 1000));

  return mockDataCourses;
};


