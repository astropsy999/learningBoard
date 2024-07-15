import { Bounce, toast } from 'react-toastify';
import { ILearner } from '../../../app/types/store';
import { getLearnerIdByName } from '../../../shared/helpers/getLearnerIdByName';
import { getLockedUsersByCourseId } from '../../../shared/helpers/getlockedUsersByCourseId';

/**
 * Custom hook for handling course locking.
 *
 * @param {any[]} selectedRowsData - The selected rows data.
 * @param {string} onlyLearnerName - The name of the only learner.
 * @param {ILearner[]} allLearners - The list of all learners.
 * @param {(lockedLearnersToSend: any[]) => Promise<any>} lockCourses - The function for locking courses.
 * @param {(key: string) => Promise<any>} mutate - The function for mutating data.
 * @param {(locked: boolean) => void} setCourseLocked - The function for setting the course locked state.
 * @param {(loading: boolean) => void} setIsLoading - The function for setting the loading state.
 * @return {{ handleLockUnlock: (e: React.MouseEvent<HTMLLabelElement, MouseEvent>, courseId: number, courseLocked: boolean) => Promise<void> }} - The handleLockUnlock function.
 */
export const useCourseLocking = (
  selectedRowsData: any[],
  onlyLearnerName: string,
  allLearners: ILearner[],
  lockCourses: (lockedLearnersToSend: any[]) => Promise<any>,
  mutate: (key: string) => Promise<any>,
  setCourseLocked: (locked: boolean) => void,
  setIsLoading: (loading: boolean) => void,
) => {
  /**
   * Handles the lock/unlock functionality for a course.
   *
   * @param {React.MouseEvent<HTMLLabelElement, MouseEvent>} e - The event object.
   * @param {number} courseId - The ID of the course.
   * @param {boolean} courseLocked - The current lock state of the course.
   * @return {Promise<void>} A promise that resolves when the lock/unlock operation is complete.
   */
  const handleLockUnlock = async (
    e: React.MouseEvent<HTMLLabelElement, MouseEvent>,
    courseId: number,
    courseLocked: boolean,
  ) => {
    e.stopPropagation();
    setIsLoading(true);

    const learnerId = getLearnerIdByName(onlyLearnerName, allLearners!);
    const allLockedLearners = getLockedUsersByCourseId(courseId, allLearners!);

    const learnersToLockIDs = onlyLearnerName
      ? courseLocked
        ? allLockedLearners.filter((learner) => learner !== learnerId)
        : [...allLockedLearners, learnerId!]
      : courseLocked
      ? []
      : Array.from(
          new Set([
            ...allLockedLearners,
            ...selectedRowsData.map((row) => +row.id!),
          ]),
        );

    const lockedLearnersToSend = [
      {
        id: courseId,
        users: learnersToLockIDs as number[],
      },
    ];

    try {
      const result = await lockCourses(lockedLearnersToSend);
      mutate('allData').then(() => {
        const lockedMessage =
          (courseLocked ? 'Курс разблокирован' : 'Курс заблокирован') ||
          result[0].data.message;

        toast.success(lockedMessage, {
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
        setIsLoading(false);
        setCourseLocked(!courseLocked);
      });
    } catch (error) {
      setIsLoading(false);
    }
  };

  return { handleLockUnlock };
};
