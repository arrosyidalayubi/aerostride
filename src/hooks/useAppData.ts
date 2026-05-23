import { useState, useEffect } from 'react';
import type { Product, Order, OfflineSale, CustomerData, DailySale } from '../types';

export function useAppData() {
  const [user, setUser] = useState<{ name: string; role: 'admin' | 'customer' } | null>(() => {
    // Ganti localStorage menjadi sessionStorage
    const savedUser = sessionStorage.getItem('aero_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

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

  const handleOnlineCheckout = async (onSuccess: () => void, onError: (msg: string) => void) => {
    if (!user) { onError('Autentikasi Diperlukan: Silakan masuk terlebih dahulu.'); return; }
    
    const targetSku = 'AST-01'; 
    const targetProduct = products.find(p => p.id === targetSku);
    if (!targetProduct || targetProduct.stock < 1) { onError('Produk tidak ditemukan atau stok habis.'); return; }

    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sku: targetSku, qty: 1, orderId: `TRX-ONL-${Date.now()}`, 
          customerName: user.name, totalAmount: targetProduct.price, date: '23 Mei'
        })
      });

      if (!response.ok) throw new Error("Gagal Checkout di server");
      
      const resProd = await fetch('/api/products');
      if (resProd.ok) setProducts(await resProd.json());
      onSuccess();
    } catch {
      onError('Terjadi kesalahan pada server D1.');
    }
  };

  return {
    user, setUser:updateAndSaveUser, products, setProducts, orders, setOrders,
    offlineSales, setOfflineSales, customers, setCustomers,
    dailySales, setDailySales, handleOnlineCheckout
  };
}