import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { TeamResponseDTO } from '@/types';

export const TeamDetails: React.FC = () => {
  const { teamId } = useParams<{ teamId: string }>();
  const navigate = useNavigate();
  const [team, setTeam] = useState<TeamResponseDTO | null>(null);

  useEffect(() => {
    fetch(`/api/v1/teams/${teamId}`)
      .then(res => res.json())
      .then(setTeam);
  }, [teamId]);

  if (!team) return <p>Загрузка команды...</p>;

  const handleDelete = () => {
    if (confirm('Удалить команду?')) {
      fetch(`/api/v1/teams/${teamId}`, { method: 'DELETE' })
        .then(() => navigate('/teams'));
    }
  };

  return (
    <div className="p-6 bg-gray-900 text-white min-h-screen">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">{team.name}</h1>
        <div className="space-x-2">
          <Link to={`/teams/${teamId}/edit`} className="px-3 py-1 bg-yellow-600 rounded hover:bg-yellow-700">Редактировать</Link>
          <button onClick={handleDelete} className="px-3 py-1 bg-red-600 rounded hover:bg-red-700">Удалить</button>
        </div>
      </div>
      {team.image && <img src={team.image.url} alt={team.image.title} className="mb-4 max-h-64 rounded" />}
      <p className="mb-4">{team.description}</p>
      <Link to={`/teams/${teamId}/members`} className="text-blue-400 hover:underline mb-4 block">Управление участниками</Link>
      <Link to={`/teams/${teamId}/robot`} className="text-blue-400 hover:underline">Просмотр/Редактирование робота</Link>
    </div>
  );
};