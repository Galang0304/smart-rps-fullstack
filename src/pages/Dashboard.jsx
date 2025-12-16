import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, FileText, CheckCircle, Plus, TrendingUp, Users } from 'lucide-react';
import { courseAPI, generatedRPSAPI } from '../services/api';

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalCourses: 0,
    totalRPS: 0,
    completedRPS: 0,
    draftRPS: 0,
  });
  const [loading, setLoading] = useState(true);
  
  const userRole = localStorage.getItem('role');
  const prodiId = localStorage.getItem('prodi_id');

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      let courses = [];
      let rpsList = [];

      // Jika role prodi/kaprodi, filter berdasarkan prodi_id
      if ((userRole === 'prodi' || userRole === 'kaprodi') && prodiId) {
        const coursesRes = await courseAPI.getByProgramId(prodiId);
        
        // Handle nested response for courses
        if (coursesRes.data?.data?.data && Array.isArray(coursesRes.data.data.data)) {
          courses = coursesRes.data.data.data;
        } else if (coursesRes.data?.data && Array.isArray(coursesRes.data.data)) {
          courses = coursesRes.data.data;
        } else if (Array.isArray(coursesRes.data)) {
          courses = coursesRes.data;
        }

        // Get RPS untuk semua courses dalam prodi ini
        const rpsRes = await generatedRPSAPI.getAll();
        
        // Handle nested response structure
        let allRPS = [];
        if (rpsRes.data?.data?.data && Array.isArray(rpsRes.data.data.data)) {
          allRPS = rpsRes.data.data.data;
        } else if (rpsRes.data?.data && Array.isArray(rpsRes.data.data)) {
          allRPS = rpsRes.data.data;
        } else if (Array.isArray(rpsRes.data)) {
          allRPS = rpsRes.data;
        }
        
        // Filter RPS yang course_id nya ada di courses prodi ini
        const courseIds = new Set(courses.map(c => c.id));
        rpsList = Array.isArray(allRPS) ? allRPS.filter(rps => courseIds.has(rps.course_id)) : [];
      } else {
        // Admin atau role lain: tampilkan semua
        const [coursesRes, rpsRes] = await Promise.all([
          courseAPI.getAll(),
          generatedRPSAPI.getAll(),
        ]);
        
        // Handle nested response for courses
        if (coursesRes.data?.data?.data && Array.isArray(coursesRes.data.data.data)) {
          courses = coursesRes.data.data.data;
        } else if (coursesRes.data?.data && Array.isArray(coursesRes.data.data)) {
          courses = coursesRes.data.data;
        } else if (Array.isArray(coursesRes.data)) {
          courses = coursesRes.data;
        }
        
        // Handle nested response for RPS
        if (rpsRes.data?.data?.data && Array.isArray(rpsRes.data.data.data)) {
          rpsList = rpsRes.data.data.data;
        } else if (rpsRes.data?.data && Array.isArray(rpsRes.data.data)) {
          rpsList = rpsRes.data.data;
        } else if (Array.isArray(rpsRes.data)) {
          rpsList = rpsRes.data;
        }
      }

      // Ensure arrays before filter
      if (!Array.isArray(rpsList)) {
        console.error('rpsList is not an array:', rpsList);
        rpsList = [];
      }
      if (!Array.isArray(courses)) {
        console.error('courses is not an array:', courses);
        courses = [];
      }

      setStats({
        totalCourses: courses.length,
        totalRPS: rpsList.length,
        completedRPS: rpsList.filter((r) => r.status === 'completed').length,
        draftRPS: rpsList.filter((r) => r.status === 'draft').length,
      });
    } catch (error) {
      console.error('Failed to load stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Total Mata Kuliah',
      value: stats.totalCourses,
      icon: BookOpen,
      color: 'bg-blue-500',
      link: (userRole === 'prodi' || userRole === 'kaprodi') ? '/kaprodi/courses' : '/courses',
    },
    {
      title: 'Total RPS',
      value: stats.totalRPS,
      icon: FileText,
      color: 'bg-purple-500',
      link: (userRole === 'prodi' || userRole === 'kaprodi') ? '/kaprodi/rps' : '/rps/list',
    },
    {
      title: 'RPS Selesai',
      value: stats.completedRPS,
      icon: CheckCircle,
      color: 'bg-green-500',
    },
    {
      title: 'RPS Draft',
      value: stats.draftRPS,
      icon: TrendingUp,
      color: 'bg-yellow-500',
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  return (
    <div>
      {/* Page Header */}
      <div className="mb-6 md:mb-8">
        <h1 className="text-xl md:text-2xl font-bold text-gray-900 mb-1 md:mb-2">Dashboard</h1>
        <p className="text-sm md:text-base text-gray-600">Selamat datang di SMART RPS - Sistem Manajemen RPS dengan AI</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6 mb-6 md:mb-8">
        {statCards.map((card) => {
          const Icon = card.icon;
          const CardWrapper = card.link ? Link : 'div';
          const cardProps = card.link ? { to: card.link } : {};

          return (
            <CardWrapper
              key={card.title}
              {...cardProps}
              className={`bg-white rounded-xl shadow p-4 md:p-6 ${card.link ? 'hover:shadow-lg transition-shadow cursor-pointer' : ''}`}
            >
              <div className="flex items-center justify-between mb-2 md:mb-4">
                <div className={`${card.color} p-2 md:p-3 rounded-lg`}>
                  <Icon className="w-5 h-5 md:w-6 md:h-6 text-white" />
                </div>
              </div>
              <h3 className="text-gray-600 text-xs md:text-sm font-medium mb-0.5 md:mb-1">{card.title}</h3>
              <p className="text-2xl md:text-3xl font-bold text-gray-900">{card.value}</p>
            </CardWrapper>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow p-4 md:p-6">
        <h2 className="text-base md:text-lg font-semibold text-gray-900 mb-3 md:mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
          <Link
            to={(userRole === 'prodi' || userRole === 'kaprodi') ? '/kaprodi/courses' : '/courses'}
            className="flex items-center gap-3 p-3 md:p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
          >
            <div className="bg-blue-100 p-2 rounded-lg flex-shrink-0">
              <BookOpen className="w-5 h-5 text-blue-600" />
            </div>
            <div className="min-w-0">
              <p className="font-medium text-gray-900 text-sm md:text-base">Kelola Mata Kuliah</p>
              <p className="text-xs md:text-sm text-gray-500 truncate">Import CSV, tambah, edit</p>
            </div>
          </Link>

          <Link
            to={(userRole === 'prodi' || userRole === 'kaprodi') ? '/kaprodi/rps/create' : '/rps/create'}
            className="flex items-center gap-3 p-3 md:p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
          >
            <div className="bg-green-100 p-2 rounded-lg flex-shrink-0">
              <Plus className="w-5 h-5 text-green-600" />
            </div>
            <div className="min-w-0">
              <p className="font-medium text-gray-900 text-sm md:text-base">Buat RPS Baru</p>
              <p className="text-xs md:text-sm text-gray-500 truncate">Dengan bantuan AI</p>
            </div>
          </Link>

          <Link
            to={(userRole === 'prodi' || userRole === 'kaprodi') ? '/kaprodi/rps' : '/rps/list'}
            className="flex items-center gap-3 p-3 md:p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
          >
            <div className="bg-purple-100 p-2 rounded-lg flex-shrink-0">
              <FileText className="w-5 h-5 text-purple-600" />
            </div>
            <div className="min-w-0">
              <p className="font-medium text-gray-900 text-sm md:text-base">Lihat Daftar RPS</p>
              <p className="text-xs md:text-sm text-gray-500 truncate">Kelola dan export</p>
            </div>
          </Link>

          {(userRole === 'prodi' || userRole === 'kaprodi') && (
            <Link
              to="/kaprodi/dosen"
              className="flex items-center gap-3 p-3 md:p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
            >
              <div className="bg-orange-100 p-2 rounded-lg flex-shrink-0">
                <Users className="w-5 h-5 text-orange-600" />
              </div>
              <div className="min-w-0">
                <p className="font-medium text-gray-900 text-sm md:text-base">Kelola Dosen</p>
                <p className="text-xs md:text-sm text-gray-500 truncate">Buat akun & assign matkul</p>
              </div>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
