import { create } from 'zustand';
import { Issue, IssueStatus } from '../types';
import { mockFetchIssues, mockUpdateIssue } from '../utils/api';

interface IssueStore {
  issues: Issue[];
  loading: boolean;
  error: string | null;
  lastSyncTime: number | null;
  isPolling: boolean;
  pollingInterval: number;
  fetchIssues: () => Promise<void>;
  updateIssueStatus: (issueId: string, newStatus: IssueStatus) => void;
  updateIssue: (issueId: string, updates: Partial<Issue>) => Promise<void>;
  startPolling: () => void;
  stopPolling: () => void;
  setPollingInterval: (interval: number) => void;
  togglePolling: () => void;
}

export const useIssueStore = create<IssueStore>((set, get) => ({
  issues: [],
  loading: false,
  error: null,
  lastSyncTime: null,
  isPolling: false,
  pollingInterval: 10000,
  
  fetchIssues: async () => {
    set({ loading: true, error: null });
    try {
      const response = await mockFetchIssues();
      const data: Issue[] = response;
      set({ issues: data, loading: false, lastSyncTime: Date.now() });
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
  
  updateIssue: async (issueId: string, updates: Partial<Issue>) => {
    set({ loading: true, error: null });
    try {
      const updatedIssue = await mockUpdateIssue(issueId, updates);
      const { issues } = get();
      const updatedIssues = issues.map(issue => 
        issue.id === issueId ? { ...issue, ...updatedIssue } : issue
      );
      set({ issues: updatedIssues, loading: false });
    } catch (error: any) {
      set({ loading: false, error: error.message || 'Failed to update issue' });
    }
  },
  
  startPolling: () => {
    const { isPolling, pollingInterval } = get();
    if (isPolling) return;
    
    set({ isPolling: true });
    const pollInterval = setInterval(async () => {
      const { fetchIssues } = get();
      await fetchIssues();
    }, pollingInterval);
    
    return () => {
      clearInterval(pollInterval);
      set({ isPolling: false });
    };
  },
  
  stopPolling: () => {
    set({ isPolling: false });
  },
  
  setPollingInterval: (interval: number) => {
    const { isPolling } = get();
    set({ pollingInterval: interval });
    
    if (isPolling) {
      get().stopPolling();
      get().startPolling();
    }
  },
  
  togglePolling: () => {
    const { isPolling } = get();
    if (isPolling) {
      get().stopPolling();
    } else {
      get().startPolling();
    }
  },
}));
