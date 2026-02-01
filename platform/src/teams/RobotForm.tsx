import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { RobotDTO, RobotResponseDTO } from '@/types';

export const RobotForm: React.FC = () => {
  const { teamId } = useParams<{ teamId: string }>();
  const isEdit = false; // decide by fetching existing
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);

  useEffect(() => {
    // could fetch existing robot: setName, description
  }, [teamId]);

  const submit = () => {
    const form = new FormData();
    form.append('robotData', new Blob([JSON.stringify({ name, description } as RobotDTO)], { type: 'application/json' }));
    if (imageFile) form.append('robotImageFile', imageFile);
    fetch(`/api/v1/teams/${teamId}/robot`, { method: isEdit ? 'PUT' : 'POST', body: form })
      .then(res => res.json())
      .then((robot: RobotResponseDTO) => navigate(`/robots/${robot.id}`));
  };

  return (
    <div className="p-6 bg-gray-900 text-white min-h-screen">
      <h1 className="text-2xl font-bold mb-4">{isEdit ? 'Редактировать' : 'Создать'} робота</h1>
      <input value={name} onChange={e => setName(e.target.value)} placeholder="Имя" className="w-full px-3 py-2 bg-gray-800 rounded mb-2" />
      <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Описание" rows={4} className="w-full px-3 py-2 bg-gray-800 rounded mb-2" />
      <div className="mb-4">
        <label className="block mb-1">Изображение робота</label>
        <input type="file" accept="image/*" onChange={e => setImageFile(e.target.files?.[0] || null)} />
      </div>
      <button onClick={submit} className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-700">Сохранить</button>
    </div>
  );
};