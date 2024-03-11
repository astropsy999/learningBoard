// types.ts

export type User = {
  id: number;
  name: string;
  position?: string;
  division?: number;
  courses: number[];
};

export type Course = {
  id: number;
  title: string;
  description: string;
  type: string;
}

export type Divisions = {
  [key: number]: string;
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

export type AllUsersData = {
  isDel: boolean;
  isEdit: boolean;
  isSU: boolean;
  users: AllUserData[];
};

export interface AllData {
  users: User[];
  courses: Course[];
  divisions: Divisions
}

export type UserState = {
  users: User[];
  allUsers: AllUserData[] | null;
  allUsersData: AllUsersData | null;
  ALL_LEARNERS: ILearner[];
  CURRENT_USER_DATA: CurrentUserData | null;
  currentUserName?: string | null;
  filteredLearners: ILearner[] | null;
  turnOffDivisionFilter: boolean | null;
  COURSES_TO_LEARNERS_DIALOG: boolean;
  SELECTED_ROWS_DATA: ILearner[];
  onlyLearnerName: string;
  allData: AllData | null;
};

export type UserActions = {
  setAllUsers: Function;
  setSelectedRowsDataOnMyLearners: Function;
  openCoursesDialog: Function;
  setAllLearners: Function;
  setCurrentUserData: Function;
  setFilteredLearners: Function;
  setCurrenUserName: Function;
  setTurnOffDivisionFilter: Function;
  setOnlyLearnerName: Function;
  deSelectAll: () => void;
  setAllData: (data: any) => void
};

export interface ILearner {
  id: number;
  name: string;
  email?: string;
  age?: number;
  phone?: string;
  position: string;
  division: string;
  courses: string[];
}

export interface CurrentUserData {
  ID: number;
  Login: string;
  Name?: string;
  first_name?: string;
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
