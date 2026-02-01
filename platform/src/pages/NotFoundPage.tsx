import React from 'react';
import { Link } from 'react-router-dom';

const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center text-white">
      <h1 className="text-6xl font-bold text-blue-500">404</h1>
      <p className="text-2xl mt-4">Страница не найдена</p>
      <Link to="/" className="mt-8 px-4 py-2 bg-blue-600 rounded hover:bg-blue-700">
        На главную
      </Link>
    </div>
  );
};

export default NotFoundPage;