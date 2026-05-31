"use client";

import React, { useState, useEffect } from 'react';
import { ShoppingBag, Users, DollarSign, ArrowUpRight, TrendingUp } from 'lucide-react';

export default function AdminDashboard() {
  const [stats, setStats] = useState([
    { label: 'Total Revenue', value: '$0', icon: DollarSign, change: '0%', color: 'bg-emerald-50 text-emerald-600' },
    { label: 'Daily Orders', value: '0', icon: ShoppingBag, change: '0%', color: 'bg-blue-50 text-blue-600' },
    { label: 'Active Customers', value: '0', icon: Users, change: '0%', color: 'bg-purple-50 text-purple-600' },
    { label: 'Conversion Rate', value: '0%', icon: TrendingUp, change: '0%', color: 'bg-orange-50 text-orange-600' },
  ]);
  const [recentOrders, setRecentOrders] = useState([]);
  const [lowStockProducts, setLowStockProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      };
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const [statsRes, ordersRes, stockRes] = await Promise.all([
        fetch(`${apiUrl}/admin/stats`, { headers }),
        fetch(`${apiUrl}/admin/orders?limit=5`, { headers }),
        fetch(`${apiUrl}/catalog/products?limit=5`) // public route, no token needed
      ]);

      const statsData = await statsRes.json();
      const ordersData = await ordersRes.json();
      const stockData = await stockRes.json();

      setStats([
        { label: 'Total Revenue', value: `$${(statsData.totalRevenue || 0).toLocaleString()}`, icon: DollarSign, change: `${statsData.revenueChange || 0}%`, color: 'bg-emerald-50 text-emerald-600' },
        { label: 'Daily Orders', value: (statsData.dailyOrders || 0).toString(), icon: ShoppingBag, change: `${statsData.ordersChange || 0}%`, color: 'bg-blue-50 text-blue-600' },
        { label: 'Active Customers', value: (statsData.totalUsers || 0).toLocaleString(), icon: Users, change: `${statsData.customersChange || 0}%`, color: 'bg-purple-50 text-purple-600' },
        { label: 'Conversion Rate', value: `${statsData.conversionRate || 0}%`, icon: TrendingUp, change: `${statsData.conversionChange || 0}%`, color: 'bg-orange-50 text-orange-600' },
      ]);

      setRecentOrders(ordersData.items || []);
      // Filter low stock (< 5) products on frontend dynamically
      const lowStock = (stockData.items || []).filter((p: any) => p.stockQuantity < 10);
      setLowStockProducts(lowStock);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-8 text-center">Loading Dashboard...</div>;

  return (
    <div className="flex flex-col gap-8">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <div className={`p-3 rounded-xl ${stat.color}`}>
                <stat.icon size={24} />
              </div>
              <span className={`flex items-center text-xs font-bold ${stat.change.startsWith('+') ? 'text-emerald-600' : 'text-stone-400'}`}>
                {stat.change} <ArrowUpRight size={12} className="ml-1" />
              </span>
            </div>
            <h3 className="text-stone-500 text-sm font-medium mb-1">{stat.label}</h3>
            <p className="text-2xl font-bold font-serif">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Orders Table */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-stone-100 flex justify-between items-center">
            <h2 className="text-lg font-serif">Recent Orders</h2>
            <button className="text-sm font-bold text-stone-500 uppercase tracking-widest hover:text-black transition-colors">View All</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-stone-50 text-stone-500 text-[10px] uppercase tracking-widest font-bold">
                  <th className="px-6 py-4">Order Number</th>
                  <th className="px-6 py-4">Customer</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Amount</th>
                  <th className="px-6 py-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="text-sm divide-y divide-stone-100">
                {recentOrders.map((order: any) => (
                  <tr key={order.id} className="hover:bg-stone-50 transition-colors">
                    <td className="px-6 py-4 font-bold">{order.orderNumber}</td>
                    <td className="px-6 py-4 text-stone-600">{order.user?.name || 'Guest'}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest
                        ${order.status === 'DELIVERED' ? 'bg-emerald-100 text-emerald-700' : 
                          order.status === 'PROCESSING' ? 'bg-blue-100 text-blue-700' : 
                          order.status === 'SHIPPED' ? 'bg-purple-100 text-purple-700' : 
                          'bg-orange-100 text-orange-700'}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-medium">${order.total.toFixed(2)}</td>
                    <td className="px-6 py-4 text-right">
                      <button className="text-stone-400 hover:text-black">•••</button>
                    </td>
                  </tr>
                ))}
                {recentOrders.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-stone-400 italic">No recent orders.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Inventory Alert */}
        <div className="bg-white rounded-2xl border border-stone-200 shadow-sm p-6">
          <h2 className="text-lg font-serif mb-6">Low Stock Alerts</h2>
          <div className="flex flex-col gap-4">
            {lowStockProducts.map((item: any) => (
              <div key={item.id} className="flex items-center gap-4 p-3 rounded-xl border border-stone-100">
                {item.images?.[0] ? (
                  <img src={item.images[0].url} alt={item.name} className="w-12 h-12 object-cover rounded-lg" />
                ) : (
                  <div className="w-12 h-12 bg-stone-100 rounded-lg flex items-center justify-center text-stone-400 text-[10px]">No Img</div>
                )}
                <div className="flex-1">
                  <h4 className="text-xs font-bold truncate max-w-[150px]">{item.name}</h4>
                  <p className="text-[10px] text-red-500 font-bold uppercase tracking-tighter">Stock: {item.stockQuantity} left</p>
                </div>
                <button className="text-[10px] font-bold uppercase tracking-widest text-blue-600">Restock</button>
              </div>
            ))}
            {lowStockProducts.length === 0 && (
              <div className="p-4 text-center text-stone-400 text-xs italic">All items well stocked.</div>
            )}
          </div>
          <button className="w-full mt-6 py-3 border border-stone-200 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-stone-50 transition-colors">
            Manage Inventory
          </button>
        </div>
      </div>
    </div>
  );
}
