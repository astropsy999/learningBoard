import { AllStatisticsData } from "../../app/types/stat.types";


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