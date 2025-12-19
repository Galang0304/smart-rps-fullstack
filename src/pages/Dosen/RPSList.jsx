import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Download, FileText, Calendar, User, Search, Edit } from 'lucide-react';
import api from '../../services/api';

export default function RPSList() {
  const [rpsList, setRpsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [dosenId, setDosenId] = useState(null);

  useEffect(() => {
    fetchDosenInfo();
  }, []);

  useEffect(() => {
    if (dosenId) {
      fetchRPSAccess();
    }
  }, [dosenId, search]);

  const fetchDosenInfo = async () => {
    try {
      // Get current user
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      if (!user.id) return;

      // Find dosen record
      const dosenListResponse = await api.get('/dosens');
      console.log('[Dosen RPSList] Dosens response:', dosenListResponse.data);
      const dosenList = Array.isArray(dosenListResponse.data?.data?.data) 
        ? dosenListResponse.data.data.data 
        : (Array.isArray(dosenListResponse.data?.data) ? dosenListResponse.data.data : []);
      console.log('[Dosen RPSList] Dosen list:', dosenList);
      const currentDosen = dosenList.find(d => d.user_id === user.id);
      
      if (currentDosen) {
        console.log('[Dosen RPSList] Current dosen:', currentDosen);
        setDosenId(currentDosen.id);
      } else {
        console.error('[Dosen RPSList] Dosen not found for user');
        alert('Data dosen tidak ditemukan');
      }
    } catch (error) {
      console.error('Failed to fetch dosen info:', error);
      alert('Gagal memuat informasi dosen');
    }
  };

  const fetchRPSAccess = async () => {
    try {
      // Fetch RPS filtered by dosen's assigned courses
      const response = await api.get(`/generated?dosen_id=${dosenId}`);
      console.log('[Dosen RPSList] RPS response:', response.data);
      let data = Array.isArray(response.data?.data?.data) 
        ? response.data.data.data 
        : (Array.isArray(response.data?.data) ? response.data.data : []);
      console.log('[Dosen RPSList] RPS data:', data);
      
      // Filter by search
      if (search) {
        data = data.filter(
          (rps) =>
            rps.course?.title?.toLowerCase().includes(search.toLowerCase()) ||
            rps.course?.code?.toLowerCase().includes(search.toLowerCase())
        );
      }
      
      setRpsList(data);
    } catch (error) {
      console.error('Failed to fetch RPS:', error);
      alert('Gagal memuat daftar RPS');
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async (rpsId, mataKuliah) => {
    try {
      const response = await api.get(`/generated/${rpsId}/export-html`, {
        responseType: 'blob',
      });
      
      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data], { type: 'text/html' }));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `RPS_${mataKuliah}_${new Date().getTime()}.html`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      
      alert('RPS berhasil diexport!');
    } catch (error) {
      console.error('Failed to export RPS:', error);
      alert('Gagal export RPS: ' + (error.response?.data?.message || error.message));
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">RPS Saya</h1>
        <p className="text-gray-600 mt-1">Daftar RPS yang dapat Anda akses</p>
      </div>

      {/* Search */}
      <div className="mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari mata kuliah atau kode..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : rpsList.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {search ? 'Tidak ada RPS ditemukan' : 'Belum ada RPS'}
          </h3>
          <p className="text-gray-500">
            {search 
              ? 'Coba kata kunci pencarian yang berbeda'
              : 'Hubungi Kaprodi untuk mendapatkan akses RPS'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rpsList.map((rps) => (
            <div
              key={rps.id}
              className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow border border-gray-200 overflow-hidden"
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-4 text-white">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-bold text-lg line-clamp-2">
                      {rps.course?.title || 'RPS'}
                    </h3>
                    <p className="text-blue-100 text-sm mt-1">
                      {rps.course?.code || '-'}
                    </p>
                  </div>
                  <FileText className="w-8 h-8 text-blue-100" />
                </div>
              </div>

              {/* Body */}
              <div className="p-4 space-y-3">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <BookOpen className="w-4 h-4" />
                  <span>{rps.course?.credits || 0} SKS • Semester {rps.course?.semester || '-'}</span>
                </div>

                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Calendar className="w-4 h-4" />
                  <span>
                    {rps.created_at
                      ? new Date(rps.created_at).toLocaleDateString('id-ID')
                      : '-'}
                  </span>
                </div>

                {rps.course_description && (
                  <p className="text-sm text-gray-600 line-clamp-2 pt-2 border-t">
                    {rps.course_description}
                  </p>
                )}

                <div className="pt-2 border-t">
                  <span className={`inline-block px-2 py-1 text-xs font-medium rounded ${
                    rps.status === 'completed' ? 'bg-green-100 text-green-800' :
                    rps.status === 'draft' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {rps.status || 'draft'}
                  </span>
                </div>
              </div>

              {/* Footer */}
              <div className="p-4 bg-gray-50 border-t">
                <div className="flex gap-2">
                  <Link
                    to={`/dosen/rps/create/${rps.course_id}?edit=${rps.id}`}
                    className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                    Edit RPS
                  </Link>
                  <button
                    onClick={() => handleExport(rps.id, rps.course?.title || 'RPS')}
                    className="flex-1 flex items-center justify-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    Export
                  </button>
                </div>
                <div className="mt-2 text-center">
                  <span className="inline-flex items-center gap-1 text-xs text-green-600 font-medium">
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    Mata Kuliah Diampu
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Info Box */}
      {rpsList.length > 0 && (
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-semibold text-blue-900 mb-2">💡 Informasi</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Anda dapat mengexport RPS ke format Word untuk keperluan dokumentasi</li>
            <li>• RPS yang ditampilkan adalah yang telah diberikan akses oleh Kaprodi</li>
            <li>• Untuk RPS tambahan, hubungi Kaprodi program studi Anda</li>
          </ul>
        </div>
      )}
    </div>
  );
}
