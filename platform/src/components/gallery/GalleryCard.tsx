import { GalleryItem } from "../types/gallery";

interface GalleryCardProps {
    item: GalleryItem;
  }
  
  const GalleryCard: React.FC<GalleryCardProps> = ({ item }) => (
    <div className="bg-gray-100 rounded-lg overflow-hidden shadow-md transition-transform duration-300 hover:scale-105">
      <img 
        src={item.image} 
        alt={item.title} 
        className="w-full h-55 object-cover"
      />
      <div className="p-4">
        <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
      </div>
    </div>
  );

  export default GalleryCard;
  