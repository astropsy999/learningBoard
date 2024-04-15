import { CourseData } from '../../app/data/store/courses';

export const getCourseTitleById = (id: number, allCourses: CourseData[]) => {
  return allCourses?.find((course) => course?.id === id)?.title;
};
