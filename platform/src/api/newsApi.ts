import apiClient from "@/services/api";
import { NewsArticle } from "@/types";

export const newsApi = {
  getAll: async (): Promise<NewsArticle[]> => {
    const res = await apiClient.get("/news");
    return res.data;
  },
  
  getById: async (id: string | number): Promise<NewsArticle> => {
    const res = await apiClient.get(`/news/${id}`);
    return res.data;
  },

  create: async (formData: FormData): Promise<NewsArticle> => {
    const res = await apiClient.post("/news", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
  },

  update: async (id: number, formData: FormData): Promise<NewsArticle> => {
    const res = await apiClient.put(`/news/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
  },

  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/news/${id}`);
  }
};