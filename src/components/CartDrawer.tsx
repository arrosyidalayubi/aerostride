import { X, ArrowRight, Trash2 } from 'lucide-react';
import type { CartItem } from '../hooks/useAppData'; // Sesuaikan path import

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  updateCartQty: (id: string, amount: number) => void;
  removeFromCart: (id: string) => void;
  onCheckout: () => void;
}

export default function CartDrawer({ isOpen, onClose, cart, removeFromCart, updateCartQty, onCheckout }: CartDrawerProps) {
  if (!isOpen) return null;

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Background Overlay */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      
      {/* Panel Keranjang */}
      <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
        <div className="p-6 flex justify-between items-center border-b border-gray-100">
          <h2 className="text-xl font-black uppercase">Keranjang ({cart.reduce((a, b) => a + b.qty, 0)})</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full"><X className="w-5 h-5" /></button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {cart.length === 0 ? (
            <p className="text-center text-gray-500 mt-10">Keranjang Anda masih kosong.</p>
          ) : (
            cart.map(item => (
              <div key={item.id} className="flex items-center gap-4 bg-gray-50 p-3 rounded-2xl border border-gray-100">
                <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded-xl bg-white" />
                <div className="flex-1">
                  <h4 className="font-bold text-sm">{item.name}</h4>
                  <p className="text-xs font-bold text-gray-500 mt-1">Rp {item.price.toLocaleString('id-ID')}</p>

                  <button 
                      onClick={() => removeFromCart(item.id)} 
                      className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      title="Hapus Barang"
                    >
                      <Trash2 className="w-4 h-4" />
                  </button>

                  <div className="flex items-center gap-2 mt-2">
                    <button onClick={() => updateCartQty(item.id, -1)} className="w-6 h-6 bg-white border border-gray-200 rounded-md text-xs font-bold hover:bg-gray-100">-</button>
                    <span className="text-xs font-bold w-4 text-center">{item.qty}</span>
                    <button onClick={() => updateCartQty(item.id, 1)} className="w-6 h-6 bg-white border border-gray-200 rounded-md text-xs font-bold hover:bg-gray-100">+</button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="p-6 border-t border-gray-100 bg-gray-50">
          <div className="flex justify-between items-center mb-4">
            <span className="text-sm font-medium text-gray-500">Subtotal</span>
            <span className="text-xl font-black">Rp {subtotal.toLocaleString('id-ID')}</span>
          </div>
          <button 
            onClick={onCheckout}
            disabled={cart.length === 0}
            className="w-full bg-black text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Lanjut Pembayaran <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}