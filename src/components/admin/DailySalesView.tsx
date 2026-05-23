import { useState, useMemo } from 'react';
import { Filter } from 'lucide-react';
import type { DailySale } from '../../types';

interface DailySalesViewProps {
  dailySales: DailySale[];
}

export default function DailySalesView({ dailySales }: DailySalesViewProps) {
  // State untuk Dropdown Filter
  const [selectedMonth, setSelectedMonth] = useState('Februari');
  const [selectedYear, setSelectedYear] = useState('2026');

  // Mesin Filter Otomatis (Real-time berbasis memori)
  const filteredSales = useMemo(() => {
    return dailySales.filter(d => 
      d.month === selectedMonth && d.date.endsWith(selectedYear)
    );
  }, [dailySales, selectedMonth, selectedYear]);

  // Kalkulasi Total Khusus untuk Bulan yang Difilter
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
          <p className="text-sm text-gray-500 font-medium mt-1">Rekapitulasi transaksi omni-channel per periode.</p>
        </div>
        
        {/* PANEL FILTER DROPDOWN */}
        <div className="flex items-center gap-3 bg-white p-2 rounded-2xl border border-gray-200 shadow-sm">
          <div className="pl-3 text-gray-400">
            <Filter className="w-5 h-5" />
          </div>
          <select 
            value={selectedMonth} 
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="bg-transparent border-none text-sm font-bold text-gray-900 outline-none cursor-pointer pr-2"
          >
            <option value="Januari">Januari</option>
            <option value="Februari">Februari</option>
            <option value="Maret">Maret</option>
            <option value="April">April</option>
          </select>
          <div className="h-6 w-px bg-gray-200"></div>
          <select 
            value={selectedYear} 
            onChange={(e) => setSelectedYear(e.target.value)}
            className="bg-transparent border-none text-sm font-bold text-gray-900 outline-none cursor-pointer pr-4"
          >
            <option value="2026">2026</option>
            <option value="2025">2025</option>
          </select>
        </div>
      </div>
      
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        {/* Papan Ringkasan Cepat Bulan Terpilih */}
        <div className="bg-gray-900 text-white p-6 flex justify-between items-center">
          <span className="font-bold text-sm text-gray-400 uppercase tracking-wider">
            Total Performa {selectedMonth} {selectedYear}
          </span>
          <div className="text-right">
            <div className="text-2xl font-black text-green-400">Rp {totalBulanIni.omzet.toLocaleString('id-ID')}</div>
            <div className="text-sm text-gray-400 font-medium">{totalBulanIni.trx} Total Transaksi</div>
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
                <th className="pb-3 bg-gray-50 px-2 rounded-tl-lg">Total Trx</th>
                <th className="pb-3 bg-gray-50 px-2 rounded-tr-lg">Total Omzet</th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-gray-50">
              {filteredSales.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-8 text-center text-gray-400 font-medium">
                    Tidak ada data transaksi untuk bulan {selectedMonth} {selectedYear}.
                  </td>
                </tr>
              ) : (
                filteredSales.map(d => (
                  <tr key={d.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="py-3 font-bold text-gray-900">{d.date}</td>
                    <td className="py-3 font-bold text-blue-600 bg-blue-50/30">{d.trxOnline}</td>
                    <td className="py-3 font-bold text-blue-600 bg-blue-50/30">Rp {d.omzetOnline.toLocaleString('id-ID')}</td>
                    <td className="py-3 text-gray-600">{d.trxJakarta}</td>
                    <td className="py-3 text-gray-600">Rp {d.omzetJakarta.toLocaleString('id-ID')}</td>
                    <td className="py-3 text-gray-600">{d.trxBandung}</td>
                    <td className="py-3 text-gray-600">Rp {d.omzetBandung.toLocaleString('id-ID')}</td>
                    <td className="py-3 bg-gray-50 font-bold px-2">{d.totalTrx}</td>
                    <td className="py-3 bg-gray-50 font-black px-2 text-green-600">Rp {d.totalOmzet.toLocaleString('id-ID')}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}