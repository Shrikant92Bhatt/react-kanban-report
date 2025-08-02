import { create } from 'zustand';
import { User } from '../types';

interface UserState {
    users: User[];
    loading: boolean;
    error: string | null;
    fetchUsers: () => Promise<void>;
    getUserById: (id: string) => User | undefined;
    getUserName: (id: string) => string;
}

export const useUserStore = create<UserState>((set, get) => ({
    users: [],
    loading: false,
    error: null,

    fetchUsers: async () => {
        set({ loading: true, error: null });
        try {
            // Simulate API call with mock data
            const mockUsers: User[] = [
                { id: 'alice', name: 'Alice Johnson', email: 'alice@company.com', avatar: 'AJ' },
                { id: 'bob', name: 'Bob Smith', email: 'bob@company.com', avatar: 'BS' },
                { id: 'carol', name: 'Carol Davis', email: 'carol@company.com', avatar: 'CD' },
                { id: 'david', name: 'David Wilson', email: 'david@company.com', avatar: 'DW' },
                { id: 'emma', name: 'Emma Brown', email: 'emma@company.com', avatar: 'EB' },
                { id: 'frank', name: 'Frank Miller', email: 'frank@company.com', avatar: 'FM' },
                { id: 'grace', name: 'Grace Taylor', email: 'grace@company.com', avatar: 'GT' },
                { id: 'henry', name: 'Henry Anderson', email: 'henry@company.com', avatar: 'HA' }
            ];

            // Simulate network delay
            await new Promise(resolve => setTimeout(resolve, 500));

            set({ users: mockUsers, loading: false });
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
            // If user not found, return a more descriptive fallback
            return `User ${id}`;
        }
    }
})); 