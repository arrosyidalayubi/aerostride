import { useState } from 'react';
import { Mail, Lock, User, ArrowRight, Phone } from 'lucide-react';
import toast from 'react-hot-toast';

interface AuthProps {
  onLoginSuccess: (user: { name: string; role: 'admin' | 'customer' }) => void;
  onClose: () => void;
}

export default function Auth({ onLoginSuccess, onClose }: AuthProps) {
  const [isLoginTab, setIsLoginTab] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Tembak data form ke Satpam API kita
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email, password: password }) // Pastikan state email & password Anda benar
      });

      const data = await res.json();

      if (res.ok && data.success) {
        // SUKSES! Masukkan data user asli ke sistem
        onLoginSuccess(data.user);
      } else {
        // GAGAL LOGIN
        toast.error(data.error || 'Login gagal');
      }
    } catch {
      toast.error('Gagal terhubung ke server autentikasi.');
    }
  };

  // Fungsi khusus untuk tab DAFTAR
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Buat ID Customer acak (contoh: CUST-4829)
    const newId = `CUST-${Math.floor(1000 + Math.random() * 9000)}`;

    try {
      // Tembak ke API Customers untuk menambah data
      const res = await fetch('/api/customers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: newId,
          name: name,       // Sesuaikan dengan nama state form nama Anda
          email: email,     // Sesuaikan dengan nama state form email Anda
          password: password, // Sesuaikan dengan nama state form password Anda
          phone: phone                // Kosongkan atau isi default karena di form tidak ada no HP
        })
      });

      const data = await res.json();

      if (res.ok && data.success) {
        toast.success('Registrasi berhasil! Silakan masuk menggunakan akun baru Anda.');
        // (Opsional) Ubah state tab aktif kembali ke 'login' agar user bisa langsung masuk
        setIsLoginTab(true);
      } else {
        toast.error(data.error || 'Gagal melakukan pendaftaran.');
      }
    } catch {
      toast.error('Gagal terhubung ke server pendaftaran.');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-100 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-3xl p-8 shadow-2xl border border-gray-100 relative animate-in fade-in zoom-in-95 duration-200">
        
        {/* Tombol Close */}
        <button onClick={onClose} className="absolute top-6 right-6 text-gray-400 hover:text-black font-bold">✕</button>

        {/* Tab Switcher */}
        <div className="flex border-b border-gray-100 mb-8">
          <button 
            onClick={() => setIsLoginTab(true)}
            className={`flex-1 pb-4 text-sm font-black uppercase tracking-wider border-b-2 transition-all ${isLoginTab ? 'border-black text-black' : 'border-transparent text-gray-400'}`}
          >
            Masuk
          </button>
          <button 
            onClick={() => setIsLoginTab(false)}
            className={`flex-1 pb-4 text-sm font-black uppercase tracking-wider border-b-2 transition-all ${!isLoginTab ? 'border-black text-black' : 'border-transparent text-gray-400'}`}
          >
            Daftar
          </button>
        </div>

        {/* Form Judul */}
        <div className="mb-6">
          <h2 className="text-2xl font-black tracking-tighter uppercase text-gray-900">
            {isLoginTab ? 'Selamat Datang Kembali' : 'Buat Akun AeroStride'}
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            {isLoginTab ? 'Masukkan kredensial Anda untuk mengakses sistem.' : 'Bergabunglah dengan 145K+ komunitas komuter urban.'}
          </p>
        </div>

        {/* Form Inputs */}
        <form onSubmit={isLoginTab ? handleSubmit : handleRegister} className="space-y-4">
          
          {/* HANYA MUNCUL SAAT TAB DAFTAR AKTIF */}
          {!isLoginTab && (
            <>
              {/* Input Nama Lengkap */}
              <div className="relative">
                <input 
                  type="text" 
                  placeholder="Nama Lengkap" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3.5 pl-11 pr-4 text-sm outline-none focus:border-black focus:bg-white transition-all"
                  required
                />
                <User className="w-4 h-4 text-gray-400 absolute left-4 top-4" />
              </div>

              {/* Input Nomor HP */}
              <div className="relative">
                <input 
                  type="tel" 
                  placeholder="Nomor HP (WhatsApp)" 
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3.5 pl-11 pr-4 text-sm outline-none focus:border-black focus:bg-white transition-all"
                  required
                />
                <Phone className="w-4 h-4 text-gray-400 absolute left-4 top-4" />
              </div>
            </>
          )}

          {/* MUNCUL DI KEDUA TAB (MASUK & DAFTAR) */}
          <div className="relative">
            <input 
              type="email" 
              placeholder="Alamat Email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3.5 pl-11 pr-4 text-sm outline-none focus:border-black focus:bg-white transition-all"
              required
            />
            <Mail className="w-4 h-4 text-gray-400 absolute left-4 top-4" />
          </div>

          <div className="relative">
            <input 
              type="password" 
              placeholder="Kata Sandi" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3.5 pl-11 pr-4 text-sm outline-none focus:border-black focus:bg-white transition-all"
              required
            />
            <Lock className="w-4 h-4 text-gray-400 absolute left-4 top-4" />
          </div>

          {/* HANYA MUNCUL SAAT TAB MASUK AKTIF */}
          {isLoginTab && (
            <div className="p-3 bg-gray-50 rounded-xl border border-gray-100 text-[11px] text-gray-500 leading-relaxed">
              💡 <strong>Demo Kredensial Admin:</strong><br />
              Email: <code className="bg-gray-200 px-1 rounded">admin@aerostride.id</code> | Pas: <code className="bg-gray-200 px-1 rounded">admin123</code>
            </div>
          )}

          <button 
            type="submit"
            className="w-full bg-black text-white py-4 rounded-xl font-bold text-sm hover:bg-gray-800 transition-colors flex items-center justify-center gap-2 mt-2 cursor-pointer shadow-lg shadow-black/5"
          >
            {isLoginTab ? 'Masuk ke Sistem' : 'Daftar Sekarang'} <ArrowRight className="w-4 h-4" />
          </button>
        </form>

      </div>
    </div>
  );
}