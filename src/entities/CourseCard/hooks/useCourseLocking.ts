import { useState } from 'react';
import { getLearnerIdByName } from '../../../shared/helpers/getLearnerIdByName';
import { getLockedUsersByCourseId } from '../../../shared/helpers/getlockedUsersByCourseId';
import { Bounce, toast } from 'react-toastify';
import { ILearner } from '../../../app/types/store.types';

export const useCourseLocking = (
  selectedRowsData: any[],
  onlyLearnerName: string,
  allLearners: ILearner[],
  lockCourses: (lockedLearnersToSend: any[]) => Promise<any>,
  mutate: (key: string) => Promise<any>,
  setCourseLocked: (locked: boolean) => void,
  setIsLoading: (loading: boolean) => void,
) => {
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
