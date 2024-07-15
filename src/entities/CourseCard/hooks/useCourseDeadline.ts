import { ToUpdateUser } from '../../../app/api/api';
import { CoursesWithDeadline, ILearner } from '../../../app/types/store';

/**
 * Returns an object containing two functions: `handleMassDateChange` and `handleDateChange`.
 *
 * @param {CoursesWithDeadline[]} massAssignedCourses - An array of courses with deadlines.
 * @param {(courses: CoursesWithDeadline[]) => void} setMassAssignedCourses - A function to update the mass assigned courses.
 * @param {ILearner[]} selectedRowsData - An array of selected rows data.
 * @param {(dataToUpdate: ToUpdateUser[], setLocalLoaderType: (prevState: boolean) => void, message: string, newTime?: number) => void} updateCourses - A function to update the courses.
 * @param {(isLoading: boolean) => void} setIsCoursedateLoading - A function to set the loading state of the course date.
 * @param {CoursesWithDeadline[]} selectedCoursesToSave - An array of selected courses to save.
 * @param {(courses: CoursesWithDeadline[]) => void} setSelectedCoursesToSave - A function to update the selected courses to save.
 * @param {boolean} isMassEditMode - A boolean indicating if the mass edit mode is enabled.
 * @return {{ handleMassDateChange: (newTime: number, courseId: number) => Promise<void>, handleDateChange: (newDate: Object | null, itemId: number) => void }} - An object containing the two functions.
 */
export const useCourseDeadline = (
  massAssignedCourses: CoursesWithDeadline[],
  setMassAssignedCourses: (courses: CoursesWithDeadline[]) => void,
  selectedRowsData: ILearner[],
  updateCourses: (
    dataToUpdate: ToUpdateUser[],
    setLocalLoaderType: (prevState: boolean) => void,
    message: string,
    newTime?: number,
  ) => void,
  setIsCoursedateLoading: (isLoading: boolean) => void,
  selectedCoursesToSave: CoursesWithDeadline[],
  setSelectedCoursesToSave: (courses: CoursesWithDeadline[]) => void,
  isMassEditMode: boolean,
) => {
  /**
   * Updates the deadline of a course in the mass assigned courses array and updates the selected rows data.
   *
   * @param {number} newTime - The new deadline value.
   * @param {number} courseId - The ID of the course to update.
   * @return {Promise<void>} A promise that resolves when the update is complete.
   */
  const handleMassDateChange = async (newTime: number, courseId: number) => {
    const updatedMassAssignedCourses = massAssignedCourses.map((course) => {
      if (course.id === courseId) {
        return {
          ...course,
          deadline: newTime,
        };
      }
      return course;
    });

    setMassAssignedCourses(updatedMassAssignedCourses);

    let dataToUpdate = selectedRowsData
      .map((user) => {
        if (!user) return null;
        return {
          id: user.id,
          courses: updatedMassAssignedCourses,
        };
      })
      .filter(Boolean) as ToUpdateUser[];

    await updateCourses(
      dataToUpdate,
      setIsCoursedateLoading,
      'Дата успешно сохранена',
      newTime,
    );
  };

  /**
   * Handles the change of a date.
   *
   * @param {Object | null} newDate - The new date object.
   * @param {number} itemId - The ID of the item.
   * @return {void}
   */
  const handleDateChange = (newDate: Object | null, itemId: number) => {
    // @ts-ignore
    const dateString = newDate!.$d;
    const unixTime = new Date(dateString).getTime() / 1000;

    if (isMassEditMode) {
      handleMassDateChange(unixTime, itemId);
    } else {
      const findedItem = selectedCoursesToSave.find(
        (item) => item.id === itemId,
      );
      findedItem!!['deadline'] = unixTime;
      setSelectedCoursesToSave([...selectedCoursesToSave]);
    }
  };

  return { handleMassDateChange, handleDateChange };
};
