import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Home, BookOpen, FileText, Users, Building2, LogOut, Settings, BookCheck } from 'lucide-react';

export default function Layout({ children }) {
  const location = useLocation();
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const role = localStorage.getItem('role');

  // Navigation items based on role
  const getNavigation = () => {
    switch (role) {
      case 'admin':
        return [
          { name: 'Dashboard', path: '/admin/dashboard', icon: Home },
          { name: 'Kelola Prodi', path: '/admin/prodis', icon: Building2 },
          { name: 'Kelola Program', path: '/admin/programs', icon: BookOpen },
          { name: 'Mata Kuliah', path: '/admin/courses', icon: BookOpen },
          { name: 'Kelola CPMK', path: '/admin/cpmk', icon: BookCheck },
          { name: 'Kelola Dosen', path: '/admin/dosens', icon: Users },
        ];
      case 'prodi':
      case 'kaprodi':
        return [
          { name: 'Dashboard', path: '/prodi/dashboard', icon: Home },
          { name: 'Mata Kuliah', path: '/prodi/courses', icon: BookOpen },
          { name: 'Kelola CPMK', path: '/prodi/cpmk', icon: BookCheck },
          { name: 'Daftar RPS', path: '/prodi/rps', icon: FileText },
          { name: 'Kelola Dosen', path: '/prodi/dosens', icon: Users },
        ];
      case 'dosen':
        return [
          { name: 'Dashboard', path: '/dosen/dashboard', icon: Home },
          { name: 'Mata Kuliah', path: '/dosen/mata-kuliah', icon: BookOpen },
          { name: 'RPS Saya', path: '/dosen/rps', icon: FileText },
        ];
      default:
        return [];
    }
  };

  const navigation = getNavigation();

  const isActive = (path) => location.pathname === path;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar - Hidden on mobile */}
      <div className="hidden md:block fixed inset-y-0 left-0 w-64 bg-white border-r border-gray-200">
        {/* Logo */}
        <div className="h-16 flex items-center gap-3 px-4 border-b border-gray-200">
          <img 
            src="/logo-ft.png" 
            alt="Fakultas Teknik UNISMUH Makassar" 
            className="w-10 h-10 object-contain"
          />
          <h1 className="text-xl font-bold text-blue-600">SMART RPS</h1>
        </div>

        {/* Navigation */}
        <nav className="mt-6 px-3">
          {navigation.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`
                  flex items-center gap-3 px-3 py-2 mb-1 rounded-lg transition-colors
                  ${isActive(item.path)
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-600 hover:bg-gray-50'
                  }
                `}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* User Info & Logout */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-blue-600 font-semibold">
                {(user.display_name || user.username || 'U')[0].toUpperCase()}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {user.display_name || user.username}
              </p>
              <span className={`inline-block text-xs px-2 py-0.5 rounded-full ${
                role === 'admin' ? 'bg-red-100 text-red-700' :
                role === 'prodi' || role === 'kaprodi' ? 'bg-blue-100 text-blue-700' :
                'bg-green-100 text-green-700'
              }`}>
                {role === 'admin' ? 'Admin' : role === 'prodi' || role === 'kaprodi' ? 'Kaprodi' : 'Dosen'}
              </span>
            </div>
          </div>
          <button
            onClick={() => {
              localStorage.clear();
              navigate('/login');
            }}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="md:ml-64 min-h-screen pb-20 md:pb-0">
        {/* Mobile Header */}
        <header className="md:hidden h-14 bg-white border-b border-gray-200 flex items-center justify-between px-4 sticky top-0 z-40">
          <div className="flex items-center gap-2">
            <img 
              src="/logo-ft.png" 
              alt="Logo" 
              className="w-8 h-8 object-contain"
            />
            <h1 className="text-lg font-bold text-blue-600">SMART RPS</h1>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-blue-600 font-semibold text-sm">
                {(user.display_name || user.username || 'U')[0].toUpperCase()}
              </span>
            </div>
          </div>
        </header>

        {/* Desktop Header */}
        <header className="hidden md:flex h-16 bg-white border-b border-gray-200 items-center px-8">
          <div className="flex-1">
            <h2 className="text-lg font-semibold text-gray-900">
              {navigation.find((item) => isActive(item.path))?.name || 'SMART RPS'}
            </h2>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-4 md:p-8">
          {children}
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
        <nav className="flex justify-around items-center h-16 px-2">
          {navigation.slice(0, 4).map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`
                  flex flex-col items-center justify-center py-2 px-3 rounded-lg min-w-0 flex-1
                  ${isActive(item.path)
                    ? 'text-blue-600'
                    : 'text-gray-500'
                  }
                `}
              >
                <Icon className={`w-5 h-5 ${isActive(item.path) ? 'text-blue-600' : 'text-gray-500'}`} />
                <span className={`text-xs mt-1 truncate ${isActive(item.path) ? 'font-semibold' : 'font-medium'}`}>
                  {item.name.split(' ')[0]}
                </span>
              </Link>
            );
          })}
          {/* Logout button di mobile navbar */}
          <button
            onClick={() => {
              localStorage.clear();
              navigate('/login');
            }}
            className="flex flex-col items-center justify-center py-2 px-3 rounded-lg min-w-0 flex-1 text-red-500"
          >
            <LogOut className="w-5 h-5" />
            <span className="text-xs mt-1 font-medium">Logout</span>
          </button>
        </nav>
      </div>
    </div>
  );
}
