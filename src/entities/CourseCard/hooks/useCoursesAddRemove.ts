import { ToUpdateUser } from '../../../app/api/api';
import { CoursesWithDeadline, ILearner } from '../../../app/types/store';

/**
 * Function that handles adding and removing courses in bulk.
 *
 * @param {ILearner[]} selectedRowsData - Array of selected learners
 * @param {(isLoading: boolean) => void} setIsCourseCardLoading - Function to set course card loading state
 * @param {(dataToUpdate: ToUpdateUser[], setLocalLoaderType: (prevState: boolean) => void, message: string) => void} updateCourses - Function to update courses
 * @param {(courses: CoursesWithDeadline[], selectedRowsData: ILearner[]) => ToUpdateUser[]} prepareDataToUpdate - Function to prepare data for updating courses
 * @return {{ removeCoursesMass: Function, addCoursesMass: Function }} Object with functions for removing and adding courses in bulk
 */
export const useCoursesAddRemove = (
  selectedRowsData: ILearner[],
  setIsCourseCardLoading: (isLoading: boolean) => void,
  updateCourses: (
    dataToUpdate: ToUpdateUser[],
    setLocalLoaderType: (prevState: boolean) => void,
    message: string,
  ) => void,
  prepareDataToUpdate: (
    courses: CoursesWithDeadline[],
    selectedRowsData: ILearner[],
  ) => ToUpdateUser[],
) => {
  /**
   * Removes multiple courses in bulk.
   *
   * @param {CoursesWithDeadline[]} withOutRemovedCourses - The list of courses to be removed.
   * @return {Promise<void>} A promise that resolves when the courses are successfully removed.
   */
  const removeCoursesMass = async (
    withOutRemovedCourses: CoursesWithDeadline[],
  ) => {
    const dataToUpdate = prepareDataToUpdate(
      withOutRemovedCourses,
      selectedRowsData,
    ) as ToUpdateUser[];
    await updateCourses(
      dataToUpdate,
      setIsCourseCardLoading,
      'Курс успешно снят!',
    );
  };
  /**
   * Function to add courses in bulk.
   *
   * @param {CoursesWithDeadline[]} withAddedCourses - The list of courses to be added.
   * @return {Promise<void>} A promise that resolves when the courses are successfully added.
   */
  const addCoursesMass = async (withAddedCourses: CoursesWithDeadline[]) => {
    const dataToUpdate = prepareDataToUpdate(
      withAddedCourses,
      selectedRowsData!,
    ) as ToUpdateUser[];
    await updateCourses(
      dataToUpdate,
      setIsCourseCardLoading,
      'Курс успешно назначен!',
    );
  };

  return { removeCoursesMass, addCoursesMass };
};
