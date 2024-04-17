import { ILearner } from '../../app/types/store';

export const getAllOptions = (
  allLearners: ILearner[],
  field: keyof ILearner,
) => {
  return [
    ...new Set(
      allLearners
        ?.map((learner) => learner[field])
        .sort()
        .filter(Boolean),
    ),
  ];
};
