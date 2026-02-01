
import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { teamApi } from '../../api/teamApi'; 
import { TeamResponseDTO } from '../../types';
import { PageHeader, Card, Button, Modal, Spinner } from '../../components/ui';
import { Users, Edit, Trash2 } from 'lucide-react';
import { MemberManager } from '../../components/teams/MemberManager'; 
import { RobotManager } from '../../components/robots/RobotManager'; 

const TeamDetailsPage: React.FC = () => {
  const { teamId } = useParams<{ teamId: string }>();
  const navigate = useNavigate();
  const [team, setTeam] = useState<TeamResponseDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);

  useEffect(() => {
    if (!teamId) return;
    setLoading(true);
    teamApi.get(teamId)
      .then(setTeam)
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [teamId]);

  const handleDelete = async () => {
    try {
      await teamApi.delete(teamId!);
      setDeleteModalOpen(false);
      navigate('/teams');
    } catch (err) {
      // Показать toast с ошибкой
      console.error(err);
    }
  };

  if (loading) return <div className="flex justify-center p-8"><Spinner size="lg" /></div>;
  if (error) return <p className="text-center text-red-400">{error}</p>;
  if (!team) return <p className="text-center text-gray-400">Команда не найдена.</p>;

  return (
    <>
      <PageHeader title={team.name} icon={<Users />} backTo="/teams">
        <Link to={`/teams/${team.id}/edit`}>
          <Button variant="warning">
            <Edit className="h-4 w-4 mr-2" />
            Редактировать
          </Button>
        </Link>
        <Button variant="danger" onClick={() => setDeleteModalOpen(true)}>
          <Trash2 className="h-4 w-4 mr-2" />
          Удалить
        </Button>
      </PageHeader>

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <Card>
            <Card.Header>Описание</Card.Header>
            <Card.Body>
              {team.image && <img src={team.image.url} alt={team.name} className="w-full h-64 object-cover rounded-md mb-4" />}
              <p className="text-gray-300">{team.description || 'Описание отсутствует.'}</p>
            </Card.Body>
          </Card>
          <RobotManager teamId={team.id.toString()} currentRobot={team.robot} />
        </div>
        <div className="lg:col-span-1">
          <MemberManager teamId={team.id} initialMembers={team.members} />
        </div>
      </div>

      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Удалить команду?"
      >
        <p className="text-gray-300">Вы уверены, что хотите удалить команду "{team.name}"? Это действие необратимо.</p>
        <div className="mt-6 flex justify-end space-x-4">
          <Button variant="secondary" onClick={() => setDeleteModalOpen(false)}>Отмена</Button>
          <Button variant="danger" onClick={handleDelete}>Удалить</Button>
        </div>
      </Modal>
    </>
  );
};

export default TeamDetailsPage;