import React from "react";
import { Calendar, Users, MapPin } from "lucide-react";
import { CompetitionSummaryDTO } from "@/types";

interface CompetitionCardProps {
  competition: CompetitionSummaryDTO;
  onClick?: (competition: CompetitionSummaryDTO) => void;
}

const CompetitionCard: React.FC<CompetitionCardProps> = ({ competition, onClick }) => {
  const getStatusColor = (status: string): string => {
    switch (status) {
      case "OPEN":
        return "bg-green-500";
      case "DRAFT":
        return "bg-gray-500";
      case "ONGOING":
        return "bg-blue-500";
      case "CLOSED":
        return "bg-red-500";
      case "FINISHED":
        return "bg-purple-500";
      default:
        return "bg-gray-600";
    }
  };

  const getStatusText = (status: string): string => {
    switch (status) {
      case "OPEN":
        return "Открыто";
      case "DRAFT":
        return "Черновик";
      case "ONGOING":
        return "Идёт";
      case "CLOSED":
        return "Закрыто";
      case "FINISHED":
        return "Завершено";
      default:
        return status;
    }
  };

  return (
    <div
      onClick={() => onClick?.(competition)}
      className="group bg-gray-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer hover:scale-[1.02] border border-gray-700"
    >
      <div className="relative">
        <img
          src={
            competition.image ||
            "https://via.placeholder.com/400x200/374151/ffffff?text=No+Image"
          }
          className="w-full h-48 object-cover group-hover:opacity-90 transition-opacity"
        />

        <div
          className={`absolute top-4 left-4 px-3 py-1 rounded-full text-white text-sm font-medium ${getStatusColor(
            competition.status
          )}`}
        >
          {getStatusText(competition.status)}
        </div>
      </div>

      <div className="p-6 flex flex-col justify-between h-[220px]">
        <div>
          <h3 className="text-xl font-semibold text-white mb-3 line-clamp-2">
            {competition.title}
          </h3>

          <div className="space-y-2 text-gray-300 text-sm">
            <div className="flex items-center">
              <Calendar className="w-4 h-4 mr-2" />
              <span>
                {new Date(competition.startDate).toLocaleDateString("ru-RU")} –{" "}
                {new Date(competition.endDate).toLocaleDateString("ru-RU")}
              </span>
            </div>

            {"location" in competition && (competition as any).location && (
              <div className="flex items-center">
                <MapPin className="w-4 h-4 mr-2" />
                <span>{(competition as any).location}</span>
              </div>
            )}

            {"currentTeams" in competition && (
              <div className="flex items-center">
                <Users className="w-4 h-4 mr-2" />
                <span>
                  {(competition as any).currentTeams ?? 0} /{" "}
                  {(competition as any).maxTeams ?? "∞"} команд
                </span>
              </div>
            )}
          </div>
        </div>

        {competition.description && (
          <p className="text-gray-400 text-sm mt-4 line-clamp-3">
            {competition.description}
          </p>
        )}
      </div>
    </div>
  );
};

export default CompetitionCard;
