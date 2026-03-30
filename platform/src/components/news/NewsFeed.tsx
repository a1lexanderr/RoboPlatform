import React from 'react';
import { Link } from 'react-router-dom';
import NewsArticleCard from './NewsArticleCard';
import { NewsArticle } from '@/types';

interface NewsFeedProps {
  articles: NewsArticle[];
  showAll?: boolean;
}

const NewsFeed: React.FC<NewsFeedProps> = ({ articles, showAll = false }) => {
  const visibleArticles = showAll ? articles : articles.slice(0, 2);

  return (
    <section className="py-12 md:py-20 lg:py-24 text-white">
      <div className="max-w-[1440px] mx-auto px-4 md:px-6 lg:px-8">
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-center mb-12">
          Новости спорта
        </h1>
        
        {articles.length === 0 ? (
          <p className="text-center text-gray-400">Пока нет добавленных новостей.</p>
        ) : (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-2">
            {visibleArticles.map((article) => (
              <NewsArticleCard
                key={article.id}
                id={article.id}
                title={article.title}
                excerpt={article.excerpt}
                imageUrl={article.imageUrl}
                createdAt={article.createdAt}
              />
            ))}
          </div>
        )}

        {!showAll && articles.length > 0 && (
          <div className="text-center mt-12">
            <Link 
              to="/news" 
              className="inline-block px-6 py-3 bg-gray-800 border border-gray-600 text-white font-medium rounded-lg hover:bg-gray-700 transition-colors duration-300 text-lg"
            >
              Все новости
            </Link>
          </div>
        )}
      </div>
    </section>
  );
};

export default NewsFeed;