import React from 'react';
import { Routes, Route } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import HomePage from '../pages/HomePage';
import TodoDetailPage from '../pages/TodoDetailPage';
import AboutPage from '../pages/AboutPage';
import NotFound from '../components/common/NotFound';
import Dashboard from '../pages/Dashboard';

const AppRouter = () => {
  return (
    <MainLayout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/todo/:id" element={<TodoDetailPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/todo" element={<HomePage />} />
        <Route path="*" element={<NotFound />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </MainLayout>
  );
};

export default AppRouter;