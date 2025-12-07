import React, { useState, useEffect } from 'react';
import { Users, Building2, BookOpen, FileText } from 'lucide-react';
import api from '../../services/api';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalProdis: 0,
    totalDosens: 0,
    totalCourses: 0,
    totalRPS: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      
      // Fetch each stat separately to handle errors individually
      let totalProdis = 0;
      let totalDosens = 0;
      let totalCourses = 0;
      let totalRPS = 0;

      try {
        const prodisRes = await api.get('/prodis');
        console.log('[Admin Dashboard] Prodis response:', prodisRes.data);
        
        // Try different response structures
        if (prodisRes.data.pagination?.total_items) {
          totalProdis = prodisRes.data.pagination.total_items;
        } else if (prodisRes.data.data?.pagination?.total_items) {
          totalProdis = prodisRes.data.data.pagination.total_items;
        } else if (Array.isArray(prodisRes.data.data?.data)) {
          totalProdis = prodisRes.data.data.data.length;
        } else if (Array.isArray(prodisRes.data.data)) {
          totalProdis = prodisRes.data.data.length;
        } else if (Array.isArray(prodisRes.data)) {
          totalProdis = prodisRes.data.length;
        }
        console.log('[Admin Dashboard] Total Prodis:', totalProdis);
      } catch (err) {
        console.warn('Failed to fetch prodis stats:', err.message);
      }

      try {
        const dosensRes = await api.get('/dosens');
        console.log('[Admin Dashboard] Dosens response:', dosensRes.data);
        
        // Try different response structures
        if (dosensRes.data.pagination?.total_items) {
          totalDosens = dosensRes.data.pagination.total_items;
        } else if (dosensRes.data.data?.pagination?.total_items) {
          totalDosens = dosensRes.data.data.pagination.total_items;
        } else if (Array.isArray(dosensRes.data.data?.data)) {
          totalDosens = dosensRes.data.data.data.length;
        } else if (Array.isArray(dosensRes.data.data)) {
          totalDosens = dosensRes.data.data.length;
        } else if (Array.isArray(dosensRes.data)) {
          totalDosens = dosensRes.data.length;
        }
        console.log('[Admin Dashboard] Total Dosens:', totalDosens);
      } catch (err) {
        console.warn('Failed to fetch dosens stats:', err.message);
      }

      try {
        const coursesRes = await api.get('/courses');
        console.log('[Admin Dashboard] Courses response:', coursesRes.data);
        
        // Try different response structures
        if (coursesRes.data.pagination?.total_items) {
          totalCourses = coursesRes.data.pagination.total_items;
        } else if (coursesRes.data.data?.pagination?.total_items) {
          totalCourses = coursesRes.data.data.pagination.total_items;
        } else if (Array.isArray(coursesRes.data.data?.data)) {
          totalCourses = coursesRes.data.data.data.length;
        } else if (Array.isArray(coursesRes.data.data)) {
          totalCourses = coursesRes.data.data.length;
        } else if (Array.isArray(coursesRes.data)) {
          totalCourses = coursesRes.data.length;
        }
        console.log('[Admin Dashboard] Total Courses:', totalCourses);
      } catch (err) {
        console.warn('Failed to fetch courses stats:', err.message);
      }

      try {
        const rpsRes = await api.get('/rps');
        console.log('[Admin Dashboard] RPS response:', rpsRes.data);
        
        // Try different response structures
        if (rpsRes.data.pagination?.total_items) {
          totalRPS = rpsRes.data.pagination.total_items;
        } else if (rpsRes.data.data?.pagination?.total_items) {
          totalRPS = rpsRes.data.data.pagination.total_items;
        } else if (Array.isArray(rpsRes.data.data?.data)) {
          totalRPS = rpsRes.data.data.data.length;
        } else if (Array.isArray(rpsRes.data.data)) {
          totalRPS = rpsRes.data.data.length;
        } else if (Array.isArray(rpsRes.data)) {
          totalRPS = rpsRes.data.length;
        }
        console.log('[Admin Dashboard] Total RPS:', totalRPS);
      } catch (err) {
        console.warn('Failed to fetch RPS stats:', err.message);
      }

      setStats({
        totalProdis,
        totalDosens,
        totalCourses,
        totalRPS,
      });
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Total Program Studi',
      value: stats.totalProdis,
      icon: Building2,
      color: 'bg-blue-500',
      bgLight: 'bg-blue-50',
      textColor: 'text-blue-600',
    },
    {
      title: 'Total Dosen',
      value: stats.totalDosens,
      icon: Users,
      color: 'bg-green-500',
      bgLight: 'bg-green-50',
      textColor: 'text-green-600',
    },
    {
      title: 'Total Mata Kuliah',
      value: stats.totalCourses,
      icon: BookOpen,
      color: 'bg-purple-500',
      bgLight: 'bg-purple-50',
      textColor: 'text-purple-600',
    },
    {
      title: 'Total RPS',
      value: stats.totalRPS,
      icon: FileText,
      color: 'bg-orange-500',
      bgLight: 'bg-orange-50',
      textColor: 'text-orange-600',
    },
  ];

  return (
    <div>
      <div className="mb-6 md:mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Dashboard Admin</h1>
        <p className="text-sm md:text-base text-gray-600 mt-1 md:mt-2">Selamat datang di SMART RPS - Panel Administrator</p>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      ) : (
        <>
          {/* Stats Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6 mb-6 md:mb-8">
            {statCards.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="bg-white rounded-xl shadow p-4 md:p-6">
                  <div className="flex items-center justify-between gap-2">
                    <div>
                      <p className="text-xs md:text-sm font-medium text-gray-600">{stat.title}</p>
                      <p className="text-2xl md:text-3xl font-bold text-gray-900 mt-1 md:mt-2">{stat.value}</p>
                    </div>
                    <div className={`${stat.bgLight} p-2 md:p-3 rounded-lg`}>
                      <Icon className={`w-5 h-5 md:w-8 md:h-8 ${stat.textColor}`} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-xl shadow p-4 md:p-6">
            <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-3 md:mb-4">Aksi Cepat</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
              <a
                href="/admin/prodis"
                className="flex items-center gap-3 md:gap-4 p-3 md:p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
              >
                <div className="bg-blue-100 p-2 md:p-3 rounded-lg">
                  <Building2 className="w-5 h-5 md:w-6 md:h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 text-sm md:text-base">Kelola Program Studi</h3>
                  <p className="text-xs md:text-sm text-gray-600">Tambah dan kelola prodi</p>
                </div>
              </a>

              <a
                href="/admin/dosens"
                className="flex items-center gap-3 md:gap-4 p-3 md:p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
              >
                <div className="bg-green-100 p-2 md:p-3 rounded-lg">
                  <Users className="w-5 h-5 md:w-6 md:h-6 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 text-sm md:text-base">Kelola Dosen</h3>
                  <p className="text-xs md:text-sm text-gray-600">Tambah dan kelola dosen</p>
                </div>
              </a>
            </div>
          </div>

          {/* Info Panel */}
          <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="font-semibold text-blue-900 mb-2">ℹ️ Informasi</h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Sebagai Admin, Anda dapat mengelola seluruh sistem</li>
              <li>• Buat akun Prodi baru dan credentials akan dikirim ke email Kaprodi</li>
              <li>• Kaprodi dapat membuat akun dosen dan mengelola RPS</li>
              <li>• Dosen hanya dapat mengakses RPS yang diberikan akses oleh Kaprodi</li>
            </ul>
          </div>
        </>
      )}
    </div>
  );
}
