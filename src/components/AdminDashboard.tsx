import { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from 'recharts';
import { Trash2, Plus, RefreshCw, Users, Mail, Phone, User, X } from 'lucide-react';
import type { Product, Order, OfflineSale, CustomerData } from '../types';

interface AdminDashboardProps {
  activeMenu: string;
  products: Product[];
  orders: Order[];
  offlineSales: OfflineSale[];
  customers: CustomerData[];
  onUpdateProducts: (products: Product[]) => void;
  onUpdateOrders: (orders: Order[]) => void;
  onUpdateOfflineSales: (sales: OfflineSale[]) => void;
  onUpdateCustomers: (customers: CustomerData[]) => void;
}

export default function AdminDashboard({
  activeMenu, products, orders, offlineSales, customers,
  onUpdateProducts, onUpdateOrders, onUpdateOfflineSales, onUpdateCustomers
}: AdminDashboardProps) {

  // Local State Input Kendali CRUD
  const [newProdName, setNewProdName] = useState('');
  const [newProdStock, setNewProdStock] = useState(20);
  const [offlineItemCode, setOfflineItemCode] = useState('AST-01');
  const [offlineQty, setOfflineQty] = useState(1);
  const [offlineCabang, setOfflineCabang] = useState<'Jakarta' | 'Bandung'>('Jakarta');

  // Local State Khusus Modal Kendali CRUD Pelanggan
  const [isCustModalOpen, setIsCustModalOpen] = useState(false);
  const [newCustName, setNewCustName] = useState('');
  const [newCustEmail, setNewCustEmail] = useState('');
  const [newCustPhone, setNewCustPhone] = useState('');

  // --- HANDLERS INVENTARIS ---
  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    const newId = `INV-00${products.length + 1}`;
    const newProduct: Product = {
      id: newId, name: newProdName, price: 1250000, category: 'Footwear', size: '42', stock: Number(newProdStock), threshold: 15,
      status: Number(newProdStock) <= 5 ? 'Critical' : Number(newProdStock) <= 15 ? 'Low Stock' : 'In Stock',
      image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=200&auto=format&fit=crop'
    };
    onUpdateProducts([...products, newProduct]);
    setNewProdName('');
  };

  const handleDeleteProduct = (id: string) => onUpdateProducts(products.filter(p => p.id !== id));

  const handleUpdateStock = (id: string, newStock: number) => {
    onUpdateProducts(products.map(p => {
      if (p.id === id) {
        const stock = Math.max(0, newStock);
        return { ...p, stock, status: stock <= 5 ? 'Critical' : stock <= p.threshold ? 'Low Stock' : 'In Stock' };
      }
      return p;
    }));
  };

  // --- HANDLERS OFFLINE ---
  const handleAddOfflineSale = (e: React.FormEvent) => {
    e.preventDefault();
    const targetProduct = products.find(p => p.id === offlineItemCode);
    if (!targetProduct || targetProduct.stock < offlineQty) {
      alert('Transaksi Gagal: Stok tidak mencukupi!');
      return;
    }
    const priceTotal = targetProduct.price * offlineQty;
    const newSale: OfflineSale = {
      id: `TRX-OFF-${offlineSales.length + 1}`, itemCode: offlineItemCode, productName: targetProduct.name,
      qty: offlineQty, totalPrice: priceTotal, cabang: offlineCabang, date: 'Mei'
    };
    handleUpdateStock(offlineItemCode, targetProduct.stock - offlineQty);
    onUpdateOfflineSales([...offlineSales, newSale]);
  };

  // --- HANDLERS ORDERS ---
  const handleToggleOrderStatus = (orderId: string) => {
    onUpdateOrders(orders.map(o => o.id === orderId ? { ...o, status: o.status === 'Packing' ? 'Delivery' : o.status === 'Delivery' ? 'Delivered' : 'Packing' } : o));
  };

  // --- HANDLERS CRM CUSTOMER ---
  const handleAddCustomer = async (e: React.FormEvent) => {
    e.preventDefault();
    const newId = `CUST-00${customers.length + 1}`;
    const formattedDate = new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });

    const newCustomer: CustomerData = { id: newId, name: newCustName, email: newCustEmail, phone: newCustPhone, joinDate: formattedDate };

    try {
      const response = await fetch('/api/customers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newCustomer)
      });
      if (!response.ok) throw new Error('Gagal menyimpan ke server D1');
      onUpdateCustomers([newCustomer, ...customers]);
      setNewCustName(''); setNewCustEmail(''); setNewCustPhone('');
      setIsCustModalOpen(false);
      alert('Berhasil! Data pelanggan disimpan permanen di Database D1.');
    } catch (error) {
      alert('Kesalahan koneksi database: ' + error);
    }
  };

  // --- CHART LOGIC ---
  const formatRupiah = (value: string | number | readonly (string | number)[] | undefined) => {
    const amount = Array.isArray(value) ? value[0] : value;
    return `Rp ${amount ?? 0} Juta`;
  };

  const ONLINE_CHART_DATA = [
    { name: 'Jan', revenue: 125 }, { name: 'Feb', revenue: 150 }, { name: 'Mar', revenue: 180 }, { name: 'Apr', revenue: 140 },
    { name: 'Mei', revenue: orders.reduce((acc, o) => acc + o.totalAmount, 0) / 1000000 + 210 }
  ];

  const OFFLINE_CHART_DATA = [
    { month: 'Jan', Jakarta: 231, Bandung: 126 }, { month: 'Feb', Jakarta: 247.5, Bandung: 138 },
    { month: 'Mar', Jakarta: 264, Bandung: 135 }, { month: 'Apr', Jakarta: 253, Bandung: 144 },
    { 
      month: 'Mei', 
      Jakarta: offlineSales.filter(s => s.cabang === 'Jakarta').reduce((acc, s) => acc + s.totalPrice, 0) / 1000000,
      Bandung: offlineSales.filter(s => s.cabang === 'Bandung').reduce((acc, s) => acc + s.totalPrice, 0) / 1000000
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 lg:ml-64 p-4 md:p-8 pt-24 lg:pt-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* VIEW 1: RINGKASAN */}
        {activeMenu === 'ringkasan' && (
          <>
            <div>
              <h1 className="text-3xl font-black text-gray-900 tracking-tighter">RINGKASAN OMNICHANNEL</h1>
              <p className="text-gray-500 text-sm">Dashboard Analitik Sistem Informasi Manajemen AeroStride</p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white p-4 md:p-6 rounded-3xl border border-gray-100 shadow-sm">
                <h3 className="text-sm font-bold mb-4 uppercase text-gray-400">Tren E-Commerce (Online)</h3>
                <div className="h-64"><ResponsiveContainer width="100%" height="100%" minWidth={1} minHeight={1}><LineChart data={ONLINE_CHART_DATA}><CartesianGrid strokeDasharray="3 3" vertical={false} /><XAxis dataKey="name" /><YAxis /><Tooltip formatter={formatRupiah} /><Line type="monotone" dataKey="revenue" stroke="#111827" strokeWidth={3} /></LineChart></ResponsiveContainer></div>
              </div>
              <div className="bg-white p-4 md:p-6 rounded-3xl border border-gray-100 shadow-sm">
                <h3 className="text-sm font-bold mb-4 uppercase text-gray-400">Distribusi Toko Fisik (Offline)</h3>
                <div className="h-64"><ResponsiveContainer width="100%" height="100%" minWidth={1} minHeight={1}><BarChart data={OFFLINE_CHART_DATA}><CartesianGrid strokeDasharray="3 3" vertical={false} /><XAxis dataKey="month" /><YAxis /><Tooltip formatter={formatRupiah} /><Legend /><Bar dataKey="Jakarta" fill="#111827" radius={[4, 4, 0, 0]} /><Bar dataKey="Bandung" fill="#dc2626" radius={[4, 4, 0, 0]} /></BarChart></ResponsiveContainer></div>
              </div>
            </div>
          </>
        )}

        {/* VIEW 2: OFFLINE */}
        {activeMenu === 'offline' && (
          <div className="space-y-6">
            <h1 className="text-3xl font-black text-gray-900 tracking-tighter uppercase">Simulasi Kasir Offline</h1>
            <form onSubmit={handleAddOfflineSale} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 items-end">
              <div><label className="block text-xs font-bold text-gray-500 uppercase mb-2">Barang</label><select value={offlineItemCode} onChange={(e) => setOfflineItemCode(e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm">{products.map(p => <option key={p.id} value={p.id}>{p.name} (Stok: {p.stock})</option>)}</select></div>
              <div><label className="block text-xs font-bold text-gray-500 uppercase mb-2">Jumlah</label><input type="number" min="1" value={offlineQty} onChange={(e) => setOfflineQty(Number(e.target.value))} className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm" /></div>
              <div><label className="block text-xs font-bold text-gray-500 uppercase mb-2">Lokasi</label><select value={offlineCabang} onChange={(e) => setOfflineCabang(e.target.value as 'Jakarta' | 'Bandung')} className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm"><option value="Jakarta">Cabang Jakarta</option><option value="Bandung">Cabang Bandung</option></select></div>
              <button type="submit" className="bg-black text-white p-3.5 rounded-xl font-bold text-sm cursor-pointer hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"><Plus className="w-4 h-4"/> Catat Penjualan</button>
            </form>
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 overflow-x-auto"><table className="w-full text-left min-w-125"><thead><tr className="border-b border-gray-100 text-gray-400 text-xs font-bold uppercase"><th className="pb-3">ID Nota</th><th className="pb-3">Produk</th><th className="pb-3">Qty</th><th className="pb-3">Total</th><th className="pb-3">Cabang</th></tr></thead><tbody className="text-sm divide-y divide-gray-50">{offlineSales.map(s => <tr key={s.id}><td className="py-3 font-mono text-gray-400 font-bold">{s.id}</td><td className="py-3 font-bold">{s.productName}</td><td className="py-3">{s.qty} pasang</td><td className="py-3 font-bold">Rp {s.totalPrice.toLocaleString('id-ID')}</td><td className="py-3"><span className="px-2.5 py-1 text-xs font-bold rounded-full bg-red-50 text-red-600">{s.cabang}</span></td></tr>)}</tbody></table></div>
          </div>
        )}

        {/* VIEW 3: INVENTARIS */}
        {activeMenu === 'inventaris' && (
          <div className="space-y-6">
            <h1 className="text-3xl font-black text-gray-900 tracking-tighter uppercase">Manajemen Inventaris</h1>
            <form onSubmit={handleAddProduct} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col sm:flex-row gap-4 items-end">
              <div className="flex-1 w-full"><label className="block text-xs font-bold text-gray-500 uppercase mb-2">Nama SKU</label><input type="text" value={newProdName} onChange={(e) => setNewProdName(e.target.value)} placeholder="Aero Running Shoes" className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm" required /></div>
              <div className="w-full sm:w-32"><label className="block text-xs font-bold text-gray-500 uppercase mb-2">Stok</label><input type="number" value={newProdStock} onChange={(e) => setNewProdStock(Number(e.target.value))} className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm" /></div>
              <button type="submit" className="w-full sm:w-auto bg-red-600 text-white px-6 py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 cursor-pointer hover:bg-red-700 transition-colors"><Plus className="w-4 h-4" /> Tambah</button>
            </form>
            <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm overflow-x-auto"><table className="w-full text-left min-w-150"><thead><tr className="border-b border-gray-100 text-gray-400 text-xs font-bold uppercase"><th className="pb-3">SKU</th><th className="pb-3">Nama Produk</th><th className="pb-3">Stok</th><th className="pb-3">Manajerial</th><th className="pb-3">Status</th><th className="pb-3 text-right">Aksi</th></tr></thead><tbody className="text-sm divide-y divide-gray-50">{products.map(p => <tr key={p.id}><td className="py-4 font-mono text-gray-400 font-bold">{p.id}</td><td className="py-4 font-bold">{p.name}</td><td className="py-4 font-mono font-black">{p.stock} pcs</td><td className="py-4"><div className="flex gap-1"><button onClick={() => handleUpdateStock(p.id, p.stock - 5)} className="px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded font-bold cursor-pointer">-5</button><button onClick={() => handleUpdateStock(p.id, p.stock + 5)} className="px-2 py-1 bg-gray-900 text-white hover:bg-gray-800 rounded font-bold cursor-pointer">+5</button></div></td><td className="py-4"><span className={`px-2.5 py-1 text-xs font-bold rounded-full border ${p.status === 'In Stock' ? 'bg-green-50 text-green-700 border-green-200' : p.status === 'Low Stock' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' : 'bg-red-50 text-red-700 border-red-200'}`}>{p.status}</span></td><td className="py-4 text-right"><button onClick={() => handleDeleteProduct(p.id)} className="p-2 text-gray-400 hover:text-red-600 cursor-pointer transition-colors"><Trash2 className="w-4 h-4" /></button></td></tr>)}</tbody></table></div>
          </div>
        )}

        {/* VIEW 4: ORDERS */}
        {activeMenu === 'orders' && (
          <div className="space-y-6">
            <h1 className="text-3xl font-black text-gray-900 tracking-tighter uppercase">Pengiriman Pesanan Online</h1>
            <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm overflow-x-auto"><table className="w-full text-left min-w-150"><thead><tr className="border-b border-gray-100 text-gray-400 text-xs font-bold uppercase"><th className="pb-3">ID Pesanan</th><th className="pb-3">Pembeli</th><th className="pb-3">Item</th><th className="pb-3">Total</th><th className="pb-3">Status</th><th className="pb-3 text-right">Aksi</th></tr></thead><tbody className="text-sm divide-y divide-gray-50">{orders.map(o => <tr key={o.id}><td className="py-4 font-mono text-gray-400 font-bold">{o.id}</td><td className="py-4 font-bold">{o.customerName}</td><td className="py-4 text-xs text-gray-600">{o.items.map((i, idx) => <div key={idx}>{i.productName} (x{i.qty})</div>)}</td><td className="py-4 font-bold">Rp {o.totalAmount.toLocaleString('id-ID')}</td><td className="py-4"><span className={`px-3 py-1 text-xs font-black rounded-full border ${o.status === 'Packing' ? 'bg-blue-50 text-blue-700 border-blue-200' : o.status === 'Delivery' ? 'bg-orange-50 text-orange-700 border-orange-200' : 'bg-green-50 text-green-700 border-green-200'}`}>{o.status}</span></td><td className="py-4 text-right"><button onClick={() => handleToggleOrderStatus(o.id)} className="inline-flex items-center gap-1 bg-gray-900 text-white text-xs font-bold px-3 py-2 rounded-xl hover:bg-gray-800 cursor-pointer"><RefreshCw className="w-3 h-3" /> Status</button></td></tr>)}</tbody></table></div>
          </div>
        )}

        {/* VIEW 5: CUSTOMERS */}
        {activeMenu === 'customers' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h1 className="text-3xl font-black text-gray-900 tracking-tighter uppercase">Manajemen Pelanggan</h1>
                <p className="text-sm text-gray-500 font-medium">Modul CRM Terintegrasi Database Cloudflare D1</p>
              </div>
              <button 
                onClick={() => setIsCustModalOpen(true)}
                className="w-full sm:w-auto bg-black text-white px-5 py-3 rounded-xl font-bold text-sm hover:bg-gray-800 transition-colors cursor-pointer flex items-center justify-center gap-2 shadow-md"
              >
                <Plus className="w-4 h-4" /> Tambah Pelanggan Manual
              </button>
            </div>

            <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm overflow-x-auto">
              <table className="w-full text-left min-w-150">
                <thead>
                  <tr className="border-b border-gray-100 text-gray-400 text-xs font-bold uppercase">
                    <th className="pb-3">ID Akun</th>
                    <th className="pb-3">Nama Lengkap</th>
                    <th className="pb-3">Kontak (Email / HP)</th>
                    <th className="pb-3">Tanggal Bergabung</th>
                    <th className="pb-3 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="text-sm divide-y divide-gray-50">
                  {customers.map(c => (
                    <tr key={c.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="py-4 font-mono font-bold text-gray-400">{c.id}</td>
                      <td className="py-4 font-bold text-gray-900">{c.name}</td>
                      <td className="py-4">
                        <div className="text-gray-900 font-medium">{c.email}</div>
                        <div className="text-gray-500 text-xs">{c.phone || '-'}</div>
                      </td>
                      <td className="py-4 text-gray-600">{c.joinDate}</td>
                      <td className="py-4 text-right">
                        <button 
                          onClick={() => onUpdateCustomers(customers.filter(cust => cust.id !== c.id))}
                          className="p-2 text-gray-400 hover:text-red-600 rounded-xl transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>

      {/* POPUP MODAL DI-RENDER DI LUAR KANVAS STRUKTUR UTAMA */}
      {isCustModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-110 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-md rounded-3xl p-8 shadow-2xl border border-gray-100 relative animate-in fade-in zoom-in-95 duration-200">
            
            <button 
              onClick={() => setIsCustModalOpen(false)} 
              className="absolute top-6 right-6 text-gray-400 hover:text-black font-bold cursor-pointer p-1.5 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="mb-6">
              <h2 className="text-2xl font-black tracking-tighter uppercase text-gray-900 flex items-center gap-2">
                <Users className="w-6 h-6 text-red-600" /> Registrasi CRM
              </h2>
              <p className="text-sm text-gray-500 mt-1">Suntik data keanggotaan pelanggan baru secara manual ke kluster data D1.</p>
            </div>

            <form onSubmit={handleAddCustomer} className="space-y-4">
              <div className="relative">
                <input 
                  type="text" placeholder="Nama Lengkap" value={newCustName} 
                  onChange={(e) => setNewCustName(e.target.value)} 
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3.5 pl-11 pr-4 text-sm outline-none focus:border-black focus:bg-white transition-all" 
                  required 
                />
                <User className="w-4 h-4 text-gray-400 absolute left-4 top-4" />
              </div>

              <div className="relative">
                <input 
                  type="email" placeholder="Alamat Email" value={newCustEmail} 
                  onChange={(e) => setNewCustEmail(e.target.value)} 
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3.5 pl-11 pr-4 text-sm outline-none focus:border-black focus:bg-white transition-all" 
                  required 
                />
                <Mail className="w-4 h-4 text-gray-400 absolute left-4 top-4" />
              </div>

              <div className="relative">
                <input 
                  type="tel" placeholder="No. Handphone" value={newCustPhone} 
                  onChange={(e) => setNewCustPhone(e.target.value)} 
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3.5 pl-11 pr-4 text-sm outline-none focus:border-black focus:bg-white transition-all" 
                  required 
                />
                <Phone className="w-4 h-4 text-gray-400 absolute left-4 top-4" />
              </div>

              <button 
                type="submit" 
                className="w-full bg-black text-white py-4 rounded-xl font-bold text-sm hover:bg-gray-800 transition-colors flex items-center justify-center gap-2 mt-4 cursor-pointer shadow-md"
              >
                <Plus className="w-4 h-4" /> Simpan Ke Database D1
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}