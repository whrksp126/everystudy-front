import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Splash from '../pages/Splash';
import Login from '../pages/Login';
import Home from '../pages/Home';

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Splash />} />
      <Route path="/login" element={<Login />} />
      <Route path="/home" element={<Home />} />
    </Routes>
  );
};

export default AppRoutes; 