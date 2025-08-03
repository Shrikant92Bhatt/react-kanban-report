import { Issue, User } from '../types';
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

export const mockFetchUsers = (): Promise<User[]> => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (Math.random() < 0.95) {
                import('../data/issues.json').then(module => {
                    const issues = module.default;
                    
                    const assigneeIds = Array.from(new Set(issues.map(issue => issue.assignee).filter(Boolean)));
                    
                    const users: User[] = assigneeIds.map(assigneeId => {
                        const name = assigneeId.charAt(0).toUpperCase() + assigneeId.slice(1);
                        const firstName = name;
                        const lastName = 'User';
                        const email = `${assigneeId}@company.com`;
                        const avatar = firstName.charAt(0) + lastName.charAt(0);
                        
                        return {
                            id: assigneeId,
                            name: `${firstName} ${lastName}`,
                            email: email,
                            avatar: avatar
                        };
                    });
                    
                    resolve(users);
                });
            } else {
                reject(new Error('Failed to fetch users'));
            }
        }, 300 + Math.random() * 400);
    });
};
