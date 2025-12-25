import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutDashboard, Users, FileBarChart, Settings, LogOut, X, ShieldCheck } from 'lucide-react';
import { DashboardState } from '../types';
import { useAppContext } from '../App';

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  currentView: DashboardState['currentView'];
  setView: DashboardState['setView'];
  isMobile: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, setIsOpen, currentView, setView, isMobile }) => {
  const { handleLogout } = useAppContext();
  
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'reports', label: 'Reports', icon: FileBarChart },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const handleNavClick = (id: any) => {
    setView(id);
    if (isMobile) setIsOpen(false);
  };

  const SidebarContent = () => (
    <div className="h-full flex flex-col bg-[#1e293b] text-white w-64 shadow-2xl overflow-hidden">
      {/* Logo Section */}
      <div className="h-16 flex items-center px-6 border-b border-slate-700/50 relative z-20 bg-[#1e293b]">
        <div className="flex items-center gap-3">
          <motion.div 
            whileHover={{ rotate: 360 }}
            transition={{ duration: 0.5 }}
            className="bg-blue-600 p-1.5 rounded-lg shadow-lg shadow-blue-500/20"
          >
            <ShieldCheck size={24} className="text-white" />
          </motion.div>
          <span className="text-xl font-bold tracking-tight">Admin Panel</span>
        </div>
        {isMobile && (
            <button onClick={() => setIsOpen(false)} className="ml-auto text-slate-400 hover:text-white">
                <X size={24} />
            </button>
        )}
      </div>

      {/* Navigation */}
      <div className="flex-1 py-6 px-3 space-y-2 overflow-y-auto">
        {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
                <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id)}
                    className={`relative w-full flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium transition-colors duration-200 outline-none
                        ${isActive ? 'text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800/50'}
                    `}
                >
                    {isActive && (
                        <motion.div
                            layoutId="sidebar-active-indicator"
                            className="absolute inset-0 bg-blue-600 rounded-lg shadow-md shadow-blue-900/20"
                            initial={false}
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        />
                    )}
                    <span className="relative z-10 flex items-center gap-3">
                        <Icon size={20} className={isActive ? 'text-white' : 'currentColor'} />
                        {item.label}
                    </span>
                </button>
            )
        })}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-slate-700/50 bg-[#1e293b] relative z-20">
        <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all"
        >
            <LogOut size={20} />
            Logout
        </button>
      </div>
    </div>
  );

  return (
    <>
        {/* Desktop Sidebar (Fixed) */}
        <div className="hidden md:block fixed left-0 top-0 h-full w-64 z-30">
            <SidebarContent />
        </div>

        {/* Mobile Sidebar (Overlay) */}
        <AnimatePresence>
            {isMobile && isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsOpen(false)}
                        className="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm"
                    />
                    <motion.div
                        initial={{ x: -280 }}
                        animate={{ x: 0 }}
                        exit={{ x: -280 }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        className="fixed left-0 top-0 h-full z-50"
                    >
                        <SidebarContent />
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    </>
  );
};

export default Sidebar;
