import { useState, useMemo } from 'react';
import { Filter, Edit2, Trash2, Plus, X } from 'lucide-react';
import type { DailySale } from '../../types';

interface DailySalesViewProps {
  dailySales: DailySale[];
  onUpdateDailySales: (sales: DailySale[]) => void;
}

export default function DailySalesView({ dailySales, onUpdateDailySales }: DailySalesViewProps) {
  const [selectedMonth, setSelectedMonth] = useState('Mei');
  const [selectedYear, setSelectedYear] = useState('2026');
  
  // State Modal CRUD
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editId, setEditId] = useState('');
  const [formData, setFormData] = useState({
    date: '', trxOnline: 0, omzetOnline: 0, trxJakarta: 0, omzetJakarta: 0, trxBandung: 0, omzetBandung: 0
  });

  const filteredSales = useMemo(() => {
    return dailySales.filter(d => d.month.trim() === selectedMonth.trim() && d.date.endsWith(selectedYear));
  }, [dailySales, selectedMonth, selectedYear]);

  const totalBulanIni = useMemo(() => {
    return filteredSales.reduce((acc, curr) => ({ trx: acc.trx + curr.totalTrx, omzet: acc.omzet + curr.totalOmzet }), { trx: 0, omzet: 0 });
  }, [filteredSales]);

  // Handler Hapus (Delete)
  const handleDelete = async (id: string) => {
    if(!window.confirm('Yakin ingin menghapus laporan hari ini? Semua rekap akan berkurang.')) return;
    try {
      await fetch(`/api/daily-sales?id=${id}`, { method: 'DELETE' });
      onUpdateDailySales(dailySales.filter(d => d.id !== id));
    } catch { alert('Gagal menghapus data.'); }
  };

  // Handler Simpan (Create / Update)
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const isNew = !editId;
    const newId = isNew ? `DAY-${formData.date}` : editId;
    const totalTrx = formData.trxOnline + formData.trxJakarta + formData.trxBandung;
    const totalOmzet = formData.omzetOnline + formData.omzetJakarta + formData.omzetBandung;

    const payload: DailySale = {
      id: newId, month: selectedMonth, ...formData, totalTrx, totalOmzet
    };

    try {
      const res = await fetch('/api/daily-sales', {
        method: isNew ? 'POST' : 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if(res.ok) {
        if(isNew) onUpdateDailySales([payload, ...dailySales]);
        else onUpdateDailySales(dailySales.map(d => d.id === newId ? payload : d));
        setIsModalOpen(false);
      }
    } catch { alert('Gagal menyimpan data.'); }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tighter uppercase">Laporan Harian</h1>
        </div>
        <div className="flex gap-4">
          <button onClick={() => { setEditId(''); setFormData({ date: '', trxOnline: 0, omzetOnline: 0, trxJakarta: 0, omzetJakarta: 0, trxBandung: 0, omzetBandung: 0 }); setIsModalOpen(true); }} className="bg-black text-white px-4 py-2 rounded-xl font-bold text-sm flex items-center gap-2">
            <Plus className="w-4 h-4"/> Koreksi / Tambah
          </button>
          <div className="flex items-center gap-3 bg-white p-2 rounded-2xl border border-gray-200">
            <Filter className="w-5 h-5 ml-2 text-gray-400" />
            <select value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)} className="bg-transparent text-sm font-bold outline-none cursor-pointer"><option value="Januari">Januari</option><option value="Februari">Februari</option><option value="Maret">Maret</option><option value="April">April</option><option value="Mei">Mei</option></select>
            <select value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)} className="bg-transparent text-sm font-bold outline-none cursor-pointer"><option value="2026">2026</option></select>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="bg-gray-900 text-white p-6 flex justify-between items-center">
          <span className="font-bold text-sm text-gray-400 uppercase">Performa {selectedMonth}</span>
          <div className="text-right">
            <div className="text-2xl font-black text-green-400">Rp {totalBulanIni.omzet.toLocaleString('id-ID')}</div>
            <div className="text-sm text-gray-400">{totalBulanIni.trx} Total Transaksi</div>
          </div>
        </div>

        <div className="p-6 overflow-x-auto">
          <table className="w-full text-left min-w-275">
            <thead>
              <tr className="border-b border-gray-100 text-gray-400 text-xs font-bold uppercase">
                <th className="pb-3">Tanggal</th>
                <th className="pb-3 text-blue-500">Trx Online</th>
                <th className="pb-3 text-blue-500">Omzet Online</th>
                <th className="pb-3">Trx Jkt</th>
                <th className="pb-3">Omzet Jkt</th>
                <th className="pb-3">Trx Bdg</th>
                <th className="pb-3">Omzet Bdg</th>
                <th className="pb-3 bg-gray-50 px-2">Total Omzet</th>
                <th className="pb-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-gray-50">
              {filteredSales.map(d => (
                <tr key={d.id} className="hover:bg-gray-50/50">
                  <td className="py-4 font-bold">{d.date}</td>
                  <td className="py-4 text-blue-600 font-bold">{d.trxOnline}</td>
                  <td className="py-4 text-blue-600 font-medium">Rp {d.omzetOnline.toLocaleString('id-ID')}</td>
                  <td className="py-4 text-gray-600 font-bold">{d.trxJakarta}</td>
                  <td className="py-4 text-gray-600">Rp {d.omzetJakarta.toLocaleString('id-ID')}</td>
                  <td className="py-4 text-gray-600 font-bold">{d.trxBandung}</td>
                  <td className="py-4 text-gray-600">Rp {d.omzetBandung.toLocaleString('id-ID')}</td>
                  <td className="py-4 font-black text-green-600 bg-gray-50 px-2">Rp {d.totalOmzet.toLocaleString('id-ID')}</td>
                  <td className="py-4 text-right flex justify-end gap-2">
                    <button onClick={() => { setEditId(d.id); setFormData(d); setIsModalOpen(true); }} className="p-1.5 bg-gray-100 text-gray-600 rounded hover:bg-gray-200"><Edit2 className="w-4 h-4"/></button>
                    <button onClick={() => handleDelete(d.id)} className="p-1.5 bg-red-50 text-red-600 rounded hover:bg-red-100"><Trash2 className="w-4 h-4"/></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL CRUD HARIAN */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 z-110 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-2xl relative">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-4 right-4 text-gray-400"><X /></button>
            <h2 className="text-xl font-black mb-6 uppercase">{editId ? 'Koreksi Data Harian' : 'Tambah Rekap Manual'}</h2>
            <form onSubmit={handleSave} className="grid grid-cols-2 gap-4">
              <div className="col-span-2"><label className="block text-xs font-bold mb-1">Tanggal (DD-MM-YYYY)</label><input type="text" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded p-2" required /></div>
              <div><label className="block text-xs font-bold mb-1">Trx Online</label><input type="number" value={formData.trxOnline} onChange={e => setFormData({...formData, trxOnline: Number(e.target.value)})} className="w-full bg-gray-50 border p-2 rounded"/></div>
              <div><label className="block text-xs font-bold mb-1">Omzet Online</label><input type="number" value={formData.omzetOnline} onChange={e => setFormData({...formData, omzetOnline: Number(e.target.value)})} className="w-full bg-gray-50 border p-2 rounded"/></div>
              <div><label className="block text-xs font-bold mb-1">Trx Jakarta</label><input type="number" value={formData.trxJakarta} onChange={e => setFormData({...formData, trxJakarta: Number(e.target.value)})} className="w-full bg-gray-50 border p-2 rounded"/></div>
              <div><label className="block text-xs font-bold mb-1">Omzet Jakarta</label><input type="number" value={formData.omzetJakarta} onChange={e => setFormData({...formData, omzetJakarta: Number(e.target.value)})} className="w-full bg-gray-50 border p-2 rounded"/></div>
              <div><label className="block text-xs font-bold mb-1">Trx Bandung</label><input type="number" value={formData.trxBandung} onChange={e => setFormData({...formData, trxBandung: Number(e.target.value)})} className="w-full bg-gray-50 border p-2 rounded"/></div>
              <div><label className="block text-xs font-bold mb-1">Omzet Bandung</label><input type="number" value={formData.omzetBandung} onChange={e => setFormData({...formData, omzetBandung: Number(e.target.value)})} className="w-full bg-gray-50 border p-2 rounded"/></div>
              <button type="submit" className="col-span-2 bg-black text-white py-3 rounded-xl font-bold mt-2 hover:bg-gray-800">Simpan Ke Database</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}