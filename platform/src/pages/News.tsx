import React, { useState, useEffect } from "react";
import NewsFeed from "@/components/news/NewsFeed";
import { newsApi} from "@/api/newsApi"; 
import { NewsArticle } from "@/types";

const News: React.FC = () => {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const data = await newsApi.getAll();
        setArticles(data);
      } catch (error) {
        console.error("Ошибка при загрузке списка новостей:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh] text-gray-400 text-xl">
        Загрузка новостей...
      </div>
    );
  }

  return (
    <NewsFeed 
      articles={articles} 
      showAll={true} 
    />
  );
};

export default News;