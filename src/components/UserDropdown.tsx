import React, { useState, useEffect, useRef } from 'react';

import { useUserStore } from '../store/userStore';
import { USER, A11Y } from '../constants/strings';
import styles from './UserDropdown.module.css';

interface UserDropdownProps {
    value: string;
    onChange: (userId: string) => void;
    placeholder?: string;
    disabled?: boolean;
}

export const UserDropdown: React.FC<UserDropdownProps> = ({
    value,
    onChange,
    placeholder = USER.SELECT_ASSIGNEE,
    disabled = false
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const dropdownRef = useRef<HTMLDivElement>(null);
    
    const { users, loading, fetchUsers } = useUserStore();

    useEffect(() => {
        if (users.length === 0) {
            fetchUsers();
        }
    }, [users.length, fetchUsers]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const selectedUser = users.find(user => user.id === value);

    const filteredUsers = users.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleSelectUser = (userId: string) => {
        onChange(userId);
        setIsOpen(false);
        setSearchTerm('');
    };

    const handleToggle = () => {
        if (!disabled) {
            setIsOpen(!isOpen);
            if (!isOpen) {
                setSearchTerm('');
            }
        }
    };

    const handleKeyDown = (event: React.KeyboardEvent) => {
        if (event.key === 'Enter' && !isOpen) {
            handleToggle();
        } else if (event.key === 'Escape') {
            setIsOpen(false);
        }
    };

    if (loading) {
        return (
            <div className={`${styles.userDropdown} ${styles.loading}`}>
                <div className={styles.dropdownTrigger}>
                    <span>{USER.LOADING_USERS}</span>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.userDropdown} ref={dropdownRef}>
            <div 
                className={`${styles.dropdownTrigger} ${isOpen ? styles.open : ''} ${disabled ? styles.disabled : ''}`}
                onClick={handleToggle}
                onKeyDown={handleKeyDown}
                tabIndex={disabled ? -1 : 0}
                role={A11Y.COMBobox}
                aria-expanded={isOpen}
                aria-haspopup={A11Y.LISTBOX}
            >
                {selectedUser ? (
                    <div className={styles.selectedUser}>
                        <div className={styles.userAvatar}>{selectedUser.avatar}</div>
                        <div className={styles.userInfo}>
                            <div className={styles.userName}>{selectedUser.name}</div>
                            <div className={styles.userEmail}>{selectedUser.email}</div>
                        </div>
                    </div>
                ) : (
                    <span className={styles.placeholder}>{placeholder}</span>
                )}
                <div className={styles.arrow}>▼</div>
            </div>

            {isOpen && (
                <div className={styles.dropdown}>
                    <div className={styles.searchContainer}>
                        <input
                            type="text"
                            placeholder={USER.SEARCH_USERS}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className={styles.searchInput}
                            autoFocus
                        />
                    </div>
                    
                    <div className={styles.usersList}>
                        {filteredUsers.length > 0 ? (
                            filteredUsers.map(user => (
                                <div
                                    key={user.id}
                                    className={`${styles.userOption} ${user.id === value ? styles.selected : ''}`}
                                    onClick={() => handleSelectUser(user.id)}
                                >
                                    <div className={styles.userOptionAvatar}>{user.avatar}</div>
                                    <div className={styles.userOptionInfo}>
                                        <div className={styles.userOptionName}>{user.name}</div>
                                        <div className={styles.userOptionEmail}>{user.email}</div>
                                    </div>
                                    {user.id === value && (
                                        <div className={styles.checkmark}></div>
                                    )}
                                </div>
                            ))
                        ) : (
                            <div className={styles.noResults}>
                                {USER.NO_USERS_FOUND} "{searchTerm}"
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}; 