import { Truck, CheckCircle, Clock } from 'lucide-react';
import type { Order } from '../types';

interface CustomerDashboardProps {
  orders: Order[];
  userName: string;
}

export default function CustomerDashboard({ orders, userName }: CustomerDashboardProps) {
  // Ambil pesanan khusus milik user yang sedang aktif login
  const myOrders = orders.filter(o => o.customerName === userName);

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tighter uppercase">Panel Akun Pelanggan</h1>
          <p className="text-gray-500 font-medium">Selamat datang kembali, <span className="text-black font-bold">{userName}</span>. Pantau riwayat belanja Anda di sini.</p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900 mb-6">Status Pengiriman Paket Anda</h2>
          
          {myOrders.length === 0 ? (
            <p className="text-sm text-gray-400 py-6 text-center">Anda belum memiliki riwayat pembelian produk online.</p>
          ) : (
            <div className="space-y-8">
              {myOrders.map(order => (
                <div key={order.id} className="p-6 bg-gray-50 rounded-2xl border border-gray-100 space-y-4">
                  <div className="flex justify-between items-center text-sm border-b border-gray-200/60 pb-3">
                    <span className="font-mono text-gray-400 font-bold">{order.id} ({order.date})</span>
                    <span className="font-black text-gray-900">Total: Rp {order.totalAmount.toLocaleString('id-ID')}</span>
                  </div>

                  {/* ALUR PELACAKAN STATUS VISUAL (PACKING - DELIVERY - DELIVERED) */}
                  <div className="grid grid-cols-3 text-center relative py-4">
                    <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-200 -translate-y-1/2 z-0"></div>
                    
                    {/* Tahap 1: Packing */}
                    <div className="relative z-10 flex flex-col evils-center items-center">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs border-2 ${
                        order.status === 'Packing' || order.status === 'Delivery' || order.status === 'Delivered' ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-300'
                      }`}><Clock className="w-4 h-4"/></div>
                      <span className="text-xs font-bold mt-2 text-gray-900">Gudang Packing</span>
                    </div>

                    {/* Tahap 2: Delivery */}
                    <div className="relative z-10 flex flex-col items-center">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs border-2 ${
                        order.status === 'Delivery' || order.status === 'Delivered' ? 'bg-orange-500 text-white border-orange-500' : 'bg-white text-gray-300'
                      }`}><Truck className="w-4 h-4"/></div>
                      <span className="text-xs font-bold mt-2 text-gray-900">Kurir Ekspedisi</span>
                    </div>

                    {/* Tahap 3: Delivered */}
                    <div className="relative z-10 flex flex-col items-center">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs border-2 ${
                        order.status === 'Delivered' ? 'bg-green-600 text-white border-green-600' : 'bg-white text-gray-300'
                      }`}><CheckCircle className="w-4 h-4"/></div>
                      <span className="text-xs font-bold mt-2 text-gray-900">Diterima</span>
                    </div>
                  </div>

                  {/* Item List Box */}
                  <div className="bg-white p-4 rounded-xl border border-gray-100 text-xs space-y-1">
                    {order.items.map((item, i) => (
                      <div key={i} className="flex justify-between text-gray-600">
                        <span>{item.productName} <strong className="text-black">(x{item.qty})</strong></span>
                        <span className="font-bold text-gray-900">Rp {item.price.toLocaleString('id-ID')}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}