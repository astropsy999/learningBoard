import { CourseData } from "../data/store/courses.store";

export const getCourseTitleById=(id: number, allCourses: CourseData[])=>{
    return allCourses?.find((course) => course.id === id)?.title
}