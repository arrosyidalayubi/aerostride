interface HeroProps {
  onViewChange: (view: 'store' | 'catalog' | 'admin' | 'customer') => void;
}

export default function Hero({ onViewChange }: HeroProps) {
  return (
    // min-h-[calc(100vh-4rem)] memastikan hero section memenuhi layar dikurangi tinggi navbar (16 = 4rem)
    <section className="relative w-full min-h-[calc(100vh-4rem)] flex items-center bg-[#f8f9fa] overflow-hidden">
      
      {/* Decorative Background Element (Glass/Blur effect) */}
      <div className="absolute top-10 right-10 w-125 h-125 bg-gray-200 rounded-full mix-blend-multiply filter blur-[100px] opacity-60"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full py-12 lg:py-0">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          
          {/* Kolom Kiri: Copywriting & Call-to-Action */}
          <div className="flex flex-col justify-center space-y-8">
            <div className="space-y-5">
              <span className="inline-block py-1.5 px-4 rounded-full bg-white text-xs font-bold tracking-widest uppercase text-gray-900 border border-gray-200 shadow-sm">
                Rilis Terbaru 2026
              </span>
              
              {/* Tipografi Oversized ala Awwwards */}
              <h1 className="text-6xl sm:text-7xl lg:text-[7rem] font-black text-gray-900 tracking-tighter leading-[0.85]">
                KUASAI <br />
                <span className="text-transparent bg-clip-text bg-linear-to-r from-gray-900 to-gray-500">
                  JALANAN.
                </span>
              </h1>
              
              <p className="max-w-md text-lg text-gray-600 font-medium leading-relaxed">
                Sepatu commuter 100% waterproof dengan sirkulasi udara maksimal. Transisi mulus dari sadel motor ke meja kafe tanpa mengorbankan gaya.
              </p>
            </div>

            {/* Grup Tombol Hero */}
        <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
          
          {/* PRIMARY CTA: Beli Sekarang */}
          <a 
            href="#produk" 
            className="group relative inline-flex items-center justify-center px-8 py-4 text-sm font-black text-white uppercase tracking-widest bg-black rounded-xl overflow-hidden transition-all hover:scale-105 hover:shadow-[0_0_40px_-10px_rgba(0,0,0,0.5)] active:scale-95"
          >
            <span className="relative z-10 flex items-center gap-2">
              Beli Sekarang 
              {/* Ikon panah yang bergeser saat di-hover */}
              <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </span>
            {/* Efek kilap (shine) yang melintas saat di-hover */}
            <div className="absolute inset-0 h-full w-full bg-linear-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]"></div>
          </a>

          {/* SECONDARY CTA: Lihat Katalog */}
          {/* Opsional: Anda bisa membuat ID #kategori nanti di bawah FeaturedProducts */}
          <button onClick={() => onViewChange('catalog')} className="inline-flex items-center justify-center px-8 py-4 text-sm font-black text-gray-900 uppercase tracking-widest border-2 border-gray-200 rounded-xl hover:border-black hover:bg-gray-50 transition-all active:scale-95 cursor-pointer">
            Lihat Katalog
          </button>

        </div>
            
            {/* Social Proof / Metrik Bisnis */}
            <div className="pt-8 flex items-center gap-8 border-t border-gray-200/60 mt-4">
              <div>
                <p className="text-3xl font-black text-gray-900 tracking-tight">145K+</p>
                <p className="text-sm text-gray-500 font-semibold uppercase tracking-wider">Komunitas Aktif</p>
              </div>
              <div className="w-px h-10 bg-gray-300"></div>
              <div>
                <p className="text-3xl font-black text-gray-900 tracking-tight">100%</p>
                <p className="text-sm text-gray-500 font-semibold uppercase tracking-wider">Weatherproof</p>
              </div>
            </div>
          </div>

          {/* Kolom Kanan: Visual Produk Interaktif */}
          <div className="relative flex justify-center items-center h-100 sm:h-125 lg:h-150 mt-10 lg:mt-0">
            {/* Lingkaran aksen di belakang sepatu */}
            <div className="absolute w-75 h-75 sm:w-100 sm:h-100 bg-linear-to-tr from-gray-300 to-gray-100 rounded-full transform -rotate-12 opacity-50"></div>
            
            {/* Gambar Sepatu Placeholder. 
              Efek: Sepatu miring secara default, dan akan lurus serta membesar saat di-hover.
            */}
            <img 
              src="https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?q=80&w=1000&auto=format&fit=crop" 
              alt="AeroStride Commuter Sneaker" 
              className="relative z-10 w-full max-w-md lg:max-w-lg object-contain transform -rotate-12 hover:rotate-0 hover:scale-110 transition-transform duration-700 ease-out drop-shadow-2xl cursor-crosshair"
            />
          </div>

        </div>
      </div>
    </section>
  );
}