import { useState } from 'react';
import { SelectedRowData } from '../../../pages/LearnersList';
import { ILearner } from '../../../app/types/store.types';

export const useSelectedRowsData = (
  isMassEditMode: boolean,
  selectedRowsData: ILearner[],
) => {
  const everySelectedUsersHaveLockedThisCourse = (courseId: number) =>
    isMassEditMode
      ? selectedRowsData?.every((item) => {
          return item?.courses_exclude?.some((course) => course === courseId);
        })
      : false;

  const everySelectedUsersHaveAssignedThisCourse = (courseId: number) =>
    isMassEditMode
      ? selectedRowsData.every((item) =>
          item?.courses?.some((course) => +Object.keys(course)[0] === courseId),
        )
      : false;

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
