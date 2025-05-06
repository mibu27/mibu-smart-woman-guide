
import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import Beranda from './Beranda';
import { useAuth } from '@/contexts/AuthContext';

const Index = () => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }
  
  if (user) {
    return <Navigate to="/beranda" replace />;
  }
  
  return <Navigate to="/login" replace />;
};

export default Index;
