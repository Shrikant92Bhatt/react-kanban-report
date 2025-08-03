import { create } from 'zustand';
import { RecentlyAccessedIssue } from '../types';

interface RecentlyAccessedStore {
  recentlyAccessed: RecentlyAccessedIssue[];
  addRecentlyAccessed: (issue: { id: string; title: string }) => void;
  clearRecentlyAccessed: () => void;
  loadFromStorage: () => void;
}

const STORAGE_KEY = 'recentlyAccessedIssues';
const MAX_RECENT_ISSUES = 5;

export const useRecentlyAccessedStore = create<RecentlyAccessedStore>((set, get) => ({
  recentlyAccessed: [],
  
  addRecentlyAccessed: (issue) => {
    const { recentlyAccessed } = get();
    const now = Date.now();
    
    const filtered = recentlyAccessed.filter(item => item.id !== issue.id);
    const updated = [
      { ...issue, accessedAt: now },
      ...filtered
    ].slice(0, MAX_RECENT_ISSUES);
    
    set({ recentlyAccessed: updated });
    
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (error) {
      console.warn('Failed to save recently accessed issues to localStorage:', error);
    }
  },
  
  clearRecentlyAccessed: () => {
    set({ recentlyAccessed: [] });
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.warn('Failed to clear recently accessed issues from localStorage:', error);
    }
  },
  
  loadFromStorage: () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        set({ recentlyAccessed: parsed });
      }
    } catch (error) {
      console.warn('Failed to load recently accessed issues from localStorage:', error);
    }
  },
})); 