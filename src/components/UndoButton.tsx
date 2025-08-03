import React from 'react';
import { useIssueStore } from '../store/issueStore';
import styles from './UndoButton.module.css';

export const UndoButton: React.FC = () => {
    const { canUndo, undoLastAction } = useIssueStore();

    if (!canUndo) {
        return null;
    }

    return (
        <button
            onClick={undoLastAction}
            className={styles.undoButton}
            title="Undo last action (5 seconds)"
        >
            ↶ Undo
        </button>
    );
}; 