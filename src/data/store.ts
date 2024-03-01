// store.ts

import { create } from 'zustand';
import { UserActions, UserState } from './types.store';

export const useUsers = create<UserState & UserActions>((set) => ({
  users: [],
  allUsers: null,
  allUsersData: null,
  SELECTED_ROWS_DATA: [],
  COURSES_TO_LEARNERS_DIALOG: false,
  setAllUsers: (newAllUsers: any) =>
    set({
      allUsers: newAllUsers,
    }),
  setSelectedRowsDataOnMyLearners: (newSelectedRowsData: []) =>
    set({ SELECTED_ROWS_DATA: newSelectedRowsData }),
  openCoursesDialog: (newDialogData: boolean) =>
    set({
      COURSES_TO_LEARNERS_DIALOG: newDialogData,
    }),
}));
