"use client";

import React, { useState, useEffect } from 'react';
import { UserPlus, Shield, Ban, Mail } from 'lucide-react';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState({ totalCustomers: 0, storeAdmins: 0, supportStaff: 0 });

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${apiUrl}/admin/users`);
      const data = await response.json();
      setUsers(data.items || []);
      
      // Calculate summary stats locally or from separate endpoint
      const customers = data.items?.filter((u: any) => u.role === 'CUSTOMER').length || 0;
      const admins = data.items?.filter((u: any) => u.role === 'ADMIN').length || 0;
      const editors = data.items?.filter((u: any) => u.role === 'EDITOR').length || 0;
      
      setSummary({ totalCustomers: customers, storeAdmins: admins, supportStaff: editors });
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-8 text-center">Loading Users...</div>;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-serif">Customer & Staff Management</h2>
        <button className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg text-xs font-bold uppercase tracking-widest hover:bg-stone-800 transition-all shadow-sm">
          <UserPlus size={14} /> Add New Staff
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Total Customers', value: summary.totalCustomers.toLocaleString(), change: '0' },
          { label: 'Store Admins', value: summary.storeAdmins.toString(), change: '0' },
          { label: 'Support Staff', value: summary.supportStaff.toString(), change: '0' },
        ].map((s) => (
          <div key={s.label} className="bg-white p-6 rounded-xl border border-stone-200 shadow-sm">
            <h4 className="text-stone-500 text-xs font-bold uppercase tracking-widest mb-1">{s.label}</h4>
            <p className="text-2xl font-bold font-serif">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-stone-50 text-stone-500 text-[10px] uppercase tracking-widest font-bold">
                <th className="px-6 py-4">User</th>
                <th className="px-6 py-4">Role</th>
                <th className="px-6 py-4">Joined</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-stone-100">
              {users.map((user: any) => (
                <tr key={user.id} className="hover:bg-stone-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-stone-200 rounded-full flex items-center justify-center font-bold text-stone-600 text-xs">
                        {user.name?.charAt(0) || '?'}
                      </div>
                      <div className="flex flex-col">
                        <span className="font-bold">{user.name}</span>
                        <span className="text-xs text-stone-500">{user.email}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded text-[10px] font-bold tracking-widest
                      ${user.role === 'ADMIN' ? 'bg-red-50 text-red-700' : 
                        user.role === 'EDITOR' ? 'bg-blue-50 text-blue-700' : 
                        'bg-stone-100 text-stone-600'}`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-stone-500">{new Date(user.createdAt).toLocaleDateString()}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button className="p-2 text-stone-400 hover:text-black hover:bg-stone-100 rounded-lg transition-all" title="Send Email">
                        <Mail size={16} />
                      </button>
                      <button className="p-2 text-stone-400 hover:text-black hover:bg-stone-100 rounded-lg transition-all" title="Edit Permissions">
                        <Shield size={16} />
                      </button>
                      <button className="p-2 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all" title="Ban User">
                        <Ban size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-stone-500 italic">No users found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
