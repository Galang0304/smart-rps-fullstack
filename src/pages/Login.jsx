import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, User, LogIn, AlertCircle } from 'lucide-react';
import api from '../services/api';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Check if already logged in
  useEffect(() => {
    try {
      const token = localStorage.getItem('token');
      const role = localStorage.getItem('role');
      if (token && role) {
        redirectToRole(role);
      }
    } catch (err) {
      console.warn('LocalStorage is not available:', err);
    }
  }, []);

  const redirectToRole = (role) => {
    switch (role) {
      case 'admin':
        navigate('/admin/dashboard', { replace: true });
        break;
      case 'kaprodi':
        navigate('/kaprodi/dashboard', { replace: true });
        break;
      case 'dosen':
        navigate('/dosen/dashboard', { replace: true });
        break;
      default:
        navigate('/');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await api.post('/auth/login', {
        username: username.trim(),
        password: password
      });

      const { token, user } = response.data.data;

      // Save to localStorage
      try {
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('role', user.role);
        
        // Save prodi_id if kaprodi
        if (user.prodi_id) {
          localStorage.setItem('prodi_id', user.prodi_id);
        }
      } catch (storageErr) {
        console.warn('Failed to access localStorage:', storageErr);
      }

      // Small delay to ensure localStorage is set
      setTimeout(() => {
        redirectToRole(user.role);
      }, 100);

    } catch (err) {
      console.error('Login error:', err);
      setError(err.response?.data?.message || 'Username atau password salah');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center bg-slate-900">
      {/* Background Image */}
      <div className="absolute inset-0">
        <picture>
          <source srcSet="/gedung-unismuh.webp" type="image/webp" />
          <source srcSet="/gedung-unismuh.jpg" type="image/jpeg" />
          <img 
            src="/gedung-unismuh.jpg" 
            alt="Gedung UNISMUH Makassar" 
            className="w-full h-full object-cover"
          />
        </picture>
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/80 via-blue-800/70 to-indigo-900/80"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-6xl mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          {/* Left Side - Branding */}
          <div className="hidden md:block text-white space-y-6">
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 bg-white rounded-2xl shadow-2xl flex items-center justify-center p-2">
                  <img 
                    src="/logo-umm.png" 
                    alt="Logo UNISMUH" 
                    className="w-full h-full object-contain"
                    loading="lazy"
                  />
                </div>
                <div>
                  <h1 className="text-4xl font-bold tracking-tight">SMART RPS</h1>
                  <p className="text-blue-200 text-sm mt-1">Universitas Muhammadiyah Makassar</p>
                </div>
              </div>
            </div>
            
            <div className="space-y-4 mt-8">
              <h2 className="text-3xl font-bold leading-tight">
                Sistem Manajemen<br />
                Rencana Pembelajaran<br />
                Semester Terintegrasi
              </h2>
              <p className="text-blue-100 text-lg leading-relaxed">
                Platform digital untuk mempermudah pengelolaan dan pembuatan RPS dengan bantuan AI
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-8">
              <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 border border-white/20">
                <div className="text-3xl font-bold">100+</div>
                <div className="text-blue-200 text-sm mt-1">Mata Kuliah</div>
              </div>
              <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 border border-white/20">
                <div className="text-3xl font-bold">50+</div>
                <div className="text-blue-200 text-sm mt-1">Dosen</div>
              </div>
            </div>

          </div>

          {/* Right Side - Login Form */}
          <div className="w-full max-w-md mx-auto">
            {/* Mobile Branding - Di atas form */}
            <div className="md:hidden text-center mb-6 text-white">
              <div className="flex justify-center mb-3">
                <div className="w-16 h-16 bg-white rounded-xl shadow-lg flex items-center justify-center p-2">
                  <img 
                    src="/logo-umm.png" 
                    alt="Logo UNISMUH" 
                    className="w-full h-full object-contain"
                    loading="lazy"
                  />
                </div>
              </div>
              <h3 className="text-xl font-bold mb-1">SMART RPS</h3>
              <p className="text-blue-200 text-sm">Universitas Muhammadiyah Makassar</p>
            </div>

            <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/20">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-800 mb-2">Selamat Datang</h2>
                <p className="text-gray-600">Silakan masuk untuk melanjutkan</p>
              </div>
            
              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="flex-shrink-0">
                      <AlertCircle className="w-5 h-5 text-red-600" />
                    </div>
                    <p className="text-sm text-red-700 font-medium">{error}</p>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Username
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
                    </div>
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="block w-full pl-12 pr-4 py-3.5 bg-gray-50 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white transition-all"
                      placeholder="Masukkan username"
                      required
                      disabled={loading}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Password
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
                    </div>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="block w-full pl-12 pr-4 py-3.5 bg-gray-50 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white transition-all"
                      placeholder="Masukkan password"
                      required
                      disabled={loading}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 px-4 rounded-xl hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-all font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Memproses...</span>
                    </>
                  ) : (
                    <>
                      <LogIn className="w-5 h-5" />
                      <span>Masuk ke Sistem</span>
                    </>
                  )}
                </button>
              </form>

              <div className="mt-8 pt-6 border-t border-gray-200">
                <p className="text-center text-sm text-gray-500 mb-3">
                  Butuh bantuan? Hubungi administrator
                </p>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="absolute bottom-0 left-0 right-0 p-4 text-center">
        <p className="text-white/80 text-sm backdrop-blur-sm bg-black/10 inline-block px-4 py-2 rounded-full">
          © 2025 Universitas Muhammadiyah Makassar
        </p>
      </div>
    </div>
  );
}
