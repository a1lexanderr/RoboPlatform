import React from "react";
import { ImageItem } from "@/types";
import GalleryGrid from "./GalleryGrid";

interface GallerySectionProps {
  title: string;
  items: ImageItem[];
  showAll?: boolean;
  onShowAll?: () => void;
}

const GallerySection: React.FC<GallerySectionProps> = ({ 
  title, 
  items, 
  showAll = false,
  onShowAll 
}) => {
  const displayedItems = showAll ? items : items.slice(0, 8);

  return (
    <section className="py-12 md:py-20 lg:py-24 text-white">
      <div className="max-w-[1440px] mx-auto px-4 md:px-6 lg:px-8">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-8 md:mb-12">
          {title}
        </h2>
        <GalleryGrid items={displayedItems} />
        {!showAll && onShowAll && (
          <div className="text-center mt-12">
            <button 
              onClick={onShowAll}
              className="inline-block px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors duration-300 text-lg"
            >
              Показать все изображения
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default GallerySection;