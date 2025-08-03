import { create } from 'zustand';
import { CurrentUser } from '../types';
import { currentUser as defaultUser } from '../constants/currentUser';

interface UserStore {
  currentUser: CurrentUser;
  setCurrentUser: (user: CurrentUser) => void;
  isAdmin: () => boolean;
  isContributor: () => boolean;
  canEditIssues: () => boolean;
  canMoveIssues: () => boolean;
  canUpdateStatus: () => boolean;
}

export const useUserStore = create<UserStore>((set, get) => ({
  currentUser: defaultUser,
  
  setCurrentUser: (user) => {
    set({ currentUser: user });
  },
  
  isAdmin: () => {
    const { currentUser } = get();
    return currentUser.role === 'admin';
  },
  
  isContributor: () => {
    const { currentUser } = get();
    return currentUser.role === 'contributor';
  },
  
  canEditIssues: () => {
    const { currentUser } = get();
    return currentUser.role === 'admin';
  },
  
  canMoveIssues: () => {
    const { currentUser } = get();
    return currentUser.role === 'admin';
  },
  
  canUpdateStatus: () => {
    const { currentUser } = get();
    return currentUser.role === 'admin';
  },
})); 