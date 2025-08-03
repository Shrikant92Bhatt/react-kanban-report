import React, { useState, useEffect, useMemo } from 'react';
import dayjs from 'dayjs';
import { Issue } from '../../types';
import { FILTER, BUTTONS, ISSUE_STATUS, ISSUE_PRIORITY, LABELS } from '../../constants/strings';
import { useUsersListStore } from '../../store/usersListStore';
import { calculatePriorityScore } from '../../hooks/usePriorityScore';
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
    const [sortBy, setSortBy] = useState('priorityScore');
    const [filters, setFilters] = useState({
        status: 'all',
        priority: 'all',
        assignee: 'all',
        severity: 'all'
    });

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
            status: 'all',
            priority: 'all',
            assignee: 'all',
            severity: 'all'
        });
        setSearchTerm('');
        setSortBy('priorityScore');
    };

    const hasActiveFilters = useMemo(() => {
        return Object.values(filters).some(value => value !== 'all') || searchTerm !== '';
    }, [filters, searchTerm]);

    useMemo(() => {
        let filtered = [...issues];

        // Apply search filter
        if (searchTerm) {
            const searchLower = searchTerm.toLowerCase();
            filtered = filtered.filter(issue =>
                issue.title.toLowerCase().includes(searchLower) ||
                issue.tags.some(tag => tag.toLowerCase().includes(searchLower))
            );
        }

        // Apply status filter
        if (filters.status !== 'all') {
            filtered = filtered.filter(issue => issue.status.toLowerCase() === filters.status);
        }

        // Apply priority filter
        if (filters.priority !== 'all') {
            filtered = filtered.filter(issue => issue.priority === filters.priority);
        }

        // Apply assignee filter
        if (filters.assignee !== 'all') {
            filtered = filtered.filter(issue => issue.assignee === filters.assignee);
        }

        // Apply severity filter
        if (filters.severity !== 'all') {
            const severityValue = parseInt(filters.severity);
            filtered = filtered.filter(issue => issue.severity === severityValue);
        }

        // Apply sorting
        filtered.sort((a, b) => {
            switch (sortBy) {
                case 'createdAt':
                    const dateComparison = dayjs(b.createdAt).valueOf() - dayjs(a.createdAt).valueOf();
                    return dateComparison !== 0 ? dateComparison : a.id.localeCompare(b.id);
                case 'priority':
                    const priorityOrder = { high: 3, medium: 2, low: 1 };
                    const priorityComparison = priorityOrder[b.priority] - priorityOrder[a.priority];
                    return priorityComparison !== 0 ? priorityComparison : a.id.localeCompare(b.id);
                case 'severity':
                    const severityComparison = b.severity - a.severity;
                    return severityComparison !== 0 ? severityComparison : a.id.localeCompare(b.id);
                case 'priorityScore':
                    const scoreA = calculatePriorityScore(a);
                    const scoreB = calculatePriorityScore(b);
                    const scoreComparison = scoreB - scoreA;
                    return scoreComparison !== 0 ? scoreComparison : a.id.localeCompare(b.id);
                case 'title':
                    const titleComparison = a.title.localeCompare(b.title);
                    return titleComparison !== 0 ? titleComparison : a.id.localeCompare(b.id);
                case 'assignee':
                    const assigneeComparison = (a.assignee || '').localeCompare(b.assignee || '');
                    return assigneeComparison !== 0 ? assigneeComparison : a.id.localeCompare(b.id);
                default:
                    return a.id.localeCompare(b.id);
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
                            <option value="priorityScore">Priority Score</option>
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