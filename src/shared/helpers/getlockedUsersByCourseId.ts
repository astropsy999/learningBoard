import { ILearner } from '../../app/types/store.types';

export const getLockedUsersByCourseId = (
  courseId: number,
  allLearners: ILearner[],
) => {
  const foundLearners = allLearners.filter((learner) =>
    learner.courses_exclude?.includes(courseId),
  );
  return foundLearners.map((learner) => learner.id);
};
