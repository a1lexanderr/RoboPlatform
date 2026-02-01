import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Trash2, Edit } from 'lucide-react';
import { competitionApi } from '@/api/competitionApi';
import { CompetitionDetailsDTO } from '@/types';

export const CompetitionDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [competition, setCompetition] = useState<CompetitionDetailsDTO | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadCompetition = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const data = await competitionApi.get(id);
        setCompetition(data);
      } finally {
        setLoading(false);
      }
    };
    loadCompetition();
  }, [id]);

  const handleDelete = async () => {
    if (!id) return;
    if (confirm('Удалить соревнование?')) {
      await competitionApi.delete(id);
      navigate('/competitions');
    }
  };

  if (loading || !competition) return <p>Загрузка...</p>;

  return (
    <div className="p-6 bg-gray-900 text-white min-h-screen">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">{competition.title}</h1>
        <div className="space-x-2">
          <Link
            to={`/competitions/${competition.id}/edit`}
            className="px-3 py-1 bg-yellow-600 rounded hover:bg-yellow-700"
          >
            <Edit className="inline-block mr-1" /> Редактировать
          </Link>
          <button
            onClick={handleDelete}
            className="px-3 py-1 bg-red-600 rounded hover:bg-red-700"
          >
            <Trash2 className="inline-block mr-1" /> Удалить
          </button>
        </div>
      </div>

      {competition.image && (
  <div className="mb-4 w-full h-64 overflow-hidden rounded-lg">
    <img
      src={competition.image.url}
      alt={competition.image.title || 'competition image'}
      className="w-full h-full object-cover"
    />
  </div>
)}

      <p className="mb-2"><strong>Статус:</strong> {competition.status}</p>
      <p className="mb-2"><strong>Начало:</strong> {competition.startDate}</p>
      <p className="mb-4"><strong>Конец:</strong> {competition.endDate}</p>

      <div
        className="prose prose-invert"
        dangerouslySetInnerHTML={{ __html: competition.description }}
      />
    </div>
  );
};
