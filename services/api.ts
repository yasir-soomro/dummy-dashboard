import { User } from '../types';
import { MOCK_USERS } from '../mockData';

const USERS_STORAGE_KEY = 'dashboard_users_db';
const DELAY_MS = 600; // Simulate slightly faster network

// Helper to initialize DB
const getLocalUsers = (): User[] => {
  const stored = localStorage.getItem(USERS_STORAGE_KEY);
  if (!stored) {
    // Seed with mock data if empty
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(MOCK_USERS));
    return MOCK_USERS;
  }
  return JSON.parse(stored);
};

const saveLocalUsers = (users: User[]) => {
  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
};

// --- AUTH SERVICES ---

export const login = async (email: string, password: string): Promise<any> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const users = getLocalUsers();
      const user = users.find(u => u.email === email);
      
      if (user && (user.password === password || (!user.password && password === 'password'))) {
        resolve(user);
      } else if (email === 'admin@example.com' && password === 'password') {
         const admin = MOCK_USERS[0];
         resolve(admin);
      } else {
        reject(new Error('Invalid email or password'));
      }
    }, DELAY_MS);
  });
};

export const signup = async (name: string, email: string, password: string): Promise<any> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const users = getLocalUsers();
      if (users.find(u => u.email === email)) {
        reject(new Error('User with this email already exists'));
        return;
      }

      const newUser: User = {
        id: Math.random().toString(36).substr(2, 9),
        name,
        email,
        password,
        role: 'Member',
        status: 'Active',
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`
      };

      users.push(newUser);
      saveLocalUsers(users);
      resolve(newUser);
    }, DELAY_MS);
  });
};

// --- DATA SERVICES ---

export const fetchUsers = async (): Promise<User[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(getLocalUsers());
    }, DELAY_MS);
  });
};

export const fetchStats = async (): Promise<any> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const users = getLocalUsers();
      const activeCount = users.filter(u => u.status === 'Active').length;
      const adminCount = users.filter(u => u.role === 'Admin').length;
      
      // Dynamic stats based on local DB
      resolve({
        totalUsers: users.length.toString(),
        totalSales: `$${(users.length * 1250).toLocaleString()}`, // Fake logic: more users = more sales
        activeOrders: (activeCount * 3).toString(), 
        pendingIssues: (users.length - activeCount + 2).toString(),
        descriptions: {
          totalUsers: "Total registered accounts on the platform.",
          totalSales: "Revenue generated in the current fiscal month.",
          activeOrders: "Orders currently being processed or shipped.",
          pendingIssues: "Support tickets requiring immediate attention."
        }
      });
    }, 500);
  });
};

export const fetchReports = async (): Promise<any> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                revenueData: [35, 60, 45, 80, 55, 75, 90],
                labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                topProducts: [
                    { name: "Pro Dashboard License", sales: 142, revenue: "$14,200", growth: "+12%" },
                    { name: "UI Kit Bundle", sales: 89, revenue: "$4,450", growth: "+5%" },
                    { name: "Consulting Hour", sales: 24, revenue: "$3,600", growth: "-2%" }
                ],
                recentTransactions: [
                    { id: "TRX-8859", user: "Alice Freeman", amount: "$129.00", status: "Completed", date: "Just now" },
                    { id: "TRX-8860", user: "Robert Wolf", amount: "$59.00", status: "Pending", date: "15 min ago" },
                    { id: "TRX-8861", user: "James Smith", amount: "$299.00", status: "Completed", date: "2 hours ago" },
                    { id: "TRX-8862", user: "Morgan Lee", amount: "$25.00", status: "Failed", date: "5 hours ago" },
                ]
            })
        }, 1000);
    });
};

export const deleteUser = async (id: string | number): Promise<void> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const users = getLocalUsers().filter(u => u.id !== id);
      saveLocalUsers(users);
      resolve();
    }, 300);
  });
};

export const createUser = async (user: Omit<User, 'id'>): Promise<User> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const users = getLocalUsers();
      const newUser: User = {
        ...user,
        id: Math.random().toString(36).substr(2, 9),
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=random`
      };
      users.push(newUser);
      saveLocalUsers(users);
      resolve(newUser);
    }, DELAY_MS);
  });
};

export const updateUser = async (updatedUser: User): Promise<User> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const users = getLocalUsers();
      const index = users.findIndex(u => u.id === updatedUser.id);
      
      if (index !== -1) {
        // Merge updates
        users[index] = { ...users[index], ...updatedUser };
        // Update avatar if name changed and avatar wasn't manually set (simplified logic)
        if(updatedUser.name && !updatedUser.avatar?.includes('http')) {
             users[index].avatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(updatedUser.name)}&background=random`;
        }
        saveLocalUsers(users);
        resolve(users[index]);
      } else {
        // If user not found (e.g. updating profile of a user not in list? unlikely), just return input
        resolve(updatedUser);
      }
    }, DELAY_MS);
  });
};
