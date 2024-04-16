import { useState } from 'react';
import { CoursesWithDeadline, ILearner } from '../../../app/types/store.types';
import { ToUpdateUser } from '../../../app/api/api';

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
