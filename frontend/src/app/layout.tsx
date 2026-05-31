import Link from "next/link";
import Navbar from "@/components/Navbar";
import { constructMetadata } from "@/lib/metadata";
import "./globals.css";

export const metadata = constructMetadata();

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased text-gray-900 bg-white">
        <Navbar />
        <main className="pt-16 min-h-screen">
          {children}
        </main>
        <footer className="bg-gray-50 border-t border-gray-100 py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider mb-4">Shop</h3>
                <ul className="space-y-2">
                  <li><Link href="/catalog" className="text-sm text-gray-500 hover:text-black">All Products</Link></li>
                  <li><Link href="/new-arrivals" className="text-sm text-gray-500 hover:text-black">New Arrivals</Link></li>
                  <li><Link href="/best-sellers" className="text-sm text-gray-500 hover:text-black">Best Sellers</Link></li>
                </ul>
              </div>
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider mb-4">Brand</h3>
                <ul className="space-y-2">
                  <li><Link href="/about" className="text-sm text-gray-500 hover:text-black">Our Story</Link></li>
                  <li><Link href="/journal" className="text-sm text-gray-500 hover:text-black">Journal</Link></li>
                  <li><Link href="/sustainability" className="text-sm text-gray-500 hover:text-black">Sustainability</Link></li>
                </ul>
              </div>
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider mb-4">Support</h3>
                <ul className="space-y-2">
                  <li><Link href="/faq" className="text-sm text-gray-500 hover:text-black">FAQ</Link></li>
                  <li><Link href="/shipping" className="text-sm text-gray-500 hover:text-black">Shipping</Link></li>
                  <li><Link href="/returns" className="text-sm text-gray-500 hover:text-black">Returns</Link></li>
                </ul>
              </div>
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider mb-4">Connect</h3>
                <div className="flex space-x-4">
                  {/* Social icons */}
                </div>
              </div>
            </div>
            <div className="mt-12 pt-8 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center">
              <p className="text-xs text-gray-400">© 2026 HERITAGE. All rights reserved.</p>
              <div className="flex space-x-6 mt-4 md:mt-0">
                <Link href="/privacy" className="text-xs text-gray-400 hover:text-black">Privacy Policy</Link>
                <Link href="/terms" className="text-xs text-gray-400 hover:text-black">Terms of Service</Link>
              </div>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
