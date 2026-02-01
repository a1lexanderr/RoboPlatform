import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import api from '../services/api';
import { LoginCredentials, RegisterData, User, AuthResponse, AuthContextType } from '../types';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      const token = localStorage.getItem('authToken');
      if (token) {
        try {
          const res = await api.get<User>('/users/me');
          setUser(res.data);
        } catch {
          localStorage.removeItem('authToken');
          setUser(null);
        }
      }
      setLoading(false);
    };
    checkSession();
  }, []);

  const login = async (credentials: LoginCredentials) => {
    const res = await api.post<AuthResponse>('/auth/login', credentials);

    // Проверяем, что сервер возвращает (token или accessToken)
    const token = res.data.token || (res.data as any).accessToken;
    if (!token) throw new Error('Сервер не вернул токен');

    localStorage.setItem('authToken', token);
    try {
        const userResponse = await api.get<User>('/users/me');
        setUser(userResponse.data);
    } catch (error) {
        localStorage.removeItem('authToken');
        delete api.defaults.headers.common['Authorization'];
        setUser(null);
        throw new Error('Не удалось получить данные пользователя после входа.');
    }
  };

  const register = async (data: RegisterData) => {
    await api.post('/users/register', data);
    // сразу логиним после успешной регистрации
    await login({ usernameOrEmail: data.username, password: data.password });
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    setUser(null);
    window.location.href = '/login';
  };

  const value: AuthContextType = {
    user,
    login,
    register,
    logout,
    loading,
    isAuthenticated: !!user,
    isAdmin: user?.roles.includes('ADMIN') ?? false,
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <p className="text-white text-xl">Проверка сессии...</p>
      </div>
    );
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
