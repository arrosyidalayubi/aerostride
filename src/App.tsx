import { useState, useEffect } from 'react';
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
import type { Product, Order, OfflineSale, CustomerData } from './types';
import { Menu } from 'lucide-react'; // Impor ikon hamburger untuk seluler admin

function App() {
  const [currentView, setCurrentView] = useState<'store' | 'admin' | 'customer'>('store');
  const [activeAdminMenu, setActiveAdminMenu] = useState('ringkasan');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  
  // State Pengendali Menu Responsif Seluler Admin
  const [isAdminMobileOpen, setIsAdminMobileOpen] = useState(false);
  
  const [user, setUser] = useState<{ name: string; role: 'admin' | 'customer' } | null>(null);

  // --- OMNICHANNEL REPOSITORY DATABASE ---
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [offlineSales, setOfflineSales] = useState<OfflineSale[]>([]);
  const [customers, setCustomers] = useState<CustomerData[]>([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const resProd = await fetch('/api/products');
        if (resProd.ok) setProducts(await resProd.json());
        
        const resCust = await fetch('/api/customers');
        if (resCust.ok) setCustomers(await resCust.json());
      } catch (error) {
        console.error("Gagal sinkronisasi data server:", error);
      }
    };
    fetchDashboardData();
  }, []);

  const handleViewChange = (view: 'store' | 'admin' | 'customer') => {
    if (view === 'admin' && (!user || user.role !== 'admin')) {
      setIsAuthModalOpen(true);
      alert('Akses Terbatas: Sila login dengan Akun Admin.');
      return;
    }
    setCurrentView(view);
  };

  const handleOnlineCheckout = async () => {
    if (!user) { 
      setIsCartOpen(false);
      setIsAuthModalOpen(true);
      alert('Autentikasi Diperlukan: Silakan masuk terlebih dahulu.');
      return; 
    }

    const targetSku = 'AST-01'; 
    const targetProduct = products.find(p => p.id === targetSku);
    if (!targetProduct) return;

    const orderId = `TRX-ONL-${Date.now()}`;

    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sku: targetSku, qty: 1, orderId: orderId, customerName: user.name, totalAmount: targetProduct.price, date: '23 Mei'
        })
      });

      if (!response.ok) throw new Error("Gagal Checkout");
      alert('Pembayaran Berhasil! Sistem pusat telah mencatat transaksi Anda.');
      
      const resProd = await fetch('/api/products');
      if (resProd.ok) setProducts(await resProd.json());
      
      setIsCartOpen(false);
      setCurrentView('customer');
    } catch (error) {
      alert('Terjadi kesalahan pada server: ' + error);
    }
  };

  return (
    <div className="min-h-screen bg-white text-gray-900 selection:bg-gray-900 selection:text-white relative">
      
      {/* RENDER TOP BAR UTAMA TOKO (Hanya jika TIDAK di area Admin) */}
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

      {/* RENDER TOP BAR KHUSUS MOBILE VIEW ADMIN */}
      {currentView === 'admin' && (
        <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-gray-900 text-white flex items-center justify-between px-4 z-40 shadow-md">
          <button 
            onClick={() => setIsAdminMobileOpen(true)} 
            className="p-2 text-gray-400 hover:text-white transition-colors cursor-pointer"
          >
            <Menu className="w-6 h-6" />
          </button>
          <span className="font-black tracking-tighter uppercase text-sm text-gray-200">Panel Kendali SIM</span>
          <div className="w-10"></div> {/* Penyeimbang Sejajar */}
        </div>
      )}

      {/* STRUKTUR ROUTING LAYOUT */}
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
            isOpen={isAdminMobileOpen}
            onClose={() => setIsAdminMobileOpen(false)}
            onLogout={() => { setUser(null); setCurrentView('store'); }}
            onBackToStore={() => setCurrentView('store')}
          />
          <main className="flex-1">
            <AdminDashboard 
              activeMenu={activeAdminMenu}
              products={products}
              orders={orders}
              offlineSales={offlineSales}
              customers={customers}
              onUpdateProducts={setProducts}
              onUpdateOrders={setOrders}
              onUpdateOfflineSales={setOfflineSales}
              onUpdateCustomers={setCustomers}
            />
          </main>
        </div>
      )}

      {/* OVERLAYS GLOBAL */}
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} onCheckout={handleOnlineCheckout} />
      {isAuthModalOpen && <Auth onLoginSuccess={(u) => { setUser(u); setIsAuthModalOpen(false); if(u.role === 'admin') setCurrentView('admin'); else setCurrentView('customer'); }} onClose={() => setIsAuthModalOpen(false)} />}
    </div>
  );
}

export default App;