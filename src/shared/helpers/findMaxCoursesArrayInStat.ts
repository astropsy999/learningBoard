import { AllStatisticsData } from '../../app/types/stat';

/**
 * Находит и возвращает массив курсов из статистики, содержащий максимальное количество курсов.
 *
 * @param {AllStatisticsData[]} stat - Массив данных статистики.
 * @returns {Array|null} Массив курсов с максимальным количеством курсов или null, если данные отсутствуют или курсы не найдены.
 *
 * @example
 * const statistics = [
 *   { courses: ['Курс1', 'Курс2'] },
 *   { courses: ['Курс3'] },
 *   { courses: ['Курс4', 'Курс5', 'Курс6'] }
 * ];
 *
 * const result = findMaxCourses(statistics);
 * console.log(result); // ['Курс4', 'Курс5', 'Курс6']
 */
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
