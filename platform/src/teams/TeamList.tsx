import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { TeamSummaryDTO } from '@/types';

export const TeamList: React.FC = () => {
  const [teams, setTeams] = useState<TeamSummaryDTO[]>([]);

  useEffect(() => {
    fetch('/api/v1/teams')
      .then(res => res.json())
      .then(setTeams);
  }, []);

  return (
    <div className="p-6 bg-gray-900 text-white min-h-screen">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Команды</h1>
        <Link to="/teams/new" className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-700">Создать команду</Link>
      </div>
      <ul className="space-y-4">
        {teams.map(t => (
          <li key={t.id} className="bg-gray-800 p-4 rounded flex justify-between">
            <Link to={`/teams/${t.id}`} className="font-medium hover:underline">{t.name}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
};