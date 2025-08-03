import { useMemo } from 'react';
import { Issue } from '../types';

export const usePriorityScore = (issue: Issue) => {
    return useMemo(() => {
        const daysSinceCreated = Math.floor((Date.now() - issue.createdAt.valueOf()) / (1000 * 60 * 60 * 24));
        const userDefinedRank = issue.priority === 'high' ? 100 : issue.priority === 'medium' ? 50 : 0;
        return issue.severity * 10 + (daysSinceCreated * -1) + userDefinedRank;
    }, [issue.severity, issue.createdAt, issue.priority]);
};

export const calculatePriorityScore = (issue: Issue): number => {
    const daysSinceCreated = Math.floor((Date.now() - issue.createdAt.valueOf()) / (1000 * 60 * 60 * 24));
    const userDefinedRank = issue.priority === 'high' ? 100 : issue.priority === 'medium' ? 50 : 0;
    return issue.severity * 10 + (daysSinceCreated * -1) + userDefinedRank;
}; 