import { Dayjs } from 'dayjs';

export type IssueStatus = 'Backlog' | 'In Progress' | 'Done';
export type IssuePriority = 'low' | 'medium' | 'high';
export type UserRole = 'admin' | 'contributor';

export interface User {
    id: string;
    name: string;
    email: string;
    avatar: string;
}

export interface CurrentUser {
    name: string;
    role: UserRole;
}

export interface Issue {
    id: string;
    title: string;
    status: IssueStatus;
    priority: IssuePriority;
    severity: number;
    createdAt: Dayjs;
    assignee: string;
    tags: Array<string>;
}

export interface RecentlyAccessedIssue {
    id: string;
    title: string;
    accessedAt: number;
}
