// Tambahkan useState dari react
import { useState } from 'react';
// Tambahkan ikon X untuk tombol close
import { Search, ShoppingBag, User, Menu, X } from 'lucide-react';

export default function Navbar() {
  // State untuk melacak apakah mobile menu sedang terbuka atau tertutup
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Fungsi untuk toggle state
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className="fixed top-0 w-full z-50 bg-white/90 backdrop-blur-md border-b border-gray-100 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* Bagian Kiri: Mobile Menu Button & Logo */}
          <div className="flex items-center gap-4">
            {/* Event onClick dipasang di sini */}
            <button 
              onClick={toggleMobileMenu}
              className="md:hidden p-2 text-gray-900 hover:text-gray-500 cursor-pointer transition-colors"
              aria-expanded={isMobileMenuOpen}
            >
              {/* Rendering kondisional: Jika terbuka tampilkan X, jika tertutup tampilkan Hamburger */}
              {isMobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
            
            <div className="shrink-0 flex items-center cursor-pointer">
              <span className="font-black text-2xl tracking-tighter text-black uppercase">
                AeroStride
              </span>
            </div>
          </div>

          {/* Bagian Tengah: Kategori Utama (Tersembunyi di Mobile) */}
          <div className="hidden md:flex space-x-8">
            <a href="#" className="text-sm font-semibold text-gray-900 hover:text-gray-500 transition-colors">
              Pria
            </a>
            <a href="#" className="text-sm font-semibold text-gray-900 hover:text-gray-500 transition-colors">
              Wanita
            </a>
            <a href="#" className="text-sm font-semibold text-gray-900 hover:text-gray-500 transition-colors">
              Commuter Gear
            </a>
            <a href="#" className="text-sm font-semibold text-red-600 hover:text-red-500 transition-colors">
              Sale
            </a>
          </div>

          {/* Bagian Kanan: Utilitas (Search, Profile, Cart) */}
          <div className="flex items-center space-x-5 md:space-x-6">
            <button className="text-gray-900 hover:text-gray-500 transition-colors hidden sm:block cursor-pointer">
              <Search className="w-5 h-5" />
            </button>
            <button className="text-gray-900 hover:text-gray-500 transition-colors cursor-pointer">
              <User className="w-5 h-5" />
            </button>
            <button className="text-gray-900 hover:text-gray-500 transition-colors relative group cursor-pointer">
              <ShoppingBag className="w-5 h-5" />
              <span className="absolute -top-1.5 -right-1.5 bg-brand-accent text-white text-[9px] font-bold h-4 w-4 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                2
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown Panel */}
      {/* Jika isMobileMenuOpen bernilai true, div ini akan di-render */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 shadow-xl absolute w-full left-0 top-16 origin-top animate-in slide-in-from-top-2 fade-in duration-200">
          <div className="px-4 pt-2 pb-6 space-y-1">
            <a 
              href="#" 
              className="block px-3 py-4 text-base font-bold text-gray-900 border-b border-gray-50 hover:bg-gray-50 transition-colors"
            >
              Pria
            </a>
            <a 
              href="#" 
              className="block px-3 py-4 text-base font-bold text-gray-900 border-b border-gray-50 hover:bg-gray-50 transition-colors"
            >
              Wanita
            </a>
            <a 
              href="#" 
              className="block px-3 py-4 text-base font-bold text-gray-900 border-b border-gray-50 hover:bg-gray-50 transition-colors"
            >
              Commuter Gear
            </a>
            <a 
              href="#" 
              className="block px-3 py-4 text-base font-bold text-red-600 hover:bg-gray-50 transition-colors"
            >
              Sale
            </a>
            
            {/* Search Box Tambahan untuk Mobile (karena ikon search utama disembunyikan di layar kecil) */}
            <div className="mt-6 pt-4 border-t border-gray-100">
              <div className="relative">
                <input 
                  type="text" 
                  placeholder="Cari produk..." 
                  className="w-full bg-gray-100 border-transparent rounded-lg py-3 px-4 text-sm focus:border-gray-500 focus:bg-white focus:ring-0 outline-none transition-all"
                />
                <Search className="absolute right-3 top-3 w-5 h-5 text-gray-400" />
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}