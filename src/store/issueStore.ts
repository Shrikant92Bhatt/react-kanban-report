import { create } from 'zustand';
import { toast } from 'react-toastify';
import { Issue, IssueStatus } from '../types';
import { mockFetchIssues, mockUpdateIssue } from '../utils/api';

interface IssueHistory {
  issues: Issue[];
  timestamp: number;
  action: string;
  issueId?: string;
  previousStatus?: IssueStatus;
  newStatus?: IssueStatus;
}

interface IssueStore {
  issues: Issue[];
  loading: boolean;
  error: string | null;
  lastSyncTime: number | null;
  isPolling: boolean;
  pollingInterval: number;
  history: IssueHistory[];
  canUndo: boolean;
  fetchIssues: () => Promise<void>;
  updateIssueStatus: (issueId: string, newStatus: IssueStatus) => void;
  updateIssue: (issueId: string, updates: Partial<Issue>) => Promise<void>;
  undoLastAction: () => void;
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
  history: [],
  canUndo: false,
  
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
    const { issues, history } = get();
    const currentIssue = issues.find(issue => issue.id === issueId);
    
    if (!currentIssue || currentIssue.status === newStatus) return;
    
    // Save current state to history
    const historyEntry: IssueHistory = {
      issues: [...issues],
      timestamp: Date.now(),
      action: 'status_change',
      issueId,
      previousStatus: currentIssue.status,
      newStatus
    };
    
    // Optimistically update UI
    const updatedIssues = issues.map(issue => 
      issue.id === issueId ? { ...issue, status: newStatus } : issue
    );
    
    set({ 
      issues: updatedIssues,
      history: [...history, historyEntry],
      canUndo: true
    });
    
    // Show success toast
    toast.success(`Issue moved to ${newStatus}`, {
      position: "top-right",
      autoClose: 2000,
    });
    
    // Auto-remove history entry after 5 seconds
    setTimeout(() => {
      const { history: currentHistory } = get();
      const filteredHistory = currentHistory.filter(entry => entry.timestamp !== historyEntry.timestamp);
      set({ 
        history: filteredHistory,
        canUndo: filteredHistory.length > 0
      });
      
      // Show warning toast when undo expires
      if (filteredHistory.length < currentHistory.length) {
        toast.info("Undo expired", {
          position: "top-right",
          autoClose: 2000,
        });
      }
    }, 5000);
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
      toast.success("Issue updated successfully", {
        position: "top-right",
        autoClose: 2000,
      });
    } catch (error: any) {
      set({ loading: false, error: error.message || 'Failed to update issue' });
      toast.error("Failed to update issue", {
        position: "top-right",
        autoClose: 3000,
      });
    }
  },
  
  undoLastAction: () => {
    const { history, issues } = get();
    if (history.length === 0) return;
    
    const lastAction = history[history.length - 1];
    const remainingHistory = history.slice(0, -1);
    
    if (lastAction.action === 'status_change' && lastAction.previousStatus) {
      const revertedIssues = issues.map(issue => 
        issue.id === lastAction.issueId 
          ? { ...issue, status: lastAction.previousStatus! }
          : issue
      );
      
      set({ 
        issues: revertedIssues,
        history: remainingHistory,
        canUndo: remainingHistory.length > 0
      });
      
      // Show undo success toast
      toast.success("Action undone", {
        position: "top-right",
        autoClose: 2000,
      });
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
