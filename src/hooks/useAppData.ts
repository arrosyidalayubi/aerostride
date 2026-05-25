import { useState, useEffect } from 'react';
import type { Product, Order, OfflineSale, CustomerData, DailySale } from '../types';
import toast from 'react-hot-toast';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  qty: number;
  image: string;
}

export function useAppData() {
  const [user, setUser] = useState<{ name: string; role: 'admin' | 'customer' } | null>(() => {
  // Mencoba membaca data tepat saat pertama kali inisialisasi
  const savedUser = sessionStorage.getItem('aero_user');
  try {
    return savedUser ? JSON.parse(savedUser) : null;
  } catch {
    return null;
  }});

  const [cart, setCart] = useState<CartItem[]>([]);
  const addToCart = (product: { id: string; name: string; price: number; image?: string }) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, qty: item.qty + 1 } : item);
      }
      return [...prev, { id: product.id, name: product.name, price: product.price, qty: 1, image: product.image || '/placeholder.png' }];
    });
    toast.success(`${product.name} berhasil ditambahkan ke keranjang!`);
  };

  const updateCartQty = (id: string, amount: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        return { ...item, qty: item.qty + amount }; // Biarkan menjadi 0 atau negatif sementara waktu
      }
      return item;
    }).filter(item => item.qty > 0)); // Filter akan membuang barang yang qty-nya 0 ke bawah
  };

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const handleActualCheckout = async (currentUser: { name: string } | null) => {
    // Keamanan lapis kedua: Tolak mentah-mentah jika tidak ada user
    if (!currentUser) return; 

    
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
    // eslint-disable-next-line react-hooks/purity
    const orderId = `TRX-ONL-${Math.floor(1000 + Math.random() * 9000)}`;
    const formattedDate = new Date().toLocaleDateString('id-ID', { day: '2-digit', month: '2-digit', year: 'numeric' }).replace(/\//g, '-');

    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: orderId,
          customerName: currentUser.name, // Tidak ada lagi Pelanggan Anonim
          date: formattedDate,
          totalAmount: subtotal,
          items: cart
        })
      });

      const result = await res.json();
      if (res.ok && result.success) {
        toast.success(`Checkout Berhasil! ID Pesanan: ${orderId}`);
        setCart([]); // Kosongkan keranjang
        
        // --- SINKRONISASI REAL-TIME ---
        // Segarkan state pesanan & laporan harian di latar belakang
        // agar saat user pindah ke Dashboard Admin, datanya sudah yang terbaru!
        fetch('/api/orders').then(r => r.json()).then(setOrders).catch(() => {});
        fetch('/api/daily-sales').then(r => r.json()).then(setDailySales).catch(() => {});
        fetch('/api/products').then(r => r.json()).then(setProducts).catch(() => {}); // Refresh stok barang

      } else throw new Error(result.error);
    } catch {
      toast.error('Gagal melakukan checkout. Periksa koneksi Anda.');
    }
  };


  const updateAndSaveUser = (newUser: { name: string; role: 'admin' | 'customer' } | null) => {
    setUser(newUser);
    if (newUser) {
      // Ganti localStorage menjadi sessionStorage
      sessionStorage.setItem('aero_user', JSON.stringify(newUser));
    } else {
      // Ganti localStorage menjadi sessionStorage
      sessionStorage.removeItem('aero_user');
    }
  };

  // 100% KOSONG - Siap menerima injeksi dari Cloudflare D1
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [offlineSales, setOfflineSales] = useState<OfflineSale[]>([]);
  const [customers, setCustomers] = useState<CustomerData[]>([]);
  const [dailySales, setDailySales] = useState<DailySale[]>([]);
  

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [resProd, resCust, resDaily, resOffline, resOrders] = await Promise.all([
          fetch('/api/products'),
          fetch('/api/customers'),
          fetch('/api/daily-sales'),
          fetch('/api/offline-sales'),
          fetch('/api/orders')
        ]);
        
        if (resProd.ok) setProducts(await resProd.json());
        if (resCust.ok) setCustomers(await resCust.json());
        if (resDaily.ok) setDailySales(await resDaily.json());
        if (resOffline.ok) setOfflineSales(await resOffline.json());
        if (resOrders.ok) setOrders(await resOrders.json());
      } catch (error) {
        console.error("Gagal sinkronisasi data server:", error);
      }
    };
    fetchDashboardData();
  }, []);

 

  return {
    user, setUser:updateAndSaveUser, products, setProducts, orders, setOrders,
    offlineSales, setOfflineSales, customers, setCustomers,
    dailySales, setDailySales, cart, setCart, addToCart, updateCartQty, removeFromCart, handleActualCheckout
  };
}