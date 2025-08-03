import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Issue } from '../types'
import { useUsersListStore } from '../store/usersListStore';
import { useRecentlyAccessedStore } from '../store/recentlyAccessedStore';
import { LABELS } from '../constants/strings';
import styles from "./IssueCard.module.css";

type IssueCardProps = Issue

const IssueCard = React.memo<IssueCardProps>(({title, assignee, createdAt, priority, severity, status, tags, id}) => {
    const navigate = useNavigate();
    const { getUserName } = useUsersListStore();
    const { addRecentlyAccessed } = useRecentlyAccessedStore();

    const assigneeName = useMemo(() => getUserName(assignee), [assignee, getUserName]);

    const handleClick = () => {
        addRecentlyAccessed({ id, title });
        navigate(`/issue/${id}`);
    };

    return (
        <div 
            className={styles.issueCard}
            data-priority={priority}
            onClick={handleClick}
        >
            <div className={styles.cardHeader} data-priority={priority}>
                <div className={styles.priorityIndicator} data-priority={priority}>
                    <div className={styles.priorityDot}></div>
                </div>
                <div className={styles.issueId}>#{id}</div>
            </div>

            <h3 className={styles.title}>
                <span className={styles.issueTitleLink}>{title}</span>
            </h3>

            <div className={styles.metaInfo}>
                <div className={styles.metaRow}>
                    <span className={styles.metaLabel}>{LABELS.ASSIGNEE}</span>
                    <span className={styles.assignee}>
                        <span className={styles.assigneeAvatar}>{assigneeName.charAt(0)}</span>
                        {assigneeName}
                    </span>
                </div>
                <div className={styles.metaRow}>
                    <span className={styles.metaLabel}>{LABELS.SEVERITY}</span>
                    <span className={`${styles.metaValue} ${styles[`severity${severity}`]}`}>
                        {severity}
                    </span>
                </div>
                <div className={styles.metaRow}>
                    <span className={styles.metaLabel}>{LABELS.CREATED}</span>
                    <span className={styles.createdAt}>
                        {createdAt.format('MMM DD, YYYY')}
                    </span>
                </div>
            </div>

            <div className={styles.badges}>
                <span className={`${styles.badge} ${styles.priorityBadge} ${priority}`}>
                    {priority}
                </span>
                <span className={`${styles.badge} ${styles.severityBadge} ${styles[`severity${severity}`]}`}>
                    {severity}
                </span>
            </div>

            {tags.length > 0 && (
                <div className={styles.tags}>
                    {tags.map((tag, index) => (
                        <span key={index} className={styles.tag}>
                            {tag}
                        </span>
                    ))}
                </div>
            )}

            <div className={styles.statusIndicator}>
                <span className={`${styles.statusBadge} ${styles[`status${status.replace(' ', '')}`]}`}>
                    {status}
                </span>
            </div>
        </div>
    );
});

IssueCard.displayName = 'IssueCard';

export default IssueCard;
