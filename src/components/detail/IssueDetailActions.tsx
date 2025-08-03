import React from 'react';
import { BUTTONS } from '../../constants/strings';
import styles from './IssueDetail.module.css';

interface IssueDetailActionsProps {
    isEditing: boolean;
    onEdit: () => void;
    onSave: () => void;
    onCancel: () => void;
    onMarkAsResolved: () => void;
    isSaving: boolean;
    canEdit: boolean;
    canUpdateStatus: boolean;
    status: string;
}

export const IssueDetailActions: React.FC<IssueDetailActionsProps> = ({
    isEditing,
    onEdit,
    onSave,
    onCancel,
    onMarkAsResolved,
    isSaving,
    canEdit,
    canUpdateStatus,
    status
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
                    {canEdit && (
                        <button
                            className={`${styles.actionButton} ${styles.primary}`}
                            onClick={onEdit}
                        >
                            {BUTTONS.EDIT}
                        </button>
                    )}
                    {canUpdateStatus && status !== 'Done' && (
                        <button
                            className={`${styles.actionButton} ${styles.success}`}
                            onClick={onMarkAsResolved}
                        >
                            Mark as Resolved
                        </button>
                    )}
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