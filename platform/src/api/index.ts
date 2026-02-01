import apiClient from "@/services/api";
import { TeamCreateDTO, TeamUpdateDTO, TeamMemberAddDTO, RobotDTO, TeamResponseDTO, TeamMemberResponseDTO, TeamSummaryDTO } from '../types';

const API_BASE_URL = 'http://localhost:8080/api/v1';


// Вспомогательная функция для обработки ответов
async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || `HTTP error! status: ${response.status}`);
  }
  // Обработка ответа без тела (например, для DELETE)
  if (response.status === 204) {
    return null as T;
  }
  return response.json();
}

// Вспомогательная функция для выполнения запросов
async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = localStorage.getItem('token');
  const headers = new Headers(options.headers || {});
  
  if (token) {
    headers.append('Authorization', `Bearer ${token}`);
  }

  if (!(options.body instanceof FormData)) {
    headers.append('Content-Type', 'application/json');
  }

  const config: RequestInit = {
    ...options,
    headers,
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
  return handleResponse<T>(response);
}

export const apiTeams = {
  getAll: async (page = 0, size = 10, search = '') =>
    (await apiClient.get(`/teams`, {
      params: { page, size, search },
    })).data,

  getMyTeams: async (): Promise<TeamSummaryDTO[]> =>
    (await apiClient.get('/teams/my-teams')).data,

  getById: async (teamId: string): Promise<TeamResponseDTO> =>
    (await apiClient.get(`/teams/${teamId}`)).data,

  create: async (data: TeamCreateDTO, imageFile?: File | null): Promise<TeamResponseDTO> => {
    const formData = new FormData();
    formData.append('teamData', new Blob([JSON.stringify(data)], { type: 'application/json' }));
    if (imageFile) {
      formData.append('imageFile', imageFile);
    }

    const response = await apiClient.post('/teams', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  updateDetails: async (teamId: string, data: TeamUpdateDTO): Promise<TeamResponseDTO> =>
    (await apiClient.put(`/teams/${teamId}/details`, data)).data,

  updateImage: async (teamId: string, imageFile: File): Promise<TeamResponseDTO> => {
    const formData = new FormData();
    formData.append('imageFile', imageFile);
    const response = await apiClient.put(`/teams/${teamId}/image`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  delete: async (teamId: string): Promise<void> => {
    await apiClient.delete(`/teams/${teamId}`);
  },

  getMembers: async (teamId: string): Promise<TeamMemberResponseDTO[]> =>
    (await apiClient.get(`/teams/${teamId}/members`)).data,

  addMember: async (teamId: string, data: TeamMemberAddDTO): Promise<TeamMemberResponseDTO> =>
    (await apiClient.post(`/teams/${teamId}/members`, data)).data,

  removeMember: async (teamId: string, userId: number): Promise<void> =>
    await apiClient.delete(`/teams/${teamId}/members/${userId}`),
};

export const apiRobots = {
  getForTeam: (teamId: string) => request(`/teams/${teamId}/robot`),

  createForTeam: (teamId: string, data: RobotDTO, imageFile?: File | null) => {
    const formData = new FormData();
    formData.append('robotData', new Blob([JSON.stringify(data)], { type: 'application/json' }));
    if (imageFile) {
      formData.append('robotImageFile', imageFile);
    }
    return request(`/teams/${teamId}/robot`, { method: 'POST', body: formData });
  },
  
  updateForTeam: (teamId: string, data: RobotDTO, imageFile?: File | null) => {
    const formData = new FormData();
    formData.append('robotData', new Blob([JSON.stringify(data)], { type: 'application/json' }));
    if (imageFile) {
      formData.append('robotImageFile', imageFile);
    }
    return request(`/teams/${teamId}/robot`, { method: 'PUT', body: formData });
  },

  deleteForTeam: (teamId: string) => request(`/teams/${teamId}/robot`, { method: 'DELETE' }),
};

