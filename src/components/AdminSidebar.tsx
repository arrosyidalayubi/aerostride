import { LayoutDashboard, Store, Package, RefreshCw, ArrowLeft, LogOut, Users, X } from 'lucide-react';

interface AdminSidebarProps {
  activeMenu: string;
  setActiveMenu: (menu: string) => void;
  onLogout: () => void;
  onBackToStore: () => void;
  userName: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function AdminSidebar({ 
  activeMenu, setActiveMenu, onLogout, onBackToStore, userName, isOpen, onClose 
}: AdminSidebarProps) {
  const menuItems = [
    { id: 'ringkasan', name: 'Ringkasan Omnichannel', icon: LayoutDashboard },
    { id: 'offline', name: 'Penjualan Offline', icon: Store },
    { id: 'inventaris', name: 'Manajemen Inventaris', icon: Package },
    { id: 'orders', name: 'Pesanan & Pengiriman', icon: RefreshCw },
    { id: 'customers', name: 'Data Pelanggan', icon: Users },
  ];

  return (
    <>
      {/* Overlay Backdrop khusus untuk tampilan Mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm animate-in fade-in duration-200"
          onClick={onClose}
        />
      )}

      {/* Sidebar Panel dengan Breakpoint Responsive */}
      <aside className={`w-64 h-screen bg-gray-900 text-white flex flex-col fixed left-0 top-0 z-50 transition-transform duration-300 lg:translate-x-0 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        
        {/* Header Sidebar */}
        <div className="p-6 border-b border-gray-800 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-black tracking-tighter uppercase text-white">SIM Admin</h2>
            <p className="text-xs text-gray-400 font-bold mt-1 bg-gray-800 inline-block px-2 py-1 rounded-md">{userName}</p>
          </div>
          {/* Tombol Close Hanya Muncul di Mobile */}
          <button onClick={onClose} className="lg:hidden p-2 text-gray-400 hover:text-white transition-colors cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Menu Navigasi Utama */}
        <nav className="flex-1 py-6 px-4 space-y-1 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeMenu === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveMenu(item.id);
                  onClose(); // Otomatis menutup laci menu setelah dipilih di mobile
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all cursor-pointer ${
                  isActive ? 'bg-red-600 text-white shadow-lg shadow-red-900/20' : 'text-gray-400 hover:text-white hover:bg-gray-800'
                }`}
              >
                <Icon className="w-5 h-5" /> {item.name}
              </button>
            );
          })}
        </nav>

        {/* Bagian Bawah: Utilitas */}
        <div className="p-4 border-t border-gray-800 space-y-2">
          <button onClick={() => { onBackToStore(); onClose(); }} className="w-full flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-white hover:bg-gray-800 rounded-xl font-bold text-sm cursor-pointer transition-colors">
            <ArrowLeft className="w-5 h-5" /> Kembali ke Toko
          </button>
          <button onClick={onLogout} className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:text-red-300 hover:bg-gray-800 rounded-xl font-bold text-sm cursor-pointer transition-colors">
            <LogOut className="w-5 h-5" /> Logout
          </button>
        </div>
      </aside>
    </>
  );
}