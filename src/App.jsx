import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Layout from './components/Layout';

// Admin Pages
import AdminDashboard from './pages/Admin/Dashboard';
import ProdiManagement from './pages/Admin/ProdiManagement';
import AdminDosenManagement from './pages/Admin/AdminDosenManagement';
import DosenManagement from './pages/Admin/DosenManagement';
import ProgramManagement from './pages/Admin/ProgramManagement';

// Prodi Pages (using existing pages temporarily)
import Dashboard from './pages/Dashboard';
import CourseManagement from './pages/CourseManagement';
import RPSCreate from './pages/RPSCreate';
import RPSListPage from './pages/RPSList';

// Dosen Pages
import DosenDashboard from './pages/Dosen/Dashboard';
import DosenRPSList from './pages/Dosen/RPSList';
import DosenMataKuliah from './pages/Dosen/MataKuliah';

// Protected Route Component
function ProtectedRoute({ children, allowedRoles }) {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(role)) {
    return <Navigate to="/login" replace />;
  }

  return <Layout>{children}</Layout>;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        
        {/* Admin Routes */}
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute allowedRoles={['admin', 'kaprodi']}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/prodis"
          element={
            <ProtectedRoute allowedRoles={['admin', 'kaprodi']}>
              <ProdiManagement />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/dosens"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminDosenManagement />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/programs"
          element={
            <ProtectedRoute allowedRoles={['admin', 'kaprodi']}>
              <ProgramManagement />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/courses"
          element={
            <ProtectedRoute allowedRoles={['admin', 'kaprodi']}>
              <CourseManagement />
            </ProtectedRoute>
          }
        />

        {/* Prodi Routes */}
        <Route
          path="/prodi/dashboard"
          element={
            <ProtectedRoute allowedRoles={['prodi', 'kaprodi']}>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/prodi/courses"
          element={
            <ProtectedRoute allowedRoles={['prodi', 'kaprodi']}>
              <CourseManagement />
            </ProtectedRoute>
          }
        />
        <Route
          path="/prodi/dosens"
          element={
            <ProtectedRoute allowedRoles={['prodi', 'kaprodi']}>
              <DosenManagement />
            </ProtectedRoute>
          }
        />
        <Route
          path="/prodi/rps"
          element={
            <ProtectedRoute allowedRoles={['prodi', 'kaprodi']}>
              <RPSListPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/prodi/rps/create"
          element={
            <ProtectedRoute allowedRoles={['prodi', 'kaprodi']}>
              <RPSCreate />
            </ProtectedRoute>
          }
        />
        <Route
          path="/prodi/rps/create/:courseId"
          element={
            <ProtectedRoute allowedRoles={['prodi', 'kaprodi']}>
              <RPSCreate />
            </ProtectedRoute>
          }
        />
        <Route
          path="/prodi/dosens"
          element={
            <ProtectedRoute allowedRoles={['prodi', 'kaprodi']}>
              <DosenManagement />
            </ProtectedRoute>
          }
        />

        {/* Dosen Routes */}
        <Route
          path="/dosen/dashboard"
          element={
            <ProtectedRoute allowedRoles={['dosen']}>
              <DosenDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dosen/mata-kuliah"
          element={
            <ProtectedRoute allowedRoles={['dosen']}>
              <DosenMataKuliah />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dosen/rps"
          element={
            <ProtectedRoute allowedRoles={['dosen']}>
              <DosenRPSList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dosen/rps/create"
          element={
            <ProtectedRoute allowedRoles={['dosen']}>
              <RPSCreate />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dosen/rps/create/:courseId"
          element={
            <ProtectedRoute allowedRoles={['dosen']}>
              <RPSCreate />
            </ProtectedRoute>
          }
        />

        {/* Default Redirects */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
