import type { DailySale } from '../../types';

interface DailySalesViewProps {
  dailySales: DailySale[];
}

export default function DailySalesView({ dailySales }: DailySalesViewProps) {
  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <h1 className="text-3xl font-black text-gray-900 tracking-tighter uppercase">Laporan Harian Toko</h1>
      <p className="text-sm text-gray-500 font-medium -mt-4 mb-6">Rekapitulasi transaksi dari semua cabang fisik.</p>
      
      <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm overflow-x-auto">
        <table className="w-full text-left min-w-200">
          <thead>
            <tr className="border-b border-gray-100 text-gray-400 text-xs font-bold uppercase">
              <th className="pb-3">Tanggal</th>
              <th className="pb-3">Trx Jkt</th>
              <th className="pb-3">Omzet Jkt</th>
              <th className="pb-3">Trx Bdg</th>
              <th className="pb-3">Omzet Bdg</th>
              <th className="pb-3 bg-gray-50 px-2 rounded-tl-lg">Total Trx</th>
              <th className="pb-3 bg-gray-50 px-2 rounded-tr-lg">Total Omzet</th>
            </tr>
          </thead>
          <tbody className="text-sm divide-y divide-gray-50">
            {dailySales.map(d => (
              <tr key={d.id} className="hover:bg-gray-50/50 transition-colors">
                <td className="py-3 font-bold text-gray-900">{d.date}</td>
                <td className="py-3 text-gray-600">{d.trxJakarta}</td>
                <td className="py-3 text-gray-600">Rp {d.omzetJakarta.toLocaleString('id-ID')}</td>
                <td className="py-3 text-gray-600">{d.trxBandung}</td>
                <td className="py-3 text-gray-600">Rp {d.omzetBandung.toLocaleString('id-ID')}</td>
                <td className="py-3 bg-gray-50 font-bold px-2">{d.totalTrx}</td>
                <td className="py-3 bg-gray-50 font-black px-2 text-green-600">Rp {d.totalOmzet.toLocaleString('id-ID')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}