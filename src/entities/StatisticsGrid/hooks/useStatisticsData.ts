import { useEffect, useState } from 'react';
import useSWR from 'swr';
import {
  fetchStatisctics,
  fetchStatiscticsBestTry,
} from '../../../app/api/api';
import { useCourses } from '../../../app/store/courses';

import { CourseAttempt, StatInfoType } from '../../../app/types/stat';
import { findMaxCourses } from '../../../shared/helpers/findMaxCoursesArrayInStat';

/**
 * Custom hook for managing statistics data.
 *
 * @return {Object} Object containing various statistics data and functions to manipulate the data.
 */
export const useStatisticsData = () => {
  const { allCourses } = useCourses();
  const { data: rawStatistics, isLoading } = useSWR('stat', fetchStatisctics);
  const { data: rawStatisticsBestTry, isLoading: isLoadingBestTry } = useSWR(
    'statBestTry',
    fetchStatiscticsBestTry,
  );
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
  }, [statLoading, allCourses, isLoading]);

  /**
   * Asynchronously shows detailed statistics for a user on a specific course.
   *
   * @param {number} course - The ID of the course.
   * @param {number} user - The ID of the user.
   * @param {string} userName - The name of the user.
   * @param {string} status - The status of the user's attempt on the course.
   * @param {number} unixDate - The Unix timestamp of the user's attempt.
   * @param {number} points - The number of points scored by the user.
   * @param {number} totalPoints - The total number of points possible on the course.
   * @param {string} percent - The percentage of points scored by the user.
   * @param {number} passingScore - The passing score for the course.
   * @param {string} timeSpent - The time spent by the user on the course.
   * @return {Promise<void>} A promise that resolves when the detailed statistics are shown.
   */
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
    if (status) {
      setShowDetailedStat((prev) => !prev);
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

      setStatInfo(getStatInfo!);
    }
  };

  return {
    coursesList,
    statLoading,
    showDetailedStat,
    statInfo,
    rawStatistics,
    rawStatisticsBestTry,
    isLoadingBestTry,
    isLoading,
    showDetailedStatistic,
    setShowDetailedStat,
  };
};
