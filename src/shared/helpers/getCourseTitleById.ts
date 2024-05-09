import { CourseData } from '../../app/store/courses';

export const getCourseTitleById = (id: number, allCourses: CourseData[]) => {
  return allCourses?.find((course) => course?.id === id)?.title;
};
