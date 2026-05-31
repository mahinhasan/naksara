"use client";

import { useEffect, useState } from 'react';
import { ProductCard } from '@/components/ProductCard';

interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  compareAtPrice?: number;
  images: { url: string }[];
  category: { name: string };
}

export default function CatalogPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
    fetch(`${apiUrl}/catalog/products`)
      .then(res => res.json())
      .then(data => {
        setProducts(data.items || []);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching products:', err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col md:flex-row justify-between items-baseline mb-8">
        <h1 className="text-4xl font-serif">All Products</h1>
        <p className="text-stone-500">{products.length} items</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
        {loading ? (
          Array(8).fill(0).map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-stone-200 aspect-[4/5] mb-4" />
              <div className="h-4 bg-stone-200 w-3/4 mb-2" />
              <div className="h-4 bg-stone-200 w-1/2" />
            </div>
          ))
        ) : (
          products.map(product => (
            <ProductCard key={product.id} product={product} />
          ))
        )}
      </div>
    </div>
  );
}
