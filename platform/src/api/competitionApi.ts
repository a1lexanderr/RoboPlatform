import apiClient from "@/services/api";
import { CompetitionDetailsDTO, CompetitionSummaryDTO } from "@/types";

export const competitionApi = {
  list: async (): Promise<CompetitionSummaryDTO[]> => {
    const res = await apiClient.get("/competitions");
    return res.data;
  },

  get: async (id: string): Promise<CompetitionDetailsDTO> => {
    const res = await apiClient.get(`/competitions/${id}`);
    return res.data;
  },

  create: async (data: FormData): Promise<CompetitionDetailsDTO> => {
  const res = await apiClient.post("/competitions", data);
  return res.data;
},

  update: async (id: string, data: FormData): Promise<CompetitionDetailsDTO> => {
  const res = await apiClient.put(`/competitions/${id}`, data, {
    headers: { 
    },
  });
  return res.data;
},

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/competitions/${id}`);
  },

  quickapply: async (competitionId: number, teamId: number): Promise<void> => {
  await apiClient.post(`/applications/quick?competitionId=${competitionId}&teamId=${teamId}`);
}

};
