import { useState } from 'react';
import { Store, Trash2 } from 'lucide-react';
import type { Product, OfflineSale } from '../../types';

interface OfflineSalesViewProps {
  products: Product[];
  offlineSales: OfflineSale[];
  onUpdateProducts: (products: Product[]) => void;
  onUpdateOfflineSales: (sales: OfflineSale[]) => void;
}

export default function OfflineSalesView({ products, offlineSales, onUpdateProducts, onUpdateOfflineSales }: OfflineSalesViewProps) {
  const [offlineItemCode, setOfflineItemCode] = useState(products[0]?.id || '');
  const [offlineQty, setOfflineQty] = useState(1);
  const [offlineCabang, setOfflineCabang] = useState<'Jakarta' | 'Bandung'>('Jakarta');

  const handleUpdateStock = (id: string, qtyToDeduct: number) => {
    onUpdateProducts(products.map(p => {
      if (p.id === id) {
        const newStock = Math.max(0, p.stock - qtyToDeduct);
        return { ...p, stock: newStock, status: newStock <= 5 ? 'Critical' : newStock <= p.threshold ? 'Low Stock' : 'In Stock' };
      }
      return p;
    }));
  };

const handleVoidTransaction = async (id: string, itemCode: string, qty: number) => {
    if (!window.confirm(`Yakin ingin membatalkan nota ${id}? Stok akan dikembalikan ke gudang dan laporan harian akan disesuaikan.`)) return;

    try {
      const res = await fetch(`/api/offline-sales?id=${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Gagal membatalkan transaksi');
      
      // Update UI: Hapus nota dari tabel
      onUpdateOfflineSales(offlineSales.filter(sale => sale.id !== id));
      
      // Update UI: Kembalikan stok di layar secara langsung (tanpa harus refresh)
      onUpdateProducts(products.map(p => 
        p.id === itemCode ? { ...p, stock: p.stock + qty } : p
      ));
      
      alert('Nota berhasil dibatalkan. Stok dan Laporan Harian telah dikoreksi otomatis.');
    } catch (error) {
      alert(error);
    }
  };

  // --- UBAH FUNGSI INI MENJADI ASYNC ---
  const handleAddOfflineSale = async (e: React.FormEvent) => {
    e.preventDefault();
    const targetProduct = products.find(p => p.id === offlineItemCode);
    
    if (!targetProduct || targetProduct.stock < offlineQty) {
      alert('Transaksi Gagal: Stok di layar tidak mencukupi!');
      return;
    }
    
    const priceTotal = targetProduct.price * offlineQty;
    
    const today = new Date();
    const d = String(today.getDate()).padStart(2, '0');
    const m = String(today.getMonth() + 1).padStart(2, '0');
    const y = today.getFullYear();
    const dateNow = `${d}-${m}-${y}`;
    
    const newSale: OfflineSale = {
      id: `TRX-OFF-${Date.now()}`, 
      itemCode: offlineItemCode, 
      productName: targetProduct.name,
      qty: offlineQty, 
      totalPrice: priceTotal, 
      cabang: offlineCabang, 
      date: dateNow
    };

    try {
      // 1. Tembakkan ke Database
      const response = await fetch('/api/offline-sales', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSale)
      });

      if (!response.ok) {
        const resErr = await response.json();
        throw new Error(resErr.error || 'Terjadi kegagalan di server D1');
      }

      // 2. Jika Database Sukses, Update Tampilan (UI)
      handleUpdateStock(offlineItemCode, offlineQty); // Potong stok produk di layar
      onUpdateOfflineSales([newSale, ...offlineSales]); // Tambah nota ke tabel
      
      // 3. Reset form jumlah barang
      setOfflineQty(1);
      alert('✅ Transaksi Offline Berhasil! Stok barang telah disinkronkan ke Database Pusat.');

    } catch (error) {
      alert(`❌ Kesalahan Sinkronisasi: ${error}`);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <h1 className="text-3xl font-black text-gray-900 tracking-tighter uppercase">Simulasi Kasir Offline</h1>
      
      <form onSubmit={handleAddOfflineSale} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 items-end">
        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Barang</label>
          <select value={offlineItemCode} onChange={(e) => setOfflineItemCode(e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm">
            {products.map(p => <option key={p.id} value={p.id}>{p.name} (Stok: {p.stock})</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Jumlah</label>
          <input type="number" min="1" value={offlineQty} onChange={(e) => setOfflineQty(Number(e.target.value))} className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm" />
        </div>
        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Lokasi</label>
          <select value={offlineCabang} onChange={(e) => setOfflineCabang(e.target.value as 'Jakarta' | 'Bandung')} className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm">
            <option value="Jakarta">Cabang Jakarta</option>
            <option value="Bandung">Cabang Bandung</option>
          </select>
        </div>
        <button type="submit" className="bg-black text-white p-3.5 rounded-xl font-bold text-sm cursor-pointer hover:bg-gray-800 transition-colors flex items-center justify-center gap-2">
          <Store className="w-4 h-4"/> Catat Penjualan
        </button>
      </form>

      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 overflow-x-auto">
        <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-100 text-gray-400 text-xs font-bold uppercase">
                <th className="pb-3">ID Nota</th>
                <th className="pb-3">Produk</th>
                <th className="pb-3 text-center">Qty</th>
                <th className="pb-3 text-right">Total</th>
                <th className="pb-3 text-center">Cabang</th>
                <th className="pb-3 text-right">Aksi</th> {/* Kolom Baru */}
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-gray-50">
              {offlineSales.map(sale => (
                <tr key={sale.id} className="hover:bg-gray-50/50">
                  <td className="py-4 font-bold text-gray-400">{sale.id}</td>
                  <td className="py-4 font-bold text-gray-900">{sale.productName}</td>
                  <td className="py-4 text-center">{sale.qty} pasang</td>
                  <td className="py-4 font-bold text-gray-900 text-right">Rp {sale.totalPrice.toLocaleString('id-ID')}</td>
                  <td className="py-4 text-center"><span className="px-2 py-1 bg-red-50 text-red-600 rounded-lg font-bold text-xs">{sale.cabang}</span></td>
                  
                  {/* Tombol Hapus Baru */}
                  <td className="py-4 text-right">
                    <button 
                      onClick={() => handleVoidTransaction(sale.id, sale.itemCode, sale.qty)}
                      className="p-1.5 bg-red-50 text-red-600 rounded hover:bg-red-100"
                      title="Batalkan Transaksi"
                    >
                      <Trash2 className="w-4 h-4"/>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
      </div>
    </div>
  );
}