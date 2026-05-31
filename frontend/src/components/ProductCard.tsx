import React from 'react';
import Link from 'next/link';
import { ShoppingBag, Star } from 'lucide-react';

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    slug: string;
    price: number;
    compareAtPrice?: number;
    images: { url: string }[];
    category: { name: string };
    rating?: number;
  };
}

export const ProductCard = ({ product }: ProductCardProps) => {
  const discount = product.compareAtPrice 
    ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
    : 0;

  return (
    <div className="group flex flex-col gap-3">
      <Link href={`/products/${product.slug}`} className="relative aspect-[4/5] overflow-hidden bg-stone-100">
        <img
          src={product.images[0]?.url || 'https://via.placeholder.com/400x500'}
          alt={product.name}
          className="absolute inset-0 object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
        />
        {discount > 0 && (
          <span className="absolute top-4 left-4 bg-black text-white text-[10px] font-bold px-2 py-1 uppercase tracking-widest">
            -{discount}%
          </span>
        )}
        <button className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur-sm text-black py-3 text-[10px] font-bold uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0 flex items-center justify-center gap-2">
          <ShoppingBag className="w-3 h-3" /> Quick Add
        </button>
      </Link>
      
      <div className="flex flex-col gap-1">
        <div className="flex justify-between items-start">
          <span className="text-[10px] text-stone-500 uppercase tracking-widest font-bold">
            {product.category.name}
          </span>
          <div className="flex items-center gap-1">
            <Star className="w-3 h-3 fill-stone-400 text-stone-400" />
            <span className="text-[10px] text-stone-500 font-bold">4.8</span>
          </div>
        </div>
        <Link href={`/products/${product.slug}`} className="text-sm font-medium hover:underline">
          {product.name}
        </Link>
        <div className="flex gap-2 items-center">
          <span className="text-sm font-bold">${product.price}</span>
          {product.compareAtPrice && (
            <span className="text-xs text-stone-400 line-through">${product.compareAtPrice}</span>
          )}
        </div>
      </div>
    </div>
  );
};
