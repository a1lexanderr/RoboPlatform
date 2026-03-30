import React, { useState, useEffect } from "react";
import { imageApi } from "../../api/imageApi";
import { ImageItem } from "@/types";

const AdminGalleryPage: React.FC = () => {
  const [images, setImages] = useState<ImageItem[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");

  const fetchImages = async () => {
    try {
      const data = await imageApi.getGalleryImages();
      setImages(data);
    } catch (error) {
      console.error("Ошибка загрузки галереи", error);
    }
  };

  useEffect(() => {
    fetchImages();
  }, []);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;
    try {
      await imageApi.upload(file, title);
      setFile(null);
      setTitle("");
      fetchImages(); // Обновляем список после загрузки
    } catch (error) {
      console.error("Ошибка загрузки фото", error);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Удалить изображение?")) return;
    try {
      await imageApi.delete(id);
      setImages(images.filter((img) => img.id !== id));
    } catch (error) {
      console.error("Ошибка удаления", error);
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Управление Галереей</h1>
      
      {/* Форма загрузки */}
      <form onSubmit={handleUpload} className="bg-gray-800 p-6 rounded-lg mb-8 flex gap-4 items-end">
        <div>
          <label className="block text-sm mb-2">Название</label>
          <input 
            type="text" 
            value={title} 
            onChange={(e) => setTitle(e.target.value)} 
            className="text-black p-2 rounded"
          />
        </div>
        <div>
          <label className="block text-sm mb-2">Файл</label>
          <input 
            type="file" 
            accept="image/*"
            onChange={(e) => setFile(e.target.files?.[0] || null)} 
          />
        </div>
        <button type="submit" disabled={!file} className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50">
          Загрузить
        </button>
      </form>

      {/* Список картинок с кнопкой удаления */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {images.map((img) => (
          <div key={img.id} className="relative bg-gray-700 p-2 rounded">
            <img src={img.url} alt={img.title} className="w-full h-40 object-cover rounded mb-2" />
            <p className="text-sm truncate">{img.title}</p>
            <button 
              onClick={() => handleDelete(img.id)}
              className="absolute top-4 right-4 bg-red-600 p-1 rounded hover:bg-red-700"
            >
              Удалить
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminGalleryPage;