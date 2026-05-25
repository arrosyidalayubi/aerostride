import { useState, useMemo } from 'react';
import { ArrowLeft, Search, SlidersHorizontal, ShoppingBag } from 'lucide-react';
import type { Product } from '../types';

interface CatalogViewProps {
  products: Product[];
  onAddToCart: (product: Product) => void;
  onBackToStore: () => void;
}

export default function CatalogView({ products, onAddToCart, onBackToStore }: CatalogViewProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Semua');

  // 1. Ambil daftar kategori unik dari data produk secara otomatis
  const categories = useMemo(() => {
    const list = products.map(p => p.category || 'Footwear');
    return ['Semua', ...Array.from(new Set(list))];
  }, [products]);

  // 2. Filter produk berdasarkan pencarian kata kunci DAN kategori yang dipilih
  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            (product.category || '').toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'Semua' || (product.category || 'Footwear') === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [products, searchQuery, selectedCategory]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in duration-300">
      
      {/* Tombol Kembali ke Beranda */}
      <button 
        onClick={onBackToStore}
        className="inline-flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-black transition-colors mb-8 cursor-pointer group"
      >
        <ArrowLeft className="w-4 h-4 transform group-hover:-translate-x-1 transition-transform" /> Kembali ke Beranda
      </button>

      {/* Header Halaman */}
      <div className="mb-12">
        <h1 className="text-4xl font-black text-gray-900 tracking-tighter uppercase">Katalog Lengkap</h1>
        <p className="text-sm text-gray-500 mt-1 font-medium">Jelajahi seluruh koleksi perlengkapan urban komuter kami.</p>
      </div>

      {/* Bar Filter & Pencarian */}
      <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between mb-10 pb-6 border-b border-gray-100">
        
        {/* Navigasi Tab Kategori Dinamis */}
        <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-none snap-x">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap snap-share ${
                selectedCategory === category 
                  ? 'bg-black text-white shadow-md' 
                  : 'bg-white text-gray-400 border border-gray-100 hover:border-gray-300 hover:text-gray-700'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Kotak Pencarian */}
        <div className="relative min-w-70">
          <input 
            type="text" 
            placeholder="Cari produk..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white border border-gray-200 rounded-xl py-3 pl-11 pr-4 text-sm outline-none focus:border-black transition-all shadow-sm"
          />
          <Search className="w-4 h-4 text-gray-400 absolute left-4 top-4" />
        </div>
      </div>

      {/* Tampilan Grid Produk */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 p-8">
          <SlidersHorizontal className="w-8 h-8 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 font-bold">Produk tidak ditemukan</p>
          <p className="text-gray-400 text-sm mt-1">Coba gunakan kata kunci pencarian atau kategori lain.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {filteredProducts.map((product) => (
            <div key={product.id} className="bg-white rounded-3xl border border-gray-100 p-4 shadow-sm hover:shadow-md transition-all group flex flex-col justify-between">
              <div>
                {/* Kontainer Foto */}
                <div className="relative bg-[#f8f9fa] rounded-2xl h-64 overflow-hidden mb-4 flex items-center justify-center p-6">
                  {product.isNew && (
                    <span className="absolute top-4 left-4 bg-white text-black text-[9px] font-black px-2.5 py-0.5 uppercase tracking-widest z-10 shadow-sm rounded">Baru</span>
                  )}
                  <img 
                    src={product.image} 
                    alt={product.name} 
                    className="w-full h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-500"
                  />
                </div>

                {/* Deskripsi Teks */}
                <div className="px-1 mb-4">
                  <span className="text-[11px] font-black tracking-widest text-gray-400 uppercase">{product.category || 'Footwear'}</span>
                  <h3 className="text-md font-bold text-gray-900 mt-0.5 group-hover:text-gray-600 transition-colors line-clamp-1">{product.name}</h3>
                  <p className="text-sm font-black text-gray-900 mt-1">
                    {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(product.price)}
                  </p>
                </div>
              </div>

              {/* Tombol Pembelian */}
              <button 
                onClick={() => onAddToCart(product)} 
                className="w-full bg-gray-50 text-gray-900 group-hover:bg-black group-hover:text-white py-3 rounded-xl font-bold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <ShoppingBag className="w-3.5 h-3.5" /> Masukkan Keranjang
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}