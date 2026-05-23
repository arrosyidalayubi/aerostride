import { useState, useEffect } from 'react'; // <-- PERBAIKAN IMPORT
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

function App() {
  const [currentView, setCurrentView] = useState<'store' | 'admin' | 'customer'>('store');
  const [activeAdminMenu, setActiveAdminMenu] = useState('ringkasan');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [customers, setCustomers] = useState<CustomerData[]>([]);
  
  // State User Session Manager
  const [user, setUser] = useState<{ name: string; role: 'admin' | 'customer' } | null>(() => {
    const savedUser = localStorage.getItem('aerostride_session');
    if (savedUser) {
      try { return JSON.parse(savedUser); } catch { return null; }
    }
    return null;
  });

  const handleLogin = (loggedInUser: { name: string; role: 'admin' | 'customer' }) => {
    setUser(loggedInUser);
    localStorage.setItem('aerostride_session', JSON.stringify(loggedInUser)); // Simpan ke browser
    setIsAuthModalOpen(false);
    
    if (loggedInUser.role === 'admin') {
      setCurrentView('admin');
    } else {
      setCurrentView('customer');
    }
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('aerostride_session'); // Hapus dari browser
    setCurrentView('store');
  };

  // --- DATABASE STATE BROKER (HYBRID FALLBACK) ---
  // Jika API gagal atau belum dibuat, sistem akan otomatis menggunakan data asli dari Excel Anda ini
  const [products, setProducts] = useState<Product[]>([
    { id: 'AST-01', name: 'Apex Weather-Shield Jacket', price: 750000, category: 'Jaket', size: 'L', stock: 120, threshold: 50, status: 'In Stock', image: 'https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?q=80&w=800&auto=format&fit=crop' },
    { id: 'AST-02', name: 'StreetStride Reflective Shoes', price: 680000, category: 'Sepatu', size: '42', stock: 85, threshold: 30, status: 'In Stock', image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=800&auto=format&fit=crop' },
    { id: 'AST-03', name: 'Urban Commuter Sling Bag', price: 350000, category: 'Aksesoris', size: 'All Size', stock: 200, threshold: 50, status: 'In Stock', image: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?q=80&w=800&auto=format&fit=crop' },
    { id: 'AST-04', name: 'Hydro-Grip Daily Sneakers', price: 550000, category: 'Sepatu', size: '40', stock: 90, threshold: 30, status: 'In Stock', image: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?q=80&w=800&auto=format&fit=crop' }
  ]);

  const [orders, setOrders] = useState<Order[]>([
    { id: 'TRX-ONL-001', customerName: 'Gladys Aditya', items: [{ productName: 'Apex Weather-Shield Jacket', qty: 1, price: 750000 }], totalAmount: 750000, status: 'Delivery', date: '22 Mei' }
  ]);

  const [offlineSales, setOfflineSales] = useState<OfflineSale[]>([
    { id: 'TRX-OFF-001', itemCode: 'AST-01', productName: 'Apex Weather-Shield Jacket', qty: 2, totalPrice: 1500000, cabang: 'Jakarta', date: 'April' },
    { id: 'TRX-OFF-002', itemCode: 'AST-02', productName: 'StreetStride Reflective Shoes', qty: 1, totalPrice: 680000, cabang: 'Bandung', date: 'April' }
  ]);

  // Menarik data dari Cloudflare D1 saat web dibuka
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const resProd = await fetch('/api/products');
        if (resProd.ok) setProducts(await resProd.json());
        
        // Panggil API Customers
        const resCust = await fetch('/api/customers');
        if (resCust.ok) setCustomers(await resCust.json());
        
      } catch (error) {
        console.error("Gagal menarik data dari server:", error);
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

  // --- ALUR CHECKOUT ASYNC (API CLOUDFLARE D1) ---
  const handleOnlineCheckout = async () => {
    if (!user) { 
      setIsCartOpen(false);
      setIsAuthModalOpen(true);
      alert('Autentikasi Diperlukan: Silakan login atau buat akun terlebih dahulu untuk melanjutkan proses pembayaran.');
      return; 
    }

    const targetSku = 'AST-01'; 
    const targetProduct = products.find(p => p.id === targetSku);
    if (!targetProduct) {
      alert('Checkout Gagal: Data produk belum termuat dari server atau stok habis!');
      return;
    }

    const orderId = `TRX-ONL-${Date.now()}`;

    try {
      // Tembak data ke Endpoint Checkout Cloudflare
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sku: targetSku,
          qty: 1,
          orderId: orderId,
          customerName: user.name,
          totalAmount: targetProduct.price,
          date: '23 Mei' // Bisa diganti new Date().toLocaleDateString('id-ID') nanti
        })
      });

      if (!response.ok) throw new Error("Gagal Checkout di sisi Server");

      alert('Pembayaran Berhasil! Sistem pusat telah mencatat transaksi Anda.');
      
      // Refresh data produk agar stok di UI ter-update dari database
      const resProd = await fetch('/api/products');
      if (resProd.ok) {
        setProducts(await resProd.json());
      }
      
      setIsCartOpen(false);
      setCurrentView('customer');

    } catch (error) {
      alert('Terjadi kesalahan pada server: ' + error);
    }
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
          onLogout={handleLogout} // <--- GANTI JADI INI
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
            onLogout={handleLogout}
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

      {/* GLOBAL OVERLAYS */}
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} onCheckout={handleOnlineCheckout} />
      
      {/* GANTI KOMPONEN AUTH MENJADI SEPERTI INI */}
      {isAuthModalOpen && (
        <Auth 
          onLoginSuccess={handleLogin} 
          onClose={() => setIsAuthModalOpen(false)} 
        />
      )}
    </div>
  );
}

export default App;