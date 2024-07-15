import { Bounce, toast } from 'react-toastify';
import { mutate } from 'swr';
import { ToUpdateUser, updateAllData } from '../../../app/api/api';
import { CoursesWithDeadline, ILearner } from '../../../app/types/store';

/**
 * Returns an object with two functions: `updateCourses` and `prepareDataToUpdate`.
 *
 * @param {function} setDeadlineDate - A function that sets the deadline date.
 * @return {object} An object with two functions:
 *   - `updateCourses`: An async function that updates courses.
 *     - @param {ToUpdateUser[]} dataToUpdate - An array of users to update.
 *     - @param {function} setLocalLoaderType - A function that sets the local loader type.
 *     - @param {string} message - An optional message to display in a toast.
 *     - @param {number | undefined} newTime - An optional new time in seconds.
 *   - `prepareDataToUpdate`: A function that prepares data to update courses.
 *     - @param {CoursesWithDeadline[]} courses - An array of courses.
 *     - @param {ILearner[]} selectedRowsData - An array of selected rows data.
 * @return {object} An object with two functions:
 *   - `updateCourses`: An async function that updates courses.
 *   - `prepareDataToUpdate`: A function that prepares data to update courses.
 */
export const useUpdateCourses = (setDeadlineDate: (date: string) => void) => {
  /**
   * An asynchronous function that updates courses.
   *
   * @param {ToUpdateUser[]} dataToUpdate - An array of users to update.
   * @param {(prevState: boolean) => void} setLocalLoaderType - A function that sets the local loader type.
   * @param {string} message - An optional message to display in a toast.
   * @param {number | undefined} newTime - An optional new time in seconds.
   */
  const updateCourses = async (
    dataToUpdate: ToUpdateUser[],
    setLocalLoaderType: (prevState: boolean) => void,
    message: string,
    newTime: number | undefined = undefined,
  ) => {
    setLocalLoaderType(true);
    const stringDate = newTime
      ? new Date(newTime * 1000).toLocaleDateString()
      : null;
    const filteredDataToUpdate = dataToUpdate?.filter(
      (user) => user !== null,
    ) as ToUpdateUser[];
    const result = await updateAllData(filteredDataToUpdate);

    mutate('allData').then(() => {
      const toastMessage = message || result[0]?.data?.message;

      toast.success(toastMessage, {
        position: 'top-right',
        autoClose: 1500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: 'colored',
        transition: Bounce,
      });

      stringDate && setDeadlineDate(stringDate!);
      setLocalLoaderType(false);
    });
  };
  /**
   * A function to prepare data for updating courses.
   *
   * @param {CoursesWithDeadline[]} courses - The list of courses with deadlines.
   * @param {ILearner[]} selectedRowsData - Array of selected learners.
   * @return {ToUpdateUser[]} An array of data to update users.
   */
  const prepareDataToUpdate = (
    courses: CoursesWithDeadline[],
    selectedRowsData: ILearner[],
  ) => {
    return selectedRowsData
      .map((user) => {
        if (!user) return null;
        const courseMap: { [id: number]: CoursesWithDeadline } = {};
        courses.forEach((course) => {
          courseMap[course.id] = course;
        });
        const uniqueCourses = Object.values(courseMap);
        return {
          id: user.id,
          courses: uniqueCourses,
        };
      })
      .filter(Boolean) as ToUpdateUser[];
  };

  return { updateCourses, prepareDataToUpdate };
};
