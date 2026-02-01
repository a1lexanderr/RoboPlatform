import GallerySection from "@/components/gallery/GallerySection";
import mouseImage from "../assets/images/mouse.svg";

const galleryItems = [
    { id: 1, title: 'Соревнование 1', image: mouseImage },
    { id: 2, title: 'Соревнование 2', image: mouseImage },
    { id: 3, title: 'Соревнование 3', image: mouseImage },
    { id: 4, title: 'Соревнование 4', image: mouseImage },
    { id: 5, title: 'Соревнование 5', image: mouseImage },
    { id: 6, title: 'Соревнование 6', image: mouseImage },
    { id: 7, title: 'Соревнование 7', image: mouseImage },
    { id: 8, title: 'Соревнование 8', image: mouseImage },
    ]

const Gallery: React.FC = () => (
    <GallerySection
      title="Все изображения"
      items={galleryItems}
      showAll
    />
  );

  export default Gallery;