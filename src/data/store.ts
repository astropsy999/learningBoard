// store.ts

import { create } from "zustand";
import { UserState, UserActions, AllUserData } from "../../types";


export const useUsers = create<UserState & UserActions>((set) => ({
  users: [],
  allUsers: null,
  fetchCurrentUserData: () => {
    
  },
  getAllUsers: (newAllUsers: AllUserData[]) => set({
    allUsers: newAllUsers
  }),
  addUser: (user) => {
    set((state) => ({ users: [...state.users, user] }));
  },
}));


