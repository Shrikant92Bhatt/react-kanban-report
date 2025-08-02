import React from 'react';
import { Issue } from '../../types';
import { LABELS, BUTTONS, PLACEHOLDERS, ISSUE } from '../../constants/strings';
import styles from './IssueDetail.module.css';

interface IssueDetailTagsProps {
    issue: Issue;
    isEditing: boolean;
    editedIssue: Partial<Issue>;
    onInputChange: (field: keyof Issue, value: any) => void;
    onTagChange: (index: number, value: string) => void;
    onAddTag: () => void;
    onRemoveTag: (index: number) => void;
}

export const IssueDetailTags: React.FC<IssueDetailTagsProps> = ({
    issue,
    isEditing,
    editedIssue,
    onInputChange,
    onTagChange,
    onAddTag,
    onRemoveTag
}) => {
    return (
        <div className={styles.tagsSection}>
            <h3>{LABELS.TAGS}</h3>
            {isEditing ? (
                <div className={styles.editTags}>
                    {(editedIssue.tags || []).map((tag, index) => (
                        <div key={index} className={styles.tagInputGroup}>
                            <input
                                type="text"
                                value={tag}
                                onChange={(e) => onTagChange(index, e.target.value)}
                                className={`${styles.editInput} ${styles.tagInput}`}
                                placeholder={PLACEHOLDERS.TAG}
                            />
                            <button
                                className={styles.removeTagBtn}
                                onClick={() => onRemoveTag(index)}
                            >
                                ×
                            </button>
                        </div>
                    ))}
                    <button
                        className={styles.addTagBtn}
                        onClick={onAddTag}
                    >
                        {BUTTONS.ADD_TAG}
                    </button>
                </div>
            ) : (
                <div className={styles.tagsContainer}>
                    {issue.tags.length > 0 ? (
                        issue.tags.map((tag, index) => (
                            <span key={index} className={styles.tag}>
                                {tag}
                            </span>
                        ))
                    ) : (
                        <span className={styles.noTags}>{ISSUE.NO_TAGS}</span>
                    )}
                </div>
            )}
        </div>
    );
}; 