import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import Hero from "@/components/Hero";
import GallerySection from "@/components/gallery/GallerySection";
import NewsFeed from "@/components/news/NewsFeed";
import { imageApi } from "@/api/imageApi";
import { newsApi} from "@/api/newsApi";
import { NewsArticle } from '@/types';
import { ImageItem } from "@/types";

const Home: React.FC = () => {
    const navigate = useNavigate();
    const [galleryItems, setGalleryItems] = useState<ImageItem[]>([]);
    const [newsArticles, setNewsArticles] = useState<NewsArticle[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Загружаем галерею и новости параллельно
        const fetchData = async () => {
            try {
                const [galleryData, newsData] = await Promise.all([
                    imageApi.getGalleryImages(),
                    newsApi.getAll()
                ]);
                
                setGalleryItems(galleryData);
                setNewsArticles(newsData);
            } catch (error) {
                console.error("Ошибка загрузки данных для главной страницы:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center text-white">Загрузка главной страницы...</div>;
    }

    return (
        <>
            <Hero />
            <GallerySection
                title="Галерея соревнований"
                items={galleryItems}
                onShowAll={() => navigate('/gallery')}
            />
            <NewsFeed articles={newsArticles} showAll={false} />
        </>
    );
};

export default Home;