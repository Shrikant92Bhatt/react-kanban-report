import React from 'react';
import { useUserStore } from '../store/userStore';
import { currentUser, contributorUser } from '../constants/currentUser';
import styles from './UserSwitcher.module.css';

export const UserSwitcher: React.FC = () => {
  const { currentUser: user, setCurrentUser } = useUserStore();

  const handleUserSwitch = () => {
    if (user.role === 'admin') {
      setCurrentUser(contributorUser);
    } else {
      setCurrentUser(currentUser);
    }
  };

  return (
    <div className={styles.userSwitcher}>
      <div className={styles.currentUser}>
        <span className={styles.userName}>{user.name}</span>
        <span className={`${styles.userRole} ${styles[user.role]}`}>
          {user.role}
        </span>
      </div>
      <button 
        className={styles.switchButton}
        onClick={handleUserSwitch}
        title={`Switch to ${user.role === 'admin' ? 'contributor' : 'admin'} role`}
      >
        Switch to {user.role === 'admin' ? 'Contributor' : 'Admin'}
      </button>
    </div>
  );
}; 