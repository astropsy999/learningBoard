import { ILearner } from '../../app/types/store.types';

export const getLearnerIdByName = (name: string, allUsersData: ILearner[]) => {
  const foundLearner = allUsersData.find((learner) => learner.name === name);
  return foundLearner?.id;
};
