// store.ts

import create from "zustand";
import { UserState, UserActions } from "../../types";

const useStore = create<UserState & UserActions>((set) => ({
  users: [],
  fetchCurrentUserData: () => {
    
  },
  fetchUsers: () => {
    // реализация запроса для получения пользователей
  },
  addUser: (user) => {
    set((state) => ({ users: [...state.users, user] }));
  },
}));

export default useStore;
