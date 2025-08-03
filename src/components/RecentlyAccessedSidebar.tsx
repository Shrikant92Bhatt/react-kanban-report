import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRecentlyAccessedStore } from '../store/recentlyAccessedStore';
import styles from './RecentlyAccessedSidebar.module.css';

export const RecentlyAccessedSidebar: React.FC = () => {
  const { recentlyAccessed, loadFromStorage, clearRecentlyAccessed } = useRecentlyAccessedStore();
  const navigate = useNavigate();

  useEffect(() => {
    loadFromStorage();
  }, [loadFromStorage]);

  const handleIssueClick = (issueId: string) => {
    navigate(`/issue/${issueId}`);
  };

  const formatTimeAgo = (timestamp: number) => {
    const now = Date.now();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  if (recentlyAccessed.length === 0) {
    return (
      <div className={styles.sidebar}>
        <div className={styles.header}>
          <h3>Recently Accessed</h3>
        </div>
        <div className={styles.emptyState}>
          <p>No recently accessed issues</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.sidebar}>
      <div className={styles.header}>
        <h3>Recently Accessed</h3>
        <button 
          onClick={clearRecentlyAccessed}
          className={styles.clearButton}
          title="Clear history"
        >
          ×
        </button>
      </div>
      <div className={styles.issueList}>
        {recentlyAccessed.map((issue) => (
          <div
            key={issue.id}
            className={styles.issueItem}
            onClick={() => handleIssueClick(issue.id)}
          >
            <div className={styles.issueTitle}>{issue.title}</div>
            <div className={styles.issueTime}>
              {formatTimeAgo(issue.accessedAt)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}; 