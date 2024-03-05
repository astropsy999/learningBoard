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
}

export const useCourses = create<CoursesState>()(
  devtools((set) => ({
    allCourses: [],
    setAllCourses: async () => {
      const response = await fetchAllCourses();
      console.log('🚀 ~ setAllCourses: ~ response:', response);
      set({ allCourses: response });
    },
  })),
);
