import React from 'react';
import { Link } from 'react-router-dom';

interface NewsArticleCardProps {
  title: string;
  excerpt: string;
  image: string;
  date: string;
  id: number;
}

const NewsArticleCard: React.FC<NewsArticleCardProps> = ({ title, excerpt, image, date, id }) => {
  return (
    <article className="bg-white rounded-lg overflow-hidden shadow-md transition-transform duration-300 hover:shadow-lg">
      <img src={image} alt={title} className="w-full h-48 object-cover" />
      <div className="p-6">
        <h2 className="text-xl font-semibold mb-2">{title}</h2>
        <p className="text-gray-600 mb-4">{excerpt}</p>
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-500">{new Date(date).toLocaleDateString('ru-RU')}</span>
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
