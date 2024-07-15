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
 * Хук для получения данных статистики.
 * @returns {Object} Объект с данными статистики и методами.
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
    console.log("🚀 ~ useEffect ~ rawStatistics:", rawStatistics)
    console.log(
      '🚀 ~ useStatisticsData ~ rawStatisticsBestTry:',
      rawStatisticsBestTry,
    );

    setCoursesList(courses!);
  }, [rawStatistics]);

  useEffect(() => {
    setStatLoading(isLoading);
    allCourses && allCourses.length > 0 && setStatLoading(false);
  }, [statLoading, allCourses, isLoading]);

  /**
   * Показать подробную статистику.
   * @param {number} course - Идентификатор курса.
   * @param {number} user - Идентификатор пользователя.
   * @param {string} userName - Имя пользователя.
   * @param {string} status - Статус прохождения.
   * @param {number} unixDate - Дата в формате Unix.
   * @param {number} points - Набранные баллы.
   * @param {number} totalPoints - Общее количество баллов.
   * @param {string} percent - Процент выполнения.
   * @param {number} passingScore - Проходной балл.
   * @param {string} timeSpent - Потраченное время.
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
