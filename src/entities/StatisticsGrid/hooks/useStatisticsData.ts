import useSWR from 'swr';
import { useCourses } from '../../../app/store/courses';
import { useEffect, useState } from 'react';
import { fetchStatisctics, getDetailedStatisctics } from '../../../app/api/api';

import { CourseAttempt, StatInfoType } from '../../../app/types/stat';
import { findMaxCourses } from '../../../shared/helpers/findMaxCoursesArrayInStat';

export const useStatisticsData = () => {
  const { allCourses } = useCourses();
  const { data: rawStatistics, isLoading } = useSWR('stat', fetchStatisctics);
  const [coursesList, setCoursesList] = useState<CourseAttempt[]>([]);
  const [statLoading, setStatLoading] = useState(true);
  const [showDetailedStat, setShowDetailedStat] = useState(false);
  const [statInfo, setStatInfo] = useState<StatInfoType>({
    course: 0,
    user: 0,
    userName: '',
    status: '',
    unixDate: 0,
    points: 0,
    totalPoints: 0,
    percent: '',
    passingScore: 0,
    timeSpent: '',
  });

  useEffect(() => {
    const courses = findMaxCourses(rawStatistics);
    setCoursesList(courses!);
  }, [rawStatistics]);

  useEffect(() => {
    setStatLoading(isLoading);
    allCourses && allCourses.length > 0 && setStatLoading(false);
  }, [statLoading]);


  const showDetailedStatistic = async (
    course: number,
    user: number,
    userName: string,
    status: string,
    unixDate: number,
    points: number,
    totalPoints: number,
    percent: string,
    passingScore: number,
    timeSpent: string,
  ) => {
    setShowDetailedStat(!showDetailedStat);
    const getStatInfo = {
      user,
      course,
      userName,
      status,
      unixDate,
      points,
      totalPoints,
      percent,
      passingScore,
      timeSpent,
    };
    const detailedStat = await getDetailedStatisctics(250,13);
    console.log('detailedStat: ', detailedStat);
    setStatInfo(getStatInfo!);
  };

  return {
    coursesList,
    statLoading,
    showDetailedStat,
    statInfo,
    rawStatistics,
    isLoading,
    showDetailedStatistic,
    setShowDetailedStat,
  };
};