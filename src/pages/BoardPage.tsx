import React, { useEffect } from 'react';
import IssueColumn from '../components/IssueColumn';
import { ISSUE_STATUSES } from '../constants/currentUser';
import { useIssueStore } from '../store/issueStore';
import { IssueStatus } from '../types';

export const BoardPage = () => {
    const { issues, fetchIssues, loading, error } = useIssueStore();

    useEffect(() => {
        fetchIssues();
    }, [fetchIssues]);
    console.log({issues, loading, error});

    if(loading) {
        return <div>Loading...</div>
    }
    
    return (

        <div className="board-container" style={{ padding: '1rem' }}>
            {ISSUE_STATUSES.map((status: IssueStatus)=> (
                <IssueColumn issues={issues} status={status} key={status} />
            ))}
        </div>
            
    );
};
