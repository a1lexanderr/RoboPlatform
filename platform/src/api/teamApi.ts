import apiClient from "@/services/api";
import {
  TeamCreateDTO,
  TeamUpdateDTO,
  TeamMemberAddDTO,
  RobotDTO,
  TeamResponseDTO,
  TeamMemberResponseDTO,
  TeamSummaryDTO,
  RobotResponseDTO
} from "@/types";

export const teamApi = {
  list: async (page = 0, size = 10, search = ""): Promise<TeamSummaryDTO[]> =>
    (await apiClient.get(`/teams`, { params: { page, size, search } })).data,

  get: async (id: string): Promise<TeamResponseDTO> =>
    (await apiClient.get(`/teams/${id}`)).data,

  getMyTeams: async (): Promise<TeamSummaryDTO[]> =>
    (await apiClient.get('/teams/my-teams')).data,

  getCaptainTeams: async (): Promise<TeamSummaryDTO[]> =>
  (await apiClient.get("/teams/captain/my-teams")).data,


  create: async (data: TeamCreateDTO, imageFile?: File | null): Promise<TeamResponseDTO> => {
    const formData = new FormData();
    formData.append("teamData", new Blob([JSON.stringify(data)], { type: "application/json" }));
    if (imageFile) formData.append("imageFile", imageFile);
    return (await apiClient.post(`/teams`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    })).data;
  },

  update: async (id: string, data: TeamUpdateDTO): Promise<TeamResponseDTO> =>
    (await apiClient.put(`/teams/${id}/details`, data)).data,

  delete: async (id: string): Promise<void> =>
    await apiClient.delete(`/teams/${id}`),

  members: {
    list: async (teamId: string): Promise<TeamMemberResponseDTO[]> =>
      (await apiClient.get(`/teams/${teamId}/members`)).data,

    add: async (teamId: string, data: TeamMemberAddDTO): Promise<TeamMemberResponseDTO> =>
      (await apiClient.post(`/teams/${teamId}/members`, data)).data,

    remove: async (teamId: string, userId: number): Promise<void> =>
      await apiClient.delete(`/teams/${teamId}/members/${userId}`),
  },

robot: {
  list: async (teamId: string): Promise<RobotResponseDTO[]> =>
    (await apiClient.get(`/teams/${teamId}/robots`)).data,

  get: async (teamId: string, robotId: string): Promise<RobotResponseDTO> =>
    (await apiClient.get(`/teams/${teamId}/robots/${robotId}`)).data,

  create: async (teamId: string, data: RobotDTO, imageFile?: File | null) => {
    const formData = new FormData();
    formData.append("robotData", new Blob([JSON.stringify(data)], { type: "application/json" }));
    if (imageFile) formData.append("robotImageFile", imageFile);
    return (await apiClient.post(`/teams/${teamId}/robots`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    })).data;
  },

  update: async (teamId: string, robotId: string, data: RobotDTO, imageFile?: File | null) => {
    const formData = new FormData();
    formData.append("robotData", new Blob([JSON.stringify(data)], { type: "application/json" }));
    if (imageFile) formData.append("robotImageFile", imageFile);
    return (await apiClient.put(`/teams/${teamId}/robots/${robotId}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    })).data;
  },

  delete: async (teamId: string, robotId: string): Promise<void> =>
    await apiClient.delete(`/teams/${teamId}/robots/${robotId}`),

  getCurrent: async (teamId: string): Promise<RobotResponseDTO> =>
    (await apiClient.get(`/teams/${teamId}/robots/current`)).data,

  setCurrent: async (teamId: string, robotId: string): Promise<RobotResponseDTO> =>
    (await apiClient.post(`/teams/${teamId}/robots/current/${robotId}`)).data,
},
};
