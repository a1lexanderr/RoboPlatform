import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { TeamCreateDTO, TeamUpdateDTO } from '@/types';

export const TeamForm: React.FC = () => {
  const { teamId } = useParams<{ teamId: string }>();
  const isEdit = Boolean(teamId);
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);

  useEffect(() => {
    if (isEdit) {
      fetch(`/api/v1/teams/${teamId}`)
        .then(res => res.json())
        .then(data => { setName(data.name); setDescription(data.description); });
    }
  }, [teamId, isEdit]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isEdit) {
      fetch(`/api/v1/teams/${teamId}/details`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, description } as TeamUpdateDTO)
      }).then(() => navigate(`/teams/${teamId}`));
    } else {
      const form = new FormData();
      form.append('teamData', new Blob([JSON.stringify({ name, description } as TeamCreateDTO)], { type: 'application/json' }));
      if (imageFile) form.append('imageFile', imageFile);
      fetch('/api/v1/teams', { method: 'POST', body: form })
        .then(res => res.json())
        .then((data) => navigate(`/teams/${data.id}`));
    }
  };

  return (
    <div className="p-6 bg-gray-900 text-white min-h-screen">
      <h1 className="text-2xl font-bold mb-4">{isEdit ? 'Редактировать команду' : 'Создать команду'}</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input value={name} onChange={e => setName(e.target.value)} placeholder="Название" className="w-full px-3 py-2 bg-gray-800 rounded" required />
        <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Описание" rows={4} className="w-full px-3 py-2 bg-gray-800 rounded" />
        <div>
          <label className="block mb-1">Изображение</label>
          <input type="file" accept="image/*" onChange={e => setImageFile(e.target.files?.[0] || null)} />
        </div>
        <button type="submit" className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-700">Сохранить</button>
      </form>
    </div>
  );
};