import { create } from 'zustand';
import { Issue, IssueStatus } from '../types';
import { mockFetchIssues } from '../utils/api';


interface IssueStore {
  issues: Issue[];
  loading: boolean;
  error: string | null;
  fetchIssues: () => Promise<void>;
  updateIssueStatus: (issueId: string, newStatus: IssueStatus) => void;
}

export const useIssueStore = create<IssueStore>((set, get) => ({
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
  updateIssueStatus: (issueId: string, newStatus: IssueStatus) => {
    const { issues } = get();
    const updatedIssues = issues.map(issue => 
      issue.id === issueId ? { ...issue, status: newStatus } : issue
    );
    set({ issues: updatedIssues });
  },
}));
