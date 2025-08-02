import React from 'react';
import dayjs from 'dayjs';
import { Issue } from '../../types';
import { UserDropdown } from '../UserDropdown';
import { LABELS, USER } from '../../constants/strings';
import styles from './IssueDetail.module.css';

interface IssueDetailInfoProps {
    issue: Issue;
    isEditing: boolean;
    editedIssue: Partial<Issue>;
    onInputChange: (field: keyof Issue, value: any) => void;
    assigneeName: string;
}

export const IssueDetailInfo: React.FC<IssueDetailInfoProps> = ({
    issue,
    isEditing,
    editedIssue,
    onInputChange,
    assigneeName
}) => {


    const formatDate = (date: any) => {
        if (!date) return 'N/A';
        return dayjs(date).format('MMMM D, YYYY');
    };

    return (
        <div className={styles.issueInfoGrid}>
            <div className={styles.infoCard} data-priority={issue.priority}>
                <h3>{LABELS.ASSIGNEE}</h3>
                {isEditing ? (
                    <UserDropdown
                        value={editedIssue.assignee || ''}
                        onChange={(userId) => onInputChange('assignee', userId)}
                        placeholder={USER.SELECT_ASSIGNEE}
                    />
                ) : (
                    <p className={styles.assigneeName}>{assigneeName}</p>
                )}
            </div>

            <div className={styles.infoCard} data-priority={issue.priority}>
                <h3>{LABELS.PRIORITY}</h3>
                <p className={`${styles.priorityText} priority-${issue.priority}`}>
                    {issue.priority.toUpperCase()}
                </p>
            </div>

            <div className={styles.infoCard} data-priority={issue.priority}>
                <h3>{LABELS.SEVERITY}</h3>
                <p className={`${styles.severityText} severity-${issue.severity <= 3 ? 'low' : issue.severity <= 6 ? 'high' : issue.severity <= 7 ? 'medium' : 'critical'}`}>
                    {issue.severity}
                </p>
            </div>

            <div className={styles.infoCard} data-priority={issue.priority}>
                <h3>{LABELS.CREATED}</h3>
                <p>{formatDate(issue.createdAt)}</p>
            </div>
        </div>
    );
}; 