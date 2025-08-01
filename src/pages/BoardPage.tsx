import React, { useEffect } from 'react';
import { DndContext, DragEndEvent, DragOverlay, DragStartEvent } from '@dnd-kit/core';
import { useState } from 'react';
import IssueColumn from '../components/IssueColumn';
import IssueCard from '../components/IssueCard';
import { ISSUE_STATUSES } from '../constants/currentUser';
import { useIssueStore } from '../store/issueStore';
import { IssueStatus, Issue } from '../types';

export const BoardPage = () => {
    const { issues, fetchIssues, loading, updateIssueStatus } = useIssueStore();
    const [activeIssue, setActiveIssue] = useState<Issue | null>(null);

    useEffect(() => {
        fetchIssues();
    }, [fetchIssues]);

    const handleDragStart = (event: DragStartEvent) => {
        const { active } = event;
        const draggedIssue = issues.find(issue => issue.id === active.id);
        if (draggedIssue) {
            setActiveIssue(draggedIssue);
        }
    };

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        
        if (over && active.id !== over.id) {
            const issueId = active.id as string;
            const newStatus = over.id as IssueStatus;
            const currentIssue = issues.find(issue => issue.id === issueId);
            
            if (currentIssue && currentIssue.status !== newStatus) {
                const isValidMove = isValidStatusTransition(currentIssue.status, newStatus);
                
                if (isValidMove) {
                    updateIssueStatus(issueId, newStatus);
                }
            }
        }
        
        setActiveIssue(null);
    };

    const isValidStatusTransition = (currentStatus: IssueStatus, newStatus: IssueStatus): boolean => {
        if (currentStatus === 'Backlog') {
            return newStatus === 'In Progress';
        }
        
        if (currentStatus === 'In Progress') {
            return newStatus === 'Backlog' || newStatus === 'Done';
        }
        
        if (currentStatus === 'Done') {
            return newStatus === 'In Progress';
        }
        
        return false;
    };

    if(loading) {
        return <div>Loading...</div>
    }
    
    return (
        <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
            <div className="board-container" style={{ padding: '1rem' }}>
                {ISSUE_STATUSES.map((status: IssueStatus)=> (
                    <IssueColumn issues={issues} status={status} key={status} />
                ))}
            </div>
            
            <DragOverlay>
                {activeIssue ? <IssueCard {...activeIssue} /> : null}
            </DragOverlay>
        </DndContext>
    );
};
