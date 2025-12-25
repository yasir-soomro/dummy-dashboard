import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Bell, Lock, Save, Loader2, Check } from 'lucide-react';
import { useAppContext } from '../App';
import { updateUser } from '../services/api';

const SettingsView: React.FC = () => {
  const { currentUser, updateCurrentUser } = useAppContext();
  
  // State
  const [formData, setFormData] = useState({
      name: '',
      email: '',
      role: '',
  });
  
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [marketingEmails, setMarketingEmails] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  
  useEffect(() => {
      if (currentUser) {
          setFormData({
              name: currentUser.name || '',
              email: currentUser.email || '',
              role: currentUser.role || '',
          });
      }
  }, [currentUser]);

  const handleSave = async () => {
      setLoading(true);
      setSuccess(false);
      try {
          const updatedUser = await updateUser({
              ...currentUser,
              name: formData.name,
              email: formData.email
          });
          
          updateCurrentUser(updatedUser);
          setSuccess(true);
          setTimeout(() => setSuccess(false), 3000);
      } catch (error) {
          console.error("Failed to update profile", error);
      } finally {
          setLoading(false);
      }
  };

  const sectionVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1, 
      y: 0,
      transition: { delay: i * 0.1, duration: 0.4 }
    })
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-10">
      
      {/* Profile Section */}
      <motion.div 
        custom={0}
        initial="hidden"
        animate="visible"
        variants={sectionVariants}
        className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
      >
        <div className="flex items-center gap-4 border-b border-gray-100 pb-4 mb-6">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                <User size={24} />
            </div>
            <div>
                <h2 className="text-lg font-bold text-gray-800">Profile Information</h2>
                <p className="text-sm text-gray-500">Update your account's public profile and email.</p>
            </div>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
            <div className="flex flex-col items-center gap-4">
                <div className="relative group cursor-pointer">
                    <img 
                        src={currentUser.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser.name)}&background=random`} 
                        alt="Profile" 
                        className="w-24 h-24 rounded-full object-cover border-4 border-gray-50 shadow-sm"
                    />
                    <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <span className="text-white text-xs font-medium">Auto</span>
                    </div>
                </div>
            </div>

            <div className="flex-1 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="text-xs font-semibold text-gray-600 uppercase">Full Name</label>
                        <input 
                            type="text" 
                            value={formData.name}
                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm text-gray-700 bg-gray-50 focus:bg-white transition-all"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-semibold text-gray-600 uppercase">Role</label>
                        <input 
                            type="text" 
                            value={formData.role} 
                            disabled 
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg bg-gray-100 text-gray-500 cursor-not-allowed text-sm"
                        />
                    </div>
                </div>
                <div className="space-y-2">
                    <label className="text-xs font-semibold text-gray-600 uppercase">Email Address</label>
                    <input 
                        type="email" 
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm text-gray-700 bg-gray-50 focus:bg-white transition-all"
                    />
                </div>
            </div>
        </div>
      </motion.div>

      {/* Notifications Section */}
      <motion.div 
        custom={1}
        initial="hidden"
        animate="visible"
        variants={sectionVariants}
        className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
      >
        <div className="flex items-center gap-4 border-b border-gray-100 pb-4 mb-6">
            <div className="p-2 bg-yellow-50 text-yellow-600 rounded-lg">
                <Bell size={24} />
            </div>
            <div>
                <h2 className="text-lg font-bold text-gray-800">Notifications</h2>
                <p className="text-sm text-gray-500">Manage how you receive updates and alerts.</p>
            </div>
        </div>

        <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                    <p className="font-medium text-gray-800 text-sm">Email Notifications</p>
                    <p className="text-xs text-gray-500">Receive daily summaries and alerts.</p>
                </div>
                <button 
                    onClick={() => setEmailNotifications(!emailNotifications)}
                    className={`relative w-11 h-6 rounded-full transition-colors ${emailNotifications ? 'bg-blue-600' : 'bg-gray-300'}`}
                >
                    <span className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform ${emailNotifications ? 'translate-x-5' : 'translate-x-0'}`} />
                </button>
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                    <p className="font-medium text-gray-800 text-sm">Marketing Emails</p>
                    <p className="text-xs text-gray-500">Receive offers and product updates.</p>
                </div>
                <button 
                    onClick={() => setMarketingEmails(!marketingEmails)}
                    className={`relative w-11 h-6 rounded-full transition-colors ${marketingEmails ? 'bg-blue-600' : 'bg-gray-300'}`}
                >
                    <span className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform ${marketingEmails ? 'translate-x-5' : 'translate-x-0'}`} />
                </button>
            </div>
        </div>
      </motion.div>

      {/* Security Section */}
      <motion.div 
        custom={2}
        initial="hidden"
        animate="visible"
        variants={sectionVariants}
        className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
      >
        <div className="flex items-center gap-4 border-b border-gray-100 pb-4 mb-6">
            <div className="p-2 bg-red-50 text-red-600 rounded-lg">
                <Lock size={24} />
            </div>
            <div>
                <h2 className="text-lg font-bold text-gray-800">Security</h2>
                <p className="text-sm text-gray-500">Update your password and security preferences.</p>
            </div>
        </div>

        <div className="space-y-4 max-w-md">
            <div className="space-y-2">
                <label className="text-xs font-semibold text-gray-600 uppercase">Current Password</label>
                <input type="password" placeholder="••••••••" className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm" />
            </div>
            <div className="space-y-2">
                <label className="text-xs font-semibold text-gray-600 uppercase">New Password</label>
                <input type="password" placeholder="••••••••" className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm" />
            </div>
            <button className="px-4 py-2 bg-gray-800 text-white rounded-lg text-sm font-medium hover:bg-gray-900 transition-colors">
                Update Password
            </button>
        </div>
      </motion.div>
      
      {/* Save Button */}
      <div className="flex justify-end pt-4">
        <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleSave}
            disabled={loading}
            className={`flex items-center gap-2 px-8 py-3 rounded-xl font-bold shadow-lg transition-all ${success ? 'bg-green-600 shadow-green-500/20' : 'bg-gradient-to-r from-blue-600 to-indigo-600 shadow-blue-500/20'} text-white`}
        >
            {loading ? (
                <Loader2 size={18} className="animate-spin" />
            ) : success ? (
                <Check size={18} />
            ) : (
                <Save size={18} />
            )}
            {success ? 'Saved!' : 'Save Changes'}
        </motion.button>
      </div>

    </div>
  );
};

export default SettingsView;