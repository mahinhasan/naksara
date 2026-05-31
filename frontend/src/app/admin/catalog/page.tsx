"use client";

import React, { useState, useEffect } from 'react';
import { Plus, Edit3, Trash2, Box, X, Image as ImageIcon } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  stockQuantity: number;
  isActive: boolean;
  category?: { name: string };
  images?: { url: string }[];
}

interface Category {
  id: string;
  name: string;
}

export default function AdminCatalog() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    price: '',
    stockQuantity: '',
    categoryId: '',
    imageUrl: ''
  });

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch(`${apiUrl}/catalog/products`);
      const data = await response.json();
      setProducts(data.items || []);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch(`${apiUrl}/catalog/categories`);
      const data = await response.json();
      setCategories(data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${apiUrl}/admin/products`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...newProduct,
          price: parseFloat(newProduct.price),
          stockQuantity: parseInt(newProduct.stockQuantity),
          images: newProduct.imageUrl ? [newProduct.imageUrl] : []
        })
      });

      if (response.ok) {
        setIsModalOpen(false);
        setNewProduct({ name: '', description: '', price: '', stockQuantity: '', categoryId: '', imageUrl: '' });
        fetchProducts();
      }
    } catch (error) {
      console.error('Error creating product:', error);
    }
  };

  if (loading) return <div className="p-8 text-center">Loading Inventory...</div>;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-serif">Inventory & Product Catalog</h2>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg text-xs font-bold uppercase tracking-widest hover:bg-stone-800 transition-all shadow-sm"
        >
          <Plus size={14} /> Add New Product
        </button>
      </div>

      {/* Add Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl">
            <div className="px-6 py-4 border-b border-stone-100 flex justify-between items-center bg-stone-50">
              <h3 className="font-serif text-lg">Add New Product</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-stone-400 hover:text-black">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleCreateProduct} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-stone-400 mb-1">Product Name</label>
                  <input 
                    type="text" 
                    required
                    value={newProduct.name}
                    onChange={e => setNewProduct({...newProduct, name: e.target.value})}
                    className="w-full p-2 bg-stone-50 border border-stone-200 rounded-lg text-sm" 
                    placeholder="e.g. Handwoven Silk Scarf"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-stone-400 mb-1">Description</label>
                  <textarea 
                    required
                    value={newProduct.description}
                    onChange={e => setNewProduct({...newProduct, description: e.target.value})}
                    className="w-full p-2 bg-stone-50 border border-stone-200 rounded-lg text-sm h-24" 
                    placeholder="Product details..."
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-stone-400 mb-1">Price ($)</label>
                  <input 
                    type="number" 
                    step="0.01"
                    required
                    value={newProduct.price}
                    onChange={e => setNewProduct({...newProduct, price: e.target.value})}
                    className="w-full p-2 bg-stone-50 border border-stone-200 rounded-lg text-sm" 
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-stone-400 mb-1">Stock Quantity</label>
                  <input 
                    type="number" 
                    required
                    value={newProduct.stockQuantity}
                    onChange={e => setNewProduct({...newProduct, stockQuantity: e.target.value})}
                    className="w-full p-2 bg-stone-50 border border-stone-200 rounded-lg text-sm" 
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-stone-400 mb-1">Category</label>
                  <select 
                    required
                    value={newProduct.categoryId}
                    onChange={e => setNewProduct({...newProduct, categoryId: e.target.value})}
                    className="w-full p-2 bg-stone-50 border border-stone-200 rounded-lg text-sm"
                  >
                    <option value="">Select Category</option>
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>
                <div className="col-span-2">
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-stone-400 mb-1">Image URL</label>
                  <div className="flex gap-2">
                    <input 
                      type="url" 
                      value={newProduct.imageUrl}
                      onChange={e => setNewProduct({...newProduct, imageUrl: e.target.value})}
                      className="flex-1 p-2 bg-stone-50 border border-stone-200 rounded-lg text-sm" 
                      placeholder="https://images.unsplash.com/..."
                    />
                    <div className="w-10 h-10 bg-stone-100 rounded-lg border border-stone-200 flex items-center justify-center overflow-hidden">
                      {newProduct.imageUrl ? (
                        <img src={newProduct.imageUrl} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <ImageIcon size={16} className="text-stone-300" />
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className="pt-4 flex gap-3">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-4 py-2 border border-stone-200 rounded-lg text-xs font-bold uppercase tracking-widest hover:bg-stone-50 transition-all"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="flex-1 px-4 py-2 bg-black text-white rounded-lg text-xs font-bold uppercase tracking-widest hover:bg-stone-800 transition-all shadow-md"
                >
                  Create Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-stone-50 text-stone-500 text-[10px] uppercase tracking-widest font-bold">
                <th className="px-6 py-4">Product</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Price</th>
                <th className="px-6 py-4">Stock</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-stone-100">
              {products.map((product) => (
                <tr key={product.id} className="hover:bg-stone-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {product.images && product.images[0] ? (
                        <img src={product.images[0].url} alt="" className="w-10 h-10 object-cover rounded-lg border border-stone-100" />
                      ) : (
                        <div className="w-10 h-10 bg-stone-100 rounded-lg border border-stone-100 flex items-center justify-center">
                          <Box size={16} className="text-stone-300" />
                        </div>
                      )}
                      <span className="font-bold">{product.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-stone-500 text-xs uppercase tracking-widest font-bold">{product.category?.name || 'Uncategorized'}</span>
                  </td>
                  <td className="px-6 py-4 font-medium">${product.price.toFixed(2)}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Box size={14} className={product.stockQuantity < 5 ? 'text-red-500' : 'text-stone-400'} />
                      <span className={product.stockQuantity < 5 ? 'text-red-500 font-bold' : 'text-stone-600'}>
                        {product.stockQuantity} units
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest
                      ${product.isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-stone-100 text-stone-500'}`}>
                      {product.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button className="p-2 text-stone-400 hover:text-black hover:bg-stone-100 rounded-lg transition-all">
                        <Edit3 size={16} />
                      </button>
                      <button className="p-2 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {products.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-stone-500 italic">
                    No products found in the catalog.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
