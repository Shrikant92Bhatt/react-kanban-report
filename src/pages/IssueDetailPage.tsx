import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useIssueStore } from '../store/issueStore';
import { useUserStore } from '../store/userStore';
import { Issue } from '../types';
import { IssueDetailHeader } from '../components/detail/IssueDetailHeader';
import { IssueDetailTitle } from '../components/detail/IssueDetailTitle';
import { IssueDetailBadges } from '../components/detail/IssueDetailBadges';

import { IssueDetailTags } from '../components/detail/IssueDetailTags';
import { IssueDetailActions } from '../components/detail/IssueDetailActions';
import { IssueDetailStatus } from '../components/detail/IssueDetailStatus';
import { IssueDetailInfo } from '../components/detail/IssueDetailInfo';
import { ISSUE } from '../constants/strings';
import styles from '../components/detail/IssueDetail.module.css';

export const IssueDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { issues, fetchIssues, updateIssue, loading, error } = useIssueStore();
    const { getUserName, users, fetchUsers } = useUserStore();
    const [issue, setIssue] = useState<Issue | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editedIssue, setEditedIssue] = useState<Partial<Issue>>({});
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [assigneeName, setAssigneeName] = useState<string>('');

    useEffect(() => {
        const timeout = setTimeout(() => {
            if (isLoading) {
                setIsLoading(false);
            }
        }, 3000); 

        return () => clearTimeout(timeout);
    }, [isLoading]);

    useEffect(() => {
        // Ensure users are loaded
        if (users.length === 0) {
            fetchUsers();
        }
    }, [users.length, fetchUsers]);

    useEffect(() => {
        if (id) {
            if (issues.length > 0) {
                const foundIssue = issues.find(issue => issue.id === id);
                setIssue(foundIssue || null);
                setIsLoading(false);
            } else {
                fetchIssues();
            }
        }
    }, [id, issues, fetchIssues]);

    useEffect(() => {
        if (issue) {
            setEditedIssue({
                title: issue.title,
                status: issue.status,
                priority: issue.priority,
                severity: issue.severity,
                assignee: issue.assignee,
                tags: [...issue.tags]
            });
            
            if (issue.assignee) {
                const name = getUserName(issue.assignee);
                console.log(`IssueDetailPage: assignee=${issue.assignee}, name=${name}, usersLoaded=${users.length > 0}`);
                setAssigneeName(name);
            } else {
                setAssigneeName('Unassigned');
            }
        }
    }, [issue, getUserName, users]);



    const handleInputChange = (field: keyof Issue, value: any) => {
        setEditedIssue(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleTagChange = (index: number, value: string) => {
        const newTags = [...(editedIssue.tags || [])];
        newTags[index] = value;
        setEditedIssue(prev => ({
            ...prev,
            tags: newTags
        }));
    };

    const addTag = () => {
        const newTags = [...(editedIssue.tags || []), ''];
        setEditedIssue(prev => ({
            ...prev,
            tags: newTags
        }));
    };

    const removeTag = (index: number) => {
        const newTags = [...(editedIssue.tags || [])];
        newTags.splice(index, 1);
        setEditedIssue(prev => ({
            ...prev,
            tags: newTags
        }));
    };

    const handleSave = async () => {
        if (!issue) return;
        
        try {
            await updateIssue(issue.id, editedIssue);
            setShowSuccessMessage(true);
            setIsEditing(false);
            
            // Hide success message after 3 seconds
            setTimeout(() => {
                setShowSuccessMessage(false);
            }, 3000);
        } catch (error) {
            console.error('Failed to update issue:', error);
        }
    };

    const handleCancel = () => {
        if (issue) {
            setEditedIssue({
                title: issue.title,
                status: issue.status,
                priority: issue.priority,
                severity: issue.severity,
                assignee: issue.assignee,
                tags: [...issue.tags]
            });
        }
        setIsEditing(false);
    };



    if (isLoading || loading) {
        return (
            <div className="issue-detail-container">
                <div className="loading-spinner">{ISSUE.LOADING}</div>
            </div>
        );
    }

    if (!issue) {
        return (
            <div className="issue-detail-container">
                <div className="error-message">
                    <h2>{ISSUE.ISSUE_NOT_FOUND}</h2>
                    <p>{ISSUE.ISSUE_NOT_EXIST}</p>
                    <button 
                        className="back-button"
                        onClick={() => navigate('/')}
                    >
                        {ISSUE.BACK_TO_BOARD}
                    </button>
                </div>
            </div>
        );
    }



    return (
        <div 
            className={`${styles.issueDetailContainer} issue-detail-container`}
            style={{ padding: '2rem' }}
            data-priority={issue.priority}
        >
            <IssueDetailHeader issue={issue} />

            {showSuccessMessage && (
                <div className="success-message">
                    <span className="success-icon"></span>
                    <span>{ISSUE.UPDATED_SUCCESSFULLY}</span>
                </div>
            )}

            {error && (
                <div className="error-message-inline">
                    <span className="error-icon"></span>
                    <span>{error}</span>
                </div>
            )}

            <div className="issue-detail-content">
                <div className="issue-main-section">
                    <IssueDetailTitle 
                        issue={issue}
                        isEditing={isEditing}
                        editedIssue={editedIssue}
                        onInputChange={handleInputChange}
                    />
                    
                    <IssueDetailBadges 
                        issue={issue}
                        isEditing={isEditing}
                        editedIssue={editedIssue}
                        onInputChange={handleInputChange}
                    />

                    <IssueDetailStatus 
                        issue={issue}
                        isEditing={isEditing}
                        editedIssue={editedIssue}
                        onInputChange={handleInputChange}
                    />

                    <IssueDetailInfo 
                        issue={issue}
                        isEditing={isEditing}
                        editedIssue={editedIssue}
                        onInputChange={handleInputChange}
                        assigneeName={assigneeName}
                    />

                    <IssueDetailTags 
                        issue={issue}
                        isEditing={isEditing}
                        editedIssue={editedIssue}
                        onInputChange={handleInputChange}
                        onTagChange={handleTagChange}
                        onAddTag={addTag}
                        onRemoveTag={removeTag}
                    />
                </div>

                <IssueDetailActions 
                    isEditing={isEditing}
                    onEdit={() => setIsEditing(true)}
                    onSave={handleSave}
                    onCancel={handleCancel}
                    isSaving={loading}
                />
            </div>
        </div>
    );
};
