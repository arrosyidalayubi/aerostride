import { useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from 'recharts';
import type { DailySale } from '../../types';

interface OverviewViewProps {
  dailySales: DailySale[];
}

// 1. Kunci Disiplin TypeScript: Definisikan Struktur Cetakan Agregasi Berstatus Strict
interface MonthlySummary {
  month: string;
  trxOnline: number;
  omzetOnline: number;
  trxOffline: number;
  omzetOffline: number;
  totalTrx: number;
  totalOmzet: number;
  omzetJakarta: number;
  omzetBandung: number;
}

interface YearlySummary {
  year: string;
  trxOnline: number;
  omzetOnline: number;
  trxOffline: number;
  omzetOffline: number;
  totalTrx: number;
  totalOmzet: number;
}

export default function OverviewView({ dailySales }: OverviewViewProps) {
  
  // =========================================================================
  // LOGIKA AGREGASI 1: RINGKASAN BULANAN OMNICHANNEL (ONLINE + OFFLINE)
  // =========================================================================
  const monthlyData = useMemo(() => {
    const summary = dailySales.reduce((acc, curr) => {
      if (!acc[curr.month]) {
        acc[curr.month] = { 
          month: curr.month, 
          trxOnline: 0,
          omzetOnline: 0,
          trxOffline: 0,
          omzetOffline: 0,
          totalTrx: 0, 
          totalOmzet: 0,
          omzetJakarta: 0, 
          omzetBandung: 0 
        };
      }
      
      // Kalkulasi sub-total offline dari cabang-cabang
      const dailyOfflineTrx = curr.trxJakarta + curr.trxBandung;
      const dailyOfflineOmzet = curr.omzetJakarta + curr.omzetBandung;

      // Akumulasi berantai data dari kluster database D1
      acc[curr.month].trxOnline += curr.trxOnline;
      acc[curr.month].omzetOnline += curr.omzetOnline;
      acc[curr.month].trxOffline += dailyOfflineTrx;
      acc[curr.month].omzetOffline += dailyOfflineOmzet;
      
      acc[curr.month].omzetJakarta += curr.omzetJakarta;
      acc[curr.month].omzetBandung += curr.omzetBandung;
      
      // Gabungan akumulatif omnichannel nyata di lapangan
      acc[curr.month].totalTrx += curr.totalTrx;
      acc[curr.month].totalOmzet += curr.totalOmzet;
      
      return acc;
    }, {} as Record<string, MonthlySummary>); 
    return Object.values(summary);
  }, [dailySales]);

  // =========================================================================
  // LOGIKA AGREGASI 2: RINGKASAN TAHUNAN OMNICHANNEL (ONLINE + OFFLINE)
  // =========================================================================
  const yearlyData = useMemo(() => {
    const summary = dailySales.reduce((acc, curr) => {
      const year = curr.date.split('-')[2] || '2026';
      if (!acc[year]) {
        acc[year] = { 
          year, 
          trxOnline: 0,
          omzetOnline: 0,
          trxOffline: 0,
          omzetOffline: 0,
          totalTrx: 0, 
          totalOmzet: 0 
        };
      }
      const dailyOfflineTrx = curr.trxJakarta + curr.trxBandung;
      const dailyOfflineOmzet = curr.omzetJakarta + curr.omzetBandung;

      acc[year].trxOnline += curr.trxOnline;
      acc[year].omzetOnline += curr.omzetOnline;
      acc[year].trxOffline += dailyOfflineTrx;
      acc[year].omzetOffline += dailyOfflineOmzet;
      acc[year].totalTrx += curr.totalTrx;
      acc[year].totalOmzet += curr.totalOmzet;
      return acc;
    }, {} as Record<string, YearlySummary>);
    return Object.values(summary);
  }, [dailySales]);

  // =========================================================================
  // KONFIGURASI GRAFIK ANALITIK (RECHARTS COMPLIANT)
  // =========================================================================
  type RechartsValue = string | number | readonly (string | number)[] | undefined;
  const formatRupiahTooltip = (value: RechartsValue): [string, string] => [`Rp ${Number(value ?? 0).toLocaleString('id-ID')}`, 'Omzet'];

  // Grafik 1: Tren Perbandingan Jalur Penjualan (Online vs Offline vs Total)
  const OMNICHANNEL_LINE_CHART = monthlyData.map(d => ({
    name: d.month.substring(0, 3), // Ambil 3 huruf depan bulan (Jan, Feb, Mrt)
    'E-Commerce (Online)': d.omzetOnline,
    'Retail (Offline)': d.omzetOffline,
    'Total Konsolidasi': d.totalOmzet
  }));

  // Grafik 2: Distribusi Pendapatan Antar Toko Fisik Makro
  const OFFLINE_DISTRIBUTION_CHART = monthlyData.map(d => ({
    month: d.month,
    Jakarta: d.omzetJakarta,
    Bandung: d.omzetBandung
  }));

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <div>
        <h1 className="text-3xl font-black text-gray-900 tracking-tighter uppercase">Ringkasan Omnichannel</h1>
        <p className="text-gray-500 text-sm">Dashboard Analitik Sistem Informasi Manajemen AeroStride Pusat</p>
      </div>

      {/* PANEL GRAFIK UTAMA */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* GRAFIK 1: PERBANDINGAN TREN JALUR DISTRIBUSI */}
        <div className="bg-white p-4 md:p-6 rounded-3xl border border-gray-100 shadow-sm">
          <h3 className="text-sm font-black mb-4 uppercase text-gray-400 tracking-wider">Performa Jalur Distribusi (Online vs Offline)</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%" minWidth={1} minHeight={1}>
              <LineChart data={OMNICHANNEL_LINE_CHART}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" />
                <YAxis tickFormatter={(v) => `Rp ${(v / 1000000).toFixed(0)}M`} />
                <Tooltip formatter={formatRupiahTooltip} />
                <Legend />
                <Line type="monotone" dataKey="E-Commerce (Online)" stroke="#2563eb" strokeWidth={2} dot={{ r: 4 }} />
                <Line type="monotone" dataKey="Retail (Offline)" stroke="#dc2626" strokeWidth={2} dot={{ r: 4 }} />
                <Line type="monotone" dataKey="Total Konsolidasi" stroke="#111827" strokeWidth={3} strokeDasharray="4 4" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        {/* GRAFIK 2: SEBARAN OUTLET FISIK */}
        <div className="bg-white p-4 md:p-6 rounded-3xl border border-gray-100 shadow-sm">
          <h3 className="text-sm font-black mb-4 uppercase text-gray-400 tracking-wider">Distribusi Wilayah Toko Fisik (Offline Only)</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%" minWidth={1} minHeight={1}>
              <BarChart data={OFFLINE_DISTRIBUTION_CHART}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="month" />
                <YAxis tickFormatter={(v) => `Rp ${(v / 1000000).toFixed(0)}M`} />
                <Tooltip formatter={formatRupiahTooltip} />
                <Legend />
                <Bar dataKey="Jakarta" fill="#111827" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Bandung" fill="#ef4444" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* PANEL TABEL REKAPITULASI DETAIL */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* TABEL BULANAN: PEMBEDAH SUB-OMZET */}
        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm lg:col-span-2">
          <h3 className="text-md font-black mb-4 text-gray-900 uppercase tracking-tight">Buku Besar Konsolidasi Bulanan</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left min-w-162.5">
              <thead>
                <tr className="border-b border-gray-100 text-gray-400 text-xs font-bold uppercase">
                  <th className="pb-3">Periode Bulan</th>
                  <th className="pb-3 text-blue-600 bg-blue-50/50 px-2 rounded-t-lg">Omzet Online</th>
                  <th className="pb-3 text-red-600 bg-red-50/50 px-2 rounded-t-lg">Omzet Offline</th>
                  <th className="pb-3 text-center">Total Unit TRX</th>
                  <th className="pb-3 text-right">Grand Total Omzet</th>
                </tr>
              </thead>
              <tbody className="text-sm divide-y divide-gray-50">
                {monthlyData.map((d, i) => (
                  <tr key={i} className="hover:bg-gray-50/50 transition-colors">
                    <td className="py-3.5 font-bold text-gray-900">{d.month}</td>
                    <td className="py-3.5 font-medium text-blue-600 bg-blue-50/20 px-2">Rp {d.omzetOnline.toLocaleString('id-ID')}</td>
                    <td className="py-3.5 font-medium text-red-600 bg-red-50/20 px-2">Rp {d.omzetOffline.toLocaleString('id-ID')}</td>
                    <td className="py-3.5 text-center font-mono font-bold text-gray-500">{d.totalTrx} trx</td>
                    <td className="py-3.5 text-right font-black text-green-600 text-base">Rp {d.totalOmzet.toLocaleString('id-ID')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* TABEL TAHUNAN: MATRIKS STRATEGIS EKSEKUTIF */}
        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
          <h3 className="text-md font-black mb-4 text-gray-900 uppercase tracking-tight">Kinerja Tahunan Macro</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-gray-100 text-gray-400 text-xs font-bold uppercase">
                  <th className="pb-3">Tahun</th>
                  <th className="pb-3 text-center">Volume</th>
                  <th className="pb-3 text-right">Total Pendapatan</th>
                </tr>
              </thead>
              <tbody className="text-sm divide-y divide-gray-50">
                {yearlyData.map((d, i) => (
                  <tr key={i} className="hover:bg-gray-50/50 transition-colors">
                    <td className="py-4 font-black text-gray-900 text-base">{d.year}</td>
                    <td className="py-4 text-center font-mono text-gray-600 font-bold">{d.totalTrx} Trx</td>
                    <td className="py-4 text-right">
                      <div className="font-black text-gray-900">Rp {d.totalOmzet.toLocaleString('id-ID')}</div>
                      <div className="text-[10px] text-gray-400 font-bold uppercase">Web: Rp {(d.omzetOnline/1000000).toFixed(1)}M | Toko: Rp {(d.omzetOffline/1000000).toFixed(1)}M</div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}