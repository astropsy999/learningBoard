import { Bounce, ToastContent, toast } from 'react-toastify';
import configApi from '../api/config.api';
import { url } from '../api/url.api';
import { mockDataCourses, mockDataTeam } from '../data/mockData';
import { AllData, ILearner } from '../data/types.store';

export type ToUpdateUser = {
  id: number;
  courses: number[];
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

export const updateAllData = async (dataToUpdate: ToUpdateUser[]) => {
  // Добавляем данные в formData

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
