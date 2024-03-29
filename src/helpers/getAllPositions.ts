import { ILearner } from '../data/types.store';

export const getAllPositions = (allLearners: ILearner[]) => {
  return [
    ...new Set(allLearners?.map((learner) => learner.position).filter(Boolean)),
  ];
};
