import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function HomePage() {
  return (
    <main className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[90vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-black/30 z-10" />
        <img 
          src="https://images.unsplash.com/photo-1513519245088-0e12902e35ca?q=80&w=2070" 
          alt="Premium Artisan Goods"
          className="absolute inset-0 object-cover w-full h-full scale-105 animate-slow-zoom"
        />
        <div className="relative z-20 text-center text-white px-4 max-w-4xl">
          <h1 className="text-5xl md:text-7xl font-serif mb-6 leading-tight">
            Authentic Craftsmanship for Modern Living
          </h1>
          <p className="text-lg md:text-xl mb-10 opacity-90 font-light tracking-wide">
            Discover a curated collection of premium artisan products, ethically sourced and built to last generations.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/catalog" 
              className="bg-white text-black px-10 py-4 text-sm font-bold tracking-widest hover:bg-black hover:text-white transition-all duration-300 uppercase"
            >
              Explore Collection
            </Link>
            <Link 
              href="/story" 
              className="border border-white text-white px-10 py-4 text-sm font-bold tracking-widest hover:bg-white hover:text-black transition-all duration-300 uppercase"
            >
              Our Story
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="py-24 px-4 bg-stone-50">
        <div className="container mx-auto">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl font-serif mb-2">Shop by Category</h2>
              <p className="text-stone-500">Carefully curated collections for your home and lifestyle.</p>
            </div>
            <Link href="/catalog" className="hidden md:flex items-center gap-2 text-sm font-bold tracking-widest uppercase hover:gap-3 transition-all">
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { name: 'Handicrafts', img: 'https://images.unsplash.com/photo-1515825838458-f2a94b20105a?q=80&w=1974', slug: 'handicrafts' },
              { name: 'Home Decor', img: 'https://images.unsplash.com/photo-1534349762230-e0cadf78f5db?q=80&w=2070', slug: 'home-decor' },
              { name: 'Lifestyle', img: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1999', slug: 'lifestyle' }
            ].map((cat) => (
              <Link key={cat.slug} href={`/categories/${cat.slug}`} className="group relative aspect-[3/4] overflow-hidden">
                <img 
                  src={cat.img} 
                  alt={cat.name}
                  className="absolute inset-0 object-cover w-full h-full group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors" />
                <div className="absolute bottom-10 left-10 text-white">
                  <h3 className="text-2xl font-serif mb-2">{cat.name}</h3>
                  <span className="text-xs font-bold tracking-widest uppercase border-b border-white pb-1">Shop Now</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Value Propositions */}
      <section className="py-20 border-y border-stone-200">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 text-center">
            {[
              { title: 'Ethically Sourced', desc: 'Direct from artisans, ensuring fair wages and practices.' },
              { title: 'Premium Quality', desc: 'Hand-picked materials and expert craftsmanship.' },
              { title: 'Secure Payment', desc: 'Enterprise-grade encryption for every transaction.' },
              { title: 'Global Delivery', desc: 'Insured and tracked shipping to your doorstep.' }
            ].map((prop) => (
              <div key={prop.title}>
                <h4 className="text-sm font-bold tracking-widest uppercase mb-3">{prop.title}</h4>
                <p className="text-stone-500 text-sm leading-relaxed">{prop.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
