import React, { useEffect, useState } from 'react';
import { DndContext, DragEndEvent, DragOverlay, DragStartEvent } from '@dnd-kit/core';
import IssueColumn from '../components/IssueColumn';
import IssueCard from '../components/IssueCard';
import { FilterSort } from '../components/filter/FilterSort';
import { RecentlyAccessedSidebar } from '../components/RecentlyAccessedSidebar';
import { UserSwitcher } from '../components/UserSwitcher';
import { ISSUE_STATUSES } from '../constants/currentUser';
import { useIssueStore } from '../store/issueStore';
import { useUsersListStore } from '../store/usersListStore';
import { useUserStore } from '../store/userStore';
import { Issue, IssueStatus } from '../types';

export const BoardPage = () => {
    const { issues, fetchIssues, loading, updateIssueStatus } = useIssueStore();
    const { users, fetchUsers } = useUsersListStore();
    const { canMoveIssues } = useUserStore();
    const [activeIssue, setActiveIssue] = useState<Issue | null>(null);
    const [filteredIssues, setFilteredIssues] = useState<Issue[]>(issues);

    useEffect(() => {
        if (users.length === 0) {
            fetchUsers();
        }
    }, [users.length, fetchUsers]);

    useEffect(() => {
        if (issues.length === 0) {
            fetchIssues();
        }
    }, [fetchIssues, issues.length]);

    useEffect(() => {
        setFilteredIssues(issues);
    }, [issues]);

    const handleDragStart = (event: DragStartEvent) => {
        const { active } = event;
        const draggedIssue = issues.find(issue => issue.id === active.id);
        if (draggedIssue) {
            setActiveIssue(draggedIssue);
        }
    };

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        
        if (!canMoveIssues()) {
            setActiveIssue(null);
            return;
        }
        
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
            <div style={{ padding: '1rem', marginRight: '280px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <UserSwitcher />
                </div>
                <FilterSort 
                    issues={issues} 
                    onFilteredIssues={setFilteredIssues} 
                />
                
                <div className="board-container">
                    {ISSUE_STATUSES.map((status: IssueStatus)=> (
                        <IssueColumn 
                            issues={filteredIssues} 
                            status={status} 
                            key={status} 
                        />
                    ))}
                </div>
            </div>
            
            <RecentlyAccessedSidebar />
            
            <DragOverlay>
                {activeIssue ? <IssueCard {...activeIssue} /> : null}
            </DragOverlay>
        </DndContext>
    );
};
