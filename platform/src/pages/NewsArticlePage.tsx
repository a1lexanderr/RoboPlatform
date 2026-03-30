import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { newsApi } from "@/api/newsApi";
import { NewsArticle } from "@/types";

const NewsArticlePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [article, setArticle] = useState<NewsArticle | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticle = async () => {
      if (!id) return;
      try {
        const data = await newsApi.getById(id);
        setArticle(data);
      } catch (error) {
        console.error("Ошибка загрузки новости:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchArticle();
  }, [id]);

  if (loading) return <div className="text-center py-20 text-white">Загрузка...</div>;
  if (!article) return <div className="text-center py-20 text-white">Новость не найдена</div>;

  return (
    <div className="max-w-[800px] mx-auto py-12 px-4 text-white">
      <Link to="/news" className="text-blue-500 hover:text-blue-400 mb-6 inline-block">
        &larr; Назад к новостям
      </Link>
      <h1 className="text-4xl font-bold mb-4">{article.title}</h1>
      <p className="text-gray-400 mb-8">{new Date(article.createdAt).toLocaleDateString('ru-RU')}</p>
      
      {article.imageUrl && (
        <img src={article.imageUrl} alt={article.title} className="w-full h-auto max-h-[500px] object-cover rounded-xl mb-8" />
      )}
      
      {/* Полный текст (пресохраняем переносы строк с помощью whitespace-pre-wrap) */}
      <div className="text-lg leading-relaxed text-gray-200 whitespace-pre-wrap">
        {article.content}
      </div>
    </div>
  );
};

export default NewsArticlePage;