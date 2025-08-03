import React, { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import { Issue, IssueStatus, IssuePriority } from '../../types';
import { FILTER, BUTTONS, ISSUE_STATUS, ISSUE_PRIORITY, LABELS } from '../../constants/strings';
import { useUsersListStore } from '../../store/usersListStore';
import styles from './FilterSort.module.css';

interface FilterSortProps {
    issues: Issue[];
    onFilteredIssues: (filteredIssues: Issue[]) => void;
}

export const FilterSort: React.FC<FilterSortProps> = ({
    issues,
    onFilteredIssues
}) => {
    const { users, fetchUsers, loading: usersLoading } = useUsersListStore();
    const [isExpanded, setIsExpanded] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [filters, setFilters] = useState({
        status: FILTER.ALL as IssueStatus | 'all',
        priority: FILTER.ALL as IssuePriority | 'all',
        assignee: FILTER.ALL as string | 'all'
    });
    const [sortBy, setSortBy] = useState('createdAt');

    // Ensure users are loaded
    useEffect(() => {
        if (users.length === 0) {
            fetchUsers();
        }
    }, [users.length, fetchUsers]);

    const handleFilterChange = (key: keyof typeof filters, value: any) => {
        setFilters(prev => ({
            ...prev,
            [key]: value
        }));
    };

    const clearFilters = () => {
        setFilters({
            status: FILTER.ALL,
            priority: FILTER.ALL,
            assignee: FILTER.ALL
        });
        setSearchTerm('');
    };

    const hasActiveFilters = filters.status !== FILTER.ALL || filters.priority !== FILTER.ALL || filters.assignee !== FILTER.ALL || searchTerm.trim() !== '';

    // Apply filters and sorting
    useEffect(() => {
        let filtered = [...issues];

        // Apply search filter
        if (searchTerm.trim() !== '') {
            const searchLower = searchTerm.toLowerCase();
            filtered = filtered.filter(issue => 
                issue.title.toLowerCase().includes(searchLower) ||
                issue.id.toLowerCase().includes(searchLower) ||
                (issue.assignee && issue.assignee.toLowerCase().includes(searchLower)) ||
                issue.tags.some(tag => tag.toLowerCase().includes(searchLower))
            );
        }

        // Apply status filter
        if (filters.status !== FILTER.ALL) {
            filtered = filtered.filter(issue => issue.status === filters.status);
        }

        // Apply priority filter
        if (filters.priority !== FILTER.ALL) {
            filtered = filtered.filter(issue => issue.priority === filters.priority);
        }

        // Apply assignee filter
        if (filters.assignee !== FILTER.ALL) {
            filtered = filtered.filter(issue => issue.assignee === filters.assignee);
        }

        // Apply sorting
        filtered.sort((a, b) => {
            switch (sortBy) {
                case 'createdAt':
                    return dayjs(b.createdAt).valueOf() - dayjs(a.createdAt).valueOf();
                case 'priority':
                    const priorityOrder = { high: 3, medium: 2, low: 1 };
                    return priorityOrder[b.priority] - priorityOrder[a.priority];
                case 'severity':
                    return b.severity - a.severity;
                case 'title':
                    return a.title.localeCompare(b.title);
                case 'assignee':
                    return (a.assignee || '').localeCompare(b.assignee || '');
                default:
                    return 0;
            }
        });

        onFilteredIssues(filtered);
    }, [issues, filters, sortBy, searchTerm, onFilteredIssues]);

    return (
        <div className={styles.filterSortContainer}>
            <div className={styles.filterHeader}>
                <button
                    className={styles.expandButton}
                    onClick={() => setIsExpanded(!isExpanded)}
                >
                    {isExpanded ? BUTTONS.HIDE_FILTERS : BUTTONS.SHOW_FILTERS}
                </button>
                {hasActiveFilters && (
                    <button
                        className={styles.clearButton}
                        onClick={clearFilters}
                    >
                        {BUTTONS.CLEAR_FILTERS}
                    </button>
                )}
            </div>

            {isExpanded && (
                <div className={styles.filterContent}>
                    <div className={styles.filterSection}>
                        <h3>{FILTER.SEARCH}</h3>
                        <input
                            type="text"
                            placeholder={FILTER.SEARCH_PLACEHOLDER}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className={styles.searchInput}
                        />
                    </div>

                    <div className={styles.filterSection}>
                        <h3>{FILTER.STATUS}</h3>
                        <select
                            value={filters.status}
                            onChange={(e) => handleFilterChange('status', e.target.value)}
                            className={styles.filterSelect}
                        >
                            <option value="all">{FILTER.ALL_STATUSES}</option>
                            <option value="backlog">{ISSUE_STATUS.BACKLOG}</option>
                            <option value="in-progress">{ISSUE_STATUS.IN_PROGRESS}</option>
                            <option value="done">{ISSUE_STATUS.DONE}</option>
                        </select>
                    </div>

                    <div className={styles.filterSection}>
                        <h3>{LABELS.PRIORITY}</h3>
                        <select
                            value={filters.priority}
                            onChange={(e) => handleFilterChange('priority', e.target.value)}
                            className={styles.filterSelect}
                        >
                            <option value="all">{FILTER.ALL_PRIORITIES}</option>
                            <option value="low">{ISSUE_PRIORITY.LOW.toUpperCase()}</option>
                            <option value="medium">{ISSUE_PRIORITY.MEDIUM.toUpperCase()}</option>
                            <option value="high">{ISSUE_PRIORITY.HIGH.toUpperCase()}</option>
                        </select>
                    </div>

                    <div className={styles.filterSection}>
                        <h3>{FILTER.ASSIGNEE}</h3>
                        <select
                            value={filters.assignee}
                            onChange={(e) => handleFilterChange('assignee', e.target.value)}
                            className={styles.filterSelect}
                            disabled={usersLoading}
                        >
                            <option value="all">{FILTER.ALL_ASSIGNEES}</option>
                            {usersLoading ? (
                                <option value="" disabled>{FILTER.LOADING_USERS}</option>
                            ) : (
                                users.map(user => (
                                    <option key={user.id} value={user.id}>
                                        {user.name}
                                    </option>
                                ))
                            )}
                        </select>
                    </div>

                    <div className={styles.filterSection}>
                        <h3>{FILTER.SORT_BY_HEADER}</h3>
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className={styles.filterSelect}
                        >
                            <option value="createdAt">{FILTER.CREATED_DATE}</option>
                            <option value="priority">{LABELS.PRIORITY}</option>
                            <option value="severity">{FILTER.SEVERITY}</option>
                            <option value="title">{LABELS.TITLE}</option>
                            <option value="assignee">{LABELS.ASSIGNEE}</option>
                        </select>
                    </div>
                </div>
            )}
        </div>
    );
}; 