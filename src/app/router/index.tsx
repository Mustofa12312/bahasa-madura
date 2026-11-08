import React, { lazy, Suspense } from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { PublicLayout } from '../layouts/PublicLayout';
import { AdminLayout } from '../layouts/AdminLayout';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { ErrorBoundary } from '../../components/ui/ErrorBoundary';

// Lazy-loaded Public Pages
const HomePage = lazy(() => import('../../pages/public/HomePage').then(m => ({ default: m.HomePage })));
const DictionaryPage = lazy(() => import('../../pages/public/DictionaryPage').then(m => ({ default: m.DictionaryPage })));
const WordDetailPage = lazy(() => import('../../pages/public/WordDetailPage').then(m => ({ default: m.WordDetailPage })));
const CategoriesPage = lazy(() => import('../../pages/public/CategoriesPage').then(m => ({ default: m.CategoriesPage })));
const CategoryDetailPage = lazy(() => import('../../pages/public/CategoryDetailPage').then(m => ({ default: m.CategoryDetailPage })));
const DailyWordPage = lazy(() => import('../../pages/public/DailyWordPage').then(m => ({ default: m.DailyWordPage })));
const LearningPage = lazy(() => import('../../pages/public/LearningPage').then(m => ({ default: m.LearningPage })));
const ArticleDetailPage = lazy(() => import('../../pages/public/ArticleDetailPage').then(m => ({ default: m.ArticleDetailPage })));
const AboutPage = lazy(() => import('../../pages/public/AboutPage').then(m => ({ default: m.AboutPage })));

// Lazy-loaded User Pages
const FavoritesPage = lazy(() => import('../../pages/user/FavoritesPage').then(m => ({ default: m.FavoritesPage })));
const HistoryPage = lazy(() => import('../../pages/user/HistoryPage').then(m => ({ default: m.HistoryPage })));
const ContributePage = lazy(() => import('../../pages/user/ContributePage').then(m => ({ default: m.ContributePage })));

// Lazy-loaded Admin Pages
const AdminDashboardPage = lazy(() => import('../../pages/admin/AdminDashboardPage').then(m => ({ default: m.AdminDashboardPage })));
const DictionaryManagementPage = lazy(() => import('../../pages/admin/DictionaryManagementPage').then(m => ({ default: m.DictionaryManagementPage })));
const ContributionManagementPage = lazy(() => import('../../pages/admin/ContributionManagementPage').then(m => ({ default: m.ContributionManagementPage })));
const BulkImportExportPage = lazy(() => import('../../pages/admin/BulkImportExportPage').then(m => ({ default: m.BulkImportExportPage })));
const LearningManagementPage = lazy(() => import('../../pages/admin/LearningManagementPage').then(m => ({ default: m.LearningManagementPage })));

const PageLoader = () => (
  <div className="min-h-[50vh] flex items-center justify-center p-8">
    <LoadingSpinner size="lg" label="Memuat halaman..." />
  </div>
);

const withSuspense = (Component: React.ComponentType) => (
  <ErrorBoundary>
    <Suspense fallback={<PageLoader />}>
      <Component />
    </Suspense>
  </ErrorBoundary>
);

export const router = createBrowserRouter([
  {
    path: '/',
    element: <PublicLayout />,
    errorElement: <ErrorBoundary />,
    children: [
      { index: true, element: withSuspense(HomePage) },
      { path: 'kamus', element: withSuspense(DictionaryPage) },
      { path: 'kamus/:slug', element: withSuspense(WordDetailPage) },
      { path: 'kategori', element: withSuspense(CategoriesPage) },
      { path: 'kategori/:slug', element: withSuspense(CategoryDetailPage) },
      { path: 'kata-hari-ini', element: withSuspense(DailyWordPage) },
      { path: 'belajar', element: withSuspense(LearningPage) },
      { path: 'belajar/:slug', element: withSuspense(ArticleDetailPage) },
      { path: 'tentang', element: withSuspense(AboutPage) },
      { path: 'kontribusi', element: withSuspense(ContributePage) },
      { path: 'favorit', element: withSuspense(FavoritesPage) },
      { path: 'riwayat', element: withSuspense(HistoryPage) },
    ],
  },
  {
    path: '/admin',
    element: <AdminLayout />,
    errorElement: <ErrorBoundary />,
    children: [
      { index: true, element: withSuspense(AdminDashboardPage) },
      { path: 'kamus', element: withSuspense(DictionaryManagementPage) },
      { path: 'kontribusi', element: withSuspense(ContributionManagementPage) },
      { path: 'import', element: withSuspense(BulkImportExportPage) },
      { path: 'artikel', element: withSuspense(LearningManagementPage) },
    ],
  },
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
]);
