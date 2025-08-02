import React from 'react';
import { BUTTONS } from '../../constants/strings';
import styles from './IssueDetail.module.css';

interface IssueDetailActionsProps {
    isEditing: boolean;
    onEdit: () => void;
    onSave: () => void;
    onCancel: () => void;
    isSaving: boolean;
}

export const IssueDetailActions: React.FC<IssueDetailActionsProps> = ({
    isEditing,
    onEdit,
    onSave,
    onCancel,
    isSaving
}) => {
    return (
        <div className={styles.issueActions}>
            {isEditing ? (
                <>
                    <button
                        className={`${styles.actionButton} ${styles.primary}`}
                        onClick={onSave}
                        disabled={isSaving}
                    >
                        {isSaving ? BUTTONS.SAVING : BUTTONS.SAVE}
                    </button>
                    <button
                        className={`${styles.actionButton} ${styles.secondary}`}
                        onClick={onCancel}
                        disabled={isSaving}
                    >
                        {BUTTONS.CANCEL}
                    </button>
                </>
            ) : (
                <>
                    <button
                        className={`${styles.actionButton} ${styles.primary}`}
                        onClick={onEdit}
                    >
                        {BUTTONS.EDIT}
                    </button>
                    <button
                        className={`${styles.actionButton} ${styles.secondary}`}
                    >
                        {BUTTONS.ADD_COMMENT}
                    </button>
                </>
            )}
        </div>
    );
}; 