import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { NAVIGATION } from '../../constants/strings';
import styles from './Navigation.module.css';

export const Navigation = () => {
    const location = useLocation();

    const isActive = (path: string) => {
        return location.pathname === path;
    };

    return (
        <nav className={styles.navigation}>
            <div className={styles.navContainer}>
                <Link to="/board" className={styles.navBrand}>
                    Issue Tracker
                </Link>

                <ul className={styles.navLinks}>
                    <li>
                        <Link
                            to="/board"
                            className={`${styles.navLink} ${isActive('/board') ? styles.active : ''}`}
                        >
                            {NAVIGATION.BOARD}
                        </Link>
                    </li>
                    <li>
                        <Link
                            to="/settings"
                            className={`${styles.navLink} ${isActive('/settings') ? styles.active : ''}`}
                        >
                            Settings
                        </Link>
                    </li>
                </ul>
            </div>
        </nav>
    );
}; 