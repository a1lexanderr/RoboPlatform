import { GalleryItem } from "../types/gallery";
import GalleryGrid from "./GalleryGrid";

interface GallerySectionProps {
    title: string;
    items: GalleryItem[];
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
      <section className="bg-white py-12 md:py-20 lg:py-24">
        <div className="max-w-[1440px] mx-auto px-4 md:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-8 md:mb-12">
            {title}
          </h2>
          <GalleryGrid items={displayedItems} />
          {!showAll && onShowAll && (
            <div className="text-center mt-12">
              <button 
                onClick={onShowAll}
                className="inline-block px-6 py-3 bg-gray-800 text-white font-medium rounded-lg hover:bg-gray-900 transition-colors duration-300 text-lg"
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