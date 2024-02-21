// types.ts

export type User = {
    id: number;
    name: string;
    email: string;
  };
  
  export type UserState = {
    users: User[];
  };
  
  export type UserActions = {
    fetchUsers: () => void;
    addUser: (user: User) => void;
  };
  