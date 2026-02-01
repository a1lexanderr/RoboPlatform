import React, { useEffect, useState } from "react";
import {
  Calendar,
  Users,
  MapPin,
  Clock,
  X,
  Edit,
  Trash2,
  UserCheck,
} from "lucide-react";
import { CompetitionDetailsDTO, User, TeamSummaryDTO, CompetitionStatus } from "@/types";

interface CompetitionModalProps {
  competition: (CompetitionDetailsDTO & {
    location?: string;
  }) | null;
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
  userTeams: (TeamSummaryDTO)[];
  onApply: (competitionId: number, teamId: number) => void;
  onSaveEdit?: (competitionId: number, updated: Partial<CompetitionDetailsDTO>) => void;
  onDelete?: (competitionId: number) => void;
}

export const CompetitionModal: React.FC<CompetitionModalProps> = ({
  competition,
  isOpen,
  onClose,
  user,
  userTeams,
  onApply,
  onSaveEdit,
  onDelete,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [showApplicationForm, setShowApplicationForm] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState("");
 const [editForm, setEditForm] = useState<{
  title: string;
  description: string;
  status: CompetitionStatus;
  startDate: string;
  endDate: string;
  location: string;
}>({
  title: '',
  description: '',
  status: 'DRAFT',
  startDate: '',
  endDate: '',
  location: '',
});

  const isAdmin = user?.roles?.includes("ADMIN") ?? false;
  const captainTeams = userTeams || [];
  const canApply = competition?.status === "OPEN" && captainTeams.length > 0;

 useEffect(() => {
  if (competition) {
    setEditForm({
      title: competition.title,
      description: competition.description,
      status: competition.status,
      startDate: competition.startDate,
      endDate: competition.endDate,
      location: competition.location || '',
    });
  }
}, [competition]);

  if (!isOpen || !competition) return null;

  const handleSave = () => {
  if (onSaveEdit) {
    onSaveEdit(competition.id, {
      title: editForm.title,
      description: editForm.description,
      status: editForm.status,
      startDate: editForm.startDate,
      endDate: editForm.endDate,
      location: editForm.location,
    });
  }
  setIsEditing(false);
};

  const handleDelete = async () => {
    if (!onDelete) {
        console.error("Функция onDelete не передана в компонент!");
        return;
    }

    if (confirm("Вы уверены, что хотите удалить это соревнование?")) {
      try {
        // Если родительская функция возвращает Promise, мы его ждем
        await onDelete(competition.id);
        onClose();
      } catch (e) {
        console.error(e);
      }
    }
  };

  const handleApplySubmit = () => {
    if (!selectedTeam) return;
    onApply(competition.id, parseInt(selectedTeam));
    setShowApplicationForm(false);
    setSelectedTeam("");
  };

  const getStatusColor = (status: string): string => {
    switch (status) {
      case "OPEN":
        return "text-green-400";
      case "DRAFT":
        return "text-gray-400";
      case "ONGOING":
        return "text-blue-400";
      case "CLOSED":
        return "text-red-400";
      case "FINISHED":
        return "text-purple-400";
      default:
        return "text-gray-400";
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-700">
        <div className="sticky top-0 bg-gray-800 border-b border-gray-700 p-6 flex justify-between items-center z-10">
          <h2 className="text-2xl font-bold text-white">
            {isEditing ? "Редактирование соревнования" : competition.title}
          </h2>
          <div className="flex items-center space-x-2">
            {isAdmin && !isEditing && (
              <>
                <button
                  onClick={() => setIsEditing(true)}
                  className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition"
                >
                  <Edit className="w-5 h-5" />
                </button>
                <button
                  onClick={handleDelete}
                  className="p-2 text-gray-400 hover:text-red-400 hover:bg-gray-700 rounded-lg transition"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </>
            )}
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="p-6">
          {isEditing ? (
            <div className="space-y-4">
              <input
                type="text"
                value={editForm.title}
                onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                placeholder="Название соревнования"
              />

              <textarea
                value={editForm.description}
                onChange={(e) =>
                  setEditForm({ ...editForm, description: e.target.value })
                }
                rows={4}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                placeholder="Описание"
              />

              <div className="grid grid-cols-2 gap-4">
                <select
  value={editForm.status}
  onChange={(e) =>
    setEditForm({
      ...editForm,
      status: e.target.value as CompetitionStatus,
    })
  }
  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
>
  <option value="DRAFT">Черновик</option>
  <option value="OPEN">Открыто</option>
  <option value="ONGOING">Идёт</option>
  <option value="CLOSED">Закрыто</option>
  <option value="FINISHED">Завершено</option>
</select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <input
                  type="date"
                  value={editForm.startDate}
                  onChange={(e) =>
                    setEditForm({ ...editForm, startDate: e.target.value })
                  }
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                />

                <input
                  type="date"
                  value={editForm.endDate}
                  onChange={(e) =>
                    setEditForm({ ...editForm, endDate: e.target.value })
                  }
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                />
              </div>

              <input
                type="text"
                value={editForm.location}
                onChange={(e) =>
                  setEditForm({ ...editForm, location: e.target.value })
                }
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                placeholder="Место проведения"
              />

              <div className="flex space-x-4 pt-4">
                <button
                  onClick={handleSave}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Сохранить
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                >
                  Отмена
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="mb-6">
                <img
                  src={
                    competition.image?.url ||
                    "https://via.placeholder.com/800x300/374151/ffffff?text=No+Image"
                  }
                  alt={competition.image?.title || competition.title}
                  className="w-full h-64 object-cover rounded-lg"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="bg-gray-700 p-4 rounded-lg">
                  <div className="flex items-center mb-2">
                    <Clock className="w-5 h-5 mr-2 text-blue-400" />
                    <span className="text-gray-300 font-medium">Статус</span>
                  </div>
                  <p className={`font-semibold ${getStatusColor(competition.status)}`}>
                    {competition.status === "OPEN"
                      ? "Открыто для регистрации"
                      : competition.status === "DRAFT"
                      ? "Черновик"
                      : competition.status === "ONGOING"
                      ? "В процессе"
                      : competition.status === "CLOSED"
                      ? "Регистрация закрыта"
                      : "Завершено"}
                  </p>
                </div>

                <div className="bg-gray-700 p-4 rounded-lg">
                  <div className="flex items-center mb-2">
                    <Calendar className="w-5 h-5 mr-2 text-green-400" />
                    <span className="text-gray-300 font-medium">Даты</span>
                  </div>
                  <p className="text-white">
                    {new Date(competition.startDate).toLocaleDateString("ru-RU")} –{" "}
                    {new Date(competition.endDate).toLocaleDateString("ru-RU")}
                  </p>
                </div>

                <div className="bg-gray-700 p-4 rounded-lg">
                  <div className="flex items-center mb-2">
                    <Users className="w-5 h-5 mr-2 text-purple-400" />
                    <span className="text-gray-300 font-medium">Участники</span>
                  </div>
                </div>
              </div>

              {competition.location && (
                <div className="bg-gray-700 p-4 rounded-lg mb-6">
                  <div className="flex items-center mb-2">
                    <MapPin className="w-5 h-5 mr-2 text-red-400" />
                    <span className="text-gray-300 font-medium">Место проведения</span>
                  </div>
                  <p className="text-white">{competition.location}</p>
                </div>
              )}

              <div className="mb-6">
                <h3 className="text-lg font-semibold text-white mb-3">Описание</h3>
                <div
                  className="prose prose-invert max-w-none text-gray-300"
                  dangerouslySetInnerHTML={{
                    __html: competition.description || "Описание отсутствует",
                  }}
                />
              </div>

              {canApply && !showApplicationForm && (
                <div className="border-t border-gray-700 pt-6">
                  <button
                    onClick={() => setShowApplicationForm(true)}
                    className="flex items-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <UserCheck className="w-5 h-5 mr-2" />
                    Подать заявку
                  </button>
                </div>
              )}

              {showApplicationForm && (
                <div className="border-t border-gray-700 pt-6">
                  <h3 className="text-lg font-semibold text-white mb-4">
                    Подача заявки
                  </h3>
                  <div className="bg-gray-700 p-4 rounded-lg">
                    <label className="block text-gray-300 mb-2">
                      Выберите команду:
                    </label>
                    <select
                      value={selectedTeam}
                      onChange={(e) => setSelectedTeam(e.target.value)}
                      className="w-full px-4 py-2 bg-gray-600 border border-gray-500 rounded-lg text-white mb-4"
                    >
                      <option value="">Выберите команду...</option>
                      {captainTeams.map((team) => (
                        <option key={team.id} value={team.id}>
                          {team.name} (Капитан)
                        </option>
                      ))}
                    </select>

                    <div className="flex space-x-4">
                      <button
                        onClick={handleApplySubmit}
                        disabled={!selectedTeam}
                        className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-500 disabled:cursor-not-allowed"
                      >
                        Подтвердить заявку
                      </button>
                      <button
                        onClick={() => setShowApplicationForm(false)}
                        className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                      >
                        Отмена
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
