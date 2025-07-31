import React from 'react'
import { Issue } from '../types'
import "./IssueCard.css";
type IssueCardProps = Issue

const IssueCard = ({title,assignee,createdAt,priority,severity,status,tags,id}: IssueCardProps) => {
    return (
        <div className="issue-card">
            <h6 className="title">{title}</h6>
            <div className="meta">
                <span>Priority: {priority}</span>
                <span>Severity: {severity}</span>
                <span>Assignee: {assignee}</span>
            </div>
            <div className="tags">
                {tags.map((tag)=> <span className="tag" key={`${id}-${tag}`}>{tag}</span>)}
                <span className="tag">bug</span>
                <span className="tag">urgent</span>
            </div>
        </div>

    )
}

export default IssueCard