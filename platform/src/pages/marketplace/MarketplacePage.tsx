import React, { useEffect, useState } from 'react';
import { marketplaceApi } from '@/api/marketplaceApi';
import { ProductDTO } from '@/types'; // Убедись, что путь к типам верный
import { useCart } from '@/context/CartContext';
import { Link } from 'react-router-dom';

const MarketplacePage: React.FC = () => {
  const [products, setProducts] = useState<ProductDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    marketplaceApi.getAllProducts()
      .then(setProducts)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="text-center mt-10 text-white">Загрузка товаров...</div>;

  return (
    <div className="container mx-auto text-white">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Маркетплейс</h1>
        <div className="flex gap-4">
          <Link to="/marketplace/create" className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded text-white font-bold">
            + Продать товар
          </Link>
          <Link to="/cart" className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-white">
            Корзина
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <div key={product.id} className="bg-gray-800 rounded-lg p-4 shadow-lg flex flex-col border border-gray-700">
            <div className="h-48 bg-gray-700 rounded mb-4 overflow-hidden relative">
              {product.imageUrls && product.imageUrls.length > 0 ? (
                <img 
                  src={product.imageUrls[0]} // Берем первую картинку
                  alt={product.title} 
                  className="w-full h-full object-cover transition-transform hover:scale-105" 
                />
              ) : (
                <div className="flex items-center justify-center h-full text-gray-500">
                  Нет фото
                </div>
              )}
              {product.category && (
                <span className="absolute top-2 right-2 bg-black/60 px-2 py-1 text-xs rounded">
                    {product.category}
                </span>
              )}
            </div>

            <h2 className="text-xl font-semibold mb-2 truncate" title={product.title}>{product.title}</h2>
            <p className="text-gray-400 text-sm mb-4 flex-grow line-clamp-2">
                {product.description}
            </p>
            
            <div className="mt-auto">
                <div className="flex justify-between items-center mb-3">
                    <span className="text-lg font-bold text-green-400">{product.price} ₽</span>
                    <span className="text-xs text-gray-500">В наличии: {product.stockQuantity}</span>
                </div>
                <button
                onClick={() => addToCart(product)}
                disabled={product.stockQuantity === 0}
                className={`w-full py-2 rounded font-semibold transition-colors ${
                    product.stockQuantity > 0 
                    ? 'bg-indigo-600 hover:bg-indigo-700 text-white' 
                    : 'bg-gray-600 cursor-not-allowed text-gray-300'
                }`}
                >
                {product.stockQuantity > 0 ? 'В корзину' : 'Раскуплено'}
                </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MarketplacePage;