import React, { useState, useEffect, createContext, useContext } from 'react';
import { Menu, Users, ShoppingCart, AlertCircle, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Sidebar from './components/Sidebar';
import StatCard from './components/StatCard';
import UserTable from './components/UserTable';
import LoginPage from './components/LoginPage';
import ReportsView from './components/ReportsView';
import SettingsView from './components/SettingsView';
import UserModal from './components/UserModal';
import { fetchStats, fetchUsers, deleteUser, createUser, updateUser, fetchReports } from './services/api';
import { User as UserType } from './types';

// Context Definition
interface AppContextType {
  sidebarOpen: boolean;
  toggleSidebar: () => void;
  currentUser: any;
  updateCurrentUser: (user: any) => void;
  handleLogout: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Hook to use context
export const useAppContext = () => {
    const context = useContext(AppContext);
    if (!context) throw new Error("useAppContext must be used within AppProvider");
    return context;
};

// Main App Component
const App: React.FC = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [currentUser, setCurrentUser] = useState<any>(null);
    const [isLoadingAuth, setIsLoadingAuth] = useState(true);

    // Check LocalStorage on Mount
    useEffect(() => {
        const storedUser = localStorage.getItem('dashboard_active_session');
        if (storedUser) {
            try {
                setCurrentUser(JSON.parse(storedUser));
                setIsAuthenticated(true);
            } catch (e) {
                console.error("Failed to parse stored user", e);
                localStorage.removeItem('dashboard_active_session');
            }
        }
        setIsLoadingAuth(false);
    }, []);

    const handleLoginSuccess = (userData: any) => {
        setCurrentUser(userData);
        setIsAuthenticated(true);
        localStorage.setItem('dashboard_active_session', JSON.stringify(userData));
    };

    const updateCurrentUser = (userData: any) => {
        setCurrentUser(userData);
        localStorage.setItem('dashboard_active_session', JSON.stringify(userData));
    };

    const handleLogout = () => {
        setIsAuthenticated(false);
        setCurrentUser(null);
        localStorage.removeItem('dashboard_active_session');
    };

    if (isLoadingAuth) {
        return <div className="min-h-screen flex items-center justify-center bg-gray-50 text-gray-400 animate-pulse">Loading Application...</div>;
    }

    if (!isAuthenticated) {
        return <LoginPage onLoginSuccess={handleLoginSuccess} />;
    }

    return (
        <DashboardLayout currentUser={currentUser} onLogout={handleLogout} updateCurrentUser={updateCurrentUser} />
    );
};

// Dashboard Layout Component
interface DashboardLayoutProps {
    currentUser: any;
    onLogout: () => void;
    updateCurrentUser: (user: any) => void;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ currentUser, onLogout, updateCurrentUser }) => {
  // State
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentView, setCurrentView] = useState<'dashboard' | 'users' | 'reports' | 'settings'>('dashboard');
  
  // Data State
  const [stats, setStats] = useState<any>(null);
  const [users, setUsers] = useState<UserType[]>([]);
  const [reportsData, setReportsData] = useState<any>(null);
  
  // Loading States
  const [loading, setLoading] = useState(true);
  const [reportsLoading, setReportsLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  // Modal State
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<UserType | null>(null);
  const [modalLoading, setModalLoading] = useState(false);

  // Effects
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [statsData, usersData] = await Promise.all([fetchStats(), fetchUsers()]);
      setStats(statsData);
      setUsers(usersData);
    } catch (error) {
      console.error("Failed to load data", error);
    } finally {
      setLoading(false);
    }
  };

  const loadReports = async () => {
      setReportsLoading(true);
      try {
          const data = await fetchReports();
          setReportsData(data);
      } catch (error) {
          console.error("Failed to load reports", error);
      } finally {
          setReportsLoading(false);
      }
  };

  useEffect(() => {
    loadData();
    loadReports();
  }, []);

  // Handlers
  const handleDeleteUser = async (id: string | number) => {
    if(window.confirm('Are you sure you want to delete this user?')) {
        setUsers(prev => prev.filter(u => u.id !== id)); // Optimistic
        try {
            await deleteUser(id);
            const statsData = await fetchStats();
            setStats(statsData);
        } catch (e) {
            console.error("Failed to delete user", e);
            loadData();
        }
    }
  };

  const openAddUserModal = () => {
      setEditingUser(null);
      setIsUserModalOpen(true);
  };

  const openEditUserModal = (id: string | number) => {
      const userToEdit = users.find(u => u.id === id);
      if (userToEdit) {
          setEditingUser(userToEdit);
          setIsUserModalOpen(true);
      }
  };

  const handleSaveUser = async (formData: Partial<UserType>) => {
      setModalLoading(true);
      try {
          if (editingUser) {
              // Edit Mode
              const updated = await updateUser({ ...editingUser, ...formData } as UserType);
              setUsers(prev => prev.map(u => u.id === updated.id ? updated : u));
          } else {
              // Create Mode
              const created = await createUser(formData as any);
              setUsers(prev => [...prev, created]);
          }
          
          // Refresh stats
          const statsData = await fetchStats();
          setStats(statsData);
          setIsUserModalOpen(false);
      } catch (error) {
          console.error("Failed to save user", error);
          alert("Failed to save user. Please try again.");
      } finally {
          setModalLoading(false);
      }
  };

  return (
    <AppContext.Provider value={{ sidebarOpen, toggleSidebar: () => setSidebarOpen(!sidebarOpen), currentUser, handleLogout: onLogout, updateCurrentUser }}>
      <div className="min-h-screen bg-gray-50 flex font-sans text-gray-900 overflow-x-hidden">
        
        {/* Sidebar */}
        <Sidebar 
            isOpen={sidebarOpen} 
            setIsOpen={setSidebarOpen} 
            currentView={currentView}
            setView={setCurrentView}
            isMobile={isMobile}
        />

        {/* Main Content */}
        <div className={`flex-1 flex flex-col min-h-screen transition-all duration-300 ease-in-out ${!isMobile ? 'ml-64' : 'ml-0'}`}>
          
          {/* Top Header */}
          <header className="h-16 bg-white/80 backdrop-blur-md sticky top-0 z-20 border-b border-gray-200/50 px-6 flex justify-between items-center shadow-sm">
            <div className="flex items-center gap-4">
              {isMobile && (
                <button 
                  onClick={() => setSidebarOpen(true)}
                  className="p-2 -ml-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                >
                  <Menu size={24} />
                </button>
              )}
            </div>

            <div className="flex items-center gap-4">
               <div className="text-right hidden sm:block">
                    <p className="text-sm font-semibold text-gray-800">{currentUser.name}</p>
                    <p className="text-xs text-gray-500">{currentUser.role || 'Member'}</p>
               </div>
               <button onClick={() => setCurrentView('settings')} className="relative group cursor-pointer outline-none">
                    <img 
                        src={currentUser.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser.name)}&background=random`} 
                        alt="Profile" 
                        className="w-10 h-10 rounded-full border-2 border-white shadow-sm object-cover" 
                    />
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
               </button>
            </div>
          </header>

          {/* Page Content */}
          <main className="flex-1 p-6 md:p-8 overflow-y-auto w-full max-w-[1600px] mx-auto">
            
            <AnimatePresence mode="wait">
              {/* View Title Container */}
              <motion.div 
                  key={currentView}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
              >
                  <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-800 capitalize tracking-tight">
                        {currentView === 'dashboard' ? 'Overview' : currentView}
                    </h1>
                    <p className="text-gray-500 text-base mt-2">
                        {currentView === 'dashboard' ? 'Welcome back! Here is your daily activity summary.' : 
                         currentView === 'users' ? 'Manage your users, assign roles and check statuses.' :
                         currentView === 'reports' ? 'Detailed analytics and performance metrics.' :
                         'Manage your account settings and preferences.'
                        }
                    </p>
                  </div>

                  {/* Dashboard View */}
                  {currentView === 'dashboard' && (
                    <div className="space-y-8">
                      {/* 3D Stat Cards Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8 perspective-1000">
                        <StatCard 
                          title="Total Users" 
                          value={stats?.totalUsers || '0'} 
                          icon={<Users size={24} className="text-white" />} 
                          colorClass="bg-gradient-to-br from-blue-500 to-blue-600" 
                          delay={0.1}
                          loading={loading}
                          description={stats?.descriptions?.totalUsers}
                        />
                        <StatCard 
                          title="Total Sales" 
                          value={stats?.totalSales || '$0'} 
                          icon={<ShoppingCart size={24} className="text-white" />} 
                          colorClass="bg-gradient-to-br from-purple-500 to-purple-600" 
                          delay={0.2}
                          loading={loading}
                          description={stats?.descriptions?.totalSales}
                        />
                        <StatCard 
                          title="Active Orders" 
                          value={stats?.activeOrders || '0'} 
                          icon={<CheckCircle size={24} className="text-white" />} 
                          colorClass="bg-gradient-to-br from-emerald-400 to-emerald-600" 
                          delay={0.3}
                          loading={loading}
                          description={stats?.descriptions?.activeOrders}
                        />
                        <StatCard 
                          title="Pending Issues" 
                          value={stats?.pendingIssues || '0'} 
                          icon={<AlertCircle size={24} className="text-white" />} 
                          colorClass="bg-gradient-to-br from-rose-500 to-rose-600" 
                          delay={0.4}
                          loading={loading}
                          description={stats?.descriptions?.pendingIssues}
                        />
                      </div>

                      {/* Users Table Section */}
                      <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.2 }}
                          className="shadow-xl rounded-2xl"
                      >
                          <UserTable 
                              users={users} 
                              loading={loading} 
                              onDelete={handleDeleteUser}
                              onEdit={openEditUserModal}
                              onAdd={openAddUserModal}
                          />
                      </motion.div>
                    </div>
                  )}

                  {/* Users View */}
                  {currentView === 'users' && (
                      <motion.div 
                        initial={{ opacity: 0, y: 20 }} 
                        animate={{ opacity: 1, y: 0 }}
                        className="shadow-xl rounded-2xl"
                      >
                        <UserTable 
                            users={users} 
                            loading={loading} 
                            onDelete={handleDeleteUser}
                            onEdit={openEditUserModal}
                            onAdd={openAddUserModal}
                        />
                      </motion.div>
                  )}

                  {/* Reports View */}
                  {currentView === 'reports' && (
                      <ReportsView data={reportsData} loading={reportsLoading} />
                  )}

                  {/* Settings View */}
                  {currentView === 'settings' && (
                      <SettingsView />
                  )}
              </motion.div>
            </AnimatePresence>

            {/* Global User Modal */}
            <UserModal 
                isOpen={isUserModalOpen}
                onClose={() => setIsUserModalOpen(false)}
                onSave={handleSaveUser}
                user={editingUser}
                loading={modalLoading}
            />

          </main>
        </div>
      </div>
    </AppContext.Provider>
  );
};

export default App;