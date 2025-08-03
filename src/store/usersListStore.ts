import { create } from 'zustand';
import { User } from '../types';
import { mockFetchUsers } from '../utils/api';

interface UsersListStore {
    users: User[];
    loading: boolean;
    error: string | null;
    fetchUsers: () => Promise<void>;
    getUserById: (id: string) => User | undefined;
    getUserName: (id: string) => string;
}

export const useUsersListStore = create<UsersListStore>((set, get) => ({
    users: [],
    loading: false,
    error: null,

    fetchUsers: async () => {
        set({ loading: true, error: null });
        try {
            const users = await mockFetchUsers();
            set({ users, loading: false });
        } catch (error) {
            set({ 
                error: error instanceof Error ? error.message : 'Failed to fetch users', 
                loading: false 
            });
        }
    },

    getUserById: (id: string) => {
        const { users } = get();
        return users.find(user => user.id === id);
    },

    getUserName: (id: string) => {
        const { users } = get();
        if (!id || id === '') return 'Unassigned';
        const user = users.find(user => user.id === id);
        if (user) {
            return user.name;
        } else {
            return `User ${id}`;
        }
    }
})); 