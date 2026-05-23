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
import { useAppData } from './hooks/useAppData'; // Import Otak Data
import { Menu } from 'lucide-react';

export default function App() {
  const [currentView, setCurrentView] = useState<'store' | 'admin' | 'customer'>('store');
  const [activeAdminMenu, setActiveAdminMenu] = useState('ringkasan');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isAdminMobileOpen, setIsAdminMobileOpen] = useState(false);
  
  // Memanggil semua data & fungsi dari Custom Hook dalam 1 baris
  const { 
    user, setUser, products, setProducts, orders, setOrders, 
    offlineSales, setOfflineSales, customers, setCustomers, 
    dailySales, handleOnlineCheckout 
  } = useAppData();

  const handleViewChange = (view: 'store' | 'admin' | 'customer') => {
    if (view === 'admin' && (!user || user.role !== 'admin')) {
      setIsAuthModalOpen(true);
      alert('Akses Terbatas: Sila login dengan Akun Admin.');
      return;
    }
    setCurrentView(view);
  };

  const executeCheckout = () => {
    handleOnlineCheckout(
      () => { // Callback Sukses
        alert('Pembayaran Berhasil! Sistem pusat telah mencatat transaksi Anda.');
        setIsCartOpen(false);
        setCurrentView('customer');
      },
      (errorMsg) => { // Callback Error
        setIsCartOpen(false);
        if (errorMsg.includes('Autentikasi')) setIsAuthModalOpen(true);
        alert(errorMsg);
      }
    );
  };

  return (
    <div className="min-h-screen bg-white text-gray-900 relative">
      
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

      {currentView === 'admin' && (
        <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-gray-900 text-white flex items-center justify-between px-4 z-40 shadow-md">
          <button onClick={() => setIsAdminMobileOpen(true)} className="p-2">
            <Menu className="w-6 h-6" />
          </button>
          <span className="font-black tracking-tighter uppercase text-sm">Panel Kendali SIM</span>
          <div className="w-10"></div>
        </div>
      )}

      {currentView === 'store' && (
        <><main className="pt-16"><Hero /><FeaturedProducts /><Testimonials /></main><Footer /></>
      )}

      {currentView === 'customer' && (
        <CustomerDashboard orders={orders} userName={user?.name || ''} />
      )}

      {currentView === 'admin' && (
        <div className="flex bg-gray-50 min-h-screen">
          <AdminSidebar 
            activeMenu={activeAdminMenu} setActiveMenu={setActiveAdminMenu} userName={user?.name || 'Admin'}
            isOpen={isAdminMobileOpen} onClose={() => setIsAdminMobileOpen(false)}
            onLogout={() => { setUser(null); setCurrentView('store'); }} onBackToStore={() => setCurrentView('store')}
          />
          <main className="flex-1">
            <AdminDashboard 
              activeMenu={activeAdminMenu} products={products} orders={orders} 
              offlineSales={offlineSales} customers={customers} dailySales={dailySales}
              onUpdateProducts={setProducts} onUpdateOrders={setOrders} onUpdateOfflineSales={setOfflineSales} 
              onUpdateCustomers={setCustomers}
            />
          </main>
        </div>
      )}

      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} onCheckout={executeCheckout} />
      {isAuthModalOpen && <Auth onLoginSuccess={(u) => { setUser(u); setIsAuthModalOpen(false); if(u.role === 'admin') setCurrentView('admin'); else setCurrentView('customer'); }} onClose={() => setIsAuthModalOpen(false)} />}
    </div>
  );
}