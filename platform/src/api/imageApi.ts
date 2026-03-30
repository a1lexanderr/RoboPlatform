import apiClient from "@/services/api";
import { ImageItem } from "@/types";

export const imageApi = {
  // Получение всех картинок
  getGalleryImages: async (): Promise<ImageItem[]> => {
    const res = await apiClient.get("/gallery");
    return res.data;
  },

  // Загрузка
  upload: async (file: File, title: string): Promise<ImageItem> => {
    const formData = new FormData();
    formData.append("file", file);
    if (title) formData.append("title", title);

    const res = await apiClient.post("/gallery/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
  },

  // Удаление
  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/gallery/${id}`);
  }
};