import { create } from 'zustand';
import { Issue } from '../types';
import { mockFetchIssues } from '../utils/api';


interface IssueStore {
  issues: Issue[];
  loading: boolean;
  error: string | null;
  fetchIssues: () => Promise<void>;
}

export const useIssueStore = create<IssueStore>((set) => ({
  issues: [],
  loading: false,
  error: null,
  fetchIssues: async () => {
    set({ loading: true, error: null });
    try {
      const response = await mockFetchIssues();
      const data: Issue[] = response;
      set({ issues: data, loading: false });
    } catch (error: any) {
      set({ loading: false, error: error.message || 'Failed to fetch issues' });
    }
  },
}));
