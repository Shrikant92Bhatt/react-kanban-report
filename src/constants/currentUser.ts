import { IssueStatus } from "../types";
import { CurrentUser } from "../types";

export const currentUser: CurrentUser = {
    name: 'Alice',
    role: 'admin'
};

export const contributorUser: CurrentUser = {
    name: 'Bob',
    role: 'contributor'
};

export const ISSUE_STATUSES: IssueStatus[] = ['Backlog', 'In Progress', 'Done'];

