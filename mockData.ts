import { User } from './types';

export const MOCK_USERS: User[] = [
  { id: '001', name: 'John Doe', email: 'john@example.com', role: 'Admin', status: 'Active', avatar: 'https://picsum.photos/100/100' },
  { id: '002', name: 'Jane Smith', email: 'jane@example.com', role: 'Editor', status: 'Active', avatar: 'https://picsum.photos/101/101' },
  { id: '003', name: 'Michael Lee', email: 'michael@example.com', role: 'Member', status: 'Inactive', avatar: 'https://picsum.photos/102/102' },
  { id: '004', name: 'Sara Wilson', email: 'sara@example.com', role: 'Member', status: 'Active', avatar: 'https://picsum.photos/103/103' },
  { id: '005', name: 'David Brown', email: 'david@example.com', role: 'Editor', status: 'Active', avatar: 'https://picsum.photos/104/104' },
  { id: '006', name: 'Emily Davis', email: 'emily@example.com', role: 'Member', status: 'Inactive', avatar: 'https://picsum.photos/105/105' },
];

export const fetchUsers = async (): Promise<User[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(MOCK_USERS);
    }, 1200); // Simulate network latency
  });
};

export const fetchStats = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        totalUsers: '1,250',
        totalSales: '$32,500',
        activeOrders: '120',
        pendingIssues: '8'
      });
    }, 800);
  });
};
