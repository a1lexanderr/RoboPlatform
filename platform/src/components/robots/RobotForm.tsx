import React, { useState } from 'react';
import { RobotDTO } from '../../types';
import { Input, Textarea, FileInput, Button } from '../ui';

interface RobotFormProps {
  initialData?: RobotDTO;
  onSubmit: (data: RobotDTO, image?: File) => Promise<void>;
  onCancel: () => void;
}

export const RobotForm: React.FC<RobotFormProps> = ({ initialData, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState<RobotDTO>(initialData ?? { name: '', description: '' });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    await onSubmit(formData, imageFile ?? undefined);
    setSaving(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm text-gray-300 mb-2">Название робота</label>
        <Input id="name" name="name" type="text" required value={formData.name} onChange={handleChange} />
      </div>
      <div>
        <label htmlFor="description" className="block text-sm text-gray-300 mb-2">Описание</label>
        <Textarea id="description" name="description" rows={4} value={formData.description} onChange={handleChange} />
      </div>
      <div>
        <label className="block text-sm text-gray-300 mb-2">Изображение робота</label>
        <FileInput onFileSelect={setImageFile} />
      </div>
      <div className="flex justify-end gap-2 mt-4">
        <Button variant="secondary" onClick={onCancel}>Отмена</Button>
        <Button type="submit" isLoading={saving}>Сохранить</Button>
      </div>
    </form>
  );
};
