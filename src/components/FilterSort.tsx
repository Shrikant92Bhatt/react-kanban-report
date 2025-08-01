import React, { useState, useMemo } from 'react';
import dayjs from 'dayjs';
import { Issue } from '../types';
import { MultiSelect } from './MultiSelect';
import './FilterSort.css';

interface FilterSortProps {
    issues: Issue[];
    onFilteredIssues: (issues: Issue[]) => void;
}

interface FilterState {
    search: string;
    assignees: string[];
    severities: string[];
    sortBy: 'priority' | 'createdAt' | 'severity';
}

export const FilterSort: React.FC<FilterSortProps> = ({ issues, onFilteredIssues }) => {
    const [filters, setFilters] = useState<FilterState>({
        search: '',
        assignees: [],
        severities: [],
        sortBy: 'priority'
    });

    const assignees = useMemo(() => {
        const uniqueAssignees = Array.from(new Set(issues.map(issue => issue.assignee)));
        return uniqueAssignees.sort();
    }, [issues]);

    const severities = useMemo(() => {
        const uniqueSeverities = Array.from(new Set(issues.map(issue => issue.severity)));
        return uniqueSeverities.sort((a, b) => a - b).map(s => s.toString());
    }, [issues]);

    const calculatePriorityScore = (issue: Issue): number => {
        const daysSinceCreated = dayjs().diff(dayjs(issue.createdAt), 'day');
        
        // Enhanced priority calculation with better weighting
        const severityWeight = issue.severity * 15; // Increased weight for severity
        const agePenalty = Math.max(0, daysSinceCreated * 2); // Age penalty increases over time
        const priorityBonus = issue.priority === 'high' ? 200 : issue.priority === 'medium' ? 100 : 0;
        
        // Additional factors
        const criticalTagBonus = issue.tags.includes('critical') ? 150 : 0;
        const bugTagBonus = issue.tags.includes('bug') ? 50 : 0;
        const securityTagBonus = issue.tags.includes('security') ? 200 : 0;
        
        return severityWeight + priorityBonus + criticalTagBonus + bugTagBonus + securityTagBonus - agePenalty;
    };

    const filteredAndSortedIssues = useMemo(() => {
        let filtered = issues.filter(issue => {
            const matchesSearch = filters.search === '' || 
                issue.title.toLowerCase().includes(filters.search.toLowerCase()) ||
                issue.tags.some(tag => tag.toLowerCase().includes(filters.search.toLowerCase()));
            
            const matchesAssignee = filters.assignees.length === 0 || filters.assignees.includes(issue.assignee);
            const matchesSeverity = filters.severities.length === 0 || filters.severities.includes(issue.severity.toString());
            
            return matchesSearch && matchesAssignee && matchesSeverity;
        });

        filtered.sort((a, b) => {
            switch (filters.sortBy) {
                case 'priority':
                    const scoreA = calculatePriorityScore(a);
                    const scoreB = calculatePriorityScore(b);
                    if (scoreA !== scoreB) {
                        return scoreB - scoreA;
                    }
                    return dayjs(b.createdAt).valueOf() - dayjs(a.createdAt).valueOf();
                case 'createdAt':
                    return dayjs(b.createdAt).valueOf() - dayjs(a.createdAt).valueOf();
                case 'severity':
                    return b.severity - a.severity;
                default:
                    return 0;
            }
        });

        return filtered;
    }, [issues, filters]);

    React.useEffect(() => {
        onFilteredIssues(filteredAndSortedIssues);
    }, [filteredAndSortedIssues, onFilteredIssues]);

    const handleFilterChange = (key: keyof FilterState, value: any) => {
        setFilters(prev => ({ ...prev, [key]: value }));
    };

    const clearFilters = () => {
        setFilters({
            search: '',
            assignees: [],
            severities: [],
            sortBy: 'priority'
        });
    };

    return (
        <div className="filter-sort-container">
            <div className="filter-row">
                <div className="filter-group">
                    <label htmlFor="search">Search:</label>
                    <input
                        id="search"
                        type="text"
                        placeholder="Search by title or tags..."
                        value={filters.search}
                        onChange={(e) => handleFilterChange('search', e.target.value)}
                        className="filter-input"
                    />
                </div>

                <MultiSelect
                    label="Assignee"
                    options={assignees}
                    selectedValues={filters.assignees}
                    onSelectionChange={(values) => handleFilterChange('assignees', values)}
                    placeholder="All Assignees"
                />

                <MultiSelect
                    label="Severity"
                    options={severities}
                    selectedValues={filters.severities}
                    onSelectionChange={(values) => handleFilterChange('severities', values)}
                    placeholder="All Severities"
                />

                <div className="filter-group">
                    <label htmlFor="sortBy">Sort By:</label>
                    <select
                        id="sortBy"
                        value={filters.sortBy}
                        onChange={(e) => handleFilterChange('sortBy', e.target.value as any)}
                        className="filter-select"
                    >
                        <option value="priority">Priority Score</option>
                        <option value="createdAt">Created Date</option>
                        <option value="severity">Severity</option>
                    </select>
                </div>

                <button onClick={clearFilters} className="clear-filters-btn">
                    Clear Filters
                </button>
            </div>

            <div className="filter-stats">
                Showing {filteredAndSortedIssues.length} of {issues.length} issues
                {filters.search && (
                    <span className="filter-highlight"> • Search: "{filters.search}"</span>
                )}
                {filters.assignees.length > 0 && (
                    <span className="filter-highlight"> • Assignees: {filters.assignees.join(', ')}</span>
                )}
                {filters.severities.length > 0 && (
                    <span className="filter-highlight"> • Severities: {filters.severities.join(', ')}</span>
                )}
            </div>
        </div>
    );
}; 