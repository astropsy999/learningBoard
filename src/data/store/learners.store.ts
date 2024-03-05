// store.ts

import { create } from 'zustand';
import {
  CurrentUserData,
  ILearner,
  UserActions,
  UserState,
} from '../types.store';
import { devtools } from 'zustand/middleware';

export const useLearners = create<UserState & UserActions>()(
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
    onlyLearnerName: '',
    setOnlyLearnerName: (name: string) => set({ onlyLearnerName: name }),
    setTurnOffDivisionFilter: (filterToggle: boolean): void =>
      set(
        { turnOffDivisionFilter: filterToggle },
        false,
        'setTurnOffDivisionFilter',
      ),
    setFilteredLearners: (newFilteredLearners: ILearner[]): void =>
      set(
        { filteredLearners: newFilteredLearners },
        false,
        'setFilteredLearners',
      ),
    setCurrenUserName: (userName: string) => set({ currentUserName: userName }),
    setCurrentUserData: (newCurrentUserData: CurrentUserData): void =>
      set(
        { CURRENT_USER_DATA: newCurrentUserData },
        false,
        'setCurrentUserData',
      ),
    setAllUsers: (newAllUsers: any) =>
      set(
        {
          allUsers: newAllUsers,
        },
        false,
        'setAllUsers',
      ),
    setAllLearners: (newAllLearners: ILearner[]) =>
      set(
        {
          ALL_LEARNERS: newAllLearners,
        },
        false,
        'setAllLearners',
      ),
    setSelectedRowsDataOnMyLearners: (newSelectedRowsData: []) =>
      set({ SELECTED_ROWS_DATA: newSelectedRowsData }),
    openCoursesDialog: (newDialogData: boolean) =>
      set(
        {
          COURSES_TO_LEARNERS_DIALOG: newDialogData,
        },
        false,
        'openCoursesDialog',
      ),
  })),
);
