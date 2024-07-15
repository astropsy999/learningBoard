import { ILearner } from '../../../app/types/store';

export const useSelectedRowsData = (
  isMassEditMode: boolean,
  selectedRowsData: ILearner[],
) => {
  /**
   * Checks if every selected user has locked the course with the given courseId.
   *
   * @param {number} courseId - The ID of the course to check.
   * @return {boolean} Returns true if every selected user has locked the course, false otherwise.
   */
  const everySelectedUsersHaveLockedThisCourse = (courseId: number) =>
    isMassEditMode
      ? selectedRowsData?.every((item) => {
          return item?.courses_exclude?.some((course) => course === courseId);
        })
      : false;

  /**
   * Checks if every selected user has assigned the course with the given courseId.
   *
   * @param {number} courseId - The ID of the course to check.
   * @return {boolean} Returns true if every selected user has assigned the course, false otherwise.
   */
  const everySelectedUsersHaveAssignedThisCourse = (courseId: number) =>
    isMassEditMode
      ? selectedRowsData.every((item) =>
          item?.courses?.some((course) => +Object.keys(course)[0] === courseId),
        )
      : false;

  /**
   * Returns the deadline of the first course with the given courseId from the selectedRowsData.
   *
   * @param {number} courseId - The ID of the course to find.
   * @return {number | undefined} The deadline of the first course with the given courseId, or undefined if not found.
   */
  const everyDate = (courseId: number) => {
    return selectedRowsData.map((item) => {
      return item?.courses?.find(
        (course) => +Object.keys(course)[0] === courseId,
      )?.deadline;
    })[0];
  };

  return {
    everySelectedUsersHaveLockedThisCourse,
    everySelectedUsersHaveAssignedThisCourse,
    everyDate,
  };
};
