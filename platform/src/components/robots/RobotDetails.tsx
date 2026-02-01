import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { RobotResponseDTO } from '@/types';

export const RobotDetails: React.FC = () => {
  const { robotId } = useParams<{ robotId: string }>();
  const [robot, setRobot] = useState<RobotResponseDTO | null>(null);

  useEffect(() => {
    fetch(`/api/v1/robots/${robotId}`)
      .then(res => res.json())
      .then(setRobot);
  }, [robotId]);

  if (!robot) return <p>Загрузка робота...</p>;

  return (
    <div className="p-6 bg-gray-900 text-white min-h-screen">
      <h1 className="text-2xl font-bold mb-4">{robot.name}</h1>
      {robot.image && (
        <img src={robot.image.url} alt={robot.image.title} className="mb-4 max-h-64 rounded" />
      )}
      <p>{robot.description}</p>
    </div>
  );
};
