// store.ts

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

export type CourseData = {
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
}

interface CoursesState {
  allCourses: CourseData[] | null;
  setAllCourses: Function;
  selectedCoursesToSave: CourseData[];
  setSelectedCoursesToSave: Function;
  singleSelectedUserCourses: CourseData[];
  selectedCoursesWithDeadlineToSave: CourseToSaveWithDeadline[];
  setSelectedCoursesWithDeadlineToSave: Function;
}



export const useCourses = create<CoursesState>()(
  devtools((set) => ({
    allCourses: null,
    selectedCoursesToSave: [],
    singleSelectedUserCourses: [],
    selectedCoursesWithDeadlineToSave: [],
    setSingleSelectedUserCourses: (newSingleSelectedUserCourses: CourseData[]) => set({
      singleSelectedUserCourses: newSingleSelectedUserCourses
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
    setSelectedCoursesWithDeadlineToSave: (newSelectedCoursesWithDeadlineToSave: CourseToSaveWithDeadline[]) => 
      set({ selectedCoursesWithDeadlineToSave: newSelectedCoursesWithDeadlineToSave }, 
        false, 
        'setSelectedCoursesWithDeadlineToSave'
      ),
  })),
    
);
