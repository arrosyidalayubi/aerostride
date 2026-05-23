import { useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import FeaturedProducts from './components/FeaturedProducts';
import Testimonials from './components/Testimonials';
import Footer from './components/Footer';
import AdminDashboard from './components/AdminDashboard';
import AdminSidebar from './components/AdminSidebar';
import CustomerDashboard from './components/CustomerDashboard';
import CartDrawer from './components/CartDrawer';
import Auth from './components/Auth';
import type { Product, Order, OfflineSale } from './types';

function App() {
  const [currentView, setCurrentView] = useState<'store' | 'admin' | 'customer'>('store');
  const [activeAdminMenu, setActiveAdminMenu] = useState('ringkasan');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  
  // State User Session Manager
  const [user, setUser] = useState<{ name: string; role: 'admin' | 'customer' } | null>(null);

  // --- DATABASE STATE BROKER (IN-MEMORY DB SIMULATION) ---
  const [products, setProducts] = useState<Product[]>([
    { id: 'AST-01', name: 'Apex Weather-Shield Jacket', price: 750000, category: 'Jaket', size: 'L', stock: 120, threshold: 50, status: 'In Stock', image: 'https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?q=80&w=800&auto=format&fit=crop' },
    { id: 'AST-02', name: 'StreetStride Reflective Shoes', price: 680000, category: 'Sepatu', size: '42', stock: 85, threshold: 30, status: 'In Stock', image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=800&auto=format&fit=crop' },
    { id: 'AST-03', name: 'Urban Commuter Sling Bag', price: 350000, category: 'Aksesoris', size: 'All Size', stock: 200, threshold: 50, status: 'In Stock', image: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?q=80&w=800&auto=format&fit=crop' },
    { id: 'AST-04', name: 'Hydro-Grip Daily Sneakers', price: 550000, category: 'Sepatu', size: '40', stock: 90, threshold: 30, status: 'In Stock', image: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?q=80&w=800&auto=format&fit=crop' }
  ]);

  const [orders, setOrders] = useState<Order[]>([
    { id: 'TRX-ONL-001', customerName: 'Gladys Aditya', items: [{ productName: 'Apex Weather-Shield Jacket', qty: 1, price: 750000 }], totalAmount: 750000, status: 'Delivery', date: '22 Mei' }
  ]);

  // Data sesuai: Book1.xlsx - penjualan offline.csv
  const [offlineSales, setOfflineSales] = useState<OfflineSale[]>([
    { id: 'TRX-OFF-001', itemCode: 'AST-01', productName: 'Apex Weather-Shield Jacket', qty: 2, totalPrice: 1500000, cabang: 'Jakarta', date: 'April' },
    { id: 'TRX-OFF-002', itemCode: 'AST-02', productName: 'StreetStride Reflective Shoes', qty: 1, totalPrice: 680000, cabang: 'Bandung', date: 'April' }
  ]);

  const handleViewChange = (view: 'store' | 'admin' | 'customer') => {
    if (view === 'admin' && (!user || user.role !== 'admin')) {
      setIsAuthModalOpen(true);
      alert('Akses Terbatas: Sila login dengan Akun Admin.');
      return;
    }
    setCurrentView(view);
  };

  // --- ALUR SIMULASI PEMBELIAN CUSTOMER ONLINE (AUTOMATIC UPDATE) ---
  const handleOnlineCheckout = () => {
    if (!user) {
      setIsCartOpen(false);
      setIsAuthModalOpen(true);
      alert('Autentikasi Diperlukan: Silakan login atau buat akun terlebih dahulu untuk melanjutkan proses pembayaran.');
      return;
    }

    // Simulasi barang di dalam keranjang belanja
    const targetSku = 'AST-01'; 
    const targetProduct = products.find(p => p.id === targetSku);

    if (!targetProduct || targetProduct.stock < 1) {
      alert('Checkout Gagal: Stok produk pilihan saat ini habis!');
      return;
    }

    // 1. Kurangi stok di master data produk secara otomatis
    const updatedProducts = products.map(p => {
      if (p.id === targetSku) {
        const stock = p.stock - 1;
        const status: Product['status'] = stock <= 5 ? 'Critical' : stock <= p.threshold ? 'Low Stock' : 'In Stock';
        return { ...p, stock, status };
      }
      return p;
    });
    setProducts(updatedProducts);

    // 2. Buat Nota Invoice Order baru ke Database Admin
    const newOrder: Order = {
      id: `TRX-ONL-00${orders.length + 1}`,
      customerName: user.name,
      items: [{ productName: targetProduct.name, qty: 1, price: targetProduct.price }],
      totalAmount: targetProduct.price,
      status: 'Packing',
      date: '23 Mei'
    };
    setOrders([...orders, newOrder]);

    setIsCartOpen(false);
    alert('Pembayaran Berhasil! Silakan cek status kurir di panel akun Anda.');
    setCurrentView('customer'); // Langsung arahkan pembeli ke dashboard miliknya
  };

  return (
    <div className="min-h-screen bg-white text-gray-900 selection:bg-gray-900 selection:text-white relative">
      
      {/* Render Top Navbar hanya jika tidak berada dalam dashboard admin tertutup */}
      {currentView !== 'admin' && (
        <Navbar 
          onOpenCart={() => setIsCartOpen(true)}
          onOpenAuth={() => setIsAuthModalOpen(true)}
          currentView={currentView === 'store' ? 'store' : 'admin'}
          onViewChange={(v) => handleViewChange(v === 'admin' ? 'admin' : 'store')}
          user={user}
          onLogout={() => { setUser(null); setCurrentView('store'); }}
        />
      )}

      {/* SAKLAR UTAMA LAYOUT ROUTING */}
      {currentView === 'store' && (
        <>
          <main className="pt-16">
            <Hero />
            <FeaturedProducts />
            <Testimonials />
          </main>
          <Footer />
        </>
      )}

      {currentView === 'customer' && (
        <CustomerDashboard orders={orders} userName={user?.name || ''} />
      )}

      {currentView === 'admin' && (
        <div className="flex bg-gray-50 min-h-screen">
          <AdminSidebar 
            activeMenu={activeAdminMenu}
            setActiveMenu={setActiveAdminMenu}
            userName={user?.name || 'Admin'}
            onLogout={() => { setUser(null); setCurrentView('store'); }}
            onBackToStore={() => setCurrentView('store')}
          />
          <main className="flex-1">
            <AdminDashboard 
              activeMenu={activeAdminMenu}
              products={products}
              orders={orders}
              offlineSales={offlineSales}
              onUpdateProducts={setProducts}
              onUpdateOrders={setOrders}
              onUpdateOfflineSales={setOfflineSales}
            />
          </main>
        </div>
      )}

      {/* GLOBAL OVERLAYS */}
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} onCheckout={handleOnlineCheckout} />
      {isAuthModalOpen && <Auth onLoginSuccess={(u) => { setUser(u); setIsAuthModalOpen(false); if(u.role === 'admin') setCurrentView('admin'); else setCurrentView('customer'); }} onClose={() => setIsAuthModalOpen(false)} />}
    </div>
  );
}

export default App;