import React from 'react';
import { Issue } from '../../types';
import { LABELS, PLACEHOLDERS } from '../../constants/strings';
import styles from './IssueDetail.module.css';

interface IssueDetailTitleProps {
    issue: Issue;
    isEditing: boolean;
    editedIssue: Partial<Issue>;
    onInputChange: (field: keyof Issue, value: any) => void;
}

export const IssueDetailTitle: React.FC<IssueDetailTitleProps> = ({
    issue,
    isEditing,
    editedIssue,
    onInputChange
}) => {
    return (
        <div className={styles.issueTitleSection}>
            {isEditing ? (
                <div className={styles.editField}>
                    <label>{LABELS.TITLE}:</label>
                    <input
                        type="text"
                        value={editedIssue.title || ''}
                        onChange={(e) => onInputChange('title', e.target.value)}
                        className={`${styles.editInput} ${styles.titleInput}`}
                        placeholder={PLACEHOLDERS.TITLE}
                    />
                </div>
            ) : (
                <h1 className={styles.issueTitle}>{issue.title}</h1>
            )}
        </div>
    );
}; 