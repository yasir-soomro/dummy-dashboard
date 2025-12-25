export interface User {
  id: string | number;
  name: string;
  email: string;
  role: 'Admin' | 'Editor' | 'Member';
  status: 'Active' | 'Inactive';
  avatar?: string;
  password?: string; // Only for local mock auth
}

export interface StatData {
  title: string;
  value: string | number;
  icon: any; // Lucide icon component type
  color: string; // Tailwind color class
  description: string; // Back of the card
}

export interface DashboardState {
  isSidebarOpen: boolean;
  currentView: 'dashboard' | 'users' | 'reports' | 'settings';
  toggleSidebar: () => void;
  setView: (view: 'dashboard' | 'users' | 'reports' | 'settings') => void;
  user: { name: string; avatar: string; role: string } | null;
}
