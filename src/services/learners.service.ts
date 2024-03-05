import axios from 'axios';
import { mockDataTeam } from '../data/mockData';
import { ILearner, User, UserState } from '../data/types.store';

export const fetchAllLearners = async () => {
  // Имитируем асинхронный запрос с задержкой
  await new Promise((resolve) => setTimeout(resolve, 1000));

  return mockDataTeam;
};

export const filterLearners = (division: string, allLearners: ILearner[]) => {
  return allLearners.filter((learner) => learner.division === '');
};

export const getCurrentUserDivision = (
  currentUserName: string,
  allLearners: ILearner[],
) => {
  // console.log('🚀 ~ allLearners:', allLearners);
  const currentLearner = allLearners?.filter(
    (learner) => learner?.name === currentUserName,
  );
  console.log('🚀 ~ currentLearner:', currentLearner);
  return currentLearner[0]?.division;
};
