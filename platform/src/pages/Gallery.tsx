import React, { useState, useEffect } from "react";
import GallerySection from "@/components/gallery/GallerySection";
// Убедись, что путь до твоего API файла правильный
import { imageApi } from "@/api/imageApi"; 
import { ImageItem } from "@/types";

const Gallery: React.FC = () => {
  const [images, setImages] = useState<ImageItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const data = await imageApi.getGalleryImages();
        setImages(data);
      } catch (error) {
        console.error("Ошибка при загрузке галереи:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64 text-gray-400">
        Загрузка галереи...
      </div>
    );
  }

  // Если картинок нет
  if (images.length === 0) {
    return (
      <div className="text-center py-20 text-gray-400">
        <h2 className="text-3xl font-bold mb-4">Галерея пуста</h2>
        <p>Администратор еще не загрузил фотографии.</p>
      </div>
    );
  }

  return (
    <GallerySection
      title="Все изображения"
      items={images}
      showAll={true}
    />
  );
};

export default Gallery;