import React from 'react'
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { Issue } from '../types'
import "./IssueCard.css";

type IssueCardProps = Issue

const IssueCard = ({title, assignee, createdAt, priority, severity, status, tags, id}: IssueCardProps) => {
    const {attributes, listeners, setNodeRef, transform, isDragging} = useDraggable({
        id: id,
        data: {
            issue: {title, assignee, createdAt, priority, severity, status, tags, id}
        }
    });

    const getSeverityColor = (severity: number) => {
        if (severity >= 8) return 'severity-critical';
        if (severity >= 6) return 'severity-high';
        if (severity >= 4) return 'severity-medium';
        return 'severity-low';
    };

    const formatDate = (date: any) => {
        return date.format('MMM D');
    };

    const style = {
        transform: CSS.Translate.toString(transform),
        opacity: isDragging ? 0.5 : 1,
    };

    return (
        <div 
            ref={setNodeRef}
            style={style}
            {...listeners}
            {...attributes}
            className={`issue-card ${isDragging ? 'dragging' : ''}`}
        >
            {/* Header with priority and title */}
            <div className="card-header">
                <div className="priority-indicator" data-priority={priority}>
                    <span className="priority-dot"></span>
                </div>
                <div className="issue-id">ISSUE-{id}</div>
            </div>
            
            {/* Title */}
            <h6 className="title">{title}</h6>
            
            {/* Meta information */}
            <div className="meta-info">
                <div className="meta-row">
                    <span className="meta-label">Assignee:</span>
                    <span className="meta-value assignee">{assignee || 'Unassigned'}</span>
                </div>
                <div className="meta-row">
                    <span className="meta-label">Created:</span>
                    <span className="meta-value">{formatDate(createdAt)}</span>
                </div>
                <div className="meta-row">
                    <span className="meta-label">Severity:</span>
                    <span className={`meta-value ${getSeverityColor(severity)}`}>
                        {severity}/10
                    </span>
                </div>
            </div>
            
            {/* Tags */}
            {tags.length > 0 && (
                <div className="tags-container">
                    {tags.map((tag) => (
                        <span className="tag" key={`${id}-${tag}`}>
                            {tag}
                        </span>
                    ))}
                </div>
            )}
            
            {/* Status indicator */}
            <div className="status-indicator">
                <span className={`status-badge status-${status.toLowerCase().replace(' ', '-')}`}>
                    {status}
                </span>
            </div>
        </div>
    )
}

export default IssueCard