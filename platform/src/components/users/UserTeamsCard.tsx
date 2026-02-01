import React from "react";
import { Link } from "react-router-dom";
import { TeamSummaryDTO } from "@/types";
import { Users } from "lucide-react";

interface UserTeamsCardProps {
  teams: TeamSummaryDTO[];
}

const UserTeamsCard: React.FC<UserTeamsCardProps> = ({ teams }) => {
  if (teams.length === 0) {
    return (
      <div className="bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-700 text-center">
        <Users className="mx-auto h-12 w-12 text-gray-500 mb-4" />
        <h3 className="text-lg font-medium text-gray-300 mb-2">Нет команд</h3>
        <p className="text-gray-500">Присоединитесь к команде или создайте свою!</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-700">
      <h3 className="text-xl font-semibold text-white mb-4">Мои команды</h3>
      <ul className="space-y-3">
        {teams.map(team => (
          <li key={team.id} className="flex items-center justify-between">
            <span className="text-gray-300">{team.name}</span>
            <Link
              to={`/teams/${team.id}`}
              className="text-blue-500 hover:text-blue-400 text-sm"
            >
              Подробнее
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserTeamsCard;
