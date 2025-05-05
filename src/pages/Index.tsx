
import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import Beranda from './Beranda';

const Index = () => {
  // In a real app with authentication, we would check if user is logged in here
  // For demo purposes, we'll assume user is NOT logged in
  const isLoggedIn = false; 
  
  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }
  
  return <Beranda />;
};

export default Index;
