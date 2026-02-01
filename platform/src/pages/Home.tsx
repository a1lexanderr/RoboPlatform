import GallerySection from "@/components/gallery/GallerySection";
import { useNavigate } from "react-router-dom";
import mouseImage from "../assets/images/mouse.svg";
import Hero from "@/components/Hero";
import NewsFeed from "@/components/news/NewsFeed";

const galleryItems = [
    { id: 1, title: 'Соревнование 1', image: mouseImage },
    { id: 2, title: 'Соревнование 2', image: mouseImage },
    { id: 3, title: 'Соревнование 3', image: mouseImage },
    { id: 4, title: 'Соревнование 4', image: mouseImage },
]

const newsArticles = [
    {
        id: 1,
        title: 'Итоги чемпионата по плаванию 2023',
        excerpt: 'Прошедший чемпионат по плаванию 2023 года стал одним из самых захватывающих за последнее десятилетие. Новые рекорды и неожиданные победы...',
        image: '/placeholder.svg?height=200&width=300',
        date: '2023-08-15',
    },
    {
        id: 2,
        title: 'Анонс соревнований по легкой атлетике',
        excerpt: 'Готовьтесь к грандиозному событию! Уже через месяц стартуют международные соревнования по легкой атлетике. Ожидается участие спортсменов из более чем 50 стран...',
        image: '/placeholder.svg?height=200&width=300',
        date: '2023-09-01',
    },
]

const Home: React.FC = () => {

    const navigate = useNavigate();

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