import React, { useEffect } from 'react';
import { useIssueStore } from '../store/issueStore';
import { useUserStore } from '../store/userStore';
import { useUsersListStore } from '../store/usersListStore';
import { UserSwitcher } from '../components/UserSwitcher';
import { SyncStatus } from '../components/SyncStatus';
import dayjs from 'dayjs';
import styles from './SettingsPage.module.css';

export const SettingsPage = () => {
    const { 
        lastSyncTime, 
        loading, 
        isPolling, 
        pollingInterval, 
        setPollingInterval, 
        togglePolling,
        fetchIssues 
    } = useIssueStore();
    
    const { currentUser, canEditIssues } = useUserStore();
    const { users, fetchUsers } = useUsersListStore();

    useEffect(() => {
        if (users.length === 0) {
            fetchUsers();
        }
    }, [users.length, fetchUsers]);

    const handleIntervalChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const interval = parseInt(event.target.value);
        setPollingInterval(interval);
    };

    const handleManualSync = async () => {
        await fetchIssues();
    };

    const formatLastSync = (timestamp: number) => {
        return dayjs(timestamp).format('YYYY-MM-DD HH:mm:ss');
    };

    return (
        <div className={styles.settingsPage}>
            <div className={styles.header}>
                <h1>Settings</h1>
                <div className={styles.headerControls}>
                    <UserSwitcher />
                    <SyncStatus lastSyncTime={lastSyncTime} loading={loading} />
                </div>
            </div>

            <div className={styles.settingsGrid}>
                <div className={styles.settingsSection}>
                    <h2>Real-Time Updates</h2>
                    <div className={styles.settingItem}>
                        <label className={styles.settingLabel}>
                            <input
                                type="checkbox"
                                checked={isPolling}
                                onChange={togglePolling}
                                className={styles.checkbox}
                            />
                            Enable automatic polling
                        </label>
                        <p className={styles.settingDescription}>
                            Automatically fetch updates from the server
                        </p>
                    </div>

                    <div className={styles.settingItem}>
                        <label className={styles.settingLabel}>
                            Polling Interval:
                            <select
                                value={pollingInterval}
                                onChange={handleIntervalChange}
                                className={styles.select}
                                disabled={!isPolling}
                            >
                                <option value={5000}>5 seconds</option>
                                <option value={10000}>10 seconds</option>
                                <option value={30000}>30 seconds</option>
                                <option value={60000}>1 minute</option>
                                <option value={300000}>5 minutes</option>
                            </select>
                        </label>
                    </div>

                    <div className={styles.settingItem}>
                        <button
                            onClick={handleManualSync}
                            disabled={loading}
                            className={styles.button}
                        >
                            {loading ? 'Syncing...' : 'Sync Now'}
                        </button>
                        {lastSyncTime && (
                            <p className={styles.lastSync}>
                                Last sync: {formatLastSync(lastSyncTime)}
                            </p>
                        )}
                    </div>
                </div>

                <div className={styles.settingsSection}>
                    <h2>User Management</h2>
                    <div className={styles.settingItem}>
                        <p className={styles.currentUserInfo}>
                            <strong>Current User:</strong> {currentUser.name}
                        </p>
                        <p className={styles.currentUserInfo}>
                            <strong>Role:</strong> {currentUser.role}
                        </p>
                        <p className={styles.currentUserInfo}>
                            <strong>Permissions:</strong>
                        </p>
                        <ul className={styles.permissionsList}>
                            <li>Move issues: {canEditIssues() ? '✓' : '✗'}</li>
                            <li>Edit issues: {canEditIssues() ? '✓' : '✗'}</li>
                            <li>Update status: {canEditIssues() ? '✓' : '✗'}</li>
                        </ul>
                    </div>
                </div>

                <div className={styles.settingsSection}>
                    <h2>System Information</h2>
                    <div className={styles.settingItem}>
                        <p className={styles.systemInfo}>
                            <strong>Total Users:</strong> {users.length}
                        </p>
                        <p className={styles.systemInfo}>
                            <strong>Polling Status:</strong> {isPolling ? 'Active' : 'Inactive'}
                        </p>
                        <p className={styles.systemInfo}>
                            <strong>Current Interval:</strong> {pollingInterval / 1000} seconds
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};