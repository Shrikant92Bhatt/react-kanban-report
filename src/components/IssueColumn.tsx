import React, { useMemo } from 'react'
import { useDroppable } from '@dnd-kit/core';
import { Issue, IssueStatus } from '../types';
import IssueCard from './IssueCard';
import { useIssueStore } from '../store/issueStore';

type IssueColumnProps = {
    status: IssueStatus;
    issues: Issue[];
}

const IssueColumn = ({ status, issues }: IssueColumnProps) => {
    const updateIssueStatus = useIssueStore(state => state.updateIssueStatus);
    
    const {setNodeRef, isOver, active} = useDroppable({
        id: status,
    });
    
    const columnIssue = useMemo(()=> issues.filter((issue)=> issue.status === status ),[issues, status]);

    // Check if the current drop is valid using the same logic as BoardPage
    const isValidDrop = useMemo(() => {
        if (!isOver || !active) return false;
        
        const draggedIssue = issues.find(issue => issue.id === active.id);
        if (!draggedIssue) return false;
        
        const currentStatus = draggedIssue.status;
        const targetStatus = status;
        
        // Backlog can only go to In Progress
        if (currentStatus === 'Backlog') {
            return targetStatus === 'In Progress';
        }
        
        // In Progress can go to Backlog or Done
        if (currentStatus === 'In Progress') {
            return targetStatus === 'Backlog' || targetStatus === 'Done';
        }
        
        // Done can only go to In Progress
        if (currentStatus === 'Done') {
            return targetStatus === 'In Progress';
        }
        
        return false;
    }, [isOver, active, issues, status]);

    return (
        <div 
            ref={setNodeRef}
            className={`column ${isOver ? (isValidDrop ? 'drag-over-valid' : 'drag-over-invalid') : ''}`}
        >
            <h2>{status}</h2>
            <ul className="issue-list">
                {columnIssue.length === 0 && (
                    <li className="empty-state">
                        {isOver ? (isValidDrop ? 'Drop here!' : 'Invalid move!') : 'No issue found!'}
                    </li>
                )}

                {columnIssue.length > 0 && columnIssue?.map((issue, idx) => (
                    <li key={idx} className="issue-row">
                        <IssueCard {...issue} />
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default IssueColumn