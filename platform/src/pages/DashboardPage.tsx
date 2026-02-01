import React from 'react';
import { Outlet } from 'react-router-dom';
import { Dashboard } from '@/components/Dashboard';

const DashboardPage: React.FC = () => {
  return (
    <div>
      <Dashboard>
      <Outlet />
    </Dashboard>
    </div>
  );
};

export default DashboardPage;
