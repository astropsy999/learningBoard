import configApi from '../api/config.api';
import { url } from '../api/url.api';
import { mockDataCourses, mockDataTeam } from '../data/mockData';
import { ILearner } from '../data/types.store';

export const getCurrentUserData = async () => {
  let userData;
  // const formData = new FormData();
  try {
    await fetch(configApi.srv + url.getUserProfileData, {
      method: 'POST',
      credentials: 'include',
    })
      .then((response) => response.json())
      .then((data) => {
        userData = data[0].data;
      });
    return userData;
  } catch (e: Error | any) {
    throw new Error(e.message);
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
