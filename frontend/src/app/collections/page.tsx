"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import { LayoutGrid, ChevronRight } from 'lucide-react';

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  _count?: {
    products: number;
  };
}

export default function CollectionsPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch(`${apiUrl}/catalog/categories`);
      const data = await response.json();
      setCategories(data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-stone-50">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
        <header className="mb-12">
          <h1 className="text-4xl font-serif mb-4">Our Collections</h1>
          <p className="text-stone-600 max-w-2xl">
            Explore our curated categories of premium artisan goods, each piece telling a unique story of heritage and craftsmanship.
          </p>
        </header>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-stone-900"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {categories.map((category) => (
              <Link 
                key={category.id} 
                href={`/catalog?categoryId=${category.id}`}
                className="group bg-white rounded-2xl overflow-hidden border border-stone-200 hover:shadow-xl transition-all duration-300"
              >
                <div className="aspect-[4/3] bg-stone-100 flex items-center justify-center relative overflow-hidden">
                   <LayoutGrid className="w-12 h-12 text-stone-300 group-hover:scale-110 transition-transform duration-500" />
                   <div className="absolute inset-0 bg-black/5 group-hover:bg-black/0 transition-colors" />
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-serif group-hover:text-stone-600 transition-colors">{category.name}</h3>
                    <ChevronRight className="w-5 h-5 text-stone-400 group-hover:translate-x-1 transition-transform" />
                  </div>
                  <p className="text-stone-500 text-sm line-clamp-2 mb-4">
                    {category.description || 'Discover our unique collection of handcrafted items.'}
                  </p>
                  <div className="text-[10px] font-bold uppercase tracking-widest text-stone-400">
                    Explore Collection
                  </div>
                </div>
              </Link>
            ))}

            {categories.length === 0 && (
              <div className="col-span-full py-20 text-center bg-white rounded-2xl border border-stone-200">
                <p className="text-stone-400 italic">No collections found at the moment. Please check back later.</p>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
