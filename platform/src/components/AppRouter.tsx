import { Routes, Route } from 'react-router-dom';
import { routes } from '../routes/routes'
import React from 'react';

const AppRouter: React.FC = () => {
  return (
      <Routes>
        {routes.map((route, index) => (
          <Route key={index} path={route.path} element={React.createElement(route.element)} />
        ))}
      </Routes>
  );
};

export default AppRouter;
