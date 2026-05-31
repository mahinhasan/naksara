"use client";

import { useCartStore } from '@/store/useCartStore';
import Link from 'next/link';
import { Trash2, Plus, Minus } from 'lucide-react';

export default function CartPage() {
  const { items, removeItem, updateQuantity, totalPrice } = useCartStore();

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center">
        <h1 className="text-3xl font-serif mb-6">Your Bag is Empty</h1>
        <Link href="/catalog" className="inline-block bg-black text-white px-8 py-3 uppercase text-xs font-bold tracking-widest">
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-serif mb-12">Shopping Bag</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-8">
          {items.map((item) => (
            <div key={item.id} className="flex gap-6 pb-8 border-b border-stone-100">
              <div className="w-24 h-32 bg-stone-100 flex-shrink-0">
                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
              </div>
              <div className="flex-grow flex justify-between">
                <div>
                  <h3 className="text-lg font-medium mb-1">{item.name}</h3>
                  <p className="text-stone-500 text-sm mb-4">${item.price}</p>
                  
                  <div className="flex items-center gap-4">
                    <div className="flex items-center border border-stone-200">
                      <button 
                        onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                        className="p-2 hover:bg-stone-50"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-8 text-center text-sm">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="p-2 hover:bg-stone-50"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                    <button onClick={() => removeItem(item.id)} className="text-stone-400 hover:text-black">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <p className="font-bold">${item.price * item.quantity}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-stone-50 p-8 h-fit">
          <h2 className="text-xl font-serif mb-6">Summary</h2>
          <div className="space-y-4 mb-8">
            <div className="flex justify-between">
              <span className="text-stone-500">Subtotal</span>
              <span>${totalPrice()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-stone-500">Shipping</span>
              <span className="text-green-600 uppercase text-xs font-bold">Complimentary</span>
            </div>
            <div className="pt-4 border-t border-stone-200 flex justify-between font-bold text-lg">
              <span>Total</span>
              <span>${totalPrice()}</span>
            </div>
          </div>
          <Link href="/checkout" className="block w-full bg-black text-white text-center py-4 uppercase text-xs font-bold tracking-widest hover:bg-stone-900 transition-colors">
            Checkout
          </Link>
        </div>
      </div>
    </div>
  );
}
