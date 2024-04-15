import { ILearner } from '../../app/types/store.types';

export const getAllPositions = (allLearners: ILearner[]) => {
  return [
    ...new Set(allLearners?.map((learner) => learner.position).filter(Boolean)),
  ];
};
