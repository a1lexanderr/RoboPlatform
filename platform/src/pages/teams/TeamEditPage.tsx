import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { apiTeams } from '../../api';
import { TeamUpdateDTO, TeamResponseDTO } from '../../types';
import { PageHeader, Card, Input, Textarea, Button, Spinner, FileInput } from '../../components/ui';
import { Users } from 'lucide-react';

const TeamEditPage: React.FC = () => {
  const { teamId } = useParams<{ teamId: string }>();
  const navigate = useNavigate();

  const [formData, setFormData] = useState<TeamUpdateDTO>({ name: '', description: '' });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [initialTeam, setInitialTeam] = useState<TeamResponseDTO | null>(null);
  
  const [loading, setLoading] = useState(true); // Изначально загружаем данные
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!teamId) {
      navigate('/teams');
      return;
    }
    apiTeams.getById(teamId)
      .then(team => {
        setInitialTeam(team);
        setFormData({ name: team.name, description: team.description || '' });
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [teamId, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!teamId) return;

    setSaving(true);
    setError(null);

    try {
      const promises = [];

      promises.push(apiTeams.updateDetails(teamId, formData));

      if (imageFile) {
        promises.push(apiTeams.updateImage(teamId, imageFile));
      }

      await Promise.all(promises);
      
      navigate(`/teams/${teamId}`);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Произошла неизвестная ошибка при сохранении');
      }
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center p-8"><Spinner size="lg" /></div>;
  }

  if (error && !initialTeam) {
    return <p className="text-center text-red-400">{error}</p>;
  }

  return (
    <div>
      <PageHeader title="Редактирование команды" icon={<Users />} backTo={`/teams/${teamId}`} />
      <Card className="mt-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">Название команды</label>
            <Input id="name" name="name" type="text" required value={formData.name} onChange={handleChange} />
          </div>
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-2">Описание</label>
            <Textarea id="description" name="description" rows={4} value={formData.description} onChange={handleChange} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Эмблема команды</label>
            <FileInput onFileSelect={setImageFile} initialFileName={initialTeam?.image?.title} />
            <p className="text-xs text-gray-400 mt-2">Выберите новый файл, чтобы заменить текущую эмблему.</p>
          </div>
          
          {error && <p className="text-sm text-red-400">{error}</p>}

          <div className="flex justify-end">
            <Button type="submit" isLoading={saving} variant="primary">
              Сохранить изменения
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default TeamEditPage;