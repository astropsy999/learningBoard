// store.ts

import { create } from 'zustand';
import { UserActions, UserState } from './types.store';

export const useUsers = create<UserState & UserActions>((set) => ({
  users: [],
  allUsers: null,
  allUsersData: null,
  fetchCurrentUserData: () => {},
  setAllUsers: (newAllUsers: any) =>
    set({
      allUsers: newAllUsers,
    }),
  addUser: (user) => {
    set((state) => ({ users: [...state.users, user] }));
  },
}));
