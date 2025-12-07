import React, { useState, useEffect } from 'react';
import { BookOpen, FileText, Clock, CheckCircle, GraduationCap } from 'lucide-react';
import api from '../../services/api';

export default function DosenDashboard() {
  const [stats, setStats] = useState({
    totalRPS: 0,
    recentRPS: [],
  });
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    setUserInfo(user);
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Get dosen info from current user
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      if (!user.id) {
        console.error('User ID not found');
        return;
      }

      // Get all dosens and find the one matching current user
      const dosenListResponse = await api.get('/dosens');
      console.log('[Dosen Dashboard] Dosens response:', dosenListResponse.data);
      const dosenList = Array.isArray(dosenListResponse.data?.data?.data) 
        ? dosenListResponse.data.data.data 
        : (Array.isArray(dosenListResponse.data?.data) ? dosenListResponse.data.data : []);
      console.log('[Dosen Dashboard] Dosen list:', dosenList);
      const currentDosen = dosenList.find(d => d.user_id === user.id);
      
      if (!currentDosen) {
        console.error('Dosen record not found for user');
        setLoading(false);
        return;
      }

      console.log('[Dosen Dashboard] Current dosen:', currentDosen);

      // Get courses assigned to this dosen
      const coursesResponse = await api.get(`/dosens/${currentDosen.id}/courses`);
      console.log('[Dosen Dashboard] Courses response:', coursesResponse.data);
      const coursesData = Array.isArray(coursesResponse.data?.data) 
        ? coursesResponse.data.data 
        : [];

      // Get RPS filtered by dosen's courses
      const rpsResponse = await api.get(`/generated?dosen_id=${currentDosen.id}`);
      console.log('[Dosen Dashboard] RPS response:', rpsResponse.data);
      const rpsData = Array.isArray(rpsResponse.data?.data?.data) 
        ? rpsResponse.data.data.data 
        : (Array.isArray(rpsResponse.data?.data) ? rpsResponse.data.data : []);

      setCourses(coursesData);
      setStats({
        totalCourses: coursesData.length,
        totalRPS: rpsData.length,
        recentRPS: rpsData.slice(0, 5),
      });
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 md:mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
          Selamat Datang, {userInfo?.name || 'Dosen'}
        </h1>
        <p className="text-sm md:text-base text-gray-600 mt-1 md:mt-2">
          Portal akses RPS yang telah diberikan oleh Kaprodi
        </p>
      </div>

      {/* Stats Card */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6 mb-6 md:mb-8">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg p-4 md:p-6 text-white">
          <div className="flex items-center justify-between gap-2">
            <div>
              <p className="text-blue-100 text-xs md:text-sm font-medium">Mata Kuliah</p>
              <p className="text-2xl md:text-3xl font-bold mt-1 md:mt-2">{stats.totalCourses || 0}</p>
            </div>
            <BookOpen className="w-7 h-7 md:w-12 md:h-12 text-blue-200" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow p-4 md:p-6 border border-gray-200">
          <div className="flex items-center justify-between gap-2">
            <div>
              <p className="text-gray-500 text-xs md:text-sm font-medium">Total RPS</p>
              <p className="text-xl md:text-2xl font-bold text-gray-900 mt-1 md:mt-2">{stats.totalRPS || 0}</p>
            </div>
            <FileText className="w-7 h-7 md:w-10 md:h-10 text-purple-500" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow p-4 md:p-6 border border-gray-200">
          <div className="flex items-center justify-between gap-2">
            <div>
              <p className="text-gray-500 text-xs md:text-sm font-medium">RPS Tersedia</p>
              <p className="text-xl md:text-2xl font-bold text-gray-900 mt-1 md:mt-2">{stats.totalRPS || 0}</p>
            </div>
            <CheckCircle className="w-7 h-7 md:w-10 md:h-10 text-green-500" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow p-4 md:p-6 border border-gray-200">
          <div className="flex items-center justify-between gap-2">
            <div>
              <p className="text-gray-500 text-xs md:text-sm font-medium">Status</p>
              <p className="text-sm md:text-lg font-bold text-green-600 mt-1 md:mt-2">Aktif</p>
            </div>
            <Clock className="w-7 h-7 md:w-10 md:h-10 text-orange-500" />
          </div>
        </div>
      </div>

      {/* Recent RPS */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">RPS Terbaru</h2>
        
        {stats.recentRPS.length === 0 ? (
          <div className="text-center py-12">
            <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">Belum ada RPS yang diberikan</p>
            <p className="text-gray-400 text-sm mt-2">
              Hubungi Kaprodi untuk mendapatkan akses RPS
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {stats.recentRPS.map((rps) => (
              <div
                key={rps.id}
                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <FileText className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{rps.course?.title || 'RPS'}</h3>
                    <p className="text-sm text-gray-500">
                      Kode: {rps.course?.code || '-'} • SKS: {rps.course?.credits || '-'}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                    Aktif
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {stats.totalRPS > 5 && (
          <div className="mt-4 text-center">
            <a
              href="/dosen/rps"
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Lihat Semua RPS →
            </a>
          </div>
        )}
      </div>

      {/* Info Boxes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Akses RPS
          </h3>
          <p className="text-sm text-blue-800">
            Anda dapat melihat dan mengekspor RPS yang telah diberikan akses oleh Kaprodi.
            Gunakan menu "RPS Saya" untuk melihat daftar lengkap.
          </p>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-lg p-6">
          <h3 className="font-semibold text-green-900 mb-2 flex items-center gap-2">
            <CheckCircle className="w-5 h-5" />
            Fitur Tersedia
          </h3>
          <ul className="text-sm text-green-800 space-y-1">
            <li>✓ Lihat detail RPS lengkap</li>
            <li>✓ Export RPS ke Word</li>
            <li>✓ Akses riwayat perubahan</li>
            <li>✓ Download dokumen RPS</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
