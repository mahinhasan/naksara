"use client";

import React, { useState } from 'react';
import { ShoppingBag, ShieldCheck, Truck, RefreshCcw } from 'lucide-react';
import { useCartStore } from '@/store/useCartStore';

export const ProductDetails = ({ product }: any) => {
  const [selectedImage, setSelectedImage] = useState(0);
  const addItem = useCartStore((state) => state.addItem);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    image: product.images.map((img: any) => img.url),
    description: product.description,
    sku: product.sku || product.id,
    brand: {
      '@type': 'Brand',
      name: 'HERITAGE',
    },
    offers: {
      '@type': 'Offer',
      url: `https://heritage-artisan.com/products/${product.slug}`,
      priceCurrency: 'USD',
      price: product.price,
      availability: product.stockQuantity > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
    },
  };

  const handleAddToCart = () => {
    addItem({
      id: Math.random().toString(36).substr(2, 9),
      name: product.name,
      price: Number(product.price),
      quantity: 1,
      image: product.images[0]?.url,
    });
    alert('Added to cart!');
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
        {/* Gallery */}
        <div className="flex flex-col gap-4">
          <div className="aspect-[4/5] overflow-hidden bg-stone-100">
            <img 
              src={product.images[selectedImage]?.url} 
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="grid grid-cols-4 gap-4">
            {product.images.map((img: any, idx: number) => (
              <button 
                key={idx} 
                onClick={() => setSelectedImage(idx)}
                className={`aspect-square overflow-hidden border-2 ${selectedImage === idx ? 'border-black' : 'border-transparent'}`}
              >
                <img src={img.url} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Info */}
        <div className="flex flex-col gap-8">
          <div>
            <span className="text-xs font-bold tracking-widest text-stone-500 uppercase mb-2 block">
              {product.category.name}
            </span>
            <h1 className="text-4xl font-serif mb-4">{product.name}</h1>
            <div className="flex items-center gap-4 mb-6">
              <span className="text-2xl font-bold">${product.price}</span>
              {product.compareAtPrice && (
                <span className="text-stone-400 line-through">${product.compareAtPrice}</span>
              )}
            </div>
            <p className="text-stone-600 leading-relaxed mb-8">
              {product.description}
            </p>
          </div>

          <button 
            onClick={handleAddToCart}
            className="w-full bg-black text-white py-5 text-sm font-bold tracking-widest uppercase hover:bg-stone-800 transition-colors flex items-center justify-center gap-3"
          >
            <ShoppingBag className="w-5 h-5" /> Add to Shopping Bag
          </button>

          {/* Trust Indicators */}
          <div className="grid grid-cols-1 gap-6 py-8 border-t border-stone-200">
            <div className="flex items-start gap-4">
              <ShieldCheck className="w-6 h-6 text-stone-400" />
              <div>
                <h4 className="text-sm font-bold uppercase tracking-wider mb-1">Authenticity Guaranteed</h4>
                <p className="text-xs text-stone-500">Every piece is verified for its origin and premium quality.</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <Truck className="w-6 h-6 text-stone-400" />
              <div>
                <h4 className="text-sm font-bold uppercase tracking-wider mb-1">Insured Shipping</h4>
                <p className="text-xs text-stone-500">Complimentary express shipping on orders over $200.</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <RefreshCcw className="w-6 h-6 text-stone-400" />
              <div>
                <h4 className="text-sm font-bold uppercase tracking-wider mb-1">30-Day Returns</h4>
                <p className="text-xs text-stone-500">Shop with confidence with our hassle-free return policy.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
