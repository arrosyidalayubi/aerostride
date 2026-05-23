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