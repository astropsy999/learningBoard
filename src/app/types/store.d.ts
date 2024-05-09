// types.ts

export type User = {
  id: number;
  name: string;
  position?: string;
  division?: number;
  courses: CoursesWithDeadline[];
  courses_exclude: number[];
};

export type CoursesWithDeadline = {
  id: number;
  deadline?: number | null;
};

export type Course = {
  id: number;
  title: string;
  description: string;
  type: string;
};

export type Divisions = {
  [key: number]: { name: string; short_name: string };
};

export interface AllUserData {
  ID: number;
  Login: string;
  Name: string;
  first_name?: string;
  last_name?: string;
  father_name?: string;
  Email?: string;
  MobileNumber?: string;
  LastActivity?: number;
  Locked: number;
  GDC: number;
  LinkedObjID?: string;
  NameLinkedObjID?: string;
  Position?: string;
  PhotoName?: string;
  learn_show: number;
  TextStatus: string;
  Groups: any[];
  isUserRight: boolean;
}

export type ManagerData = {
  state: boolean;
  level: number;
};

export type CurrentUserInfo = {
  id: number;
  division: number;
  manager: ManagerData;
  name: string;
};

export interface AllData {
  users: User[];
  courses: Course[];
  divisions: Divisions;
  currentUserInfo: CurrentUserInfo;
}

export type UserState = {
  users: User[];
  allUsers: AllUserData[] | null;
  allLearners: ILearner[] | null;
  currentUserData?: CurrentUserInfo;
  currentUserName?: string | null;
  filteredLearners: ILearner[] | null;
  turnOffDivisionFilter: boolean | null;
  coursesToLearnersDialog: boolean;
  selectedRowsData: ILearner[];
  onlyLearnerName: string;
  allData: AllData | null;
  currentUserDivisionName: string | null;
  divisions: Divisions | null;
  selectedLearnersToLockCourse: string[] | ILearner[];
  isMassEditMode: boolean;
  currentDivisionUsersList: string[];
  // allCourses: Course[] | null;
};

export type UserActions = {
  setAllUsers: Function;
  setSelectedRowsDataOnMyLearners: Function;
  openCoursesDialog: Function;
  setAllLearners: Function;
  setCurrentUserData: Function;
  setFilteredLearners: Function;
  setCurrentUserName: Function;
  setTurnOffDivisionFilter: Function;
  setOnlyLearnerName: Function;
  deSelectAll: () => void;
  setAllData: (data: any) => void;
  setCurrentUserDivisionName: (name: string) => void;
  setDivisions: (newDivisions: Divisions) => void;
  setSelectedLearnersToLockCourse: (
    newSelectedLearnersToLockCourse: string[] | ILearner[],
  ) => void;
  setIsMassEditMode: (value: boolean) => void;
  setCurrentDivisionUsersList: (users: string[]) => void;
};

export interface ILearner {
  id?: number;
  name?: string;
  position?: string;
  division?: string;
  courses?: CoursesWithDeadline[];
  courses_exclude?: number[];
}

export interface CurrentUserData {
  id: number;
  name: string;
  division: Divisions;
  manager: ManagerData;
  last_name?: string;
  father_name?: string;
  Email?: string;
  MobileNumber?: string;
  LastActivity: number;
  Locked?: null;
  GDC: number;
  LinkedObjID: string;
  NameLinkedObjID: string;
  Position?: string;
  PhotoName?: string;
  learn_show?: number;
}

export type SelectedRowData = {
  id: number;
  name: string;
  position?: string;
  division?: string;
  access?: string;
  courses: CoursesWithDeadline[];
  courses_exclude: number[];
  isDelLoading: boolean;
};
