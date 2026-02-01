import { GalleryItem } from "../types/gallery";
import GalleryCard from "./GalleryCard";

interface GalleryGridProps {
    items: GalleryItem[];
  }
  
  const GalleryGrid: React.FC<GalleryGridProps> = ({ items }) => (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
      {items.map((item) => (
        <GalleryCard key={item.id} item={item} />
      ))}
    </div>
  );

  export default GalleryGrid;