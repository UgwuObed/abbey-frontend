import React from 'react';
import { Navigate } from 'react-router-dom';
import { AuthLayout } from '../components/auth/AuthLayout';
import { LoginForm } from '../components/auth/LoginForm';
import { useAuth } from '../contexts/AuthContext';

export const Login: React.FC = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (user) {
    return <Navigate to="/" replace />;
  }

  return (
    <AuthLayout
      title="Sign in to your account"
      subtitle="Welcome back! Please sign in to continue."
      linkText="Don't have an account?"
      linkTo="/register"
      linkLabel="Sign up"
    >
      <LoginForm />
    </AuthLayout>
  );
};