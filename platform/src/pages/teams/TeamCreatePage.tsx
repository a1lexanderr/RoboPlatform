// src/pages/teams/TeamCreatePage.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { teamApi } from '../../api/teamApi'; 
import { TeamCreateDTO, TeamResponseDTO } from '../../types';
import { PageHeader } from '../../components/ui/PageHeader';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Textarea } from '../../components/ui/Textarea';
import { Button } from '../../components/ui/Button';
import { FileInput } from '../../components/ui/FileInput';
import { Users } from 'lucide-react';

const TeamCreatePage: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<TeamCreateDTO>({ name: '', description: '' });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const newTeam: TeamResponseDTO = await teamApi.create(formData, imageFile) as TeamResponseDTO;
      navigate(`/teams/${newTeam.id}`);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Произошла неизвестная ошибка');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
  <PageHeader title="Создание новой команды" icon={<Users className="h-6 w-6" />} backTo="/teams" />

  <Card className="mt-10 p-6">
    <form onSubmit={handleSubmit} className="space-y-8">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">Название команды</label>
        <Input id="name" name="name" type="text" required value={formData.name} onChange={handleChange} placeholder="Например, 'Робо-воины'" />
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-2">Описание</label>
        <Textarea id="description" name="description" rows={4} value={formData.description} onChange={handleChange} placeholder="Расскажите о вашей команде" />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Эмблема команды</label>
        <FileInput onFileSelect={setImageFile} />
      </div>

      {error && <p className="text-sm text-red-400">{error}</p>}

      <div className="flex justify-end mt-6">
        <Button type="submit" isLoading={loading}>
          Создать команду
        </Button>
      </div>
    </form>
  </Card>
</div>

  );
};

export default TeamCreatePage;