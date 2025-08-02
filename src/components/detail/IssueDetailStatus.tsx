import React from 'react';
import { Issue } from '../../types';
import { LABELS, ISSUE_STATUS } from '../../constants/strings';
import styles from './IssueDetail.module.css';

interface IssueDetailStatusProps {
    issue: Issue;
    isEditing: boolean;
    editedIssue: Partial<Issue>;
    onInputChange: (field: keyof Issue, value: any) => void;
}

export const IssueDetailStatus: React.FC<IssueDetailStatusProps> = ({
    issue,
    isEditing,
    editedIssue,
    onInputChange
}) => {


    return (
        <div className={styles.issueStatusSection}>
            <span className={styles.statusLabel}>{LABELS.STATUS}:</span>
            {isEditing ? (
                <select
                    value={editedIssue.status || ''}
                    onChange={(e) => onInputChange('status', e.target.value)}
                    className={styles.statusSelect}
                >
                    <option value="backlog" className={styles.statusBacklog}>{ISSUE_STATUS.BACKLOG}</option>
                    <option value="in-progress" className={styles.statusInProgress}>{ISSUE_STATUS.IN_PROGRESS}</option>
                    <option value="done" className={styles.statusDone}>{ISSUE_STATUS.DONE}</option>
                </select>
            ) : (
                <div className={`${styles.statusBadge} status-${issue.status}`}>
                    {issue.status.replace('-', ' ').toUpperCase()}
                </div>
            )}
        </div>
    );
}; 