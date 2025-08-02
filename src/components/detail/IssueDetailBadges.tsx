import React from 'react';
import { Issue } from '../../types';
import { LABELS, ISSUE_PRIORITY } from '../../constants/strings';
import styles from './IssueDetail.module.css';

interface IssueDetailBadgesProps {
    issue: Issue;
    isEditing: boolean;
    editedIssue: Partial<Issue>;
    onInputChange: (field: keyof Issue, value: any) => void;
}

export const IssueDetailBadges: React.FC<IssueDetailBadgesProps> = ({
    issue,
    isEditing,
    editedIssue,
    onInputChange
}) => {


    return (
        <div className={styles.issueMetaBadges}>
            {isEditing ? (
                <div className={styles.editBadges}>
                    <div className={styles.editField}>
                        <label>{LABELS.PRIORITY}:</label>
                        <select
                            value={editedIssue.priority || ''}
                            onChange={(e) => onInputChange('priority', e.target.value)}
                            className={styles.editSelect}
                        >
                            <option value="low" className={styles.priorityOptionLow}>{ISSUE_PRIORITY.LOW.toUpperCase()}</option>
                            <option value="medium" className={styles.priorityOptionMedium}>{ISSUE_PRIORITY.MEDIUM.toUpperCase()}</option>
                            <option value="high" className={styles.priorityOptionHigh}>{ISSUE_PRIORITY.HIGH.toUpperCase()}</option>
                        </select>
                    </div>
                    <div className={styles.editField}>
                        <label>{LABELS.SEVERITY}:</label>
                        <select
                            value={editedIssue.severity || ''}
                            onChange={(e) => onInputChange('severity', parseInt(e.target.value))}
                            className={styles.editSelect}
                        >
                            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(severity => (
                                <option 
                                    key={severity} 
                                    value={severity}
                                    className={`severity-option-${severity}`}
                                >
                                    {severity}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            ) : (
                <>
                    <div className={`${styles.priorityBadge} priority-${issue.priority}`}>
                        {issue.priority.toUpperCase()}
                    </div>
                    <div className={`${styles.severityBadge} severity-${issue.severity <= 3 ? 'low' : issue.severity <= 6 ? 'high' : issue.severity <= 7 ? 'medium' : 'critical'}`}>
                        {issue.severity}
                    </div>
                </>
            )}
        </div>
    );
}; 