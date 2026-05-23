import { useState, useEffect } from 'react';
import type { Product, Order, OfflineSale, CustomerData, DailySale } from '../types';

export function useAppData() {
  const [user, setUser] = useState<{ name: string; role: 'admin' | 'customer' } | null>(null);

  // 100% KOSONG - Siap menerima injeksi dari Cloudflare D1
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [offlineSales, setOfflineSales] = useState<OfflineSale[]>([]);
  const [customers, setCustomers] = useState<CustomerData[]>([]);
  const [dailySales, setDailySales] = useState<DailySale[]>([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [resProd, resCust, resDaily] = await Promise.all([
          fetch('/api/products'),
          fetch('/api/customers'),
          fetch('/api/daily-sales')
        ]);
        
        if (resProd.ok) setProducts(await resProd.json());
        if (resCust.ok) setCustomers(await resCust.json());
        if (resDaily.ok) setDailySales(await resDaily.json());
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
    user, setUser, products, setProducts, orders, setOrders,
    offlineSales, setOfflineSales, customers, setCustomers,
    dailySales, setDailySales, handleOnlineCheckout
  };
}