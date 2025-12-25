import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Edit2, Trash2, Plus } from 'lucide-react';
import { User } from '../types';

interface UserTableProps {
  users: User[];
  loading: boolean;
  onDelete: (id: string | number) => void;
  onEdit: (id: string | number) => void;
  onAdd?: () => void;
}

const UserTable: React.FC<UserTableProps> = ({ users, loading, onDelete, onEdit, onAdd }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-white">
        <h2 className="text-lg font-bold text-gray-800">User Management</h2>
        <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onAdd}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors shadow-blue-200 shadow-md"
        >
            <Plus size={16} />
            Add User
        </motion.button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50/50 text-gray-500 text-xs uppercase tracking-wider border-b border-gray-100">
              <th className="p-4 font-semibold">ID</th>
              <th className="p-4 font-semibold">Name</th>
              <th className="p-4 font-semibold">Email</th>
              <th className="p-4 font-semibold">Role</th>
              <th className="p-4 font-semibold">Status</th>
              <th className="p-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            <AnimatePresence mode='popLayout'>
            {loading ? (
              // Skeleton Rows
              Array.from({ length: 5 }).map((_, i) => (
                <motion.tr 
                  key={`skeleton-${i}`}
                  exit={{ opacity: 0 }}
                  className="animate-pulse"
                >
                  <td className="p-4"><div className="h-4 w-8 bg-gray-200 rounded"></div></td>
                  <td className="p-4 flex items-center gap-3">
                    <div className="h-8 w-8 bg-gray-200 rounded-full"></div>
                    <div className="h-4 w-24 bg-gray-200 rounded"></div>
                  </td>
                  <td className="p-4"><div className="h-4 w-32 bg-gray-200 rounded"></div></td>
                  <td className="p-4"><div className="h-4 w-16 bg-gray-200 rounded"></div></td>
                  <td className="p-4"><div className="h-6 w-16 bg-gray-200 rounded-full"></div></td>
                  <td className="p-4 text-right"><div className="h-8 w-20 bg-gray-200 rounded ml-auto"></div></td>
                </motion.tr>
              ))
            ) : (
              users.map((user, index) => (
                <motion.tr 
                    layout
                    key={user.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ delay: index * 0.05 }}
                    className="hover:bg-gray-50/80 transition-colors group"
                >
                  <td className="p-4 text-sm text-gray-500">#{user.id}</td>
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-xs font-bold uppercase overflow-hidden">
                             {user.avatar && user.avatar.includes('http') ? (
                                <img src={user.avatar} alt={user.name} className="w-full h-full rounded-full object-cover" />
                             ) : (
                                user.name.charAt(0)
                             )}
                        </div>
                        <span className="font-medium text-gray-900 text-sm">{user.name}</span>
                    </div>
                  </td>
                  <td className="p-4 text-sm text-gray-500">{user.email}</td>
                  <td className="p-4 text-sm text-gray-600">{user.role}</td>
                  <td className="p-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize
                        ${user.status === 'Active' 
                            ? 'bg-green-100 text-green-700 border border-green-200' 
                            : 'bg-red-100 text-red-700 border border-red-200'
                        }`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex justify-end gap-2 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                        <motion.button 
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => onEdit(user.id)}
                            className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                        >
                            <Edit2 size={16} />
                        </motion.button>
                        <motion.button 
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => onDelete(user.id)}
                            className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                        >
                            <Trash2 size={16} />
                        </motion.button>
                    </div>
                  </td>
                </motion.tr>
              ))
            )}
            </AnimatePresence>
          </tbody>
        </table>
      </div>
      
      {!loading && users.length === 0 && (
          <div className="p-8 text-center text-gray-500">
              No users found.
          </div>
      )}
    </div>
  );
};

export default UserTable;
