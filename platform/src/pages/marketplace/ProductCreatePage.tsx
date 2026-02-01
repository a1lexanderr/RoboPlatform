import React, { useState } from 'react';
import { marketplaceApi, CreateProductForm } from '@/api/marketplaceApi';
import { useNavigate } from 'react-router-dom';

const ProductCreatePage: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  
  const [formData, setFormData] = useState<CreateProductForm>({
    title: '',
    description: '',
    price: 0,
    stockQuantity: 1,
    category: 'ELECTRONICS'
  });

  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const fileList = Array.from(e.target.files);
      setFiles(fileList);
      
      // Генерация превью для UX
      const newPreviews = fileList.map(file => URL.createObjectURL(file));
      setPreviews(newPreviews);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await marketplaceApi.createProduct(formData, files);
      alert('Товар успешно создан!');
      navigate('/marketplace');
    } catch (error) {
      console.error(error);
      alert('Ошибка при создании товара. Проверьте данные.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-gray-800 rounded-lg mt-10 text-white border border-gray-700">
      <h2 className="text-2xl font-bold mb-6">Разместить товар на продажу</h2>
      <form onSubmit={handleSubmit} className="space-y-5">
        
        <div>
          <label className="block mb-1 font-medium">Название товара</label>
          <input 
            type="text" 
            required
            className="w-full p-2 bg-gray-900 border border-gray-600 rounded focus:border-blue-500 focus:outline-none"
            value={formData.title}
            onChange={e => setFormData({...formData, title: e.target.value})}
            placeholder="Например: Arduino Uno R3"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Категория</label>
          <select 
            className="w-full p-2 bg-gray-900 border border-gray-600 rounded focus:border-blue-500 focus:outline-none"
            value={formData.category}
            onChange={e => setFormData({...formData, category: e.target.value})}
          >
             <option value="ELECTRONICS">Электроника</option>
             <option value="MECHANICS">Механика</option>
             <option value="KITS">Наборы (Kits)</option>
             <option value="MERCH">Мерч</option>
             <option value="OTHER">Разное</option>
          </select>
        </div>

        <div>
          <label className="block mb-1 font-medium">Описание</label>
          <textarea 
            required
            className="w-full p-2 bg-gray-900 border border-gray-600 rounded h-32 focus:border-blue-500 focus:outline-none"
            value={formData.description}
            onChange={e => setFormData({...formData, description: e.target.value})}
            placeholder="Опишите состояние, характеристики..."
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block mb-1 font-medium">Цена (₽)</label>
            <input 
              type="number" 
              required
              min="0"
              className="w-full p-2 bg-gray-900 border border-gray-600 rounded focus:border-blue-500 focus:outline-none"
              value={formData.price}
              onChange={e => setFormData({...formData, price: Number(e.target.value)})}
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Количество на складе</label>
            <input 
              type="number" 
              required
              min="1"
              className="w-full p-2 bg-gray-900 border border-gray-600 rounded focus:border-blue-500 focus:outline-none"
              value={formData.stockQuantity}
              onChange={e => setFormData({...formData, stockQuantity: Number(e.target.value)})}
            />
          </div>
        </div>

        <div>
          <label className="block mb-1 font-medium">Фотографии</label>
          <input 
            type="file" 
            multiple 
            accept="image/*"
            onChange={handleFileChange}
            className="w-full p-2 bg-gray-700 rounded cursor-pointer"
          />
          <p className="text-xs text-gray-400 mt-1">Первое фото будет обложкой</p>
          
          {/* Превью загружаемых фото */}
          {previews.length > 0 && (
            <div className="flex gap-2 mt-3 overflow-x-auto pb-2">
              {previews.map((src, idx) => (
                <div key={idx} className="relative group flex-shrink-0">
                    <img src={src} alt="Preview" className="h-24 w-24 object-cover rounded border border-gray-600" />
                    <div className="absolute top-0 left-0 bg-black/50 text-white text-xs px-1 rounded-br">
                        {idx === 0 ? 'Main' : idx + 1}
                    </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <button 
          type="submit" 
          disabled={isLoading}
          className="w-full bg-blue-600 hover:bg-blue-700 p-3 rounded font-bold mt-4 transition-colors disabled:opacity-70"
        >
          {isLoading ? 'Загрузка...' : 'Опубликовать товар'}
        </button>
      </form>
    </div>
  );
};

export default ProductCreatePage;