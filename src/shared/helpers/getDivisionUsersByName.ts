import { ILearner } from '../../app/types/store.types';

export const getDivisionUsersArrayByName = (
  allLearners: ILearner[],
  divisionName: string,
) => {
  return allLearners
    ?.filter((learner) => learner.division === divisionName)
    .map((l) => l.name);
};
