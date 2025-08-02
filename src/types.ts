import { Dayjs } from 'dayjs';

export type IssueStatus = 'Backlog' | 'In Progress' | 'Done';
export type IssuePriority = 'low' | 'medium' | 'high';

export interface User {
    id: string;
    name: string;
    email: string;
    avatar: string;
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
