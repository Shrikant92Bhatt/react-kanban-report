// Issue Status
export const ISSUE_STATUS = {
  BACKLOG: 'Backlog',
  IN_PROGRESS: 'In Progress',
  DONE: 'Done'
} as const;

// Issue Priority
export const ISSUE_PRIORITY = {
  HIGH: 'high',
  MEDIUM: 'medium',
  LOW: 'low'
} as const;



// User Related
export const USER = {
  UNASSIGNED: 'Unassigned',
  UNKNOWN_USER: 'Unknown User',
  LOADING_USERS: 'Loading users...',
  NO_USERS_FOUND: 'No users found matching',
  SELECT_ASSIGNEE: 'Select assignee',
  SEARCH_USERS: 'Search users...'
} as const;

// Issue Related
export const ISSUE = {
  ISSUE_PREFIX: 'ISSUE-',
  SEVERITY_SUFFIX: '/10',
  NO_ISSUE_FOUND: 'No issue found!',
  DROP_HERE: 'Drop here!',
  INVALID_MOVE: 'Invalid move!',
  ISSUE_NOT_FOUND: 'Issue Not Found',
  ISSUE_NOT_EXIST: "The issue you're looking for doesn't exist.",
  BACK_TO_BOARD: 'Back to Board',
  LOADING: 'Loading...',
  UPDATED_SUCCESSFULLY: 'Issue updated successfully!',
  FAILED_TO_UPDATE: 'Failed to update issue',
  FAILED_TO_FETCH: 'Failed to fetch issues',
  NO_TAGS: 'No tags'
} as const;

// Form Labels
export const LABELS = {
  ASSIGNEE: 'Assignee:',
  CREATED: 'Created:',
  SEVERITY: 'Severity:',
  PRIORITY: 'Priority',
  STATUS: 'Status',
  TAGS: 'Tags',
  TITLE: 'Title'
} as const;

// Button Text
export const BUTTONS = {
  EDIT: 'Edit',
  SAVE: 'Save Changes',
  SAVING: 'Saving...',
  CANCEL: 'Cancel',
  BACK: 'Back',
  CLEAR_FILTERS: 'Clear Filters',
  SHOW_FILTERS: 'Show Filters & Sort',
  HIDE_FILTERS: 'Hide Filters & Sort',
  ADD_TAG: 'Add Tag',
  REMOVE_TAG: 'Remove Tag',
  ADD_COMMENT: 'Add Comment'
} as const;

// Filter and Sort
export const FILTER = {
  ALL: 'all',
  SEARCH_PLACEHOLDER: 'Search issues by title, ID, assignee, or tags...',
  SORT_BY: 'Sort by',
  CREATED_AT: 'createdAt',
  PRIORITY: 'priority',
  TITLE: 'title',
  LOADING_USERS: 'Loading users...',
  SEARCH: 'Search',
  STATUS: 'Status',
  ASSIGNEE: 'Assignee',
  SORT_BY_HEADER: 'Sort By',
  ALL_STATUSES: 'All Statuses',
  ALL_PRIORITIES: 'All Priorities',
  ALL_ASSIGNEES: 'All Assignees',
  CREATED_DATE: 'Created Date',
  SEVERITY: 'Severity'
} as const;

// Navigation
export const NAVIGATION = {
  BOARD: 'Board',
  ISSUES: 'Issues',
  DASHBOARD: 'Dashboard'
} as const;

// Placeholder Text
export const PLACEHOLDERS = {
  SEARCH: 'Search...',
  TITLE: 'Enter issue title...',
  TAG: 'Enter tag...'
} as const;



// Accessibility
export const A11Y = {
  EXPANDED: 'expanded',
  COLLAPSED: 'collapsed',
  DROPDOWN: 'dropdown',
  BUTTON: 'button',
  LISTBOX: 'listbox',
  COMBobox: 'combobox',
  HAS_POPUP: 'haspopup'
} as const;

 