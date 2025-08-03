import React from 'react';
import dayjs from 'dayjs';
import styles from './SyncStatus.module.css';

interface SyncStatusProps {
  lastSyncTime: number | null;
  loading: boolean;
}

export const SyncStatus: React.FC<SyncStatusProps> = ({ lastSyncTime, loading }) => {
  const formatLastSync = (timestamp: number) => {
    return dayjs(timestamp).format('HH:mm:ss');
  };

  return (
    <div className={styles.syncStatus}>
      <div className={styles.syncIndicator}>
        <div className={`${styles.syncDot} ${loading ? styles.syncing : styles.synced}`}></div>
        <span className={styles.syncText}>
          {loading ? 'Syncing...' : 'Last sync'}
        </span>
      </div>
      {lastSyncTime && !loading && (
        <span className={styles.syncTime}>
          {formatLastSync(lastSyncTime)}
        </span>
      )}
    </div>
  );
}; 