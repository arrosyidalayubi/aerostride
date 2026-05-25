import { useEffect, useState } from 'react';
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
import CatalogView from './components/CatalogView';
import { useAppData } from './hooks/useAppData';
import { Menu } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

export default function App() {
  
  
  // 1. Inisialisasi state dengan membaca sessionStorage (jika ada, pakai itu; jika tidak, default ke 'store')
  const [currentView, setCurrentView] = useState<'store' | 'catalog' | 'admin' | 'customer'>(() => {
  return (sessionStorage.getItem('aero_view') as 'store' | 'catalog' | 'admin' | 'customer') || 'store';
});

  const [activeAdminMenu, setActiveAdminMenu] = useState('ringkasan');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isAdminMobileOpen, setIsAdminMobileOpen] = useState(false);
  
  const { 
    user, setUser, products, setProducts, orders, setOrders, 
    offlineSales, setOfflineSales, customers, setCustomers, 
    dailySales ,setDailySales, cart, addToCart, updateCartQty, removeFromCart, handleActualCheckout
  } = useAppData();

  // 2. Simpan setiap perubahan 'currentView' ke sessionStorage
  useEffect(() => {
    sessionStorage.setItem('aero_view', currentView);
  }, [currentView]);

  const handleLogout = () => {
    setUser(null);
    setCurrentView('store');
    sessionStorage.removeItem('aero_user');
    sessionStorage.removeItem('aero_view');
  };

  const handleViewChange = (view: 'store' | 'catalog' | 'admin' | 'customer') => {
    if (view === 'admin' && (!user || user.role !== 'admin')) {
      setIsAuthModalOpen(true);
      toast.error('Akses Terbatas: Sila login dengan Akun Admin.');
      return;
    }
    setCurrentView(view);
  };

  return (
    <div className="min-h-screen bg-white text-gray-900 relative">

      <Toaster 
      position="top-center"
      toastOptions={{
        style: {
          background: '#111827',
          color: '#fff',
          borderRadius: '16px',
          fontWeight: 'bold',
          padding: '16px 24px',
        },
        success: { iconTheme: { primary: '#10B981', secondary: '#fff' } },
        error: { iconTheme: { primary: '#EF4444', secondary: '#fff' } },
      }}
    />
      
      {currentView !== 'admin' && (
        <Navbar 
          cartItemCount={cart.reduce((sum, item) => sum + item.qty, 0)}  
          onOpenCart={() => setIsCartOpen(true)}
          onOpenAuth={() => setIsAuthModalOpen(true)}
          currentView={currentView} 
          onViewChange={handleViewChange} 
          user={user}
          onLogout={handleLogout}
        />
      )}

      <CartDrawer 
      isOpen={isCartOpen} 
      onClose={() => setIsCartOpen(false)} 
      cart={cart} 
      updateCartQty={updateCartQty} 
      removeFromCart={removeFromCart}
      onCheckout={() => {
          if (!user) {
            // Jika belum login: Beri peringatan, tutup keranjang, buka popup login
            toast.error('Silakan Masuk atau Daftar terlebih dahulu untuk melakukan pembayaran.');
            setIsCartOpen(false);
            setIsAuthModalOpen(true);
          } else {
            // Jika sudah login: Lanjutkan ke API
            handleActualCheckout(user);
          }
        }} 
    />

      {currentView === 'admin' && (
        <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-gray-900 text-white flex items-center justify-between px-4 z-40 shadow-md">
          <button onClick={() => setIsAdminMobileOpen(true)} className="p-2">
            <Menu className="w-6 h-6" />
          </button>
          <img src="/logo-aerostride-putih.png" alt="Panel Admin" className="h-6 object-contain" />
          <div className="w-10"></div>
        </div>
      )}

      {currentView === 'store' && (
        <>
        <main className="pt-16">
        <Hero onViewChange={setCurrentView} />
        <FeaturedProducts products={products} onAddToCart={addToCart} onViewAll={() => setCurrentView('catalog')} />
        <Testimonials />
        </main>
        <Footer />
        </>
      )}

      {currentView === 'catalog' && (
        <>
        <main className="pt-24 bg-gray-50 min-h-screen">
        <CatalogView products={products} onAddToCart={addToCart} onBackToStore={() => setCurrentView('store')} />
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
            activeMenu={activeAdminMenu} setActiveMenu={setActiveAdminMenu} userName={user?.name || 'Admin'}
            isOpen={isAdminMobileOpen} onClose={() => setIsAdminMobileOpen(false)}
            onLogout={handleLogout} onBackToStore={() => setCurrentView('store')}
          />
          <main className="flex-1">
            <AdminDashboard 
              activeMenu={activeAdminMenu} 
              products={products} 
              orders={orders} 
              offlineSales={offlineSales} 
              customers={customers} 
              dailySales={dailySales}
              onUpdateProducts={setProducts} 
              onUpdateOrders={setOrders} 
              onUpdateOfflineSales={setOfflineSales} 
              onUpdateCustomers={setCustomers}
              onUpdateDailySales={setDailySales} 
            />
          </main>
        </div>
      )}

      {isAuthModalOpen && <Auth onLoginSuccess={(u) => { setUser(u); setIsAuthModalOpen(false); if(u.role === 'admin') setCurrentView('admin'); else setCurrentView('customer'); }} onClose={() => setIsAuthModalOpen(false)} />}
    </div>
  );
}