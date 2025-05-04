
import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import Beranda from './Beranda';

const Index = () => {
  // In a real app with authentication, we would check if user is logged in here
  // const isLoggedIn = checkUserLoggedIn();
  const isLoggedIn = true; // For now, we'll assume user is logged in
  
  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }
  
  return <Beranda />;
};

export default Index;
