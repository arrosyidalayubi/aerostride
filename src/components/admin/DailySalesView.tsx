import { useState, useMemo } from 'react';
import { Filter } from 'lucide-react';
import type { DailySale } from '../../types';

interface DailySalesViewProps {
  dailySales: DailySale[];
}

export default function DailySalesView({ dailySales }: DailySalesViewProps) {
  // Tambahkan log untuk debug (bisa dilihat di Console Browser F12)
  console.log("Total data harian yang diterima:", dailySales.length);

  const [selectedMonth, setSelectedMonth] = useState('Januari');
  const [selectedYear, setSelectedYear] = useState('2026');

  const filteredSales = useMemo(() => {
    return dailySales.filter(d => {
      // Kita bersihkan spasi dan samakan format agar filter lebih akurat
      const matchMonth = d.month.trim() === selectedMonth.trim();
      const matchYear = d.date.endsWith(selectedYear); // Mencocokkan 4 digit tahun di akhir date
      return matchMonth && matchYear;
    });
  }, [dailySales, selectedMonth, selectedYear]);

  const totalBulanIni = useMemo(() => {
    return filteredSales.reduce((acc, curr) => ({
      trx: acc.trx + curr.totalTrx,
      omzet: acc.omzet + curr.totalOmzet
    }), { trx: 0, omzet: 0 });
  }, [filteredSales]);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tighter uppercase">Laporan Harian Toko</h1>
        </div>
        
        <div className="flex items-center gap-3 bg-white p-2 rounded-2xl border border-gray-200 shadow-sm">
          <Filter className="w-5 h-5 ml-2 text-gray-400" />
          <select value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)} className="bg-transparent text-sm font-bold outline-none cursor-pointer">
            <option value="Januari">Januari</option>
            <option value="Februari">Februari</option>
            <option value="Maret">Maret</option>
            <option value="Mei">Mei</option>
          </select>
          <select value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)} className="bg-transparent text-sm font-bold outline-none cursor-pointer">
            <option value="2026">2026</option>
          </select>
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
          <table className="w-full text-left min-w-225">
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
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-gray-50">
              {filteredSales.length > 0 ? (
                filteredSales.map(d => (
                  <tr key={d.id} className="hover:bg-gray-50/50">
                    <td className="py-3 font-bold">{d.date}</td>
                    <td className="py-3 font-bold text-blue-600">{d.trxOnline}</td>
                    <td className="py-3 font-bold text-blue-600">Rp {d.omzetOnline.toLocaleString('id-ID')}</td>
                    <td className="py-3 text-gray-600">{d.trxJakarta}</td>
                    <td className="py-3 text-gray-600">Rp {d.omzetJakarta.toLocaleString('id-ID')}</td>
                    <td className="py-3 text-gray-600">{d.trxBandung}</td>
                    <td className="py-3 text-gray-600">Rp {d.omzetBandung.toLocaleString('id-ID')}</td>
                    <td className="py-3 font-black text-green-600">Rp {d.totalOmzet.toLocaleString('id-ID')}</td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan={8} className="py-10 text-center text-gray-400">Data tidak ditemukan untuk filter ini.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}