import  apiClient from "@/services/api";

export const getImageUrl = (url: string): string => {
  if (!url) return "";

  if (url.startsWith("http://") || url.startsWith("https://")) {
    return url;
  }

  return `${apiClient.defaults.baseURL?.replace(/\/$/, "")}/files/${url}`;
};