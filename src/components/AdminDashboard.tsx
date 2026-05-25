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
  onUpdateDailySales: (sales: DailySale[]) => void;
  onUpdateProducts: (products: Product[]) => void;
  onUpdateOrders: (orders: Order[]) => void;
  onUpdateOfflineSales: (sales: OfflineSale[]) => void;
  onUpdateCustomers: (customers: CustomerData[]) => void;
}

export default function AdminDashboard({
  activeMenu, products, orders, offlineSales, customers, dailySales,
  onUpdateProducts, onUpdateOrders, onUpdateOfflineSales, onUpdateCustomers, onUpdateDailySales
}: AdminDashboardProps) {
  
  return (
    <div className="min-h-screen bg-gray-50 lg:ml-64 p-4 md:p-8 pt-24 lg:pt-8">
      <div className="w-full max-w-7xl mx-auto pt-20 lg:pt-8 px-4 sm:px-6 lg:px-8 pb-12">
        
        {activeMenu === 'ringkasan' && (
          <OverviewView dailySales={dailySales} />
        )}

        {activeMenu === 'harian' && (
         <DailySalesView dailySales={dailySales} onUpdateDailySales={onUpdateDailySales} />
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