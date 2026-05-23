import { useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from 'recharts';
import type { Order, DailySale } from '../../types';

// Hapus OfflineSale dari props karena sudah tidak dipakai di halaman ringkasan
interface OverviewViewProps {
  orders: Order[];
  dailySales: DailySale[];
}

// Cetakan ketat untuk menggantikan 'any'
interface MonthlySummary {
  month: string;
  totalTrx: number;
  omzetJakarta: number;
  omzetBandung: number;
  totalOmzet: number;
}

interface YearlySummary {
  year: string;
  totalTrx: number;
  totalOmzet: number;
}

export default function OverviewView({ orders, dailySales }: OverviewViewProps) {
  // 1. Agregasi Bulanan (Bebas dari 'any')
  const monthlyData = useMemo(() => {
    const summary = dailySales.reduce((acc, curr) => {
      if (!acc[curr.month]) {
        acc[curr.month] = { month: curr.month, totalTrx: 0, omzetJakarta: 0, omzetBandung: 0, totalOmzet: 0 };
      }
      acc[curr.month].totalTrx += curr.totalTrx;
      acc[curr.month].omzetJakarta += curr.omzetJakarta;
      acc[curr.month].omzetBandung += curr.omzetBandung;
      acc[curr.month].totalOmzet += curr.totalOmzet;
      return acc;
    }, {} as Record<string, MonthlySummary>); 
    return Object.values(summary);
  }, [dailySales]);

  // 2. Agregasi Tahunan (Bebas dari 'any')
  const yearlyData = useMemo(() => {
    const summary = dailySales.reduce((acc, curr) => {
      const year = curr.date.split('-')[2] || '2026';
      if (!acc[year]) {
        acc[year] = { year, totalTrx: 0, totalOmzet: 0 };
      }
      acc[year].totalTrx += curr.totalTrx;
      acc[year].totalOmzet += curr.totalOmzet;
      return acc;
    }, {} as Record<string, YearlySummary>);
    return Object.values(summary);
  }, [dailySales]);

  // 3. Format Tooltip (Menambahkan 'readonly' agar cocok dengan arsitektur Recharts)
  type RechartsValue = string | number | readonly (string | number)[] | undefined;
  const formatRupiah = (value: RechartsValue): [string, string] => [`Rp ${value ?? 0} Juta`, 'Revenue'];

  const DYNAMIC_BAR_CHART = monthlyData.map(d => ({
    month: d.month,
    Jakarta: d.omzetJakarta / 1000000,
    Bandung: d.omzetBandung / 1000000
  }));

  const ONLINE_CHART_DATA = [
    { name: 'Jan', revenue: 125 }, { name: 'Feb', revenue: 150 }, { name: 'Mar', revenue: 180 }, { name: 'Apr', revenue: 140 },
    { name: 'Mei', revenue: orders.reduce((acc, o) => acc + o.totalAmount, 0) / 1000000 + 210 }
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <div>
        <h1 className="text-3xl font-black text-gray-900 tracking-tighter">RINGKASAN OMNICHANNEL</h1>
        <p className="text-gray-500 text-sm">Dashboard Analitik Sistem Informasi Manajemen AeroStride</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-4 md:p-6 rounded-3xl border border-gray-100 shadow-sm">
          <h3 className="text-sm font-bold mb-4 uppercase text-gray-400">Tren E-Commerce (Online)</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%" minWidth={1} minHeight={1}>
              <LineChart data={ONLINE_CHART_DATA}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={formatRupiah} />
                <Line type="monotone" dataKey="revenue" stroke="#111827" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        <div className="bg-white p-4 md:p-6 rounded-3xl border border-gray-100 shadow-sm">
          <h3 className="text-sm font-bold mb-4 uppercase text-gray-400">Distribusi Toko Fisik (Offline)</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%" minWidth={1} minHeight={1}>
              <BarChart data={DYNAMIC_BAR_CHART}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={formatRupiah} />
                <Legend />
                <Bar dataKey="Jakarta" fill="#111827" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Bandung" fill="#dc2626" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
          <h3 className="text-md font-bold mb-4 text-gray-900">Rekapitulasi Bulanan</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-gray-100 text-gray-400 text-xs font-bold uppercase">
                  <th className="pb-3">Bulan</th>
                  <th className="pb-3">Total Trx</th>
                  <th className="pb-3">Total Omzet</th>
                </tr>
              </thead>
              <tbody className="text-sm divide-y divide-gray-50">
                {monthlyData.map((d, i) => (
                  <tr key={i}>
                    <td className="py-3 font-bold text-gray-900">{d.month}</td>
                    <td className="py-3 text-gray-600">{d.totalTrx}</td>
                    <td className="py-3 font-bold text-green-600">Rp {d.totalOmzet.toLocaleString('id-ID')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
          <h3 className="text-md font-bold mb-4 text-gray-900">Rekapitulasi Tahunan</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-gray-100 text-gray-400 text-xs font-bold uppercase">
                  <th className="pb-3">Tahun</th>
                  <th className="pb-3">Total Trx</th>
                  <th className="pb-3">Total Omzet</th>
                </tr>
              </thead>
              <tbody className="text-sm divide-y divide-gray-50">
                {yearlyData.map((d, i) => (
                  <tr key={i}>
                    <td className="py-3 font-bold text-gray-900">{d.year}</td>
                    <td className="py-3 text-gray-600">{d.totalTrx}</td>
                    <td className="py-3 font-bold text-blue-600">Rp {d.totalOmzet.toLocaleString('id-ID')}</td>
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