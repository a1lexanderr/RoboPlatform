// src/pages/teams/TeamListPage.tsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { teamApi } from '../../api/teamApi'; 
import { TeamSummaryDTO } from '../../types';
import { PageHeader, Card, Button, Spinner} from '../../components/ui';
import { Users, Plus } from 'lucide-react';

const TeamListPage: React.FC = () => {
  const [teams, setTeams] = useState<TeamSummaryDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    teamApi.getMyTeams()
      .then(setTeams)
      .catch(err => {
        if (err instanceof Error) setError(err.message);
        else setError("Не удалось загрузить команды");
      })
      .finally(() => setLoading(false));
  }, []);

  const renderContent = () => {
    if (loading) {
      return <div className="flex justify-center p-8"><Spinner size="lg" /></div>;
    }
    if (error) {
      return <p className="text-center text-red-400">{error}</p>;
    }
    if (teams.length === 0) {
      return (
        <Card className="text-center">
          <p className="text-gray-400">У вас пока нет команд.</p>
          <p className="text-gray-500 mt-2">Создайте свою первую команду, чтобы начать!</p>
        </Card>
      );
    }
    return (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {teams.map(team => (
      <Card key={team.id} className="flex flex-col">
        <div className="flex-grow">
          {team.image && <img src={team.image} alt={team.name} className="w-full h-40 object-cover rounded-t-lg mb-4" />}
          <h3 className="text-xl font-bold text-white mb-2">{team.name}</h3>
          <p className="text-gray-400 text-sm line-clamp-3">{team.description}</p>
        </div>
        <div className="mt-4">
          <Link to={`/teams/${team.id}`}>
            <Button variant="secondary" className="w-full">Подробнее</Button>
          </Link>
        </div>
      </Card>
    ))}
  </div>
);
  };

  return (
    <div>
      <PageHeader
        title="Мои команды"
        icon={<Users className="h-6 w-6" />}
      >
        <Link to="/teams/create">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Создать команду
          </Button>
        </Link>
      </PageHeader>
      <div className="mt-8">
        {renderContent()}
      </div>
    </div>
  );
};

export default TeamListPage;