export interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  size: string;
  stock: number;
  threshold: number;
  status: 'In Stock' | 'Low Stock' | 'Critical';
  image: string;
}

export interface Order {
  id: string;
  customerName: string;
  items: { productName: string; qty: number; price: number }[];
  totalAmount: number;
  status: 'Packing' | 'Delivery' | 'Delivered';
  date: string;
}

export interface OfflineSale {
  id: string;
  itemCode: string;
  productName: string;
  qty: number;
  totalPrice: number;
  cabang: 'Jakarta' | 'Bandung'; 
  date: string;
}

export interface CustomerData {
  id: string;
  name: string;
  email: string;
  phone: string;
  joinDate: string;
}

export interface DailySale {
  id: string;
  date: string;         // Tanggal (ex: "01-01-2026")
  month: string;        // Bulan (ex: "Januari")
  trxJakarta: number;   // Transaksi Jakarta
  omzetJakarta: number; // Omzet Jakarta (IDR)
  trxBandung: number;   // Transaksi Bandung
  omzetBandung: number; // Omzet Bandung (IDR)
  totalTrx: number;     // Total Transaksi
  totalOmzet: number;   // Total Omzet Offline (IDR)
  trxOnline: number;
  omzetOnline: number;
}