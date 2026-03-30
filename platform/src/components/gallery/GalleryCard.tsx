import React from "react";
import { ImageItem } from "@/types";

interface GalleryCardProps {
  item: ImageItem;
}

const GalleryCard: React.FC<GalleryCardProps> = ({ item }) => (
  <div className="bg-gray-800 rounded-lg overflow-hidden shadow-lg transition-transform duration-300 hover:scale-105 border border-gray-700">
    <img 
      src={item.url}
      alt={item.title || "Изображение галереи"} 
      className="w-full h-56 object-cover bg-gray-700"
    />
    <div className="p-4">
      <h3 className="text-xl font-semibold mb-2 text-white truncate" title={item.title}>
        {item.title || "Без названия"}
      </h3>
    </div>
  </div>
);

export default GalleryCard;