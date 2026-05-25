import { useState } from 'react';
import { X, ShoppingBag, ArrowRight } from 'lucide-react';
import type { Product } from '../types';

interface FeaturedProductsProps {
  products: Product[];
  onAddToCart: (product: Product) => void;
  onViewAll: () => void;
}

export default function FeaturedProducts({ products, onAddToCart, onViewAll }: FeaturedProductsProps) {
  // State untuk menyimpan produk mana yang sedang diklik untuk dilihat detailnya
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const handleQuickAdd = (e: React.MouseEvent, product: Product) => {
    e.stopPropagation(); // Mencegah klik tombol "Tambah" memicu klik pada gambar (yang membuka modal)
    onAddToCart(product);
  };

  const handleModalAdd = (product: Product) => {
    onAddToCart(product);
    setSelectedProduct(null);
  };

  return (
    <>
      {/* JANGKAR NAVIGASI: id="produk" */}
      <section id="produk" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-4xl font-black text-gray-900 tracking-tighter uppercase">Gear Pilihan</h2>
              <p className="mt-2 text-gray-500 font-medium">Dirancang khusus untuk menaklukkan cuaca kota.</p>
            </div>
            <button 
              onClick={onViewAll} 
              className="hidden sm:block text-sm font-bold text-gray-900 border-b-2 border-black pb-1 hover:text-gray-500 hover:border-gray-500 transition-colors cursor-pointer"
            >
              Lihat Semua Produk
            </button>
          </div>

          {!products || products.length === 0 ? (
            <div className="text-center py-12 text-gray-400">Memuat katalog produk...</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {products.map((product) => (
                <div key={product.id} className="group cursor-pointer" onClick={() => setSelectedProduct(product)}>
                  
                  <div className="relative bg-[#f8f9fa] rounded-2xl h-80 overflow-hidden mb-4 flex items-center justify-center p-6">
                    {product.isNew && (
                      <span className="absolute top-4 left-4 bg-white text-black text-[10px] font-black px-3 py-1 uppercase tracking-widest z-10 shadow-sm">Baru</span>
                    )}
                    <img 
                      src={product.image} 
                      alt={product.name} 
                      className="w-full h-full object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-500"
                    />
                    
                    {/* Tombol Tambah Cepat di atas gambar */}
                    <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                      <button 
                        onClick={(e) => handleQuickAdd(e, product)} 
                        className="w-full bg-black/90 backdrop-blur-sm text-white py-3 rounded-xl font-bold text-sm hover:bg-black transition-colors shadow-xl"
                      >
                        Tambah Cepat
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1">
                    <p className="text-sm text-gray-500 font-medium">{product.category || "Footwear"}</p>
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

      {/* ========================================== */}
      {/* MODAL DETAIL PRODUK */}
      {/* ========================================== */}
      {selectedProduct && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={() => setSelectedProduct(null)} />
          
          <div className="relative bg-white w-full max-w-4xl max-h-[90vh] rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row animate-in zoom-in-95 duration-300">
            
            {/* Tombol Tutup Silang */}
            <button 
              onClick={() => setSelectedProduct(null)} 
              className="absolute top-4 right-4 z-10 bg-white/50 backdrop-blur-md p-2 rounded-full hover:bg-white text-gray-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Bagian Kiri: Gambar Produk Eksklusif */}
            <div className="w-full md:w-1/2 bg-[#f8f9fa] flex items-center justify-center p-8 lg:p-12 min-h-75 md:min-h-full">
              <img 
                src={selectedProduct.image} 
                alt={selectedProduct.name} 
                className="w-full h-full object-contain mix-blend-multiply drop-shadow-2xl hover:scale-105 transition-transform duration-500" 
              />
            </div>

            {/* Bagian Kanan: Detail Informasi */}
            <div className="w-full md:w-1/2 p-8 lg:p-12 overflow-y-auto flex flex-col justify-center bg-white">
              <div className="uppercase tracking-widest text-xs font-black text-gray-400 mb-2">
                {selectedProduct.category || "Urban Commuter"}
              </div>
              <h2 className="text-3xl md:text-4xl font-black tracking-tighter text-gray-900 mb-4">
                {selectedProduct.name}
              </h2>
              <p className="text-2xl font-bold text-gray-900 mb-6">
                {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(selectedProduct.price)}
              </p>
              
              <div className="w-10 h-1 bg-black mb-6"></div>
              
              <p className="text-gray-600 leading-relaxed text-sm mb-8">
                Dirancang secara spesifik menggunakan material tangguh yang tahan air dan memiliki sirkulasi udara optimal.
                Sepatu ini merupakan jawaban bagi para komuter urban yang membutuhkan ketangguhan tanpa mengorbankan estetika dan kenyamanan harian.
              </p>

              {/* Pilihan Ukuran (Dummy Visual) */}
              <div className="mb-8">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-sm font-bold text-gray-900">Pilih Ukuran</span>
                  <a href="#" className="text-xs text-gray-500 underline">Panduan Ukuran</a>
                </div>
                <div className="flex gap-2">
                  {['39', '40', '41', '42', '43'].map(size => (
                    <button key={size} className="w-12 h-12 border-2 border-gray-100 rounded-xl font-bold text-sm text-gray-600 hover:border-black hover:text-black transition-colors">
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tombol Eksekusi Aksi */}
              <button 
                onClick={() => handleModalAdd(selectedProduct)}
                className="w-full bg-black text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-gray-800 transition-colors shadow-lg shadow-black/10"
              >
                <ShoppingBag className="w-5 h-5" /> Masukkan ke Keranjang <ArrowRight className="w-4 h-4 ml-1" />
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  );
}