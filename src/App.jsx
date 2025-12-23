import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  Home, 
  Users, 
  Building2, 
  BookOpen, 
  FileText, 
  LogOut, 
  Menu, 
  X,
  Settings,
  GraduationCap,
  Target,
  ChevronDown,
  ChevronRight
} from 'lucide-react';

// Pages
import Login from './pages/Login';
import HomePage from './pages/Home';
import About from './pages/About';
import Panduan from './pages/Panduan';
import Dashboard from './pages/Dashboard';

// Admin Pages
import AdminDashboard from './pages/Admin/Dashboard';
import ProdiManagement from './pages/Admin/ProdiManagement';
import DosenManagement from './pages/Admin/DosenManagement';
import AdminDosenManagement from './pages/Admin/AdminDosenManagement';
import ProgramManagement from './pages/Admin/ProgramManagement';
import CPMKManagement from './pages/Admin/CPMKManagement';
import CPLManagement from './pages/Admin/CPLManagement';
import CommonCourseManagement from './pages/Admin/CommonCourseManagement';

// Kaprodi Pages

// Dosen Pages  
import DosenDashboard from './pages/Dosen/Dashboard';
import DosenRPSList from './pages/Dosen/RPSList';
import DosenMataKuliah from './pages/Dosen/MataKuliah';

// Shared Pages
import CourseManagement from './pages/CourseManagement';
import RPSCreate from './pages/RPSCreate';
import RPSList from './pages/RPSList';

// Layout Component with Sidebar
function Layout({ children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [expandedMenus, setExpandedMenus] = useState({});
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const role = localStorage.getItem('role') || 'dosen';

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('role');
    navigate('/login');
  };

  const toggleMenu = (menuKey) => {
    setExpandedMenus(prev => ({
      ...prev,
      [menuKey]: !prev[menuKey]
    }));
  };

  const isActive = (path) => location.pathname === path || location.pathname.startsWith(path + '/');

  // Admin menu items
  const adminMenuItems = [
    { 
      icon: Home, 
      label: 'Dashboard', 
      path: '/admin/dashboard' 
    },
    { 
      icon: Building2, 
      label: 'Program Studi', 
      path: '/admin/prodi' 
    },
    { 
      icon: Users, 
      label: 'Dosen', 
      path: '/admin/dosen' 
    },
    { 
      icon: GraduationCap, 
      label: 'Program', 
      path: '/admin/program' 
    },
    { 
      icon: BookOpen, 
      label: 'Mata Kuliah', 
      path: '/admin/courses' 
    },
    { 
      icon: BookOpen, 
      label: 'Matkul Umum', 
      path: '/admin/common-courses' 
    },
    { 
      icon: Target, 
      label: 'CPL', 
      path: '/admin/cpl' 
    },
    { 
      icon: FileText, 
      label: 'CPMK', 
      path: '/admin/cpmk' 
    },
  ];

  // Kaprodi menu items
  const kaprodiMenuItems = [
    { 
      icon: Home, 
      label: 'Dashboard', 
      path: '/kaprodi/dashboard' 
    },
    { 
      icon: Users, 
      label: 'Dosen', 
      path: '/kaprodi/dosen' 
    },
    { 
      icon: BookOpen, 
      label: 'Mata Kuliah', 
      path: '/kaprodi/courses' 
    },
    { 
      icon: Target, 
      label: 'CPL', 
      path: '/kaprodi/cpl' 
    },
    { 
      icon: FileText, 
      label: 'CPMK', 
      path: '/kaprodi/cpmk' 
    },
    { 
      icon: FileText, 
      label: 'RPS', 
      path: '/kaprodi/rps' 
    },
  ];

  // Dosen menu items
  const dosenMenuItems = [
    { 
      icon: Home, 
      label: 'Dashboard', 
      path: '/dosen/dashboard' 
    },
    { 
      icon: BookOpen, 
      label: 'Mata Kuliah', 
      path: '/dosen/courses' 
    },
    { 
      icon: FileText, 
      label: 'RPS Saya', 
      path: '/dosen/rps' 
    },
  ];

  const getMenuItems = () => {
    switch (role) {
      case 'admin':
        return adminMenuItems;
      case 'kaprodi':
        return kaprodiMenuItems;
      case 'dosen':
        return dosenMenuItems;
      default:
        return dosenMenuItems;
    }
  };

  const menuItems = getMenuItems();

  return (
    <div className="min-h-screen bg-gray-100 lg:flex">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar - Always Fixed */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 lg:z-30
        w-64 bg-slate-900 text-white
        transform transition-transform duration-200 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="flex flex-col h-full overflow-hidden">
          {/* Logo - Fixed at Top */}
          <div className="flex-shrink-0 p-4 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white rounded-full p-1.5 flex items-center justify-center shadow-md">
                <img 
                  src="/logo-umm.png" 
                  alt="Logo Unismuh Makassar" 
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <h1 className="text-base font-bold leading-tight">SMART RPS</h1>
                <p className="text-xs text-slate-400">Unismuh Makassar</p>
                <p className="text-xs text-blue-400 capitalize font-medium">{role}</p>
              </div>
            </div>
            <button 
              className="lg:hidden p-1 hover:bg-slate-800 rounded"
              onClick={() => setSidebarOpen(false)}
            >
              <X size={20} />
            </button>
          </div>

          {/* Menu Items - Scrollable Area */}
          <nav className="flex-1 p-4 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-slate-800">
            <ul className="space-y-1 pb-4">
              {menuItems.map((item, index) => (
                <li key={index}>
                  <Link
                    to={item.path}
                    onClick={() => setSidebarOpen(false)}
                    className={`
                      flex items-center gap-3 px-4 py-3 rounded-lg transition-colors
                      ${isActive(item.path) 
                        ? 'bg-blue-600 text-white' 
                        : 'text-slate-300 hover:bg-slate-800 hover:text-white'}
                    `}
                  >
                    <item.icon size={20} />
                    <span>{item.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* User Info & Logout - Fixed at Bottom */}
          <div className="flex-shrink-0 p-3 md:p-4 border-t border-slate-800 bg-slate-900">
            <div className="bg-slate-800 rounded-lg p-2.5 md:p-3 mb-2 md:mb-3">
              <p className="text-xs md:text-sm font-medium truncate">{user.display_name || user.username || 'User'}</p>
              <p className="text-[10px] md:text-xs text-slate-400 truncate">{user.email || ''}</p>
            </div>
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-1.5 md:gap-2 px-3 md:px-4 py-2 md:py-2.5 bg-red-600 hover:bg-red-700 active:bg-red-800 rounded-lg transition-colors text-sm md:text-base font-medium"
            >
              <LogOut size={16} className="md:w-[18px] md:h-[18px]" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content - Add margin to accommodate fixed sidebar on desktop */}
      <div className="flex-1 flex flex-col min-h-screen lg:ml-64">
        {/* Top Header */}
        <header className="bg-white shadow-sm border-b border-gray-200 px-4 py-3 flex items-center justify-between lg:justify-end">
          <button 
            className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu size={24} />
          </button>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600 hidden sm:block">
              {new Date().toLocaleDateString('id-ID', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </span>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 md:p-6 overflow-auto pb-20 lg:pb-6">
          {children}
        </main>

        {/* Bottom Navigation - Mobile Only */}
        <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-40">
          <div className="flex items-center justify-around px-2 py-2">
            {menuItems.slice(0, 4).map((item, index) => (
              <Link
                key={index}
                to={item.path}
                className={`
                  flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-all flex-1
                  ${isActive(item.path) 
                    ? 'text-blue-600 bg-blue-50' 
                    : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'}
                `}
              >
                <item.icon size={20} strokeWidth={isActive(item.path) ? 2.5 : 2} />
                <span className="text-xs font-medium truncate max-w-full">{item.label}</span>
              </Link>
            ))}
            <button
              onClick={() => setSidebarOpen(true)}
              className="flex flex-col items-center gap-1 px-3 py-2 rounded-lg text-gray-600 hover:text-blue-600 hover:bg-gray-50 transition-all flex-1"
            >
              <Menu size={20} />
              <span className="text-xs font-medium">Menu</span>
            </button>
          </div>
        </nav>
      </div>
    </div>
  );
}

// Protected Route Component
function ProtectedRoute({ children, allowedRoles = [] }) {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(role)) {
    // Redirect to appropriate dashboard based on role
    switch (role) {
      case 'admin':
        return <Navigate to="/admin/dashboard" replace />;
      case 'kaprodi':
        return <Navigate to="/kaprodi/dashboard" replace />;
      case 'dosen':
        return <Navigate to="/dosen/dashboard" replace />;
      default:
        return <Navigate to="/login" replace />;
    }
  }

  return <Layout>{children}</Layout>;
}

// Main App Component
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<About />} />
        <Route path="/panduan" element={<Panduan />} />
        <Route path="/login" element={<Login />} />

        {/* Admin Routes */}
        <Route path="/admin/dashboard" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminDashboard />
          </ProtectedRoute>
        } />
        <Route path="/admin/prodi" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <ProdiManagement />
          </ProtectedRoute>
        } />
        <Route path="/admin/dosen" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminDosenManagement />
          </ProtectedRoute>
        } />
        <Route path="/admin/program" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <ProgramManagement />
          </ProtectedRoute>
        } />
        <Route path="/admin/courses" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <CourseManagement />
          </ProtectedRoute>
        } />
        <Route path="/admin/cpl" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <CPLManagement />
          </ProtectedRoute>
        } />
        <Route path="/admin/cpmk" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <CPMKManagement />
          </ProtectedRoute>
        } />
        <Route path="/admin/common-courses" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <CommonCourseManagement />
          </ProtectedRoute>
        } />

        {/* Kaprodi Routes */}
        <Route path="/kaprodi/dashboard" element={
          <ProtectedRoute allowedRoles={['kaprodi']}>
            <Dashboard />
          </ProtectedRoute>
        } />
        <Route path="/kaprodi/dosen" element={
          <ProtectedRoute allowedRoles={['kaprodi']}>
            <DosenManagement />
          </ProtectedRoute>
        } />
        <Route path="/kaprodi/courses" element={
          <ProtectedRoute allowedRoles={['kaprodi']}>
            <CourseManagement />
          </ProtectedRoute>
        } />
        <Route path="/kaprodi/cpl" element={
          <ProtectedRoute allowedRoles={['kaprodi']}>
            <CPLManagement />
          </ProtectedRoute>
        } />
        <Route path="/kaprodi/cpmk" element={
          <ProtectedRoute allowedRoles={['kaprodi']}>
            <CPMKManagement />
          </ProtectedRoute>
        } />
        <Route path="/kaprodi/rps" element={
          <ProtectedRoute allowedRoles={['kaprodi']}>
            <RPSList />
          </ProtectedRoute>
        } />
        <Route path="/kaprodi/rps/create" element={
          <ProtectedRoute allowedRoles={['kaprodi']}>
            <RPSCreate />
          </ProtectedRoute>
        } />
        <Route path="/kaprodi/rps/create/:id" element={
          <ProtectedRoute allowedRoles={['kaprodi']}>
            <RPSCreate />
          </ProtectedRoute>
        } />

        {/* Dosen Routes */}
        <Route path="/dosen/dashboard" element={
          <ProtectedRoute allowedRoles={['dosen']}>
            <DosenDashboard />
          </ProtectedRoute>
        } />
        <Route path="/dosen/courses" element={
          <ProtectedRoute allowedRoles={['dosen']}>
            <DosenMataKuliah />
          </ProtectedRoute>
        } />
        <Route path="/dosen/rps" element={
          <ProtectedRoute allowedRoles={['dosen']}>
            <DosenRPSList />
          </ProtectedRoute>
        } />
        <Route path="/dosen/rps/create" element={
          <ProtectedRoute allowedRoles={['dosen']}>
            <RPSCreate />
          </ProtectedRoute>
        } />
        <Route path="/dosen/rps/create/:id" element={
          <ProtectedRoute allowedRoles={['dosen']}>
            <RPSCreate />
          </ProtectedRoute>
        } />

        {/* Shared RPS Routes (accessible by kaprodi and dosen) */}
        <Route path="/rps/create" element={
          <ProtectedRoute allowedRoles={['kaprodi', 'dosen']}>
            <RPSCreate />
          </ProtectedRoute>
        } />
        <Route path="/rps/create/:id" element={
          <ProtectedRoute allowedRoles={['kaprodi', 'dosen']}>
            <RPSCreate />
          </ProtectedRoute>
        } />

        {/* Catch all - redirect to login */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
