import React, { useMemo } from 'react'
import { Issue, IssueStatus } from '../types';
import IssueCard from './IssueCard';

type IssueColumnProps = {
    status: IssueStatus;
    issues: Issue[];
}

const IssueColumn = ({ status, issues }: IssueColumnProps) => {
    const columnIssue = useMemo(()=> issues.filter((issue)=> issue.status === status ),[]);
    return (
        <div className="column">
            <h2>{status}</h2>
            <ul className="issue-list">
                {columnIssue.length === 0 && (
                    <li>No issue found!</li>
                )}

                {columnIssue.length && columnIssue?.map((issue, idx) => (
                    <li key={idx} className="issue-row">
                        <IssueCard {...issue} />
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default IssueColumn