import React, { useState } from 'react';
import { useCart } from '@/context/CartContext';
import { marketplaceApi } from '@/api/marketplaceApi';
import { useNavigate } from 'react-router-dom';

const CartPage: React.FC = () => {
  const { cart, removeFromCart, updateQuantity, clearCart, totalPrice } = useCart();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleCheckout = async () => {
    if (cart.length === 0) return;
    setIsSubmitting(true);
    try {
      // Собираем данные для отправки на бэк
      const orderRequest = {
        items: cart.map(item => ({
          productId: item.id,
          quantity: item.quantityInCart
        }))
      };
      await marketplaceApi.createOrder(orderRequest);
      clearCart();
      alert('Заказ успешно оформлен!');
      navigate('/orders');
    } catch (error) {
      console.error(error);
      alert('Ошибка при оформлении заказа. Возможно, товар закончился.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (cart.length === 0) {
    return <div className="text-center mt-10 text-xl text-white">Ваша корзина пуста</div>;
  }

  return (
    <div className="max-w-4xl mx-auto text-white">
      <h1 className="text-3xl font-bold mb-6">Корзина</h1>
      <div className="bg-gray-800 rounded-lg p-6 shadow-lg border border-gray-700">
        {cart.map((item) => (
          <div key={item.id} className="flex items-center justify-between border-b border-gray-700 py-4 last:border-0">
            <div className="flex items-center gap-4">
               <div className="w-16 h-16 bg-gray-700 rounded overflow-hidden flex-shrink-0">
                 {item.imageUrls && item.imageUrls.length > 0 ? (
                    <img src={item.imageUrls[0]} alt={item.title} className="w-full h-full object-cover" />
                 ) : (
                    <div className="w-full h-full flex items-center justify-center text-xs text-gray-500">No img</div>
                 )}
               </div>
               
              <div>
                <h3 className="text-lg font-semibold">{item.title}</h3>
                <p className="text-sm text-gray-400">Цена: {item.price} ₽</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center bg-gray-700 rounded">
                <button 
                  onClick={() => updateQuantity(item.id, item.quantityInCart - 1)}
                  className="px-3 py-1 hover:bg-gray-600 rounded-l transition-colors"
                >-</button>
                <span className="px-3 font-mono">{item.quantityInCart}</span>
                <button 
                   onClick={() => updateQuantity(item.id, item.quantityInCart + 1)}
                   className="px-3 py-1 hover:bg-gray-600 rounded-r transition-colors"
                   disabled={item.quantityInCart >= item.stockQuantity} // Блокируем, если больше нет на складе
                >+</button>
              </div>
              <p className="font-bold w-24 text-right">
                {item.price * item.quantityInCart} ₽
              </p>
              <button 
                onClick={() => removeFromCart(item.id)}
                className="text-red-400 hover:text-red-300 ml-2"
              >
                ✕
              </button>
            </div>
          </div>
        ))}
        
        <div className="mt-8 flex justify-between items-center border-t border-gray-700 pt-6">
          <div className="text-2xl font-bold">
            Итого: <span className="text-green-400">{totalPrice} ₽</span>
          </div>
          <button 
            onClick={handleCheckout}
            disabled={isSubmitting}
            className="bg-green-600 hover:bg-green-700 px-8 py-3 rounded-lg font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isSubmitting ? 'Оформление...' : 'Оформить заказ'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartPage;