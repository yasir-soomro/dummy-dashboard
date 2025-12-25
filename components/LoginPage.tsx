import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, Mail, Lock, Loader2, AlertCircle, User, ArrowRight } from 'lucide-react';
import { login, signup } from '../services/api';

interface LoginPageProps {
  onLoginSuccess: (userData: any) => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  
  // Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('admin@example.com');
  const [password, setPassword] = useState('password');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setError('');
    setSuccessMsg('');
    // Reset defaults for convenience
    if (!isLogin) {
      setEmail('admin@example.com');
      setPassword('password');
    } else {
      setEmail('');
      setPassword('');
      setName('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccessMsg('');

    try {
      if (isLogin) {
        const user = await login(email, password);
        onLoginSuccess(user);
      } else {
        await signup(name, email, password);
        setSuccessMsg('Account created successfully! Logging you in...');
        // Auto login after signup
        setTimeout(async () => {
             const user = await login(email, password);
             onLoginSuccess(user);
        }, 1500);
      }
    } catch (err: any) {
      setError(err.message || 'Authentication failed');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f3f4f6] px-4 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
         <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] bg-blue-200/30 rounded-full blur-3xl"></div>
         <div className="absolute top-[40%] -right-[10%] w-[40%] h-[60%] bg-purple-200/30 rounded-full blur-3xl"></div>
      </div>

      <motion.div 
        layout
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden border border-white/50 relative z-10 backdrop-blur-sm"
      >
        <div className="p-8">
          <div className="flex flex-col items-center mb-6">
            <motion.div 
              initial={{ rotate: -180, scale: 0 }}
              animate={{ rotate: 0, scale: 1 }}
              transition={{ type: "spring", stiffness: 200 }}
              className="bg-gradient-to-tr from-blue-600 to-indigo-600 p-3 rounded-xl shadow-lg shadow-blue-500/30 mb-4"
            >
              <ShieldCheck size={32} className="text-white" />
            </motion.div>
            
            <h2 className="text-2xl font-bold text-gray-800">
                {isLogin ? 'Welcome Back' : 'Create Account'}
            </h2>
            <p className="text-gray-500 text-sm mt-1">
                {isLogin ? 'Enter your credentials to access the dashboard' : 'Get started with your free admin account'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <AnimatePresence mode='popLayout'>
                {!isLogin && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="space-y-2 overflow-hidden"
                    >
                    <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide ml-1">Full Name</label>
                    <div className="relative group">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors" size={18} />
                        <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-gray-700 bg-gray-50 focus:bg-white"
                        placeholder="John Doe"
                        required={!isLogin}
                        />
                    </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide ml-1">Email Address</label>
              <div className="relative group">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors" size={18} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-gray-700 bg-gray-50 focus:bg-white"
                  placeholder="name@company.com"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide ml-1">Password</label>
              <div className="relative group">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors" size={18} />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-gray-700 bg-gray-50 focus:bg-white"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            {error && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 text-red-600 text-sm bg-red-50 p-3 rounded-lg border border-red-100"
              >
                <AlertCircle size={16} />
                {error}
              </motion.div>
            )}

            {successMsg && (
                <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-2 text-green-600 text-sm bg-green-50 p-3 rounded-lg border border-green-100"
                >
                    <ShieldCheck size={16} />
                    {successMsg}
                </motion.div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-xl font-bold hover:shadow-lg hover:shadow-blue-500/30 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed mt-4"
            >
              {loading ? (
                <>
                  <Loader2 size={20} className="animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  {isLogin ? 'Sign In' : 'Create Account'}
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
                {isLogin ? "Don't have an account? " : "Already have an account? "}
                <button 
                    onClick={toggleMode}
                    className="text-blue-600 font-semibold hover:text-blue-700 transition-colors hover:underline"
                >
                    {isLogin ? 'Sign Up' : 'Sign In'}
                </button>
            </p>
          </div>
        </div>
        
        {isLogin && (
            <div className="bg-gray-50 p-4 text-center text-xs text-gray-400 border-t border-gray-100">
            <p>Demo: admin@example.com / password</p>
            </div>
        )}
      </motion.div>
    </div>
  );
};

export default LoginPage;
