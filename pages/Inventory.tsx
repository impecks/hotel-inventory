import React, { useEffect, useState } from 'react';
import { MockDB } from '../services/db';
import { Product, Category, Role } from '../types';
import { useAuth } from '../App';
import { Plus, Search, Filter, Trash2, Edit2, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

export const Inventory = () => {
  const { user } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [filter, setFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Form State
  const initialFormState = {
    name: '', category: Category.FOOD, quantity: 0, unit: 'pcs', minLevel: 10, supplier: '', price: 0
  };
  const [formData, setFormData] = useState(initialFormState);

  const refreshData = () => {
    setProducts(MockDB.getProducts());
  };

  useEffect(() => {
    refreshData();
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const newProduct: Product = {
        id: editingProduct ? editingProduct.id : crypto.randomUUID(),
        ...formData
    };
    MockDB.saveProduct(newProduct);
    MockDB.logActivity(user!.id, editingProduct ? 'Product Updated' : 'Product Added', `Product: ${newProduct.name}`);
    toast.success(editingProduct ? 'Product updated successfully' : 'Product added successfully');
    setIsModalOpen(false);
    refreshData();
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      MockDB.deleteProduct(id);
      MockDB.logActivity(user!.id, 'Product Deleted', `Product ID: ${id}`);
      toast.success('Product deleted');
      refreshData();
    }
  };

  const openModal = (product?: Product) => {
    if (product) {
      setEditingProduct(product);
      setFormData({ ...product });
    } else {
      setEditingProduct(null);
      setFormData(initialFormState);
    }
    setIsModalOpen(true);
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(filter.toLowerCase()) &&
    (categoryFilter === 'All' || p.category === categoryFilter)
  );

  const isAdmin = user?.role === Role.ADMIN;

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
            <h1 className="text-2xl font-serif font-bold text-slate-800">Inventory Management</h1>
            <p className="text-slate-500">Manage stock, categories, and suppliers.</p>
        </div>
        {isAdmin && (
            <button onClick={() => openModal()} className="flex items-center gap-2 bg-hotel-navy text-white px-5 py-2.5 rounded-lg hover:bg-slate-800 transition-all shadow-lg">
            <Plus size={18} />
            <span>Add Product</span>
            </button>
        )}
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 mb-6 flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
            <Search className="absolute left-3 top-3 text-slate-400" size={20} />
            <input 
                type="text" 
                placeholder="Search products..." 
                className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-hotel-gold outline-none"
                value={filter}
                onChange={e => setFilter(e.target.value)}
            />
        </div>
        <div className="relative w-full md:w-64">
            <Filter className="absolute left-3 top-3 text-slate-400" size={20} />
            <select 
                className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-hotel-gold outline-none appearance-none bg-white"
                value={categoryFilter}
                onChange={e => setCategoryFilter(e.target.value)}
            >
                <option value="All">All Categories</option>
                {Object.values(Category).map(c => <option key={c} value={c}>{c}</option>)}
            </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
            <table className="w-full text-left">
                <thead className="bg-slate-50 border-b border-slate-200">
                    <tr>
                        <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Product Name</th>
                        <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Category</th>
                        <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Quantity</th>
                        <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                    {filteredProducts.map(product => (
                        <tr key={product.id} className="hover:bg-slate-50 transition-colors">
                            <td className="px-6 py-4">
                                <div className="font-medium text-slate-800">{product.name}</div>
                                <div className="text-xs text-slate-400">{product.supplier}</div>
                            </td>
                            <td className="px-6 py-4 text-sm text-slate-600">
                                <span className="px-2 py-1 bg-slate-100 rounded text-xs border border-slate-200">{product.category}</span>
                            </td>
                            <td className="px-6 py-4">
                                {product.quantity <= product.minLevel ? (
                                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                        <AlertCircle size={12} /> Low Stock
                                    </span>
                                ) : (
                                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                        In Stock
                                    </span>
                                )}
                            </td>
                            <td className="px-6 py-4 font-mono text-sm text-slate-700">
                                {product.quantity} <span className="text-slate-400 text-xs ml-1">{product.unit}</span>
                            </td>
                            <td className="px-6 py-4 text-right">
                                {isAdmin && (
                                    <div className="flex items-center justify-end gap-2">
                                        <button onClick={() => openModal(product)} className="p-1.5 text-slate-400 hover:text-hotel-navy hover:bg-slate-200 rounded transition-colors">
                                            <Edit2 size={16} />
                                        </button>
                                        <button onClick={() => handleDelete(product.id)} className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors">
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
        {filteredProducts.length === 0 && (
            <div className="p-12 text-center text-slate-400">
                No products found.
            </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl transform transition-all scale-100">
                <div className="p-6 border-b border-slate-100">
                    <h3 className="text-xl font-serif font-bold text-slate-800">{editingProduct ? 'Edit Product' : 'Add New Product'}</h3>
                </div>
                <form onSubmit={handleSave} className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Product Name</label>
                        <input required className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-hotel-gold outline-none" 
                            value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
                            <select className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-hotel-gold outline-none"
                                value={formData.category} onChange={e => setFormData({...formData, category: e.target.value as any})}>
                                {Object.values(Category).map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Unit (e.g., pcs, kg)</label>
                            <input required className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-hotel-gold outline-none"
                                value={formData.unit} onChange={e => setFormData({...formData, unit: e.target.value})} />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Current Stock</label>
                            <input type="number" required className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-hotel-gold outline-none"
                                value={formData.quantity} onChange={e => setFormData({...formData, quantity: parseInt(e.target.value)})} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Min Level (Alert)</label>
                            <input type="number" required className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-hotel-gold outline-none"
                                value={formData.minLevel} onChange={e => setFormData({...formData, minLevel: parseInt(e.target.value)})} />
                        </div>
                    </div>
                     <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Price (Cost)</label>
                            <input type="number" step="0.01" required className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-hotel-gold outline-none"
                                value={formData.price} onChange={e => setFormData({...formData, price: parseFloat(e.target.value)})} />
                        </div>
                         <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Supplier</label>
                            <input required className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-hotel-gold outline-none"
                                value={formData.supplier} onChange={e => setFormData({...formData, supplier: e.target.value})} />
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 mt-6">
                        <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg font-medium">Cancel</button>
                        <button type="submit" className="px-6 py-2 bg-hotel-gold text-white rounded-lg hover:bg-hotel-goldDark font-medium shadow-lg shadow-orange-100">Save Product</button>
                    </div>
                </form>
            </div>
        </div>
      )}
    </div>
  );
};