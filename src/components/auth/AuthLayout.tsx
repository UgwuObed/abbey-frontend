import React from 'react';
import { Link } from 'react-router-dom';

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
  linkText?: string;
  linkTo?: string;
  linkLabel?: string;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({
  children,
  title,
  subtitle,
  linkText,
  linkTo,
  linkLabel,
}) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            {title}
          </h2>
          {subtitle && (
            <p className="mt-2 text-center text-sm text-gray-600">
              {subtitle}
            </p>
          )}
        </div>
        
        <div className="bg-white rounded-lg shadow p-8">
          {children}
        </div>

        {linkText && linkTo && linkLabel && (
          <div className="text-center">
            <span className="text-sm text-gray-600">{linkText} </span>
            <Link
              to={linkTo}
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              {linkLabel}
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};