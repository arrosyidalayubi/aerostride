import { X, ShoppingBag, ArrowRight } from 'lucide-react';

// Props definition
interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onCheckout: () => void;
}

export default function CartDrawer({ isOpen, onClose, onCheckout }: CartDrawerProps) {
  // Simulasi state keranjang
  const cartItems = [
    { id: 1, name: "Aero X-1 Urban", size: "42", price: 1250000, qty: 1, image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=200&auto=format&fit=crop" },
    { id: 2, name: "Aero Lite Transit", size: "39", price: 950000, qty: 1, image: "https://images.unsplash.com/photo-1608231387042-66d1773070a5?q=80&w=200&auto=format&fit=crop" }
  ];

  const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.qty), 0);

  return (
    <>
      {/* Overlay Gelap */}
      <div 
        className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-60 transition-opacity duration-300 ${isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}
        onClick={onClose}
      />

      {/* Slide Over Panel */}
      <div className={`fixed inset-y-0 right-0 z-70 w-full max-w-md bg-white shadow-2xl transform transition-transform duration-500 ease-in-out flex flex-col ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        
        {/* Cart Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-2 text-gray-900">
            <ShoppingBag className="w-5 h-5" />
            <h2 className="text-lg font-black tracking-tighter uppercase">Keranjang (2)</h2>
          </div>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-black transition-colors rounded-full hover:bg-gray-100">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Cart Items Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {cartItems.map((item) => (
            <div key={item.id} className="flex gap-4">
              <div className="w-24 h-24 bg-gray-50 rounded-xl overflow-hidden shrink-0">
                <img src={item.image} alt={item.name} className="w-full h-full object-cover mix-blend-multiply" />
              </div>
              <div className="flex-1 flex flex-col justify-between py-1">
                <div>
                  <h3 className="font-bold text-gray-900">{item.name}</h3>
                  <p className="text-sm text-gray-500">Size: {item.size}</p>
                </div>
                <div className="flex justify-between items-end">
                  <p className="font-bold text-sm">
                    {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(item.price)}
                  </p>
                  <div className="flex items-center border border-gray-200 rounded-lg">
                    <button className="px-2 py-1 text-gray-500 hover:text-black">-</button>
                    <span className="px-2 text-sm font-bold">{item.qty}</span>
                    <button className="px-2 py-1 text-gray-500 hover:text-black">+</button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Cart Footer / Checkout Area */}
        <div className="border-t border-gray-100 p-6 bg-gray-50">
          <div className="flex justify-between text-gray-900 mb-4 font-bold text-lg">
            <span>Subtotal</span>
            <span>{new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(subtotal)}</span>
          </div>
          <p className="text-xs text-gray-500 mb-6">Pajak dan ongkos kirim dihitung saat checkout.</p>
          <button onClick={onCheckout} className="w-full bg-black text-white py-4 rounded-full font-bold text-lg hover:bg-gray-800 transition-colors flex items-center justify-center gap-2 cursor-pointer">
            Lanjut Ke Pembayaran
            <ArrowRight className="w-5 h-5" />
        </button>
        </div>
      </div>
    </>
  );
}