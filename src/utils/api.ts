import { Issue } from '../types';
import dayjs from 'dayjs';

export const mockFetchIssues = (): Promise<Issue[]> => {
    return new Promise(resolve => {
        setTimeout(() => {
            import('../data/issues.json').then(module => {
                const issues = module.default.map((issue: any) => ({
                    ...issue,
                    createdAt: dayjs(issue.createdAt)
                })) as Issue[];
                resolve(issues);
            });
        }, 500);
    });
};

export const mockUpdateIssue = (issueId: string, updates: Partial<Issue>): Promise<Issue> => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (Math.random() < 0.9) {
                resolve({id: issueId, ...updates} as Issue);
            } else {
                reject(new Error('Failed to update issue'));
            }
        }, 500);
    });
};
