import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Info, X, ArrowRight, TrendingUp } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  colorClass: string;
  delay: number;
  loading?: boolean;
  description?: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, colorClass, delay, loading, description }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  if (loading) {
    return (
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 h-48 animate-pulse flex flex-col justify-between">
        <div className="flex justify-between items-start">
            <div className="h-12 w-12 bg-gray-200 rounded-xl"></div>
            <div className="h-6 w-16 bg-gray-200 rounded-full"></div>
        </div>
        <div className="space-y-3">
            <div className="h-10 w-2/3 bg-gray-200 rounded"></div>
            <div className="h-4 w-1/3 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="h-48 w-full [perspective:1000px] cursor-pointer group"
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0, rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6, type: "spring", stiffness: 260, damping: 20, delay: delay * 0.1 }}
        className="relative w-full h-full [transform-style:preserve-3d] shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-2xl"
      >
        {/* Front of Card */}
        <div className={`absolute inset-0 w-full h-full ${colorClass} rounded-2xl p-6 text-white [backface-visibility:hidden] flex flex-col justify-between overflow-hidden relative border border-white/10`}>
           
           {/* Decorative Background Elements */}
           <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl pointer-events-none" />
           <div className="absolute bottom-0 left-0 w-32 h-32 bg-black/5 blur-2xl rounded-full pointer-events-none" />

           {/* Header: Icon & Info Badge */}
           <div className="relative z-10 flex justify-between items-start">
                <div className="p-3 bg-white/20 rounded-xl backdrop-blur-md shadow-inner text-white border border-white/20">
                    {icon}
                </div>
                
                <motion.div 
                    initial={{ opacity: 0.6 }}
                    whileHover={{ opacity: 1, scale: 1.05 }}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-black/20 backdrop-blur-sm rounded-full border border-white/10 transition-all"
                >
                    <Info size={14} className="text-white/90" />
                    <span className="text-xs font-medium text-white/90">Details</span>
                </motion.div>
           </div>

           {/* Content: Value & Title */}
           <div className="relative z-10 mt-2">
                <div className="flex items-baseline gap-2">
                    <h2 className="text-4xl font-bold tracking-tight text-white drop-shadow-sm">{value}</h2>
                    {/* Optional Growth Indicator Simulation */}
                    <span className="flex items-center text-xs font-semibold bg-white/20 px-1.5 py-0.5 rounded text-white/90">
                        <TrendingUp size={10} className="mr-1" />
                        +2.4%
                    </span>
                </div>
                <p className="text-white/80 text-sm font-medium uppercase tracking-wide mt-1 opacity-90">{title}</p>
           </div>
           
           {/* Hover Hint */}
           <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 translate-x-2 group-hover:translate-x-0">
             <ArrowRight size={20} className="text-white/70" />
           </div>
        </div>

        {/* Back of Card */}
        <div className="absolute inset-0 w-full h-full bg-white rounded-2xl p-6 text-gray-800 [backface-visibility:hidden] [transform:rotateY(180deg)] border border-gray-100 flex flex-col shadow-sm">
            <div className="flex justify-between items-center mb-4 border-b border-gray-100 pb-3">
                <h4 className="text-base font-bold text-gray-800 flex items-center gap-2">
                    {title}
                </h4>
                <button className="text-gray-400 hover:text-gray-600 bg-gray-50 hover:bg-gray-100 p-1 rounded-full transition-colors">
                    <X size={16} />
                </button>
            </div>
            
            <div className="flex-1 overflow-y-auto custom-scrollbar">
                <p className="text-sm text-gray-500 leading-relaxed">
                  {description || "This metric tracks the overall performance and growth over the last 30 days. Click to flip back to the summary view."}
                </p>
                
                <div className="mt-4 pt-3 border-t border-gray-50">
                    <div className="flex justify-between items-center text-xs text-gray-400">
                        <span>Last updated:</span>
                        <span className="font-medium text-gray-600">Just now</span>
                    </div>
                </div>
            </div>
        </div>
      </motion.div>
    </div>
  );
};

export default StatCard;