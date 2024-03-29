import { create } from 'zustand';
import {
  CurrentUserData,
  CurrentUserInfo,
  Divisions,
  ILearner,
  UserActions,
  UserState,
} from '../types.store';
import { devtools } from 'zustand/middleware';

export const useLearners = create<UserState & UserActions>()(
  devtools((set) => ({
    users: [],
    allData: null,
    currentUserData: undefined,
    currentUserDivisionName: null,
    currentUserName: null,
    allUsers: null,
    allLearners: null,
    allUsersData: null,
    selectedRowsData: [],
    coursesToLearnersDialog: false,
    filteredLearners: null,
    turnOffDivisionFilter: false,
    onlyLearnerName: '',
    divisions: null,
    selectedLearnersToLockCourse: [],

    setSelectedLearnersToLockCourse: (
      newSelectedLearnersToLockCourse: string[] | ILearner[],
    ) =>
      set(
        { selectedLearnersToLockCourse: newSelectedLearnersToLockCourse },
        false,
        'setSelectedLearnersToLockCourse',
      ),

    setDivisions: (newDivisions: Divisions) =>
      set({ divisions: newDivisions }, false, 'setDivisions'),
    setCurrentUserDivisionName: (name: string) =>
      set(
        { currentUserDivisionName: name },
        false,
        'setCurrentUserDivisionName',
      ),
    setAllData: (data: any) => set({ allData: data }, false, 'setAllData'),
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
    setCurrentUserName: (userName: string) =>
      set({ currentUserName: userName }),
    setCurrentUserData: (newCurrentUserData: CurrentUserInfo): void =>
      set({ currentUserData: newCurrentUserData }, false, 'setCurrentUserData'),
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
          allLearners: newAllLearners,
        },
        false,
        'setAllLearners',
      ),
    setSelectedRowsDataOnMyLearners: (newSelectedRowsData: []) =>
      set({ selectedRowsData: newSelectedRowsData }),
    openCoursesDialog: (newDialogData: boolean) =>
      set(
        {
          coursesToLearnersDialog: newDialogData,
        },
        false,
        'openCoursesDialog',
      ),
    deSelectAll: () => {
      const checkbox = document.querySelector(
        'input.PrivateSwitchBase-input',
      ) as HTMLInputElement;

      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      checkbox?.checked ? checkbox?.click() : null;
    },
  })),
);
