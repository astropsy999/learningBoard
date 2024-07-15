import { GridComparatorFn, GridSortCellParams } from '@mui/x-data-grid';
import {
  AllStatisticsData,
  CourseAttempt,
} from '../../../app/types/stat';
/**
 * Returns a comparator function for sorting statistics data based on the percentage of points achieved in a course.
 *
 * @return {GridComparatorFn<any>} A comparator function that takes in two statistics data objects, cell parameters, and compares their percentage of points achieved in a course.
 */
export const useStatSortComparator = () => {
  const calculatePercent = (points: number, totalPoints: number) => {
    if (totalPoints === 0) {
      return 0;
    }
    return Number(((points / totalPoints) * 100).toFixed(0));
  };

  const sortComparator: GridComparatorFn<any> = (
    v1,
    v2,
    cellParams1,
    cellParams2,
  ) => {
    const courseId = +cellParams1?.field?.split('_')[0];
    const getVal = (cellParams: GridSortCellParams) =>
      cellParams?.value?.courses?.filter(
        (v: CourseAttempt) => v.id === courseId,
      )[0]?.attempts[0]?.points;

    const getTotalVal = (cellParams: GridSortCellParams) =>
      +cellParams?.value?.courses?.find(
        (c: AllStatisticsData) => c.id === courseId,
      )?.total_points;

    const val1 = getVal(cellParams1);
    const val2 = getVal(cellParams2);
    const totalVal1 = getTotalVal(cellParams1);
    const totalVal2 = getTotalVal(cellParams2);

    const percentA = calculatePercent(val1, totalVal1);
    const percentB = calculatePercent(val2, totalVal2);

    return percentA - percentB;
  };

  return sortComparator;
};
