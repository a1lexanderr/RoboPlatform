import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

interface PageHeaderProps {
  title: string;
  icon: React.ReactNode;
  backTo?: string;
  children?: React.ReactNode;
}

export const PageHeader: React.FC<PageHeaderProps> = ({ title, icon, backTo, children }) => {
  return (
    <div className="md:flex md:items-center md:justify-between">
      <div className="flex-1 min-w-0 flex items-center">
        {backTo && (
          <Link to={backTo} className="text-gray-400 hover:text-white mr-4">
            <ArrowLeft className="h-6 w-6" />
          </Link>
        )}
        <div className="text-blue-500 mr-3">{icon}</div>
        <h2 className="text-2xl font-bold leading-7 text-white sm:truncate sm:text-3xl">
          {title}
        </h2>
      </div>
      <div className="mt-4 flex md:mt-0 md:ml-4 space-x-3">{children}</div>
    </div>
  );
};