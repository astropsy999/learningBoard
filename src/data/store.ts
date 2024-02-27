// store.ts

import { create } from 'zustand';
import { UserState, UserActions, AllUserData, AllUsersData } from '../../types';

export const useUsers = create<UserState & UserActions>((set) => ({
  users: [],
  allUsers: null,
  allUsersData: null,
  fetchCurrentUserData: () => {},
  getAllUsers: (newAllUsers: AllUsersData) =>
    set({
      allUsersData: newAllUsers,
    }),
  addUser: (user) => {
    set((state) => ({ users: [...state.users, user] }));
  },
}));
