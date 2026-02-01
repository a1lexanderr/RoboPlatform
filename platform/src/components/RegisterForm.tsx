import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { RegisterData } from '../types';
import { Eye, EyeOff, UserPlus } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export const RegisterForm: React.FC = () => {
  const [formData, setFormData] = useState<RegisterData & { confirmPassword: string }>({
    firstName: '', lastName: '', username: '', email: '', phoneNumber: '', password: '', confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  if (formData.password !== formData.confirmPassword) {
    setError('Пароли не совпадают');
    return;
  }
  setLoading(true);
  setError('');
  try {
    await register(formData);
    navigate('/dashboard');
  } catch (err) {
    setError(err instanceof Error ? err.message : 'Ошибка регистрации');
  } finally {
    setLoading(false);
  }
};

  const handleChange = (field: keyof typeof formData) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [field]: e.target.value });
  };

  return (
    <div className="bg-gray-800 rounded-lg shadow-xl p-8 w-full max-w-md">
      <div className="text-center mb-8">
        <UserPlus className="mx-auto h-12 w-12 text-green-500 mb-4" />
        <h2 className="text-3xl font-bold text-white">Регистрация</h2>
        <p className="text-gray-400 mt-2">Создайте новый аккаунт</p>
      </div>

      {error && (
        <div className="bg-red-900/50 border border-red-500 text-red-200 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Имя</label>
            <input type="text" required value={formData.firstName} onChange={handleChange('firstName')} className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-green-500" placeholder="Ваше имя" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Фамилия</label>
            <input type="text" required value={formData.lastName} onChange={handleChange('lastName')} className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-green-500" placeholder="Ваша фамилия" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Имя пользователя</label>
          <input type="text" required value={formData.username} onChange={handleChange('username')} className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-green-500" placeholder="Уникальное имя" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Email</label>
          <input type="email" required value={formData.email} onChange={handleChange('email')} className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-green-500" placeholder="your@email.com" />
        </div>
         <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Телефон</label>
            <input type="tel" required value={formData.phoneNumber} onChange={handleChange('phoneNumber')} className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-green-500" placeholder="+7 (XXX) XXX-XX-XX" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Пароль</label>
          <div className="relative">
            <input type={showPassword ? 'text' : 'password'} required value={formData.password} onChange={handleChange('password')} className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-green-500 pr-10" placeholder="Создайте пароль" />
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-300">
              {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>
        </div>
         <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Подтвердите пароль</label>
          <input type='password' required value={formData.confirmPassword} onChange={handleChange('confirmPassword')} className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-green-500" placeholder="Повторите пароль" />
        </div>
        <button type="submit" disabled={loading} className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed mt-6">
          {loading ? 'Регистрируемся...' : 'Зарегистрироваться'}
        </button>
        <div className="text-center">
            <Link to="/login" className="text-blue-400 hover:text-blue-300 text-sm">
              Уже есть аккаунт? Войти
            </Link>
        </div>
      </form>
    </div>
  );
};