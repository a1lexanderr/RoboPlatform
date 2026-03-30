import React from 'react';
import { Link } from 'react-router-dom';

interface NewsArticleCardProps {
  id: number;
  title: string;
  excerpt: string;
  imageUrl: string;
  createdAt: string;
}

const NewsArticleCard: React.FC<NewsArticleCardProps> = ({ title, excerpt, imageUrl, createdAt, id }) => {
  const defaultImage = "https://via.placeholder.com/300x200?text=Нет+фото";

  return (
    <article className="bg-gray-800 rounded-lg overflow-hidden shadow-lg border border-gray-700 transition-transform duration-300 hover:-translate-y-1">
      <img src={imageUrl || defaultImage} alt={title} className="w-full h-48 object-cover bg-gray-700" />
      <div className="p-6">
        <h2 className="text-xl font-bold mb-2 text-white line-clamp-2">{title}</h2>
        <p className="text-gray-300 mb-4 line-clamp-3 text-sm">{excerpt}</p>
        <div className="flex justify-between items-center mt-auto">
          <span className="text-xs text-gray-400">
            {new Date(createdAt).toLocaleDateString('ru-RU')}
          </span>
          <Link 
            to={`/news/${id}`} 
            className="inline-block px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors duration-300 text-sm"
          >
            Читать далее
          </Link>
        </div>
      </div>
    </article>
  );
};

export default NewsArticleCard;