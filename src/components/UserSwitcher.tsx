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

  const nextRole = user.role === 'admin' ? 'contributor' : 'admin';
  const nextRoleDisplay = user.role === 'admin' ? 'Contributor' : 'Admin';

  return (
    <div className={styles.userSwitcher}>
      <div className={styles.currentUser}>
        <span className={styles.userName}>{user.name}</span>
        <div className={styles.roleAndButton}>
          <span className={`${styles.userRole} ${styles[user.role]}`}>
            {user.role}
          </span>
          <button 
            className={styles.switchButton}
            onClick={handleUserSwitch}
            title={`Switch to ${nextRole} role`}
            aria-label={`Switch from ${user.role} to ${nextRole} role`}
          >
            Switch to {nextRoleDisplay}
          </button>
        </div>
      </div>
    </div>
  );
}; 