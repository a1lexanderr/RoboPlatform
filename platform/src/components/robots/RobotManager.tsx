import React, { useState, useEffect } from 'react';
import { RobotResponseDTO, RobotDTO } from '../../types';
import { teamApi } from '../../api/teamApi';
import { Card, Button, Input, Textarea, Modal, FileInput, Spinner } from '../ui';
import { Bot, Plus, Edit, Trash2, Star, Settings } from 'lucide-react';

interface RobotManagerProps {
  teamId: string;
  currentRobot?: RobotResponseDTO | null;
}

export const RobotManager: React.FC<RobotManagerProps> = ({ teamId, currentRobot: initialCurrentRobot }) => {
  const [robots, setRobots] = useState<RobotResponseDTO[]>([]);
  const [currentRobot, setCurrentRobot] = useState<RobotResponseDTO | null>(initialCurrentRobot || null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [isCreateModalOpen, setCreateModalOpen] = useState(false);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [editingRobot, setEditingRobot] = useState<RobotResponseDTO | null>(null);

  const [formData, setFormData] = useState<RobotDTO>({ name: '', description: '' });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadRobots();
  }, [teamId]);

  const loadRobots = async () => {
    try {
      setLoading(true);
      const robotsData = await teamApi.robot.list(teamId);
      setRobots(robotsData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Не удалось загрузить роботов');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({ name: '', description: '' });
    setImageFile(null);
    setError(null);
  };

  const handleCreateRobot = async () => {
    if (!formData.name.trim()) {
      setError('Введите название робота');
      return;
    }

    setSubmitting(true);
    try {
      const newRobot = await teamApi.robot.create(teamId, formData, imageFile);
      setRobots([...robots, newRobot]);
      setCreateModalOpen(false);
      resetForm();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Не удалось создать робота');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditRobot = async () => {
    if (!editingRobot || !formData.name.trim()) {
      setError('Введите название робота');
      return;
    }

    setSubmitting(true);
    try {
      const updatedRobot = await teamApi.robot.update(teamId, editingRobot.id.toString(), formData, imageFile);
      setRobots(robots.map(r => r.id === updatedRobot.id ? updatedRobot : r));

      if (currentRobot?.id === updatedRobot.id) {
        setCurrentRobot(updatedRobot);
      }
      
      setEditModalOpen(false);
      setEditingRobot(null);
      resetForm();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Не удалось обновить робота');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteRobot = async (robotId: number) => {
    const confirmDelete = window.confirm('Вы уверены, что хотите удалить этого робота?');
    if (!confirmDelete) return;

    try {
      await teamApi.robot.delete(teamId, robotId.toString());
      setRobots(robots.filter(r => r.id !== robotId));

      if (currentRobot?.id === robotId) {
        setCurrentRobot(null);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Не удалось удалить робота');
    }
  };

  const handleSetCurrentRobot = async (robotId: number) => {
    try {
      const newCurrentRobot = await teamApi.robot.setCurrent(teamId, robotId.toString());
      setCurrentRobot(newCurrentRobot);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Не удалось установить текущего робота');
    }
  };

  const openEditModal = (robot: RobotResponseDTO) => {
    setEditingRobot(robot);
    setFormData({ name: robot.name, description: robot.description });
    setEditModalOpen(true);
  };

  const openCreateModal = () => {
    resetForm();
    setCreateModalOpen(true);
  };

  if (loading) {
    return (
      <Card>
        <Card.Body>
          <div className="flex justify-center p-8">
            <Spinner size="lg" />
          </div>
        </Card.Body>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <Card.Header>
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <Bot className="h-5 w-5" />
              <span>Роботы команды</span>
            </div>
            <Button variant="secondary" onClick={openCreateModal}>
              <Plus className="h-4 w-4 mr-2" />
              Добавить робота
            </Button>
          </div>
        </Card.Header>
        <Card.Body>
          {error && (
            <div className="mb-4 p-3 bg-red-900/20 border border-red-500/30 rounded-md">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          {robots.length === 0 ? (
            <div className="text-center py-8">
              <Bot className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-400">У команды пока нет роботов</p>
              <p className="text-gray-500 text-sm mt-2">Создайте первого робота для участия в соревнованиях</p>
            </div>
          ) : (
            <div className="space-y-4">
              {robots.map(robot => (
                <div key={robot.id} className="border border-gray-600 rounded-lg p-4">
                  <div className="flex items-start space-x-4">
                    {robot.image ? (
                      <img 
                        src={robot.image.url} 
                        alt={robot.name}
                        className="w-16 h-16 rounded-md object-cover flex-shrink-0"
                      />
                    ) : (
                      <div className="w-16 h-16 bg-gray-700 rounded-md flex items-center justify-center flex-shrink-0">
                        <Bot className="h-8 w-8 text-gray-400" />
                      </div>
                    )}
                    
                    <div className="flex-grow min-w-0">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="text-lg font-semibold text-white truncate">{robot.name}</h3>
                        {currentRobot?.id === robot.id && (
                          <div className="flex items-center space-x-1 bg-yellow-900/30 text-yellow-400 px-2 py-1 rounded text-xs">
                            <Star className="h-3 w-3" />
                            <span>Активный</span>
                          </div>
                        )}
                      </div>
                      <p className="text-gray-400 text-sm line-clamp-2">{robot.description}</p>
                    </div>

                    <div className="flex items-center space-x-2 flex-shrink-0">
                      {currentRobot?.id !== robot.id && (
                        <Button 
                          variant="secondary" 
                          onClick={() => handleSetCurrentRobot(robot.id)}
                        >
                          <Settings className="h-3 w-3 mr-1" />
                          Активировать
                        </Button>
                      )}
                      <Button 
                        variant="secondary" 
                        onClick={() => openEditModal(robot)}
                      >
                        <Edit className="h-3 w-3" />
                      </Button>
                      <Button 
                        variant="danger" 
                        onClick={() => handleDeleteRobot(robot.id)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card.Body>
      </Card>

      <Modal 
        isOpen={isCreateModalOpen} 
        onClose={() => setCreateModalOpen(false)} 
        title="Создать нового робота"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Название робота
            </label>
            <Input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Например, 'Железный Воин'"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Описание
            </label>
            <Textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Опишите особенности и возможности робота"
              rows={3}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Фотография робота
            </label>
            <FileInput onFileSelect={setImageFile} />
          </div>

          {error && <p className="text-red-400 text-sm">{error}</p>}

          <div className="flex justify-end space-x-4 pt-4">
            <Button variant="secondary" onClick={() => setCreateModalOpen(false)}>
              Отмена
            </Button>
            <Button onClick={handleCreateRobot} isLoading={submitting}>
              Создать робота
            </Button>
          </div>
        </div>
      </Modal>

      <Modal 
        isOpen={isEditModalOpen} 
        onClose={() => setEditModalOpen(false)} 
        title="Редактировать робота"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Название робота
            </label>
            <Input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Например, 'Железный Воин'"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Описание
            </label>
            <Textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Опишите особенности и возможности робота"
              rows={3}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Фотография робота
            </label>
            <FileInput 
              onFileSelect={setImageFile} 
              initialFileName={editingRobot?.image?.title}
            />
            <p className="text-xs text-gray-400 mt-2">
              Выберите новый файл, чтобы заменить текущую фотографию.
            </p>
          </div>

          {error && <p className="text-red-400 text-sm">{error}</p>}

          <div className="flex justify-end space-x-4 pt-4">
            <Button variant="secondary" onClick={() => setEditModalOpen(false)}>
              Отмена
            </Button>
            <Button onClick={handleEditRobot} isLoading={submitting}>
              Сохранить изменения
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};