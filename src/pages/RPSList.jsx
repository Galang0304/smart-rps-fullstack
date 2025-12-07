import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FileText, Download, Loader2, CheckCircle, Clock, AlertCircle, Trash2, Check } from 'lucide-react';
import { generatedRPSAPI, courseAPI } from '../services/api';

export default function RPSList() {
  const [rpsList, setRpsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, completed, draft
  
  const userRole = localStorage.getItem('role');
  const prodiId = localStorage.getItem('prodi_id');

  useEffect(() => {
    loadRPS();
  }, [filter]);

  const loadRPS = async () => {
    setLoading(true);
    try {
      const res = filter === 'all'
        ? await generatedRPSAPI.getAll()
        : await generatedRPSAPI.getByStatus(filter);
      
      console.log('RPS API response:', res);
      
      // Handle nested response structure
      let rpsData = [];
      if (res.data?.data?.data && Array.isArray(res.data.data.data)) {
        rpsData = res.data.data.data;
      } else if (res.data?.data && Array.isArray(res.data.data)) {
        rpsData = res.data.data;
      } else if (Array.isArray(res.data)) {
        rpsData = res.data;
      }

      console.log('Parsed RPS data:', rpsData);

      // Jika role prodi, filter RPS berdasarkan courses dalam prodi ini
      if ((userRole === 'prodi' || userRole === 'kaprodi') && prodiId) {
        const coursesRes = await courseAPI.getByProgramId(prodiId);
        
        // Handle nested response for courses too
        let courses = [];
        if (coursesRes.data?.data?.data && Array.isArray(coursesRes.data.data.data)) {
          courses = coursesRes.data.data.data;
        } else if (coursesRes.data?.data && Array.isArray(coursesRes.data.data)) {
          courses = coursesRes.data.data;
        } else if (Array.isArray(coursesRes.data)) {
          courses = coursesRes.data;
        }
        
        console.log('Courses for filtering:', courses);
        const courseIds = new Set(courses.map(c => c.id));
        rpsData = rpsData.filter(rps => courseIds.has(rps.course_id));
        console.log('Filtered RPS data:', rpsData);
      }

      // Ensure rpsData is always an array
      if (!Array.isArray(rpsData)) {
        console.error('rpsData is not an array:', rpsData);
        rpsData = [];
      }

      setRpsList(rpsData);
    } catch (error) {
      console.error('Failed to load RPS:', error);
      setRpsList([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, title) => {
    if (!confirm(`Apakah Anda yakin ingin menghapus RPS "${title}"?`)) {
      return;
    }

    try {
      await generatedRPSAPI.delete(id);
      alert('RPS berhasil dihapus');
      loadRPS(); // Reload list
    } catch (error) {
      console.error('Failed to delete RPS:', error);
      alert('Gagal menghapus RPS: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleMarkAsCompleted = async (id, title) => {
    if (!confirm(`Tandai RPS "${title}" sebagai Selesai?`)) {
      return;
    }

    try {
      await generatedRPSAPI.updateStatus(id, 'completed');
      alert('RPS berhasil ditandai sebagai Selesai');
      loadRPS(); // Reload list
    } catch (error) {
      console.error('Failed to update RPS status:', error);
      alert('Gagal update status RPS: ' + (error.response?.data?.message || error.message));
    }
  };

  const getStatusBadge = (status) => {
    const config = {
      completed: { icon: CheckCircle, text: 'Selesai', className: 'bg-green-100 text-green-800' },
      draft: { icon: Clock, text: 'Draft', className: 'bg-yellow-100 text-yellow-800' },
      processing: { icon: Loader2, text: 'Processing', className: 'bg-blue-100 text-blue-800' },
      failed: { icon: AlertCircle, text: 'Gagal', className: 'bg-red-100 text-red-800' },
    };
    const { icon: Icon, text, className } = config[status] || config.draft;
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${className}`}>
        <Icon className="w-3 h-3" />
        {text}
      </span>
    );
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Daftar RPS</h1>
          <p className="text-gray-600 mt-1">Kelola dan export RPS yang telah dibuat</p>
        </div>
        <Link
          to={(userRole === 'prodi' || userRole === 'kaprodi') ? '/prodi/rps/create' : '/rps/create'}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <FileText className="w-5 h-5" />
          <span>Buat RPS Baru</span>
        </Link>
      </div>

      {/* Filters */}
      <div className="mb-6 flex gap-2">
        {['all', 'completed', 'draft'].map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === status
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
            }`}
          >
            {status === 'all' ? 'Semua' : status === 'completed' ? 'Selesai' : 'Draft'}
          </button>
        ))}
      </div>

      {/* RPS List */}
      {loading ? (
        <div className="flex items-center justify-center h-64 bg-white rounded-lg shadow">
          <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
        </div>
      ) : rpsList.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 bg-white rounded-lg shadow text-gray-500">
          <FileText className="w-12 h-12 mb-2 opacity-50" />
          <p>Belum ada RPS</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.isArray(rpsList) && rpsList.map((rps) => (
            <div
              key={rps.id}
              className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow border border-gray-200 overflow-hidden"
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-4 text-white">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-bold text-lg line-clamp-2">
                      {rps.course?.title || 'Untitled RPS'}
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
                  <CheckCircle className="w-4 h-4" />
                  <span>{rps.course?.credits || 0} SKS • Semester {rps.course?.semester || '-'}</span>
                </div>

                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Clock className="w-4 h-4" />
                  <span>
                    {rps.created_at
                      ? new Date(rps.created_at).toLocaleDateString('id-ID')
                      : '-'}
                  </span>
                </div>

                <div className="pt-2 border-t">
                  {getStatusBadge(rps.status)}
                </div>
              </div>

              {/* Footer */}
              <div className="p-4 bg-gray-50 border-t">
                <div className="flex gap-2 mb-2">
                  <Link
                    to={(userRole === 'prodi' || userRole === 'kaprodi') 
                      ? `/prodi/rps/create/${rps.course_id}?edit=${rps.id}`
                      : `/rps/create/${rps.course_id}?edit=${rps.id}`
                    }
                    className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <FileText className="w-4 h-4" />
                    Edit RPS
                  </Link>
                  <button
                    onClick={() => window.open(`http://localhost:8080/api/v1/generated/${rps.id}/export`, '_blank')}
                    className="flex items-center justify-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    Export
                  </button>
                </div>
                <div className="flex gap-2">
                  {rps.status === 'draft' && (
                    <button
                      onClick={() => handleMarkAsCompleted(rps.id, rps.course?.title || 'Untitled')}
                      className="flex-1 flex items-center justify-center gap-1 px-3 py-2 text-sm bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                      title="Tandai Selesai"
                    >
                      <Check className="w-4 h-4" />
                      Tandai Selesai
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(rps.id, rps.course?.title || 'Untitled')}
                    className="flex-1 flex items-center justify-center gap-1 px-3 py-2 text-sm bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                    title="Hapus RPS"
                  >
                    <Trash2 className="w-4 h-4" />
                    Hapus
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
