import { useQuery } from '@tanstack/react-query';
import { ShoppingBag } from 'lucide-react';

// 1. Simulasi Data API (Mock Data)
const MOCK_PRODUCTS = [
  {
    id: 1,
    name: "Aero X-1 Urban",
    price: 1250000,
    category: "Men's Commuter",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=800&auto=format&fit=crop",
    isNew: true,
  },
  {
    id: 2,
    name: "Aero Glide Pro",
    price: 1450000,
    category: "Unisex Weatherproof",
    image: "https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?q=80&w=800&auto=format&fit=crop",
    isNew: false,
  },
  {
    id: 3,
    name: "Aero Stealth Mid",
    price: 1650000,
    category: "Men's Boots",
    image: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?q=80&w=800&auto=format&fit=crop",
    isNew: true,
  },
  {
    id: 4,
    name: "Aero Lite Transit",
    price: 950000,
    category: "Women's Casual",
    image: "https://images.unsplash.com/photo-1608231387042-66d1773070a5?q=80&w=800&auto=format&fit=crop",
    isNew: false,
  }
];

// 2. Fungsi Simulasi Fetching Data (dengan delay 1.5 detik agar efek loading terlihat)
const fetchProducts = async () => {
  return new Promise<typeof MOCK_PRODUCTS>((resolve) => {
    setTimeout(() => {
      resolve(MOCK_PRODUCTS);
    }, 1500);
  });
};

// 3. Komponen Utama
export default function FeaturedProducts() {
  // Implementasi TanStack Query
  const { data: products, isLoading, isError } = useQuery({
    queryKey: ['featured-products'],
    queryFn: fetchProducts,
  });

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-4xl font-black text-gray-900 tracking-tighter uppercase">Gear Pilihan</h2>
            <p className="mt-2 text-gray-500 font-medium">Dirancang khusus untuk menaklukkan cuaca kota.</p>
          </div>
          <a href="#" className="hidden sm:block text-sm font-bold text-gray-900 border-b-2 border-black pb-1 hover:text-gray-500 hover:border-gray-500 transition-colors">
            Lihat Semua Produk
          </a>
        </div>

        {/* State Management Tampilan */}
        {isLoading ? (
          // Skeleton Loading UI
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="animate-pulse flex flex-col gap-4">
                <div className="bg-gray-200 h-80 w-full rounded-2xl"></div>
                <div className="bg-gray-200 h-6 w-3/4 rounded"></div>
                <div className="bg-gray-200 h-4 w-1/2 rounded"></div>
              </div>
            ))}
          </div>
        ) : isError ? (
          // Error UI
          <div className="text-center py-12 bg-red-50 rounded-2xl">
            <p className="text-red-600 font-bold">Gagal memuat produk. Silakan coba lagi.</p>
          </div>
        ) : (
          // Success UI: Product Grid
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {products?.map((product) => (
              <div key={product.id} className="group cursor-pointer">
                {/* Image Container */}
                <div className="relative bg-[#f8f9fa] rounded-2xl h-80 overflow-hidden mb-4 flex items-center justify-center p-6">
                  {product.isNew && (
                    <span className="absolute top-4 left-4 bg-white text-black text-[10px] font-black px-3 py-1 uppercase tracking-widest z-10">
                      Baru
                    </span>
                  )}
                  <img 
                    src={product.image} 
                    alt={product.name} 
                    className="w-full h-full object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-500"
                  />
                  {/* Quick Add Button (Muncul saat di-hover) */}
                  <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                    <button className="w-full bg-black text-white py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-gray-800">
                      <ShoppingBag className="w-4 h-4" /> Tambah
                    </button>
                  </div>
                </div>

                {/* Product Info */}
                <div className="flex flex-col gap-1">
                  <p className="text-sm text-gray-500 font-medium">{product.category}</p>
                  <h3 className="text-lg font-bold text-gray-900 group-hover:text-gray-600 transition-colors">{product.name}</h3>
                  <p className="text-md font-bold text-gray-900 mt-1">
                    {/* Format Rupiah Standard */}
                    {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(product.price)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
        
      </div>
    </section>
  );
}