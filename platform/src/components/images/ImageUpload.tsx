// ImageUpload.tsx
import React, { useState, ChangeEvent } from 'react';
import { Upload } from 'lucide-react';

export const ImageUpload: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState('');
  const [uploaded, setUploaded] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFile(e.target.files?.[0] || null);
  };

  const handleUpload = async () => {
    if (!file) return;
    const data = new FormData();
    data.append('file', file);
    data.append('title', title);

    const res = await fetch('/api/v1/images/upload', { method: 'POST', body: data });
    if (res.ok) setUploaded(true);
  };

  return (
    <div className="p-6 bg-gray-900 text-white min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Загрузить изображение</h1>
      <input type="text" placeholder="Заголовок" value={title} onChange={e => setTitle(e.target.value)} className="mb-2 w-full px-3 py-2 bg-gray-800 rounded" />
      <input type="file" accept="image/*" onChange={handleChange} className="mb-4" />
      <button onClick={handleUpload} className="flex items-center bg-green-600 px-4 py-2 rounded hover:bg-green-700">
        <Upload className="mr-2" /> Загрузить
      </button>
      {uploaded && <p className="mt-4 text-green-400">Успешно загружено!</p>}
    </div>
  );
};
