// // ImageGallery.tsx
// import React, { useEffect, useState } from 'react';
// import { Link } from 'react-router-dom';
// import { ImageDTO } from '../types'; // define this interface accordingly

// export const ImageGallery: React.FC = () => {
//   const [images, setImages] = useState<ImageDTO[]>([]);

//   useEffect(() => {
//     fetch('/api/v1/images')
//       .then(res => res.json())
//       .then(setImages);
//   }, []);

//   return (
//     <div className="p-6 bg-gray-900 text-white min-h-screen">
//       <h1 className="text-2xl font-bold mb-4">Галерея изображений</h1>
//       <div className="grid grid-cols-3 gap-4">
//         {images.map(img => (
//           <Link key={img.id} to={`/images/${img.id}`} className="block border border-gray-700 rounded overflow-hidden">
//             <img src={img.url} alt={img.title} className="w-full h-48 object-cover" />
//             <div className="p-2 bg-gray-800 text-sm">{img.title}</div>
//           </Link>
//         ))}
//       </div>
//     </div>
//   );
// };