import React from 'react';
import { RegisterForm } from '../components/RegisterForm';

const RegisterPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center py-12 px-4">
      <RegisterForm />
    </div>
  );
};

export default RegisterPage;