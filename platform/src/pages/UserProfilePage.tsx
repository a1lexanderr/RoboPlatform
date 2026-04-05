import React, { useState, useEffect } from 'react';
import { userApi } from '@/api/userApi';
import { User } from '@/types';
import { User as UserIcon, Mail, Phone, Edit2, Save, X } from 'lucide-react';

const ProfilePage: React.FC = () => {
  
  const [profile, setProfile] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState('');

  // Стейт для формы редактирования
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phoneNumber: ''
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await userApi.getMyProfile();
        setProfile(data);
        setFormData({
          firstName: data.firstName,
          lastName: data.lastName,
          phoneNumber: data.phoneNumber
        });
      } catch (err) {
        console.error("Ошибка загрузки профиля", err);
        setError("Не удалось загрузить профиль");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const updatedUser = await userApi.updateProfile(formData);
      setProfile(updatedUser);
      setIsEditing(false);
    } catch (err) {
      console.error("Ошибка обновления профиля", err);
      setError("Не удалось сохранить изменения. Проверьте правильность данных.");
    }
  };

  if (loading) return <div className="text-gray-400 p-8">Загрузка профиля...</div>;
  if (!profile) return <div className="text-red-400 p-8">{error}</div>;

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-white">Мой профиль</h1>
        {!isEditing ? (
          <button 
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <Edit2 size={18} />
            Редактировать
          </button>
        ) : (
          <button 
            onClick={() => {
              setIsEditing(false);
              setFormData({ firstName: profile.firstName, lastName: profile.lastName, phoneNumber: profile.phoneNumber }); // Сброс
            }}
            className="flex items-center gap-2 bg-gray-600 hover:bg-gray-500 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <X size={18} />
            Отмена
          </button>
        )}
      </div>

      {error && <div className="bg-red-900/50 border border-red-500 text-red-200 p-4 rounded-lg mb-6">{error}</div>}

      <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden shadow-lg">
        {/* Шапка профиля с аватаркой */}
        <div className="bg-gray-700/50 p-8 flex items-center gap-6 border-b border-gray-700">
          <div className="w-24 h-24 rounded-full bg-gray-600 flex items-center justify-center overflow-hidden border-4 border-gray-800">
            {profile.image?.url ? (
              <img src={profile.image.url} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              <UserIcon size={48} className="text-gray-400" />
            )}
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">{profile.firstName} {profile.lastName}</h2>
            <p className="text-blue-400 font-medium">@{profile.username}</p>
            <div className="mt-2 flex gap-2">
              {profile.roles.map(role => (
                <span key={role} className="bg-blue-900/50 text-blue-300 text-xs px-2 py-1 rounded border border-blue-800">
                  {role}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Форма / Информация */}
        <div className="p-8">
          {isEditing ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Имя</label>
                  <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} required
                    className="w-full bg-gray-900 border border-gray-600 text-white px-4 py-2 rounded-lg focus:outline-none focus:border-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Фамилия</label>
                  <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} required
                    className="w-full bg-gray-900 border border-gray-600 text-white px-4 py-2 rounded-lg focus:outline-none focus:border-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Телефон</label>
                  <input type="tel" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} required
                    className="w-full bg-gray-900 border border-gray-600 text-white px-4 py-2 rounded-lg focus:outline-none focus:border-blue-500" />
                </div>
                
                {/* Неизменяемые поля */}
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-2">Email (нельзя изменить)</label>
                  <input type="email" value={profile.email} disabled
                    className="w-full bg-gray-800 border border-gray-700 text-gray-500 px-4 py-2 rounded-lg cursor-not-allowed" />
                </div>
              </div>
              <div className="flex justify-end pt-4">
                <button type="submit" className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-medium transition-colors">
                  <Save size={18} />
                  Сохранить
                </button>
              </div>
            </form>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-8 gap-x-6">
              <div>
                <p className="text-sm text-gray-400 mb-1">Имя</p>
                <p className="text-lg text-white font-medium">{profile.firstName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400 mb-1">Фамилия</p>
                <p className="text-lg text-white font-medium">{profile.lastName}</p>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="text-gray-500" size={20} />
                <div>
                  <p className="text-sm text-gray-400 mb-1">Email</p>
                  <p className="text-white font-medium">{profile.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="text-gray-500" size={20} />
                <div>
                  <p className="text-sm text-gray-400 mb-1">Телефон</p>
                  <p className="text-white font-medium">{profile.phoneNumber}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;