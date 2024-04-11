

export type Attempt = {
    points: number,
    status: 'passed' | 'failed' | 'incomplete',

}
export type CourseAttempt = {
    id: number,
    attempts: Attempt[],
    total_points: number,
}

export type AllStatisticsData = {
    id: number,
    name: string,
    courses: CourseAttempt[],
}

export const findMaxCourses = (stat: AllStatisticsData[]) => {
    const filteredStat = stat?.filter((st) => st.courses.length > 0);
    
    let maxCourses = 0;
    let courseArrayWithMaxCourses = null;
  
    filteredStat?.forEach((st) => {
      if (st.courses.length > maxCourses) {
        maxCourses = st.courses.length;
        courseArrayWithMaxCourses = st.courses;
      }
    });
  
    return courseArrayWithMaxCourses;
  };