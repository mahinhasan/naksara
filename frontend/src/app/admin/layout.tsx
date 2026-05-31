import React from 'react';
import Link from 'next/link';
import { 
  LayoutDashboard, 
  ShoppingBag, 
  Users, 
  Package, 
  Settings, 
  LogOut,
  TrendingUp
} from 'lucide-react';

import Logo from '@/components/Logo';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-stone-100 font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-black text-white p-6 flex flex-col gap-8">
        <div className="flex items-center gap-3 px-2">
          <Logo light />
        </div>

        <nav className="flex flex-col gap-2">
          <Link href="/admin" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-stone-800 transition-colors">
            <LayoutDashboard size={20} />
            <span className="text-sm font-medium">Dashboard</span>
          </Link>
          <Link href="/admin/orders" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-stone-800 transition-colors">
            <ShoppingBag size={20} />
            <span className="text-sm font-medium">Orders</span>
          </Link>
          <Link href="/admin/users" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-stone-800 transition-colors">
            <Users size={20} />
            <span className="text-sm font-medium">Customers & Staff</span>
          </Link>
          <Link href="/admin/roles" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-stone-800 transition-colors">
            <Settings size={20} />
            <span className="text-sm font-medium">Permissions</span>
          </Link>
          <Link href="/admin/catalog" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-stone-800 transition-colors">
            <Package size={20} />
            <span className="text-sm font-medium">Inventory</span>
          </Link>
          <Link href="/admin/analytics" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-stone-800 transition-colors">
            <TrendingUp size={20} />
            <span className="text-sm font-medium">Analytics</span>
          </Link>
        </nav>

        <div className="mt-auto flex flex-col gap-2">
          <Link href="/admin/settings" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-stone-800 transition-colors">
            <Settings size={20} />
            <span className="text-sm font-medium">Settings</span>
          </Link>
          <button className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-red-900 transition-colors text-red-400">
            <LogOut size={20} />
            <span className="text-sm font-medium">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-serif">Admin Management</h1>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm font-bold">Mahin</p>
              <p className="text-xs text-stone-500 uppercase tracking-widest">Store Manager</p>
            </div>
            <div className="w-10 h-10 bg-stone-300 rounded-full" />
          </div>
        </header>
        {children}
      </main>
    </div>
  );
}
