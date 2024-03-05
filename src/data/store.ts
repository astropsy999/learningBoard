// store.ts

import { create } from 'zustand';
import {
  CurrentUserData,
  ILearner,
  UserActions,
  UserState,
} from './types.store';
import { devtools } from 'zustand/middleware';

export const useUsers = create<UserState & UserActions>()(
  devtools((set) => ({
    users: [],
    CURRENT_USER_DATA: null,
    currentUserName: null,
    allUsers: null,
    ALL_LEARNERS: [],
    allUsersData: null,
    SELECTED_ROWS_DATA: [],
    COURSES_TO_LEARNERS_DIALOG: false,
    filteredLearners: null,
    turnOffDivisionFilter: false,
    setTurnOffDivisionFilter: (filterToggle: boolean) =>
      set({ turnOffDivisionFilter: filterToggle }),
    setFilteredLearners: (newFilteredLearners: ILearner[]) =>
      set({ filteredLearners: newFilteredLearners }),
    setCurrenUserName: (userName: string) => set({ currentUserName: userName }),
    setCurrentUserData: (newCurrentUserData: CurrentUserData) =>
      set({ CURRENT_USER_DATA: newCurrentUserData }),
    setAllUsers: (newAllUsers: any) =>
      set({
        allUsers: newAllUsers,
      }),
    setAllLearners: (newAllLearners: ILearner[]) =>
      set({
        ALL_LEARNERS: newAllLearners,
      }),
    setSelectedRowsDataOnMyLearners: (newSelectedRowsData: []) =>
      set({ SELECTED_ROWS_DATA: newSelectedRowsData }),
    openCoursesDialog: (newDialogData: boolean) =>
      set({
        COURSES_TO_LEARNERS_DIALOG: newDialogData,
      }),
  })),
);
