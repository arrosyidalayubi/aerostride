import { RefreshCw } from 'lucide-react';
import type { Order } from '../../types';

interface OrdersViewProps {
  orders: Order[];
  onUpdateOrders: (orders: Order[]) => void;
}

export default function OrdersView({ orders, onUpdateOrders }: OrdersViewProps) {
  
  const handleToggleOrderStatus = (orderId: string) => {
    onUpdateOrders(orders.map(o => 
      o.id === orderId 
        ? { ...o, status: o.status === 'Packing' ? 'Delivery' : o.status === 'Delivery' ? 'Delivered' : 'Packing' } 
        : o
    ));
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <h1 className="text-3xl font-black text-gray-900 tracking-tighter uppercase">Pengiriman Pesanan Online</h1>
      
      <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm overflow-x-auto">
        <table className="w-full text-left min-w-150">
          <thead>
            <tr className="border-b border-gray-100 text-gray-400 text-xs font-bold uppercase">
              <th className="pb-3">Tanggal</th>
              <th className="pb-3">ID Pesanan</th>
              <th className="pb-3">Pembeli</th>
              <th className="pb-3">Item</th>
              <th className="pb-3">Total</th>
              <th className="pb-3">Status</th>
              <th className="pb-3 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="text-sm divide-y divide-gray-50">
            {orders.map(o => (
              <tr key={o.id}>
                <td className="py-4 font-mono text-gray-400 font-bold">{o.id}</td>
                <td className="py-4 font-bold text-gray-700">{o.date}</td>
                <td className="py-4 font-bold">{o.customerName}</td>
                <td className="py-4 text-xs text-gray-600">
                  {o.items.map((i, idx) => <div key={idx}>{i.productName} (x{i.qty})</div>)}
                </td>
                <td className="py-4 font-bold">Rp {o.totalAmount.toLocaleString('id-ID')}</td>
                <td className="py-4">
                  <span className={`px-3 py-1 text-xs font-black rounded-full border ${o.status === 'Packing' ? 'bg-blue-50 text-blue-700 border-blue-200' : o.status === 'Delivery' ? 'bg-orange-50 text-orange-700 border-orange-200' : 'bg-green-50 text-green-700 border-green-200'}`}>{o.status}</span>
                </td>
                <td className="py-4 text-right">
                  <button onClick={() => handleToggleOrderStatus(o.id)} className="inline-flex items-center gap-1 bg-gray-900 text-white text-xs font-bold px-3 py-2 rounded-xl hover:bg-gray-800 cursor-pointer">
                    <RefreshCw className="w-3 h-3" /> Status
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}