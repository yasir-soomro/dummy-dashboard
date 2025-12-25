import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Save, User, Mail, Shield, Activity, Loader2 } from 'lucide-react';
import { User as UserType } from '../types';

interface UserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (user: Partial<UserType>) => Promise<void>;
  user?: UserType | null;
  loading: boolean;
}

const UserModal: React.FC<UserModalProps> = ({ isOpen, onClose, onSave, user, loading }) => {
  const [formData, setFormData] = useState<Partial<UserType>>({
    name: '',
    email: '',
    role: 'Member',
    status: 'Active'
  });

  useEffect(() => {
    if (user) {
      setFormData(user);
    } else {
      setFormData({ name: '', email: '', role: 'Member', status: 'Active' });
    }
  }, [user, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
      />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden relative z-10"
      >
        <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gray-50/50">
          <h2 className="text-xl font-bold text-gray-800">
            {user ? 'Edit User' : 'Add New User'}
          </h2>
          <button 
            onClick={onClose} 
            className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-2 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
            {/* Name */}
            <div className="space-y-2">
                <label className="text-xs font-semibold text-gray-500 uppercase flex items-center gap-2">
                    <User size={14} /> Full Name
                </label>
                <input 
                    type="text" 
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-sm text-gray-800"
                    placeholder="Enter full name"
                    required
                />
            </div>

            {/* Email */}
            <div className="space-y-2">
                <label className="text-xs font-semibold text-gray-500 uppercase flex items-center gap-2">
                    <Mail size={14} /> Email Address
                </label>
                <input 
                    type="email" 
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-sm text-gray-800"
                    placeholder="name@company.com"
                    required
                />
            </div>

            {/* Role & Status Row */}
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label className="text-xs font-semibold text-gray-500 uppercase flex items-center gap-2">
                        <Shield size={14} /> Role
                    </label>
                    <select 
                        value={formData.role}
                        onChange={(e) => setFormData({...formData, role: e.target.value as any})}
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-sm text-gray-800 bg-white"
                    >
                        <option value="Admin">Admin</option>
                        <option value="Editor">Editor</option>
                        <option value="Member">Member</option>
                    </select>
                </div>
                
                <div className="space-y-2">
                    <label className="text-xs font-semibold text-gray-500 uppercase flex items-center gap-2">
                        <Activity size={14} /> Status
                    </label>
                    <select 
                        value={formData.status}
                        onChange={(e) => setFormData({...formData, status: e.target.value as any})}
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-sm text-gray-800 bg-white"
                    >
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                    </select>
                </div>
            </div>

            {/* Actions */}
            <div className="pt-4 flex gap-3">
                <button 
                    type="button"
                    onClick={onClose}
                    className="flex-1 px-4 py-2.5 border border-gray-200 text-gray-600 rounded-xl text-sm font-semibold hover:bg-gray-50 transition-colors"
                >
                    Cancel
                </button>
                <button 
                    type="submit"
                    disabled={loading}
                    className="flex-[2] flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/30 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                    {loading ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                    {user ? 'Save Changes' : 'Create User'}
                </button>
            </div>
        </form>
      </motion.div>
    </div>
  );
};

export default UserModal;
