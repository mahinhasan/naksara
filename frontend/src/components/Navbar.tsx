"use client";

import Link from "next/link";
import { useCartStore } from "@/store/useCartStore";
import { ShoppingBag, User, Search } from "lucide-react";
import Logo from "./Logo";

export default function Navbar() {
  const totalItems = useCartStore((state) => state.totalItems());

  return (
    <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="hover:opacity-85 transition-opacity">
              <Logo />
            </Link>
          </div>

          <div className="hidden sm:flex space-x-8">
            <Link href="/catalog" className="text-sm font-medium text-gray-700 hover:text-black">Catalog</Link>
            <Link href="/collections" className="text-sm font-medium text-gray-700 hover:text-black">Collections</Link>
            <Link href="/blog" className="text-sm font-medium text-gray-700 hover:text-black">Journal</Link>
          </div>

          <div className="flex items-center space-x-4">
            <button className="p-2 text-gray-400 hover:text-black">
              <Search className="h-5 w-5" />
            </button>
            <Link href="/account" className="p-2 text-gray-400 hover:text-black">
              <User className="h-5 w-5" />
            </Link>
            <Link href="/cart" className="p-2 text-gray-400 hover:text-black relative">
              <ShoppingBag className="h-5 w-5" />
              {totalItems > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-black rounded-full">
                  {totalItems}
                </span>
              )}
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
