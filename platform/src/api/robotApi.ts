import apiClient from "@/services/api";
import { RobotDTO, RobotResponseDTO } from '../types';

export const apiRobots = {
  async getByTeam(teamId: string): Promise<RobotResponseDTO> {
    const { data } = await apiClient.get(`/teams/${teamId}/robot`);
    return data;
  },

  async create(teamId: string, robotData: RobotDTO, imageFile?: File): Promise<RobotResponseDTO> {
    const formData = new FormData();
    formData.append('robotData', new Blob([JSON.stringify(robotData)], { type: 'application/json' }));
    if (imageFile) formData.append('robotImageFile', imageFile);
    const { data } = await apiClient.post(`/teams/${teamId}/robot`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data;
  },

  async update(teamId: string, robotData: RobotDTO, imageFile?: File): Promise<RobotResponseDTO> {
    const formData = new FormData();
    formData.append('robotData', new Blob([JSON.stringify(robotData)], { type: 'application/json' }));
    if (imageFile) formData.append('robotImageFile', imageFile);
    const { data } = await apiClient.put(`/teams/${teamId}/robot`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data;
  },

  async delete(teamId: string): Promise<void> {
    await apiClient.delete(`/teams/${teamId}/robot`);
  },
};
