import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { TeamMemberResponseDTO } from '@/types';

export const TeamMembers: React.FC = () => {
  const { teamId } = useParams<{ teamId: string }>();
  const [members, setMembers] = useState<TeamMemberResponseDTO[]>([]);
  const [newMemberUsername, setNewMemberUsername] = useState('');

  useEffect(() => {
    fetch(`/api/v1/teams/${teamId}/members`)
      .then(res => res.json())
      .then(setMembers);
  }, [teamId]);

  const handleAdd = () => {
    fetch(`/api/v1/teams/${teamId}/members`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: newMemberUsername })
    }).then(res => res.json()).then(member => setMembers([...members, member]));
  };

  const handleRemove = (userId: number) => {
    fetch(`/api/v1/teams/${teamId}/members/${userId}`, { method: 'DELETE' })
      .then(() => setMembers(m => m.filter(x => x.userId !== userId)));
  };

  return (
    <div className="p-6 bg-gray-900 text-white min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Участники команды</h1>
      <ul className="space-y-2 mb-4">
        {members.map(m => (
          <li key={m.userId} className="flex justify-between bg-gray-800 p-2 rounded">
            <span>{m.username} )</span>
            <button onClick={() => handleRemove(m.userId)} className="text-red-500">Удалить</button>
          </li>
        ))}
      </ul>
      <div className="flex gap-2">
        <input value={newMemberUsername} onChange={e => setNewMemberUsername(e.target.value)} placeholder="Новый участник" className="px-3 py-2 bg-gray-800 rounded flex-1" />
        <button onClick={handleAdd} className="bg-green-600 px-4 py-2 rounded hover:bg-green-700">Добавить</button>
      </div>
    </div>
  );
};