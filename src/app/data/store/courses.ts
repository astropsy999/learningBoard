// store.ts

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { CoursesWithDeadline } from '../../types/types.store';

export type CourseData = {
  id: number;
  title: string;
  description?: string;
  type?: string;
  deadline?: number;
};

export type CourseCategoryData = {
  id: number;
  title: string;
};

export type CourseRowData = {
  category: CourseCategoryData;
  id: number;
  title: string;
  description?: string;
  type?: string;
  deadline?: number;
};

export type CourseToSaveWithDeadline = {
  id: number;
  title: string;
  description?: string;
  type?: string;
  deadline?: number;
};

interface CoursesState {
  allCourses: CourseData[] | null;
  setAllCourses: Function;
  selectedCoursesToSave: CourseData[];
  assignedCourses: CoursesWithDeadline[];
  massAssignedCourses: CoursesWithDeadline[];
  setSelectedCoursesToSave: Function;
  singleSelectedUserCourses: CourseData[];
  selectedCoursesWithDeadlineToSave: CourseToSaveWithDeadline[];
  setSelectedCoursesWithDeadlineToSave: Function;
  setAssignedCourses: Function;
  setMassAssignedCourses: Function;
}

export const useCourses = create<CoursesState>()(
  devtools((set) => ({
    allCourses: null,
    selectedCoursesToSave: [],
    singleSelectedUserCourses: [],
    selectedCoursesWithDeadlineToSave: [],
    assignedCourses: [],
    massAssignedCourses: [],
    setMassAssignedCourses: (newMassAssignedCourses: CoursesWithDeadline[]) =>
      set(
        {
          massAssignedCourses: newMassAssignedCourses,
        },
        false,
        'setMassAssignedCourses',
      ),
    setSingleSelectedUserCourses: (
      newSingleSelectedUserCourses: CourseData[],
    ) =>
      set({
        singleSelectedUserCourses: newSingleSelectedUserCourses,
      }),
    setSelectedCoursesToSave: (newSelectedCoursesToSave: CourseData[]) =>
      set(
        {
          selectedCoursesToSave: newSelectedCoursesToSave,
        },
        false,
        'setSelectedCoursesToSave',
      ),
    setAllCourses: (newAllCourses: CourseData[]) =>
      set(
        {
          allCourses: newAllCourses,
        },
        false,
        'setAllCourses',
      ),
    setSelectedCoursesWithDeadlineToSave: (
      newSelectedCoursesWithDeadlineToSave: CourseToSaveWithDeadline[],
    ) =>
      set(
        {
          selectedCoursesWithDeadlineToSave:
            newSelectedCoursesWithDeadlineToSave,
        },
        false,
        'setSelectedCoursesWithDeadlineToSave',
      ),
    setAssignedCourses: (newAssignedCourses: CoursesWithDeadline[]) =>
      set(
        {
          assignedCourses: newAssignedCourses,
        },
        false,
        'setAssignedCourses',
      ),
  })),
);
