import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Issue } from '../../types';
import { ISSUE } from '../../constants/strings';
import styles from './IssueDetail.module.css';

interface IssueDetailHeaderProps {
    issue: Issue;
}

export const IssueDetailHeader: React.FC<IssueDetailHeaderProps> = ({ issue }) => {
    const navigate = useNavigate();

    return (
        <div className={styles.issueDetailHeader}>
            <button
                className={styles.backButton}
                onClick={() => navigate('/')}
            >
                ← {ISSUE.BACK_TO_BOARD}
            </button>
            <div className={styles.issueIdLarge}>{ISSUE.ISSUE_PREFIX}{issue.id}</div>
        </div>
    );
}; 