import React, { useState, ChangeEvent, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Save } from 'lucide-react';
import { competitionApi } from '@/api/competitionApi';
import { CompetitionDetailsDTO } from '@/types';

interface FormDataFields {
  title: string;
  description: string;
  location: string;
  status: string;
  startDate: string;
  endDate: string;
  imageFile?: File;
}

const statuses = ['DRAFT', 'OPEN', 'CLOSED', 'ONGOING', 'FINISHED'];

export const CompetitionForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const [form, setForm] = useState<FormDataFields>({
    title: '',
    description: '',
    location: '',
    status: 'DRAFT',
    startDate: '',
    endDate: '',
  });

  useEffect(() => {
    if (isEdit && id) {
      (async () => {
        const data: CompetitionDetailsDTO = await competitionApi.get(id);
        setForm({
          title: data.title,
          description: data.description,
          location: data.location,
          status: data.status,
          startDate: data.startDate,
          endDate: data.endDate,
        });
      })();
    }
  }, [id, isEdit]);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFile = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) setForm({ ...form, imageFile: e.target.files[0] });
  };

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  const formData = new FormData();
  formData.append(
    "competitionData",
    new Blob(
      [JSON.stringify({
        title: form.title,
        description: form.description,
        location: form.location,
        status: form.status,
        startDate: form.startDate,
        endDate: form.endDate,
      })],
      { type: "application/json" }
    )
  );

  if (form.imageFile) {
    formData.append("imageFile", form.imageFile);
  }

  if (isEdit && id) {
    await competitionApi.update(id, formData);
  } else {
    await competitionApi.create(formData);
  }

  navigate("/competitions");
};

  return (
    <div className="p-6 bg-gray-900 text-white min-h-screen">
      <h1 className="text-2xl font-bold mb-4">{isEdit ? 'Редактировать' : 'Создать'} соревнование</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="Название"
          className="w-full px-3 py-2 bg-gray-800 rounded"
          required
        />
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Описание"
          rows={5}
          className="w-full px-3 py-2 bg-gray-800 rounded"
          required
        />
        <input
          name="location"
          value={form.location || ''}
          onChange={handleChange}
          placeholder="Место проведения"
          className="w-full px-3 py-2 bg-gray-800 rounded"
          required
        />

        <select
          name="status"
          value={form.status}
          onChange={handleChange}
          className="w-full px-3 py-2 bg-gray-800 rounded"
        >
          {statuses.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        <div className="grid grid-cols-2 gap-4">
          <input
            type="date"
            name="startDate"
            value={form.startDate}
            onChange={handleChange}
            className="w-full px-3 py-2 bg-gray-800 rounded"
            required
          />
          <input
            type="date"
            name="endDate"
            value={form.endDate}
            onChange={handleChange}
            className="w-full px-3 py-2 bg-gray-800 rounded"
            required
          />
        </div>
        <div>
          <label className="block mb-1">Изображение</label>
          <input type="file" accept="image/*" onChange={handleFile} />
        </div>
        <button
          type="submit"
          className="flex items-center bg-blue-600 px-4 py-2 rounded hover:bg-blue-700"
        >
          <Save className="mr-2" /> Сохранить
        </button>
      </form>
    </div>
  );
};
