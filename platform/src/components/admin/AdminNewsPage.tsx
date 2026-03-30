import React, { useState, useEffect } from "react";
import { newsApi} from "../../api/newsApi";
import { NewsArticle } from "@/types";

const AdminNewsPage: React.FC = () => {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);

  // Состояние формы
  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const fetchNews = async () => {
    try {
      const data = await newsApi.getAll();
      setArticles(data);
    } catch (error) {
      console.error("Ошибка загрузки новостей", error);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  const resetForm = () => {
    setEditingId(null);
    setTitle("");
    setExcerpt("");
    setContent("");
    setFile(null);
  };

  const handleEditClick = (article: NewsArticle) => {
    setEditingId(article.id);
    setTitle(article.title);
    setExcerpt(article.excerpt);
    setContent(article.content);
    setFile(null); // Картинку нужно будет загружать заново при желании изменить
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", title);
    formData.append("excerpt", excerpt);
    formData.append("content", content);
    if (file) formData.append("image", file);

    try {
      if (editingId) {
        await newsApi.update(editingId, formData);
      } else {
        await newsApi.create(formData);
      }
      resetForm();
      fetchNews();
    } catch (error) {
      console.error("Ошибка при сохранении новости", error);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Точно удалить новость?")) return;
    try {
      await newsApi.delete(id);
      setArticles(articles.filter((a) => a.id !== id));
    } catch (error) {
      console.error("Ошибка удаления", error);
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Управление Новостями</h1>
      
      {/* Форма */}
      <form onSubmit={handleSubmit} className="bg-gray-800 p-6 rounded-lg mb-8 flex flex-col gap-4 border border-gray-700">
        <h2 className="text-xl font-semibold mb-2">{editingId ? "Редактировать новость" : "Добавить новость"}</h2>
        
        <input 
          type="text" placeholder="Заголовок" required
          value={title} onChange={(e) => setTitle(e.target.value)} 
          className="bg-gray-700 text-white p-3 rounded w-full border border-gray-600 focus:outline-none focus:border-blue-500"
        />
        
        <textarea 
          placeholder="Краткое описание (для карточки)" required rows={2}
          value={excerpt} onChange={(e) => setExcerpt(e.target.value)} 
          className="bg-gray-700 text-white p-3 rounded w-full border border-gray-600 focus:outline-none focus:border-blue-500"
        />

        <textarea 
          placeholder="Полный текст новости" required rows={6}
          value={content} onChange={(e) => setContent(e.target.value)} 
          className="bg-gray-700 text-white p-3 rounded w-full border border-gray-600 focus:outline-none focus:border-blue-500"
        />

        <div>
          <label className="block text-sm mb-2 text-gray-400">Обложка новости</label>
          <input 
            type="file" accept="image/*"
            onChange={(e) => setFile(e.target.files?.[0] || null)} 
            className="text-gray-300"
          />
        </div>

        <div className="flex gap-4 mt-2">
          <button type="submit" className="bg-blue-600 px-6 py-2 rounded font-medium hover:bg-blue-700 transition-colors">
            {editingId ? "Сохранить изменения" : "Опубликовать"}
          </button>
          {editingId && (
            <button type="button" onClick={resetForm} className="bg-gray-600 px-6 py-2 rounded font-medium hover:bg-gray-500 transition-colors">
              Отмена
            </button>
          )}
        </div>
      </form>

      {/* Список новостей */}
      <div className="space-y-4">
        {articles.map((article) => (
          <div key={article.id} className="bg-gray-800 p-4 rounded-lg flex justify-between items-center border border-gray-700">
            <div>
              <h3 className="text-lg font-bold">{article.title}</h3>
              <p className="text-sm text-gray-400">{new Date(article.createdAt).toLocaleDateString('ru-RU')}</p>
            </div>
            <div className="flex gap-3">
              <button onClick={() => handleEditClick(article)} className="bg-yellow-600 px-4 py-2 rounded hover:bg-yellow-700 text-sm">
                Ред.
              </button>
              <button onClick={() => handleDelete(article.id)} className="bg-red-600 px-4 py-2 rounded hover:bg-red-700 text-sm">
                Удалить
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminNewsPage;