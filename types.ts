// types.ts

export type User = {
    id: number;
    name: string;
    email: string;
};
export interface AllUserData {
    ID: number,
    Login: string,
    Name: string,
    first_name?: string,
    last_name?: string,
    father_name?: string,
    Email?: string,
    MobileNumber?: string,
    LastActivity?: number,
    Locked: number,
    GDC: number,
    LinkedObjID?: string,
    NameLinkedObjID?: string,
    Position?: string,
    PhotoName?: string,
    learn_show: number,
    TextStatus:string,
    Groups: any[],
    isUserRight: boolean

}

export type AllUsersData = {
  isDel: boolean;
  isEdit: boolean;
  isSU: boolean;
  users: AllUserData[];
}

export type UserState = {
  users: User[];
  allUsers: AllUserData[];
};
  
export type UserActions = {
    getAllUsers: Function;
    addUser: (user: User) => void;
};
  