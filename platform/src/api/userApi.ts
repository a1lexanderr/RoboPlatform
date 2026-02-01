import apiClient from "@/services/api";
import { User, UserSummaryDTO } from "../types";

export const userApi = {
  async getMyProfile(): Promise<User> {
    const response = await apiClient.get<User>("/users/me");
    return response.data;
  },

  async getUserByUsername(username: string): Promise<User> {
    const response = await apiClient.get<User>(`/users/${username}`);
    return response.data;
  },

  async updateProfile(data: Partial<User>): Promise<User> {
    const response = await apiClient.put<User>("/users/me", data);
    return response.data;
  },

  async searchUsers(query: string): Promise<UserSummaryDTO[]> {
    const response = await apiClient.get<UserSummaryDTO[]>(`/users/search`, {
      params: { q: query }
    });
    return response.data;
  },
};