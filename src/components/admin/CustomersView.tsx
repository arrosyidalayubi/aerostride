import { useState } from 'react';
import { Plus, Trash2, Users, Mail, Phone, User, X } from 'lucide-react';
import type { CustomerData } from '../../types';
import toast from 'react-hot-toast';

interface CustomersViewProps {
  customers: CustomerData[];
  onUpdateCustomers: (customers: CustomerData[]) => void;
}

export default function CustomersView({ customers, onUpdateCustomers }: CustomersViewProps) {
  const [isCustModalOpen, setIsCustModalOpen] = useState(false);
  const [newCustName, setNewCustName] = useState('');
  const [newCustEmail, setNewCustEmail] = useState('');
  const [newCustPhone, setNewCustPhone] = useState('');

  // ==========================================
  // FUNGSI TAMBAH PELANGGAN
  // ==========================================
  const handleAddCustomer = async (e: React.FormEvent) => {
    e.preventDefault();
    const newId = `CUST-00${customers.length + 1}`;
    const formattedDate = new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });

    const newCustomer: CustomerData = { id: newId, name: newCustName, email: newCustEmail, phone: newCustPhone, joinDate: formattedDate };

    try {
      const response = await fetch('/api/customers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newCustomer)
      });
      if (!response.ok) throw new Error('Gagal menyimpan ke server D1');
      
      onUpdateCustomers([newCustomer, ...customers]);
      setNewCustName(''); setNewCustEmail(''); setNewCustPhone('');
      setIsCustModalOpen(false);
      toast.success('Berhasil! Data pelanggan disimpan permanen di Database D1.');
    } catch (error) {
      toast.error('Kesalahan koneksi database: ' + error);
    }
  };

  // ==========================================
  // FUNGSI HAPUS PELANGGAN PERMANEN (BARU)
  // ==========================================
  const handleDeleteCustomer = async (id: string) => {
    if (!window.confirm(`Yakin ingin menghapus pelanggan dengan ID ${id} secara permanen?`)) return;

    try {
      const res = await fetch(`/api/customers?id=${id}`, { 
        method: 'DELETE' 
      });
      
      if (!res.ok) throw new Error('Gagal menghapus data dari server');

      // Update UI dengan menghilangkan data yang dihapus
      onUpdateCustomers(customers.filter(cust => cust.id !== id));
      toast.success('Data pelanggan berhasil dihapus secara permanen dari Database D1!');
    } catch (error) {
      toast.error('Terjadi kesalahan saat menghapus data: ' + error);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tighter uppercase">Manajemen Pelanggan</h1>
          <p className="text-sm text-gray-500 font-medium">Modul CRM Terintegrasi Database Cloudflare D1</p>
        </div>
        <button 
          onClick={() => setIsCustModalOpen(true)}
          className="w-full sm:w-auto bg-black text-white px-5 py-3 rounded-xl font-bold text-sm hover:bg-gray-800 transition-colors cursor-pointer flex items-center justify-center gap-2 shadow-md"
        >
          <Plus className="w-4 h-4" /> Tambah Pelanggan Manual
        </button>
      </div>

      {/* TABEL DATA */}
      <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm overflow-x-auto">
        <table className="w-full text-left min-w-[800px]">
          <thead>
            <tr className="border-b border-gray-100 text-gray-400 text-xs font-bold uppercase">
              <th className="pb-3">ID Akun</th>
              <th className="pb-3">Nama Lengkap</th>
              <th className="pb-3">Kontak (Email / HP)</th>
              <th className="pb-3">Tanggal Bergabung</th>
              <th className="pb-3 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="text-sm divide-y divide-gray-50">
            {customers.map(c => (
              <tr key={c.id} className="hover:bg-gray-50/50 transition-colors">
                <td className="py-4 font-mono font-bold text-gray-400">{c.id}</td>
                <td className="py-4 font-bold text-gray-900">{c.name}</td>
                <td className="py-4">
                  <div className="text-gray-900 font-medium">{c.email}</div>
                  <div className="text-gray-500 text-xs">{c.phone || '-'}</div>
                </td>
                <td className="py-4 text-gray-600">{c.joinDate}</td>
                <td className="py-4 text-right">
                  {/* TOMBOL HAPUS YANG SUDAH DIPERBAIKI */}
                  <button 
                    onClick={() => handleDeleteCustomer(c.id)}
                    className="p-2 text-gray-400 hover:text-red-600 rounded-xl transition-colors cursor-pointer"
                    title="Hapus Pelanggan"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* POPUP MODAL TAMBAH PELANGGAN */}
      {isCustModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-110 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-md rounded-3xl p-8 shadow-2xl border border-gray-100 relative animate-in fade-in zoom-in-95 duration-200">
            
            <button 
              onClick={() => setIsCustModalOpen(false)} 
              className="absolute top-6 right-6 text-gray-400 hover:text-black font-bold cursor-pointer p-1.5 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="mb-6">
              <h2 className="text-2xl font-black tracking-tighter uppercase text-gray-900 flex items-center gap-2">
                <Users className="w-6 h-6 text-red-600" /> Registrasi CRM
              </h2>
              <p className="text-sm text-gray-500 mt-1">Suntik data keanggotaan pelanggan baru secara manual ke kluster data D1.</p>
            </div>

            <form onSubmit={handleAddCustomer} className="space-y-4">
              <div className="relative">
                <input type="text" placeholder="Nama Lengkap" value={newCustName} onChange={(e) => setNewCustName(e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3.5 pl-11 pr-4 text-sm outline-none focus:border-black focus:bg-white transition-all" required />
                <User className="w-4 h-4 text-gray-400 absolute left-4 top-4" />
              </div>
              <div className="relative">
                <input type="email" placeholder="Alamat Email" value={newCustEmail} onChange={(e) => setNewCustEmail(e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3.5 pl-11 pr-4 text-sm outline-none focus:border-black focus:bg-white transition-all" required />
                <Mail className="w-4 h-4 text-gray-400 absolute left-4 top-4" />
              </div>
              <div className="relative">
                <input type="tel" placeholder="No. Handphone" value={newCustPhone} onChange={(e) => setNewCustPhone(e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3.5 pl-11 pr-4 text-sm outline-none focus:border-black focus:bg-white transition-all" required />
                <Phone className="w-4 h-4 text-gray-400 absolute left-4 top-4" />
              </div>
              <button type="submit" className="w-full bg-black text-white py-4 rounded-xl font-bold text-sm hover:bg-gray-800 transition-colors flex items-center justify-center gap-2 mt-4 cursor-pointer shadow-md">
                <Plus className="w-4 h-4" /> Simpan Ke Database
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}