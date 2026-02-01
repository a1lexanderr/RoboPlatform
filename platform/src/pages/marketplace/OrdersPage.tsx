import React, { useEffect, useState } from 'react';
import { marketplaceApi } from '../../api/marketplaceApi';
import { OrderResponse } from '@/types';

const OrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<OrderResponse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    marketplaceApi.getMyOrders()
      .then(setOrders)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div>Загрузка истории...</div>;

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Мои покупки</h1>
      <div className="space-y-4">
        {orders.map((order) => (
          <div key={order.id} className="bg-gray-800 rounded p-4 border border-gray-700">
            <div className="flex justify-between mb-2">
              <span className="text-gray-400">Заказ #{order.id} от {new Date(order.createdAt).toLocaleDateString()}</span>
              <span className={`font-bold ${order.status === 'NEW' ? 'text-blue-400' : 'text-green-400'}`}>
                {order.status}
              </span>
            </div>
            <div className="space-y-1 pl-4 border-l-2 border-gray-600 mb-2">
                {order.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between text-sm">
                        <span>{item.productTitle} x {item.quantity}</span>
                        <span>{item.pricePerUnit} ₽/шт</span>
                    </div>
                ))}
            </div>
            <div className="text-right font-bold text-lg border-t border-gray-700 pt-2">
                Сумма: {order.totalPrice} ₽
            </div>
          </div>
        ))}
        {orders.length === 0 && <p>У вас пока нет заказов.</p>}
      </div>
    </div>
  );
};

export default OrdersPage;