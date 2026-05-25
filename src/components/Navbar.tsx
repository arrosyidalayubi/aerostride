import { useState } from 'react';
import { Search, ShoppingBag, User, Menu, X, LayoutDashboard, LogOut } from 'lucide-react';


interface NavbarProps {
  onOpenCart: () => void;
  onOpenAuth: () => void;
  currentView: 'store' | 'admin' | 'customer';
  onViewChange: (view: 'store' | 'admin' | 'customer') => void;
  user: { name: string; role: 'admin' | 'customer' } | null;
  onLogout: () => void;
  cartItemCount: number;
}


export default function Navbar({ 
  onOpenAuth, 
  currentView, 
  onViewChange, 
  user, 
  onLogout ,
  cartItemCount, 
  onOpenCart
}: NavbarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  // State untuk mengontrol visibilitas dropdown profil internal
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  const toggleProfileDropdown = () => setIsProfileDropdownOpen(!isProfileDropdownOpen);

  const handleProfileClick = () => {
    if (!user) {
      onOpenAuth(); // Jika guest, langsung pemicu modal login
    } else {
      toggleProfileDropdown(); // Jika sudah masuk, buka menu dropdown pilihan
    }
  };

  return (
    <nav className="fixed top-0 w-full z-50 bg-white/90 backdrop-blur-md border-b border-gray-100 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* Bagian Kiri: Mobile Menu Button & Logo */}
          <div className="flex items-center gap-4">
            <button 
              onClick={toggleMobileMenu}
              className="md:hidden p-2 text-gray-900 hover:text-gray-500 cursor-pointer transition-colors"
              aria-expanded={isMobileMenuOpen}
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            
            <div 
              onClick={() => onViewChange('store')} 
              className="shrink-0 flex items-center cursor-pointer"
            >
              <a href="/" className="flex items-center gap-2">
                <img src="/logo-aerostride-hitam.png" alt="Logo AeroStride" className="h-8 object-contain" />
              </a>
            </div>
          </div>

          {/* Bagian Tengah: Kategori Utama (Hanya muncul jika di tampilan store) */}
          <div className="hidden md:flex space-x-8">
            <button 
              onClick={() => onViewChange('store')}
              className={`text-sm font-semibold tracking-wide uppercase cursor-pointer transition-colors ${currentView === 'store' ? 'text-black border-b-2 border-black pb-1' : 'text-gray-500 hover:text-black'}`}
            >
              Belanja
            </button>
            <a href="#produk" className="text-sm font-semibold text-gray-900 hover:text-gray-500 transition-colors uppercase tracking-wide pt-0.5">
              Produk
            </a>
            <a href="#ulasan" className="text-sm font-semibold text-gray-900 hover:text-gray-500 transition-colors uppercase tracking-wide pt-0.5">
              Ulasan
            </a>
            <a href="#promo" className="text-sm font-semibold text-red-600 hover:text-red-500 transition-colors uppercase tracking-wide pt-0.5">
              Promo
            </a>
          </div>

          {/* Bagian Kanan: Utilitas (Search, Profile, Cart) */}
          <div className="flex items-center space-x-5 md:space-x-6">
            <button className="text-gray-900 hover:text-gray-500 transition-colors hidden sm:block cursor-pointer">
              <Search className="w-5 h-5" />
            </button>
            
            {/* User Profile Container dengan Dropdown Relatif */}
            <div className="relative">
              <button 
                onClick={handleProfileClick}
                className={`text-gray-900 hover:text-gray-500 transition-colors cursor-pointer p-1 rounded-full ${user ? 'bg-gray-100 ring-2 ring-gray-200' : ''}`}
                title={user ? `Masuk sebagai ${user.name}` : 'Masuk Akun'}
              >
                <User className="w-5 h-5" />
              </button>

              {/* Dropdown Menu untuk User yang Sudah Login */}
              {user && isProfileDropdownOpen && (
                <div className="absolute right-0 mt-3 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-60 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="px-4 py-2.5 border-b border-gray-50">
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Akun Anda</p>
                    <p className="text-sm font-black text-gray-900 truncate mt-0.5">{user.name}</p>
                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-0.5 bg-gray-100 inline-block px-2 py-0.5 rounded-full">{user.role}</p>
                  </div>
                  
                  <div className="p-1">
                    {/* JIKA ADMIN: Munculkan menu Dashboard SIM */}
                    {user.role === 'admin' && (
                      <button
                        onClick={() => {
                          onViewChange('admin');
                          setIsProfileDropdownOpen(false);
                        }}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 text-sm font-bold rounded-xl transition-colors cursor-pointer ${currentView === 'admin' ? 'bg-red-50 text-red-600' : 'text-gray-700 hover:bg-gray-50'}`}
                      >
                        <LayoutDashboard className="w-4 h-4" /> Dashboard SIM
                      </button>
                    )}

                    {/* JIKA CUSTOMER: Munculkan menu Panel Pelanggan */}
                    {user.role === 'customer' && (
                      <button
                        onClick={() => {
                          onViewChange('customer');
                          setIsProfileDropdownOpen(false);
                        }}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 text-sm font-bold rounded-xl transition-colors cursor-pointer ${currentView === 'customer' ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-50'}`}
                      >
                        <User className="w-4 h-4" /> Pesanan Saya
                      </button>
                    )}
                    
                    <button
                      onClick={() => {
                        onLogout();
                        setIsProfileDropdownOpen(false);
                      }}
                      className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-bold text-red-600 hover:bg-red-50 rounded-xl transition-colors cursor-pointer"
                    >
                      <LogOut className="w-4 h-4" /> Keluar (Logout)
                    </button>
                  </div>
                </div>
              )}
            </div>
            
            {/* Shopping Cart Button */}
            <button onClick={onOpenCart} className="relative p-2 text-gray-600 hover:text-black transition-colors cursor-pointer">
          <ShoppingBag className="w-6 h-6" />
          {cartItemCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center animate-bounce shadow-md">
              {cartItemCount}
            </span>
          )}
        </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown Panel */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 shadow-xl absolute w-full left-0 top-16 z-50">
          <div className="px-4 pt-2 pb-6 space-y-1">
            <button 
              onClick={() => { onViewChange('store'); toggleMobileMenu(); }}
              className="w-full text-left block px-3 py-4 text-base font-bold text-gray-900 border-b border-gray-50 hover:bg-gray-50"
            >
              Belanja Utama
            </button>
            {user && user.role === 'admin' && (
              <button 
                onClick={() => { onViewChange('admin'); toggleMobileMenu(); }}
                className="w-full text-left block px-3 py-4 text-base font-bold text-red-600 border-b border-gray-50 hover:bg-gray-50"
              >
                Dashboard Admin SIM
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}