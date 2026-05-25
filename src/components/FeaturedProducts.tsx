import type { Product } from '../types';

interface FeaturedProductsProps {
  products: Product[];
  onAddToCart: (product: Product) => void;
}

export default function FeaturedProducts({ products, onAddToCart }: FeaturedProductsProps) {
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

        {/* Cek apakah data products belum siap atau kosong */}
        {!products || products.length === 0 ? (
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
        ) : (
          // Success UI: Product Grid
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {products.map((product) => (
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
                  {/* Quick Add Button */}
                  <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                    <button onClick={() => onAddToCart(product)} className="w-full bg-black text-white py-3 rounded-xl font-bold text-sm hover:bg-gray-800 transition-colors">
                      Tambah
                    </button>
                  </div>
                </div>

                {/* Product Info */}
                <div className="flex flex-col gap-1">
                  <p className="text-sm text-gray-500 font-medium">{product.category}</p>
                  <h3 className="text-lg font-bold text-gray-900 group-hover:text-gray-600 transition-colors">{product.name}</h3>
                  <p className="text-md font-bold text-gray-900 mt-1">
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