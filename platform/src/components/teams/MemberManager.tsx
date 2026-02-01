import React, { useState, useEffect } from 'react';
import { TeamMemberResponseDTO, UserSummaryDTO } from '../../types';
import { userApi } from '../../api/userApi';
import { teamApi } from '../../api/teamApi'; 
import { Card, Button, Input, Modal, Spinner } from '../ui';
import { UserPlus, Trash2 } from 'lucide-react';

interface MemberManagerProps {
  teamId: number;
  initialMembers: TeamMemberResponseDTO[];
}

export const MemberManager: React.FC<MemberManagerProps> = ({ teamId, initialMembers }) => {
  const [members, setMembers] = useState<TeamMemberResponseDTO[]>(initialMembers);
  const [isModalOpen, setModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<UserSummaryDTO[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Сбрасываем ошибки через 5 сек
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  // Автопоиск пользователей
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery.trim().length >= 2) handleSearchUsers();
      else setSearchResults([]);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleRemoveMember = async (userId: number) => {
    if (loading) return;

    const original = [...members];
    setMembers(members.filter(m => m.userId !== userId));

    try {
      setLoading(true);
      await teamApi.members.remove(teamId.toString(), userId);
    } catch (err) {
      setMembers(original);
      setError(err instanceof Error ? err.message : 'Не удалось удалить участника');
    } finally {
      setLoading(false);
    }
  };

  const handleSearchUsers = async () => {
    if (searchQuery.trim().length < 2) return;

    setSearchLoading(true);
    setError(null);
    
    try {
      const results = await userApi.searchUsers(searchQuery.trim());
      const currentIds = new Set(members.map(m => m.userId));
      setSearchResults(results.filter(u => !currentIds.has(u.id)));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка при поиске пользователей');
    } finally {
      setSearchLoading(false);
    }
  };

  const handleAddMember = async (user: UserSummaryDTO) => {
    if (loading) return;
    setLoading(true);
    setError(null);

    try {
      const newMember = await teamApi.members.add(teamId.toString(), {
        userId: user.id,
        role: 'MEMBER',
      });

      setMembers(prev => [...prev, newMember]);
      setSearchResults(prev => prev.filter(u => u.id !== user.id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Не удалось добавить участника');
    } finally {
      setLoading(false);
    }
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSearchQuery('');
    setSearchResults([]);
    setError(null);
  };

  const getMemberDisplayName = (member: TeamMemberResponseDTO) => {
    const fullName = `${member.firstName ?? ''} ${member.lastName ?? ''}`.trim();
    return fullName ? `${fullName} (@${member.username})` : `@${member.username}`;
  };

  return (
    <>
      <Card>
        <Card.Header>
          <div className="flex justify-between items-center">
            <span className="font-semibold text-white">
              Участники команды ({members.length})
            </span>
            <Button 
              variant="secondary" 
              onClick={() => setModalOpen(true)}
              disabled={loading}
            >
              <UserPlus className="h-4 w-4" />
            </Button>
          </div>
        </Card.Header>

        <Card.Body>
          {members.length > 0 ? (
            <ul className="space-y-3">
              {members.map(member => (
                <li 
                  key={member.userId} 
                  className="flex items-center justify-between bg-gray-800 p-2 rounded-lg"
                >
                  <div className="flex flex-col">
                    <span className="text-white">{getMemberDisplayName(member)}</span>
                    {member.role && (
                      <span className="text-xs text-gray-400">{member.role}</span>
                    )}
                  </div>
                  <button
                    onClick={() => handleRemoveMember(member.userId)}
                    className="text-red-500 hover:text-red-400 disabled:opacity-50"
                    disabled={loading}
                    aria-label={`Удалить ${member.username}`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-400 text-center">В команде пока нет участников.</p>
          )}
        </Card.Body>
      </Card>

      <Modal isOpen={isModalOpen} onClose={handleCloseModal} title="Добавить участника">
        <div className="space-y-4">
          <Input
            type="search"
            placeholder="Введите имя пользователя..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            disabled={loading}
          />

          {searchLoading && <p className="text-gray-400 text-sm">Поиск...</p>}

          {searchResults.length > 0 && (
            <ul className="space-y-2 max-h-60 overflow-y-auto">
              {searchResults.map(user => (
                <li key={user.id} className="flex items-center justify-between bg-gray-700 p-2 rounded">
                  <div className="flex items-center space-x-2">
                    <img
                      src={user.avatarUrl || '/default-avatar.png'}
                      alt={user.fullName}
                      className="w-6 h-6 rounded-full"
                    />
                    <span className="text-white">{user.fullName} (@{user.username})</span>
                  </div>
                  <Button 
                    onClick={() => handleAddMember(user)}
                    disabled={loading}
                  >
                    {loading ? <Spinner size="sm" /> : 'Добавить'}
                  </Button>
                </li>
              ))}
            </ul>
          )}

          {searchQuery.trim().length >= 2 && searchResults.length === 0 && !searchLoading && (
            <p className="text-gray-400 text-sm">Пользователи не найдены</p>
          )}

          {error && (
            <div className="p-3 bg-red-900/20 border border-red-500 rounded">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="secondary" onClick={handleCloseModal}>
              Закрыть
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};
