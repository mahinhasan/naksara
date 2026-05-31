"use client";

import React from 'react';
import Navbar from '@/components/Navbar';
import { BookOpen } from 'lucide-react';

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-stone-50">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
        <header className="mb-12 text-center">
          <h1 className="text-4xl font-serif mb-4 italic">The Heritage Journal</h1>
          <p className="text-stone-600 max-w-2xl mx-auto">
            Stories of craftsmanship, heritage, and the artisans behind our collections.
          </p>
        </header>

        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-stone-200 shadow-sm">
          <BookOpen className="w-16 h-16 text-stone-200 mb-6" />
          <h2 className="text-2xl font-serif mb-2">Coming Soon</h2>
          <p className="text-stone-500 text-center max-w-md">
            We are currently documenting the stories of our master artisans. Check back soon for deep dives into traditional techniques and cultural history.
          </p>
          <button className="mt-8 px-8 py-3 bg-stone-900 text-white rounded-full text-xs font-bold uppercase tracking-widest hover:bg-stone-800 transition-colors">
            Subscribe for Updates
          </button>
        </div>
      </main>
    </div>
  );
}
