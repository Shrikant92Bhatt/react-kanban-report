import React, { useMemo } from 'react'
import { useDroppable } from '@dnd-kit/core';
import { Issue, IssueStatus } from '../types';
import IssueCard from './IssueCard';
import { ISSUE } from '../constants/strings';
import styles from './IssueColumn.module.css';

type IssueColumnProps = {
    status: IssueStatus;
    issues: Issue[];
}

const IssueColumn = ({ status, issues }: IssueColumnProps) => {
    const {setNodeRef, isOver, active} = useDroppable({
        id: status,
    });
    
    const columnIssue = useMemo(()=> issues.filter((issue)=> issue.status === status ),[issues, status]);

    const isValidDrop = useMemo(() => {
        if (!isOver || !active) return false;
        
        const draggedIssue = issues.find(issue => issue.id === active.id);
        if (!draggedIssue) return false;
        
        const currentStatus = draggedIssue.status;
        const targetStatus = status;
        
        if (currentStatus === 'Backlog') {
            return targetStatus === 'In Progress';
        }
        
        if (currentStatus === 'In Progress') {
            return targetStatus === 'Backlog' || targetStatus === 'Done';
        }
        
        if (currentStatus === 'Done') {
            return targetStatus === 'In Progress';
        }
        
        return false;
    }, [isOver, active, issues, status]);

    return (
        <div 
            ref={setNodeRef}
            className={`${styles.column} ${isOver ? (isValidDrop ? styles.dragOverValid : styles.dragOverInvalid) : ''}`}
        >
            <h2>{status}</h2>
            <ul className={styles.issueList}>
                {columnIssue.length === 0 && (
                    <li className={styles.emptyState}>
                        {isOver ? (isValidDrop ? ISSUE.DROP_HERE : ISSUE.INVALID_MOVE) : ISSUE.NO_ISSUE_FOUND}
                    </li>
                )}

                {columnIssue.length > 0 && columnIssue?.map((issue, idx) => (
                    <li key={idx} className={styles.issueRow}>
                        <IssueCard {...issue} />
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default IssueColumn