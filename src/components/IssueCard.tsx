import React, { useRef, useState, useEffect } from 'react'
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { useNavigate } from 'react-router-dom';
import { Issue } from '../types'
import { useUserStore } from '../store/userStore';
import { USER, ISSUE, LABELS } from '../constants/strings';
import styles from "./IssueCard.module.css";

type IssueCardProps = Issue

const IssueCard = ({title, assignee, createdAt, priority, severity, status, tags, id}: IssueCardProps) => {
    const navigate = useNavigate();
    const { getUserName, users, fetchUsers } = useUserStore();
    const [assigneeName, setAssigneeName] = useState<string>(assignee || USER.UNASSIGNED);
    const {attributes, listeners, setNodeRef, transform, isDragging} = useDraggable({
        id: id,
        data: { issue: {title, assignee, createdAt, priority, severity, status, tags, id} },
    });

    const getSeverityColor = (severity: number) => {
        if (severity >= 8) return styles.severityCritical;
        if (severity >= 6) return styles.severityHigh;
        if (severity >= 4) return styles.severityMedium;
        return styles.severityLow;
    };

    const formatDate = (date: any) => {
        return date.format('MMM D');
    };

    useEffect(() => {
        // Ensure users are loaded
        if (users.length === 0) {
            fetchUsers();
        }
    }, [users.length, fetchUsers]);

    useEffect(() => {
        if (assignee) {
            const name = getUserName(assignee);
            console.log(`IssueCard: assignee=${assignee}, name=${name}, usersLoaded=${users.length > 0}`);
            setAssigneeName(name);
        } else {
            setAssigneeName(USER.UNASSIGNED);
        }
    }, [assignee, getUserName, users]);

    const style = {
        transform: CSS.Translate.toString(transform),
        opacity: isDragging ? 0.5 : 1,
    };

    const dragStarted = useRef(false);
    const pointerDownPos = useRef<{x:number, y:number} | null>(null);
    const DRAG_THRESHOLD = 5;

    const handlePointerDown = (event: React.PointerEvent) => {
        dragStarted.current = false;
        pointerDownPos.current = { x: event.clientX, y: event.clientY };
    };

    const handlePointerMove = (event: React.PointerEvent) => {
        if (!pointerDownPos.current) return;
        const dx = Math.abs(event.clientX - pointerDownPos.current.x);
        const dy = Math.abs(event.clientY - pointerDownPos.current.y);
        if (dx > DRAG_THRESHOLD || dy > DRAG_THRESHOLD) {
            dragStarted.current = true;
        }
    };

    const handleClick = () => {
        if (!dragStarted.current) {
            navigate(`/issue/${id}`);
        }
    };

    return (
        <div
            ref={setNodeRef}
            className={`${styles.issueCard} ${isDragging ? styles.dragging : ''}`}
            style={style}
            data-priority={priority}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onClick={handleClick}
        >
            {/* Make header draggable by spreading listeners and attributes here */}
            <div
                className={styles.cardHeader}
                data-priority={priority}
                {...listeners}
                {...attributes}
                onPointerDown={(e) => {
                    handlePointerDown(e);
                    listeners?.onPointerDown?.(e);
                }}
            >
                <div className={styles.priorityIndicator} data-priority={priority}>
                    <span className={styles.priorityDot}></span>
                </div>
                <div className={styles.issueId}>{ISSUE.ISSUE_PREFIX}{id}</div>
            </div>
            
            {/* Rest of the card is clickable but not draggable */}
            <h6
                className={`${styles.title} ${styles.issueTitleLink}`}
                onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/issue/${id}`);
                }}
                tabIndex={0}
                onKeyDown={e => {
                    if (e.key === "Enter" || e.key === " ") {
                        e.stopPropagation();
                        navigate(`/issue/${id}`);
                    }
                }}
                style={{ cursor: "pointer" }}
            >
                {title}
            </h6>
            
            <div className={styles.metaInfo}>
                <div className={styles.metaRow}>
                    <span className={styles.metaLabel}>{LABELS.ASSIGNEE}</span>
                    <span className={`${styles.metaValue} ${styles.assignee}`}>{assigneeName}</span>
                </div>
                <div className={styles.metaRow}>
                    <span className={styles.metaLabel}>{LABELS.CREATED}</span>
                    <span className={`${styles.metaValue} ${styles.createdAt}`}>{formatDate(createdAt)}</span>
                </div>
                <div className={styles.metaRow}>
                    <span className={styles.metaLabel}>{LABELS.SEVERITY}</span>
                    <span className={`${styles.metaValue} ${getSeverityColor(severity)}`}>
                        {severity}{ISSUE.SEVERITY_SUFFIX}
                    </span>
                </div>
            </div>
            
            {tags.length > 0 && (
                <div className={styles.tags}>
                    {tags.map((tag) => (
                        <span className={styles.tag} key={`${id}-${tag}`}>
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
    )
}

export default IssueCard
