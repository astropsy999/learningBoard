import { CoursesWithDeadline } from '../../app/types/types.store';

export const getDeadlineDate = (
  courseId: number,
  isUnixTime = false,
  assigned: CoursesWithDeadline[],
) => {
  const deadline = assigned.find((course) => course.id === courseId)?.deadline;
  switch (deadline) {
    case null:
      return 'Без срока';
    case undefined:
      return '';
    default:
      const date = new Date(deadline! * 1000);
      return !isUnixTime ? date.toLocaleDateString('ru-RU') : deadline;
  }
};
