import { ILearner } from '../../app/types/types.store';

export const getAllPositions = (allLearners: ILearner[]) => {
  return [
    ...new Set(allLearners?.map((learner) => learner.position).filter(Boolean)),
  ];
};
