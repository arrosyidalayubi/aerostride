import OverviewView from './admin/OverviewView';
import OfflineSalesView from './admin/OfflineSalesView';
import InventoryView from './admin/InventoryView';
import OrdersView from './admin/OrdersView';
import CustomersView from './admin/CustomersView';
import DailySalesView from './admin/DailySalesView';
import type { Product, Order, OfflineSale, CustomerData, DailySale } from '../types';

interface AdminDashboardProps {
  activeMenu: string;
  products: Product[];
  orders: Order[];
  offlineSales: OfflineSale[];
  customers: CustomerData[];
  dailySales: DailySale[];
  onUpdateProducts: (products: Product[]) => void;
  onUpdateOrders: (orders: Order[]) => void;
  onUpdateOfflineSales: (sales: OfflineSale[]) => void;
  onUpdateCustomers: (customers: CustomerData[]) => void;
}

export default function AdminDashboard({
  activeMenu, products, orders, offlineSales, customers, dailySales,
  onUpdateProducts, onUpdateOrders, onUpdateOfflineSales, onUpdateCustomers
}: AdminDashboardProps) {
  
  return (
    <div className="min-h-screen bg-gray-50 lg:ml-64 p-4 md:p-8 pt-24 lg:pt-8">
      <div className="max-w-7xl mx-auto">
        
        {activeMenu === 'ringkasan' && (
          <OverviewView orders={orders} dailySales={dailySales} />
        )}

        {activeMenu === 'harian' && (
          <DailySalesView dailySales={dailySales} />
        )}

        {activeMenu === 'offline' && (
          <OfflineSalesView 
            products={products} offlineSales={offlineSales} 
            onUpdateProducts={onUpdateProducts} onUpdateOfflineSales={onUpdateOfflineSales} 
          />
        )}

        {activeMenu === 'inventaris' && (
          <InventoryView products={products} onUpdateProducts={onUpdateProducts} />
        )}

        {activeMenu === 'orders' && (
          <OrdersView orders={orders} onUpdateOrders={onUpdateOrders} />
        )}

        {activeMenu === 'customers' && (
          <CustomersView customers={customers} onUpdateCustomers={onUpdateCustomers} />
        )}

      </div>
    </div>
  );
}