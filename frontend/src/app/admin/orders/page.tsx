"use client";

import React, { useState, useEffect } from 'react';
import { Search, Filter, Download, ExternalLink } from 'lucide-react';

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${apiUrl}/admin/orders`);
      const data = await response.json();
      setOrders(data.items || []);
      setTotalCount(data.total || 0);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-8 text-center">Loading Orders...</div>;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-serif">Order Management</h2>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-stone-200 rounded-lg text-xs font-bold uppercase tracking-widest hover:bg-stone-50 transition-all">
            <Download size={14} /> Export CSV
          </button>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-sm flex flex-wrap gap-4 items-center">
        <div className="flex-1 min-w-[300px] relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" size={18} />
          <input 
            type="text" 
            placeholder="Search by Order ID, Customer, or Email..." 
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-stone-200 focus:outline-none focus:ring-2 focus:ring-black/5 text-sm"
          />
        </div>
        <div className="flex gap-2">
          <select className="px-4 py-2 rounded-lg border border-stone-200 bg-white text-sm focus:outline-none">
            <option>All Statuses</option>
            <option>PENDING</option>
            <option>PROCESSING</option>
            <option>SHIPPED</option>
            <option>DELIVERED</option>
            <option>CANCELLED</option>
          </select>
          <button className="p-2 bg-stone-100 rounded-lg text-stone-600 hover:bg-stone-200 transition-colors">
            <Filter size={20} />
          </button>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-stone-50 text-stone-500 text-[10px] uppercase tracking-widest font-bold">
                <th className="px-6 py-4">Order Info</th>
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4">Items</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Total</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-stone-100">
              {orders.map((order: any) => (
                <tr key={order.id} className="hover:bg-stone-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="font-bold">{order.orderNumber}</span>
                      <span className="text-[10px] text-stone-400">{new Date(order.createdAt).toLocaleDateString()}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="font-medium text-stone-900">{order.user?.name || 'Guest'}</span>
                      <span className="text-xs text-stone-500">{order.user?.email || 'N/A'}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-stone-600">{order.items?.length || 0} items</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest
                      ${order.status === 'DELIVERED' ? 'bg-emerald-100 text-emerald-700' : 
                        order.status === 'PROCESSING' ? 'bg-blue-100 text-blue-700' : 
                        order.status === 'SHIPPED' ? 'bg-purple-100 text-purple-700' : 
                        'bg-orange-100 text-orange-700'}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-bold">${order.total.toFixed(2)}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button className="p-2 text-stone-400 hover:text-black hover:bg-stone-100 rounded-lg transition-all">
                        <ExternalLink size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {orders.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-stone-500 italic">No orders found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="p-4 bg-stone-50 border-t border-stone-100 flex justify-between items-center text-xs">
          <span className="text-stone-500">Showing {orders.length} of {totalCount} orders</span>
          <div className="flex gap-2">
            <button className="px-3 py-1 border border-stone-200 rounded bg-white disabled:opacity-50" disabled>Previous</button>
            <button className="px-3 py-1 border border-stone-200 rounded bg-white">Next</button>
          </div>
        </div>
      </div>
    </div>
  );
}
