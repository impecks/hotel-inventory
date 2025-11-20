import React, { useState, useEffect } from 'react';
import { useAuth } from '../App';
import { MockDB } from '../services/db';
import { StockRequest, Product, Role } from '../types';
import { Check, X, Plus, ShoppingBag } from 'lucide-react';
import toast from 'react-hot-toast';

export const StockRequests = () => {
  const { user } = useAuth();
  const [requests, setRequests] = useState<StockRequest[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  
  // New Request State
  const [selectedProduct, setSelectedProduct] = useState('');
  const [reqQty, setReqQty] = useState(1);

  useEffect(() => {
    refreshData();
  }, []);

  const refreshData = () => {
    setRequests(MockDB.getRequests());
    setProducts(MockDB.getProducts());
  };

  const handleRequestSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const product = products.find(p => p.id === selectedProduct);
    if (!product) return;

    const newReq: StockRequest = {
        id: crypto.randomUUID(),
        productId: product.id,
        productName: product.name,
        requesterId: user!.id,
        requesterName: user!.name,
        requesterRole: user!.role,
        quantity: reqQty,
        status: 'PENDING',
        date: new Date().toISOString()
    };

    MockDB.addRequest(newReq);
    MockDB.logActivity(user!.id, 'Stock Requested', `Requested ${reqQty} x ${product.name}`);
    toast.success('Request submitted successfully');
    setIsRequestModalOpen(false);
    refreshData();
  };

  const handleAction = (id: string, status: 'APPROVED' | 'REJECTED') => {
    MockDB.updateRequestStatus(id, status);
    MockDB.logActivity(user!.id, `Request ${status}`, `Request ID: ${id}`);
    toast.success(`Request ${status.toLowerCase()}`);
    refreshData();
  };

  const canApprove = user?.role === Role.ADMIN;

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
            <h1 className="text-2xl font-serif font-bold text-slate-800">Stock Requisitions</h1>
            <p className="text-slate-500">Manage incoming requests from departments.</p>
        </div>
        <button onClick={() => setIsRequestModalOpen(true)} className="flex items-center gap-2 bg-hotel-gold text-white px-5 py-2.5 rounded-lg hover:bg-hotel-goldDark transition-all shadow-lg shadow-orange-100">
            <Plus size={18} />
            <span>New Request</span>
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {requests.length === 0 && (
             <div className="p-12 text-center text-slate-400 bg-white rounded-xl border border-slate-100">
                No stock requests found.
            </div>
        )}
        {requests.map(req => (
            <div key={req.id} className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${req.status === 'PENDING' ? 'bg-yellow-50 text-yellow-600' : req.status === 'APPROVED' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                        <ShoppingBag size={20} />
                    </div>
                    <div>
                        <h4 className="font-bold text-slate-800">{req.productName} <span className="text-slate-400 text-sm font-normal">x{req.quantity}</span></h4>
                        <p className="text-sm text-slate-500">Requested by <span className="font-medium text-slate-700">{req.requesterName}</span> ({req.requesterRole})</p>
                        <p className="text-xs text-slate-400 mt-1">{new Date(req.date).toLocaleString()}</p>
                    </div>
                </div>
                
                <div className="flex items-center gap-4">
                    <div className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider 
                        ${req.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' : 
                          req.status === 'APPROVED' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {req.status}
                    </div>

                    {req.status === 'PENDING' && canApprove && (
                        <div className="flex gap-2 ml-4 pl-4 border-l border-slate-100">
                            <button onClick={() => handleAction(req.id, 'APPROVED')} className="p-2 bg-green-50 text-green-600 hover:bg-green-600 hover:text-white rounded-lg transition-colors" title="Approve">
                                <Check size={18} />
                            </button>
                            <button onClick={() => handleAction(req.id, 'REJECTED')} className="p-2 bg-red-50 text-red-600 hover:bg-red-600 hover:text-white rounded-lg transition-colors" title="Reject">
                                <X size={18} />
                            </button>
                        </div>
                    )}
                </div>
            </div>
        ))}
      </div>

      {/* Request Modal */}
      {isRequestModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl p-6">
                <h3 className="text-xl font-serif font-bold text-slate-800 mb-4">New Stock Request</h3>
                <form onSubmit={handleRequestSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Select Product</label>
                        <select required className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-hotel-gold outline-none"
                             value={selectedProduct} onChange={e => setSelectedProduct(e.target.value)}>
                             <option value="">-- Select Item --</option>
                             {products.map(p => (
                                 <option key={p.id} value={p.id}>{p.name} (Avail: {p.quantity})</option>
                             ))}
                        </select>
                    </div>
                    <div>
                         <label className="block text-sm font-medium text-slate-700 mb-1">Quantity Required</label>
                         <input type="number" min="1" required className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-hotel-gold outline-none"
                             value={reqQty} onChange={e => setReqQty(parseInt(e.target.value))} />
                    </div>
                    <div className="flex justify-end gap-3 mt-6">
                        <button type="button" onClick={() => setIsRequestModalOpen(false)} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg font-medium">Cancel</button>
                        <button type="submit" className="px-6 py-2 bg-hotel-gold text-white rounded-lg hover:bg-hotel-goldDark font-medium">Submit Request</button>
                    </div>
                </form>
            </div>
        </div>
      )}
    </div>
  );
};