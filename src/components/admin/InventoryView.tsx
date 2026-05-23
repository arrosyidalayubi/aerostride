import { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import type { Product } from '../../types';

interface InventoryViewProps {
  products: Product[];
  onUpdateProducts: (products: Product[]) => void;
}

export default function InventoryView({ products, onUpdateProducts }: InventoryViewProps) {
  const [newProdName, setNewProdName] = useState('');
  const [newProdStock, setNewProdStock] = useState(20);

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    const newId = `INV-00${products.length + 1}`;
    const newProduct: Product = {
      id: newId, name: newProdName, price: 1250000, category: 'Footwear', size: '42', stock: Number(newProdStock), threshold: 15,
      status: Number(newProdStock) <= 5 ? 'Critical' : Number(newProdStock) <= 15 ? 'Low Stock' : 'In Stock',
      image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=200&auto=format&fit=crop'
    };
    onUpdateProducts([newProduct, ...products]);
    setNewProdName('');
  };

  const handleDeleteProduct = (id: string) => onUpdateProducts(products.filter(p => p.id !== id));

  const handleUpdateStock = (id: string, delta: number) => {
    onUpdateProducts(products.map(p => {
      if (p.id === id) {
        const stock = Math.max(0, p.stock + delta);
        return { ...p, stock, status: stock <= 5 ? 'Critical' : stock <= p.threshold ? 'Low Stock' : 'In Stock' };
      }
      return p;
    }));
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <h1 className="text-3xl font-black text-gray-900 tracking-tighter uppercase">Manajemen Inventaris</h1>
      
      <form onSubmit={handleAddProduct} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col sm:flex-row gap-4 items-end">
        <div className="flex-1 w-full">
          <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Nama SKU</label>
          <input type="text" value={newProdName} onChange={(e) => setNewProdName(e.target.value)} placeholder="Aero Running Shoes" className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm" required />
        </div>
        <div className="w-full sm:w-32">
          <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Stok</label>
          <input type="number" value={newProdStock} onChange={(e) => setNewProdStock(Number(e.target.value))} className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm" />
        </div>
        <button type="submit" className="w-full sm:w-auto bg-red-600 text-white px-6 py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 cursor-pointer hover:bg-red-700 transition-colors">
          <Plus className="w-4 h-4" /> Tambah
        </button>
      </form>

      <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm overflow-x-auto">
        <table className="w-full text-left min-w-150">
          <thead>
            <tr className="border-b border-gray-100 text-gray-400 text-xs font-bold uppercase">
              <th className="pb-3">SKU</th>
              <th className="pb-3">Nama Produk</th>
              <th className="pb-3">Stok</th>
              <th className="pb-3">Manajerial</th>
              <th className="pb-3">Status</th>
              <th className="pb-3 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="text-sm divide-y divide-gray-50">
            {products.map(p => (
              <tr key={p.id}>
                <td className="py-4 font-mono text-gray-400 font-bold">{p.id}</td>
                <td className="py-4 font-bold">{p.name}</td>
                <td className="py-4 font-mono font-black">{p.stock} pcs</td>
                <td className="py-4">
                  <div className="flex gap-1">
                    <button onClick={() => handleUpdateStock(p.id, -5)} className="px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded font-bold cursor-pointer">-5</button>
                    <button onClick={() => handleUpdateStock(p.id, 5)} className="px-2 py-1 bg-gray-900 text-white hover:bg-gray-800 rounded font-bold cursor-pointer">+5</button>
                  </div>
                </td>
                <td className="py-4">
                  <span className={`px-2.5 py-1 text-xs font-bold rounded-full border ${p.status === 'In Stock' ? 'bg-green-50 text-green-700 border-green-200' : p.status === 'Low Stock' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' : 'bg-red-50 text-red-700 border-red-200'}`}>{p.status}</span>
                </td>
                <td className="py-4 text-right">
                  <button onClick={() => handleDeleteProduct(p.id)} className="p-2 text-gray-400 hover:text-red-600 cursor-pointer transition-colors"><Trash2 className="w-4 h-4" /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}