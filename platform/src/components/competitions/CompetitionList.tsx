import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Users } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { competitionApi } from "@/api/competitionApi";
import { teamApi } from "@/api/teamApi";

import CompetitionCard from "./CompetitionCard";
import { CompetitionModal } from "./CompetitionModal";
import { CompetitionDetailsDTO, TeamSummaryDTO, User, CompetitionSummaryDTO } from "@/types";

type ExtendedCompetition = CompetitionDetailsDTO & {
  location?: string;
};

const CompetitionList: React.FC = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const [competitions, setCompetitions] = useState<CompetitionSummaryDTO[]>([]);
  const [selectedCompetition, setSelectedCompetition] = useState<ExtendedCompetition | null>(null);
  const [userTeams, setUserTeams] = useState<(TeamSummaryDTO)[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCompetitions = async () => {
      try {
        const response = await competitionApi.list();
        setCompetitions(response);
      } catch (err) {
        console.error("Ошибка при загрузке соревнований:", err);
        setError("Не удалось загрузить соревнования");
      } finally {
        setLoading(false);
      }
    };
    fetchCompetitions();
  }, []);

  useEffect(() => {
    if (!isAuthenticated) return;
    const fetchTeams = async () => {
      try {
        const response = await teamApi.getCaptainTeams();
        setUserTeams(response);
      } catch (err) {
        console.error("Ошибка при загрузке команд:", err);
      }
    };
    fetchTeams();
  }, [isAuthenticated]);

  const handleCompetitionClick = async (competition: CompetitionSummaryDTO) => {
    try {
      const details = await competitionApi.get(String(competition.id));
      setSelectedCompetition(details);
      setIsModalOpen(true);
    } catch (err) {
      console.error("Ошибка при загрузке деталей соревнования:", err);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedCompetition(null);
  };

  const handleApply = async (competitionId: number, teamId: number) => {
    try {
      await competitionApi.quickapply(competitionId, teamId);
      alert("✅ Заявка успешно подана!");
      handleCloseModal();
    } catch (err) {
      console.error("Ошибка при подаче заявки:", err);
      alert("❌ Ошибка при подаче заявки");
    }
  };

  const handleCreateCompetition = () => {
    navigate("/account/competitions/new");
  };

  const handleSaveEdit = async (competitionId: number, updatedData: Partial<CompetitionDetailsDTO>) => {
    try {
      const formData = new FormData();

      const updateData = {
        title: updatedData.title,
        description: updatedData.description,
        location: updatedData.location,
        status: updatedData.status,
        startDate: updatedData.startDate,
        endDate: updatedData.endDate
      };

      if (!updateData.title || !updateData.description || !updateData.location ||
        !updateData.status || !updateData.startDate || !updateData.endDate) {
        alert("❌ Все поля должны быть заполнены");
        return;
      }

      console.log("Отправляемые данные:", updateData);

      formData.append(
        "competitionData",
        new Blob([JSON.stringify(updateData)], { type: "application/json" })
      );

      await competitionApi.update(String(competitionId), formData);
      alert("✅ Соревнование успешно обновлено!");

      const response = await competitionApi.list();
      setCompetitions(response);

    } catch (err) {
      console.error("Ошибка при обновлении соревнования:", err);
      alert("❌ Не удалось обновить соревнование");
    }
  };

  const handleDelete = async (competitionId: number) => {
    try {
      await competitionApi.delete(String(competitionId));
      setCompetitions((prev) => prev.filter((c) => c.id !== competitionId));
      handleCloseModal();
      alert("✅ Соревнование успешно удалено!");

    } catch (err) {
      console.error("Ошибка при удалении соревнования:", err);
      alert("❌ Не удалось удалить соревнование");
    }
  };

  if (loading) {
    return (
      <div className="p-6 bg-gray-900 text-white min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-gray-900 text-white min-h-screen">
        <p className="text-red-500 text-center">{error}</p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-900 text-white min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Соревнования</h1>
          <p className="text-gray-400">Найдите и примите участие в интересных соревнованиях</p>
        </div>
        {user?.roles.includes("ADMIN") && (
          <button
            onClick={handleCreateCompetition}
            className="flex items-center bg-blue-600 px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Users className="mr-2" />
            Создать соревнование
          </button>
        )}
      </div>

      {competitions.length === 0 ? (
        <div className="text-center py-12">
          <Users className="w-16 h-16 mx-auto text-gray-600 mb-4" />
          <p className="text-gray-400 text-lg">Пока нет доступных соревнований</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {competitions.map((competition) => (
            <CompetitionCard
              key={competition.id}
              competition={competition}
              onClick={handleCompetitionClick}
            />
          ))}
        </div>
      )}

      <CompetitionModal
        competition={selectedCompetition}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        user={user as User}
        userTeams={userTeams}
        onApply={handleApply}
        onSaveEdit={handleSaveEdit}
        onDelete={handleDelete}
      />

    </div>
  );
};

export default CompetitionList;
