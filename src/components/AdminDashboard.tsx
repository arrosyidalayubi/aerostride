import { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from 'recharts';
import { Trash2, Plus, RefreshCw } from 'lucide-react';
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

  // Local State untuk Form Input CRUD
  const [newProdName, setNewProdName] = useState('');
  const [newProdStock, setNewProdStock] = useState(20);
  const [offlineItemCode, setOfflineItemCode] = useState('INV-001');
  const [offlineQty, setOfflineQty] = useState(1);
  const [offlineCabang, setOfflineCabang] = useState<'Jakarta' | 'Bandung'>('Jakarta');
  const [newCustName, setNewCustName] = useState('');
  const [newCustEmail, setNewCustEmail] = useState('');
  const [newCustPhone, setNewCustPhone] = useState('');

  // --- HANDLER CRUD MANAJEMEN INVENTARIS ---
  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    const newId = `INV-00${products.length + 1}`;
    const newProduct: Product = {
      id: newId,
      name: newProdName,
      price: 1250000,
      category: 'Footwear',
      size: '42',
      stock: Number(newProdStock),
      threshold: 15,
      status: Number(newProdStock) <= 5 ? 'Critical' : Number(newProdStock) <= 15 ? 'Low Stock' : 'In Stock',
      image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=200&auto=format&fit=crop'
    };
    onUpdateProducts([...products, newProduct]);
    setNewProdName('');
  };

  const handleDeleteProduct = (id: string) => {
    onUpdateProducts(products.filter(p => p.id !== id));
  };

  const handleUpdateStock = (id: string, newStock: number) => {
    const updated = products.map(p => {
      if (p.id === id) {
        const stock = Math.max(0, newStock);
        const status: 'Critical' | 'Low Stock' | 'In Stock' = stock <= 5 ? 'Critical' : stock <= p.threshold ? 'Low Stock' : 'In Stock';
        return { ...p, stock, status };
      }
      return p;
    });
    onUpdateProducts(updated);
  };

  // --- HANDLER CRUD PENJUALAN OFFLINE ---
  const handleAddOfflineSale = (e: React.FormEvent) => {
    e.preventDefault();
    const targetProduct = products.find(p => p.id === offlineItemCode);
    if (!targetProduct) return;

    if (targetProduct.stock < offlineQty) {
      alert('Transaksi Gagal: Stok gudang tidak mencukupi untuk penjualan offline ini!');
      return;
    }

    const priceTotal = targetProduct.price * offlineQty;
    const newSale: OfflineSale = {
      id: `TRX-OFF-${offlineSales.length + 1}`,
      itemCode: offlineItemCode,
      productName: targetProduct.name,
      qty: offlineQty,
      totalPrice: priceTotal,
      cabang: offlineCabang,
      date: 'Mei'
    };

    // 1. Kurangi stok barang karena laku terjual di toko fisik
    handleUpdateStock(offlineItemCode, targetProduct.stock - offlineQty);
    // 2. Catat log penjualan offline
    onUpdateOfflineSales([...offlineSales, newSale]);
  };

  // --- HANDLER CRUD PELANGGAN MANUAl ---
  const handleAddCustomer = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Generate ID & Tanggal
    const newId = `CUST-00${customers.length + 1}`;
    const today = new Date();
    const formattedDate = today.toLocaleDateString('id-ID', { 
      day: 'numeric', month: 'long', year: 'numeric' 
    });

    const newCustomer = {
      id: newId,
      name: newCustName,
      email: newCustEmail,
      phone: newCustPhone,
      joinDate: formattedDate
    };

    try {
      // 1. Tembak data (POST) ke Backend API Cloudflare
      const response = await fetch('/api/customers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newCustomer)
      });

      if (!response.ok) {
        throw new Error('Gagal menyimpan data ke Database Server');
      }

      // 2. Jika server sukses merespons, baru kita update UI di layar
      onUpdateCustomers([newCustomer, ...customers]);
      
      // 3. Kosongkan form
      setNewCustName('');
      setNewCustEmail('');
      setNewCustPhone('');

      alert('Berhasil! Data pelanggan telah disimpan secara permanen di Database.');

    } catch (error) {
      alert('Terjadi kesalahan koneksi ke server: ' + error);
    }
  };
  // --- HANDLER UPDATE STATUS DELIVERY ORDER ---
  const handleToggleOrderStatus = (orderId: string) => {
    const updated = orders.map(o => {
      if (o.id === orderId) {
        const nextStatus: Order['status'] = o.status === 'Packing' ? 'Delivery' : o.status === 'Delivery' ? 'Delivered' : 'Packing';
        return { ...o, status: nextStatus };
      }
      return o;
    });
    onUpdateOrders(updated);
  };

  // --- CHART FORMATTERS ---
  type RechartsValue = string | number | readonly (string | number)[] | undefined;
  const formatRupiah = (value: RechartsValue): [string, string] => [`Rp ${value ?? 0} Juta`, 'Revenue'];

  // Agregasi Chart Data Online
  const ONLINE_CHART_DATA = [
    { name: 'Jan', revenue: 125 }, { name: 'Feb', revenue: 150 },
    { name: 'Mar', revenue: 180 }, { name: 'Apr', revenue: 140 },
    // Data bulan Mei mengambil total orders (Online) yang dinamis
    { name: 'Mei', revenue: orders.reduce((acc, o) => acc + o.totalAmount, 0) / 1000000 + 210 }
  ];

  // Agregasi Chart Data Offline (Menyatukan Histori Excel + Transaksi Manual State)
  const OFFLINE_CHART_DATA = [
    { month: 'Jan', Jakarta: 231, Bandung: 126 },
    { month: 'Feb', Jakarta: 247.5, Bandung: 138 },
    { month: 'Mar', Jakarta: 264, Bandung: 135 },
    { month: 'Apr', Jakarta: 253, Bandung: 144 },
    { 
      month: 'Mei', 
      Jakarta: offlineSales.filter(s => s.cabang === 'Jakarta').reduce((acc, s) => acc + s.totalPrice, 0) / 1000000,
      Bandung: offlineSales.filter(s => s.cabang === 'Bandung').reduce((acc, s) => acc + s.totalPrice, 0) / 1000000
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 ml-64 p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* VIEW 1: RINGKASAN OMNICHANNEL */}
        {activeMenu === 'ringkasan' && (
          <>
            <div>
              <h1 className="text-3xl font-black text-gray-900 tracking-tighter">RINGKASAN OMNICHANNEL</h1>
              <p className="text-gray-500 text-sm">Dashboard Analitik Sistem Informasi Manajemen AeroStride</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                <h3 className="text-md font-bold mb-4 uppercase text-gray-400">Tren E-Commerce (Online)</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={ONLINE_CHART_DATA}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                      <XAxis dataKey="name" tick={{fill: '#6b7280'}} />
                      <YAxis tick={{fill: '#6b7280'}} />
                      <Tooltip formatter={formatRupiah} />
                      <Line type="monotone" dataKey="revenue" stroke="#111827" strokeWidth={3} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                <h3 className="text-md font-bold mb-4 uppercase text-gray-400">Distribusi Toko Fisik (Offline)</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={OFFLINE_CHART_DATA}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                      <XAxis dataKey="month" tick={{fill: '#6b7280'}} />
                      <YAxis tick={{fill: '#6b7280'}} />
                      <Tooltip formatter={formatRupiah} cursor={{fill: '#f3f4f6'}} />
                      <Legend iconType="circle" wrapperStyle={{ paddingTop: '10px' }} />
                      
                      {/* Memisahkan batang grafik menjadi dua untuk perbandingan per bulan */}
                      <Bar dataKey="Jakarta" fill="#111827" radius={[4, 4, 0, 0]} name="Cabang Jakarta" />
                      <Bar dataKey="Bandung" fill="#dc2626" radius={[4, 4, 0, 0]} name="Cabang Bandung" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </>
        )}
        {/* VIEW 2: CRUD PENJUALAN OFFLINE */}
        {activeMenu === 'offline' && (
          <div className="space-y-6">
            <h1 className="text-3xl font-black text-gray-900 tracking-tighter uppercase">Simulasi Transaksi Kasir Offline</h1>
            
            <form onSubmit={handleAddOfflineSale} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Pilih Barang</label>
                <select value={offlineItemCode} onChange={(e) => setOfflineItemCode(e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm">
                  {products.map(p => <option key={p.id} value={p.id}>{p.name} (Stok: {p.stock})</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Jumlah Beli</label>
                <input type="number" min="1" value={offlineQty} onChange={(e) => setOfflineQty(Number(e.target.value))} className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Lokasi Toko</label>
                <select value={offlineCabang} onChange={(e) => setOfflineCabang(e.target.value as 'Jakarta' | 'Bandung')} className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm">
                  <option value="Jakarta">Cabang Jakarta</option>
                  <option value="Bandung">Cabang Bandung</option>
                </select>
              </div>
              <button type="submit" className="bg-black text-white p-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 cursor-pointer hover:bg-gray-800">
                <Plus className="w-4 h-4" /> Catat Nota Penjualan
              </button>
            </form>

            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-gray-100 text-gray-400 text-xs font-bold uppercase">
                    <th className="pb-3">ID Nota</th>
                    <th className="pb-3">Nama Produk</th>
                    <th className="pb-3">Qty</th>
                    <th className="pb-3">Total Harga</th>
                    <th className="pb-3">Cabang</th>
                  </tr>
                </thead>
                <tbody className="text-sm divide-y divide-gray-50">
                  {offlineSales.map(s => (
                    <tr key={s.id}>
                      <td className="py-3 font-mono font-bold text-gray-400">{s.id}</td>
                      <td className="py-3 font-bold text-gray-900">{s.productName}</td>
                      <td className="py-3 font-medium text-gray-600">{s.qty} pasang</td>
                      <td className="py-3 font-bold text-gray-900">Rp {s.totalPrice.toLocaleString('id-ID')}</td>
                      <td className="py-3"><span className="px-2 py-0.5 text-xs font-bold rounded-full bg-red-50 text-red-600">{s.cabang}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* VIEW 3: CRUD MANAJEMEN INVENTARIS */}
        {activeMenu === 'inventaris' && (
          <div className="space-y-6">
            <h1 className="text-3xl font-black text-gray-900 tracking-tighter uppercase">Logistik & Manajemen Inventaris</h1>
            
            <form onSubmit={handleAddProduct} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col md:flex-row gap-4 items-end">
              <div className="flex-1">
                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Nama SKU Baru</label>
                <input type="text" value={newProdName} onChange={(e) => setNewProdName(e.target.value)} placeholder="Contoh: Aero Alpha Commuter" className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm" required />
              </div>
              <div className="w-32">
                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Stok Awal</label>
                <input type="number" value={newProdStock} onChange={(e) => setNewProdStock(Number(e.target.value))} className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm" />
              </div>
              <button type="submit" className="bg-red-600 text-white px-6 py-3.5 rounded-xl font-bold text-sm flex items-center gap-2 cursor-pointer hover:bg-red-700">
                <Plus className="w-4 h-4" /> Tambah Barang
              </button>
            </form>

            <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-gray-100 text-gray-400 text-xs font-bold uppercase">
                    <th className="pb-3">Kode SKU</th>
                    <th className="pb-3">Nama Produk</th>
                    <th className="pb-3">Stok Sistem</th>
                    <th className="pb-3">Ubah Stok Manajerial</th>
                    <th className="pb-3">Status</th>
                    <th className="pb-3 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="text-sm divide-y divide-gray-50">
                  {products.map(p => (
                    <tr key={p.id}>
                      <td className="py-4 font-mono font-bold text-gray-400">{p.id}</td>
                      <td className="py-4 font-bold text-gray-900">{p.name}</td>
                      <td className="py-4 font-mono font-black">{p.stock} pcs</td>
                      <td className="py-4">
                        <div className="flex gap-1">
                          <button onClick={() => handleUpdateStock(p.id, p.stock - 5)} className="px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded font-bold">-5</button>
                          <button onClick={() => handleUpdateStock(p.id, p.stock + 5)} className="px-2 py-1 bg-gray-900 text-white hover:bg-gray-800 rounded font-bold">+5</button>
                        </div>
                      </td>
                      <td className="py-4">
                        <span className={`px-2.5 py-1 text-xs font-bold rounded-full border ${
                          p.status === 'In Stock' ? 'bg-green-50 text-green-700 border-green-200' :
                          p.status === 'Low Stock' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' : 'bg-red-50 text-red-700 border-red-200'
                        }`}>{p.status}</span>
                      </td>
                      <td className="py-4 text-right">
                        <button onClick={() => handleDeleteProduct(p.id)} className="p-2 text-gray-400 hover:text-red-600 rounded-xl transition-colors cursor-pointer">
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

        {/* VIEW 4: ORDERS & STATUS DELIVERY CONTROLLER */}
        {activeMenu === 'orders' && (
          <div className="space-y-6">
            <h1 className="text-3xl font-black text-gray-900 tracking-tighter uppercase">Ekspedisi & Pengiriman Pesanan Online</h1>
            <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-gray-100 text-gray-400 text-xs font-bold uppercase">
                    <th className="pb-3">ID Pesanan</th>
                    <th className="pb-3">Nama Pembeli</th>
                    <th className="pb-3">Item Belanja</th>
                    <th className="pb-3">Nilai Nota</th>
                    <th className="pb-3">Status Kurir</th>
                    <th className="pb-3 text-right">Kontrol Status SIM</th>
                  </tr>
                </thead>
                <tbody className="text-sm divide-y divide-gray-50">
                  {orders.map(o => (
                    <tr key={o.id}>
                      <td className="py-4 font-mono font-bold text-gray-400">{o.id}</td>
                      <td className="py-4 font-bold text-gray-900">{o.customerName}</td>
                      <td className="py-4 text-gray-600 text-xs">
                        {o.items.map((i, idx) => <div key={idx}>{i.productName} (x{i.qty})</div>)}
                      </td>
                      <td className="py-4 font-bold text-gray-900">Rp {o.totalAmount.toLocaleString('id-ID')}</td>
                      <td className="py-4">
                        <span className={`px-3 py-1 text-xs font-black rounded-full border ${
                          o.status === 'Packing' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                          o.status === 'Delivery' ? 'bg-orange-50 text-orange-700 border-orange-200' : 'bg-green-50 text-green-700 border-green-200'
                        }`}>{o.status}</span>
                      </td>
                      <td className="py-4 text-right">
                        <button onClick={() => handleToggleOrderStatus(o.id)} className="inline-flex items-center gap-1 bg-gray-900 text-white text-xs font-bold px-3 py-2 rounded-xl hover:bg-gray-800 cursor-pointer">
                          <RefreshCw className="w-3 h-3" /> Ubah Status
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}


        {/* VIEW 5: DATA PELANGGAN (CRM) */}
        {activeMenu === 'customers' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h1 className="text-3xl font-black text-gray-900 tracking-tighter uppercase mb-6">Manajemen Pelanggan</h1>
              
              <form onSubmit={handleAddCustomer} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm grid grid-cols-1 md:grid-cols-4 gap-4 items-end mb-6">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Nama Lengkap</label>
                  <input type="text" value={newCustName} onChange={(e) => setNewCustName(e.target.value)} placeholder="Budi Santoso" className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm" required />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Alamat Email</label>
                  <input type="email" value={newCustEmail} onChange={(e) => setNewCustEmail(e.target.value)} placeholder="arrosyid@gmail.com" className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm" required />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-2">No. Handphone</label>
                  <input type="tel" value={newCustPhone} onChange={(e) => setNewCustPhone(e.target.value)} placeholder="081234..." className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm" required />
                </div>
                <button type="submit" className="bg-black text-white p-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 cursor-pointer hover:bg-gray-800">
                  <Plus className="w-4 h-4" /> Tambah Manual
                </button>
              </form>
            </div>

            <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
              <table className="w-full text-left">
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
                    <tr key={c.id}>
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
                          title="Hapus Data"
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
    </div>
  );
}