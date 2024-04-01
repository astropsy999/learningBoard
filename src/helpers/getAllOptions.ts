import { ILearner } from '../data/types.store';

export const getAllOptions = (allLearners: ILearner[], field: keyof ILearner) => {
  return [
    ...new Set(allLearners?.map((learner) => learner[field]).filter(Boolean)),
  ];
};
