// store.ts

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { fetchAllCourses } from '../../services/learners.service';

export type CourseData = {
  id: number;
  title: string;
  description: string;
  type: string;
};

interface CoursesState {
  allCourses: CourseData[];
  setAllCourses: Function;
  selectedCoursesToSave: CourseData[];
  setSelectedCoursesToSave: Function;
}

export const useCourses = create<CoursesState>()(
  devtools((set) => ({
    allCourses: [],
    selectedCoursesToSave: [],
    setSelectedCoursesToSave: (newSelectedCoursesToSave: CourseData[]) =>
      set(
        {
          selectedCoursesToSave: newSelectedCoursesToSave,
        },
        false,
        'setSelectedCoursesToSave',
      ),
    setAllCourses: async () => {
      const response = await fetchAllCourses();

      set({ allCourses: response }, false, 'setAllCourses');
    },
  })),
);
