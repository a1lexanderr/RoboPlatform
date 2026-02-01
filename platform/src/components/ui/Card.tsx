import React, { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
}

const CardHeader: React.FC<{ children: ReactNode }> = ({ children }) => (
  <div className="border-b border-gray-700 px-4 py-3 sm:px-6">
    <h3 className="text-lg font-semibold leading-6 text-white">{children}</h3>
  </div>
);

const CardBody: React.FC<{ children: ReactNode; className?: string }> = ({ children, className = '' }) => (
  <div className={`px-4 py-5 sm:p-6 ${className}`}>{children}</div>
);

export const Card = ({ children, className = '' }: CardProps) => {
  return (
    <div className={`bg-gray-800 rounded-lg shadow-lg overflow-hidden ${className}`}>
      {children}
    </div>
  );
};

Card.Header = CardHeader;
Card.Body = CardBody;