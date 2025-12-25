import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, DollarSign, Activity, CreditCard } from 'lucide-react';

interface ReportsViewProps {
  data: any;
  loading: boolean;
}

const ReportsView: React.FC<ReportsViewProps> = ({ data, loading }) => {
  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-64 bg-white rounded-xl"></div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="h-64 bg-white rounded-xl"></div>
            <div className="h-64 bg-white rounded-xl"></div>
        </div>
      </div>
    );
  }

  const maxBarHeight = 160; // px

  return (
    <div className="space-y-6">
      {/* Revenue Chart Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100"
      >
        <div className="flex justify-between items-center mb-8">
            <div>
                <h2 className="text-lg font-bold text-gray-800">Revenue Analytics</h2>
                <p className="text-sm text-gray-500">Weekly earnings performance</p>
            </div>
            <div className="flex items-center gap-2 text-green-600 bg-green-50 px-3 py-1 rounded-full text-sm font-semibold">
                <TrendingUp size={16} />
                +14.5%
            </div>
        </div>

        {/* Custom Bar Chart */}
        <div className="flex items-end justify-between h-48 px-2 sm:px-10">
            {data?.revenueData.map((heightPerc: number, index: number) => (
                <div key={index} className="flex flex-col items-center gap-3 group">
                    <div className="relative flex items-end h-40 w-8 sm:w-12 bg-gray-100 rounded-lg overflow-hidden">
                        <motion.div 
                            initial={{ height: 0 }}
                            animate={{ height: `${heightPerc}%` }}
                            transition={{ duration: 0.8, delay: index * 0.1, type: "spring" }}
                            className="w-full bg-blue-600 rounded-t-lg opacity-80 group-hover:opacity-100 transition-opacity relative"
                        >
                            {/* Tooltip on hover */}
                            <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                                ${heightPerc * 100}
                            </div>
                        </motion.div>
                    </div>
                    <span className="text-xs font-medium text-gray-500">{data?.labels[index]}</span>
                </div>
            ))}
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Products */}
        <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100"
        >
            <h3 className="text-lg font-bold text-gray-800 mb-6">Top Selling Products</h3>
            <div className="space-y-4">
                {data?.topProducts.map((product: any, idx: number) => (
                    <div key={idx} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-xl transition-colors">
                        <div className="flex items-center gap-4">
                            <div className="bg-indigo-100 p-2.5 rounded-lg text-indigo-600">
                                <Activity size={20} />
                            </div>
                            <div>
                                <p className="font-semibold text-gray-800 text-sm">{product.name}</p>
                                <p className="text-xs text-gray-500">{product.sales} sales</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="font-bold text-gray-900">{product.revenue}</p>
                            <p className={`text-xs font-medium ${product.growth.startsWith('+') ? 'text-green-600' : 'text-red-500'}`}>
                                {product.growth}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </motion.div>

        {/* Recent Transactions */}
        <motion.div 
             initial={{ opacity: 0, x: 20 }}
             animate={{ opacity: 1, x: 0 }}
             transition={{ delay: 0.3 }}
             className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100"
        >
            <h3 className="text-lg font-bold text-gray-800 mb-6">Recent Transactions</h3>
            <div className="space-y-2">
                {data?.recentTransactions.map((tx: any, idx: number) => (
                    <div key={idx} className="flex items-center justify-between p-3 border-b border-gray-50 last:border-0">
                        <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-full ${tx.status === 'Completed' ? 'bg-green-100 text-green-600' : tx.status === 'Pending' ? 'bg-orange-100 text-orange-600' : 'bg-red-100 text-red-600'}`}>
                                <DollarSign size={16} />
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-gray-800">{tx.user}</p>
                                <p className="text-xs text-gray-400">{tx.date}</p>
                            </div>
                        </div>
                        <div className="text-right">
                             <p className="text-sm font-bold text-gray-900">{tx.amount}</p>
                             <p className={`text-[10px] uppercase font-bold tracking-wider ${tx.status === 'Completed' ? 'text-green-600' : tx.status === 'Pending' ? 'text-orange-500' : 'text-red-500'}`}>
                                {tx.status}
                             </p>
                        </div>
                    </div>
                ))}
            </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ReportsView;
