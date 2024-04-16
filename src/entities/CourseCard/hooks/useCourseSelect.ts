import { useState } from 'react';

export const useCourseSelect = (
  isMassEditMode: boolean,
  checked: boolean,
  courseItem: any,
  massAssignedCourses: any[],
  selectedCoursesToSave: any[],
  setChecked: (checked: boolean) => void,
  setMassAssignedCourses: (courses: any[]) => void,
  setSelectedCoursesToSave: (courses: any[]) => void,
  addCoursesMass: (withAddedCourses: any[]) => Promise<void>,
  removeCoursesMass: (withOutRemovedCourses: any[]) => Promise<void>,
) => {
  const handleCardSelect = () => {
    const newChecked = !checked;
    setChecked(newChecked);

    if (isMassEditMode) {
      if (!checked) {
        const withAddedCourses = [
          ...massAssignedCourses,
          { id: courseItem.id, deadline: null },
        ];
        setMassAssignedCourses(withAddedCourses);
        addCoursesMass(withAddedCourses);
      } else {
        const withOutRemovedCourses = massAssignedCourses.filter(
          (item) => item.id !== courseItem.id,
        );
        setMassAssignedCourses(withOutRemovedCourses);
        removeCoursesMass(withOutRemovedCourses);
      }
    }

    if (!checked) {
      setSelectedCoursesToSave([
        ...selectedCoursesToSave,
        { ...courseItem, deadline: null },
      ]);
    } else {
      setSelectedCoursesToSave(
        selectedCoursesToSave.filter((item) => item.id !== courseItem.id),
      );
    }
  };

  return { handleCardSelect };
};
