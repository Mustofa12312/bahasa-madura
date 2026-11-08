import React from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { PublicLayout } from '../layouts/PublicLayout';
import { AdminLayout } from '../layouts/AdminLayout';

// Public Pages
import { HomePage } from '../../pages/public/HomePage';
import { DictionaryPage } from '../../pages/public/DictionaryPage';
import { WordDetailPage } from '../../pages/public/WordDetailPage';
import { CategoriesPage } from '../../pages/public/CategoriesPage';
import { CategoryDetailPage } from '../../pages/public/CategoryDetailPage';
import { DailyWordPage } from '../../pages/public/DailyWordPage';
import { LearningPage } from '../../pages/public/LearningPage';
import { ArticleDetailPage } from '../../pages/public/ArticleDetailPage';
import { AboutPage } from '../../pages/public/AboutPage';

// User Pages
import { FavoritesPage } from '../../pages/user/FavoritesPage';
import { HistoryPage } from '../../pages/user/HistoryPage';
import { ContributePage } from '../../pages/user/ContributePage';

// Admin Pages
import { AdminDashboardPage } from '../../pages/admin/AdminDashboardPage';
import { DictionaryManagementPage } from '../../pages/admin/DictionaryManagementPage';
import { ContributionManagementPage } from '../../pages/admin/ContributionManagementPage';
import { BulkImportExportPage } from '../../pages/admin/BulkImportExportPage';
import { LearningManagementPage } from '../../pages/admin/LearningManagementPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <PublicLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'kamus', element: <DictionaryPage /> },
      { path: 'kamus/:slug', element: <WordDetailPage /> },
      { path: 'kategori', element: <CategoriesPage /> },
      { path: 'kategori/:slug', element: <CategoryDetailPage /> },
      { path: 'kata-hari-ini', element: <DailyWordPage /> },
      { path: 'belajar', element: <LearningPage /> },
      { path: 'belajar/:slug', element: <ArticleDetailPage /> },
      { path: 'tentang', element: <AboutPage /> },
      { path: 'kontribusi', element: <ContributePage /> },
      { path: 'favorit', element: <FavoritesPage /> },
      { path: 'riwayat', element: <HistoryPage /> },
    ],
  },
  {
    path: '/admin',
    element: <AdminLayout />,
    children: [
      { index: true, element: <AdminDashboardPage /> },
      { path: 'kamus', element: <DictionaryManagementPage /> },
      { path: 'kontribusi', element: <ContributionManagementPage /> },
      { path: 'import', element: <BulkImportExportPage /> },
      { path: 'artikel', element: <LearningManagementPage /> },
    ],
  },
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
]);

