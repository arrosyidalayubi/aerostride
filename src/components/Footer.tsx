import { ArrowRight } from 'lucide-react';
// Import logo sosial media dari React Icons (FontAwesome 6)
import { FaInstagram, FaXTwitter, FaFacebookF } from 'react-icons/fa6';

export default function Footer() {
  return (
    <footer className="bg-black text-white pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Section: Grid 4 Kolom */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          
          {/* Kolom 1: Brand Info & Newsletter */}
          <div className="lg:col-span-1">
            <span className="font-black text-2xl tracking-tighter uppercase mb-6 block">
              AeroStride
            </span>
            <p className="text-gray-400 text-sm mb-6 leading-relaxed">
              Inovasi alas kaki untuk mobilitas tanpa batas. Menembus cuaca, menguasai jalanan perkotaan.
            </p>
            {/* Form Newsletter Sederhana */}
            <form className="flex group">
              <input 
                type="email" 
                placeholder="Email Anda" 
                className="bg-gray-900 text-white px-4 py-3 text-sm w-full outline-none focus:ring-1 focus:ring-gray-500 transition-all"
              />
              <button 
                type="button"
                className="bg-white text-black px-4 py-3 hover:bg-gray-200 transition-colors cursor-pointer"
              >
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>

          {/* Kolom 2: Produk */}
          <div>
            <h4 className="font-bold text-lg mb-6 uppercase tracking-wider">Produk</h4>
            <ul className="space-y-4 text-sm text-gray-400">
              <li><a href="#" className="hover:text-white transition-colors">Commuter Series</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Waterproof Boots</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Apparel</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Aksesoris</a></li>
            </ul>
          </div>

          {/* Kolom 3: Dukungan */}
          <div>
            <h4 className="font-bold text-lg mb-6 uppercase tracking-wider">Dukungan</h4>
            <ul className="space-y-4 text-sm text-gray-400">
              <li><a href="#" className="hover:text-white transition-colors">FAQ</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Lacak Pesanan</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Pengembalian Barang</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Panduan Ukuran</a></li>
            </ul>
          </div>

          {/* Kolom 4: Kontak & Socials */}
          <div>
            <h4 className="font-bold text-lg mb-6 uppercase tracking-wider">Hubungi Kami</h4>
            <ul className="space-y-4 text-sm text-gray-400 mb-6">
              <li>cs@aerostride.id</li>
              <li>+62 811 2233 4455</li>
            </ul>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 bg-gray-900 flex items-center justify-center rounded-full hover:bg-white hover:text-black transition-all">
                <FaInstagram className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-gray-900 flex items-center justify-center rounded-full hover:bg-white hover:text-black transition-all">
                <FaXTwitter className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-gray-900 flex items-center justify-center rounded-full hover:bg-white hover:text-black transition-all">
                <FaFacebookF className="w-4 h-4" /> {/* FacebookF sedikit lebih kecil agar proporsional */}
              </a>
            </div>
          </div>

        </div>

        {/* Bottom Section: Legal */}
        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-500">
          <p>&copy; {new Date().getFullYear()} AeroStride. Hak Cipta Dilindungi.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-white transition-colors">Kebijakan Privasi</a>
            <a href="#" className="hover:text-white transition-colors">Syarat & Ketentuan</a>
          </div>
        </div>

      </div>
    </footer>
  );
}