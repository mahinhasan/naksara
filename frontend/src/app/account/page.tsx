"use client";

import React from 'react';
import Navbar from '@/components/Navbar';
import { User, Package, Heart, MapPin, LogOut } from 'lucide-react';

export default function AccountPage() {
  return (
    <div className="min-h-screen bg-stone-50">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
        <header className="mb-12">
          <h1 className="text-4xl font-serif mb-2">My Account</h1>
          <p className="text-stone-600">Manage your profile, orders, and preferences.</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <aside className="lg:col-span-1">
            <nav className="bg-white rounded-2xl border border-stone-200 p-4 space-y-1">
              {[
                { label: 'Profile', icon: User, active: true },
                { label: 'Orders', icon: Package },
                { label: 'Wishlist', icon: Heart },
                { label: 'Addresses', icon: MapPin },
              ].map((item) => (
                <button 
                  key={item.label}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                    item.active ? 'bg-stone-900 text-white' : 'text-stone-600 hover:bg-stone-50'
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  {item.label}
                </button>
              ))}
              <hr className="my-2 border-stone-100" />
              <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 transition-colors">
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </nav>
          </aside>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-2xl border border-stone-200 p-8">
              <h2 className="text-2xl font-serif mb-6">Profile Information</h2>
              
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row gap-6">
                  <div className="flex-1">
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-stone-400 mb-2">First Name</label>
                    <div className="p-3 bg-stone-50 border border-stone-200 rounded-lg text-stone-900">Guest</div>
                  </div>
                  <div className="flex-1">
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-stone-400 mb-2">Last Name</label>
                    <div className="p-3 bg-stone-50 border border-stone-200 rounded-lg text-stone-900">User</div>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-stone-400 mb-2">Email Address</label>
                  <div className="p-3 bg-stone-50 border border-stone-200 rounded-lg text-stone-900">guest@example.com</div>
                </div>

                <div className="pt-6">
                  <button className="px-8 py-3 border border-stone-200 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-stone-50 transition-colors">
                    Edit Profile
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
