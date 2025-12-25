import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FileText, Download, Loader2, CheckCircle, Clock, AlertCircle, Trash2, Check, Edit, X } from 'lucide-react';
import { generatedRPSAPI, courseAPI, programAPI, API_BASE_URL } from '../services/api';

export default function RPSList() {
  const navigate = useNavigate();
  const [rpsList, setRpsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, completed, draft
  const [showExportModal, setShowExportModal] = useState(false);
  const [selectedRPS, setSelectedRPS] = useState(null);
  
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

      // Jika role prodi/kaprodi, filter RPS berdasarkan courses dalam prodi ini
      if ((userRole === 'prodi' || userRole === 'kaprodi') && prodiId) {
        // Step 1: Get programs by prodi_id
        const programsRes = await programAPI.getAll({ prodi_id: prodiId });
        let programs = [];
        if (programsRes.data?.data?.data && Array.isArray(programsRes.data.data.data)) {
          programs = programsRes.data.data.data;
        } else if (programsRes.data?.data && Array.isArray(programsRes.data.data)) {
          programs = programsRes.data.data;
        } else if (Array.isArray(programsRes.data)) {
          programs = programsRes.data;
        }
        
        console.log('Programs for prodi:', programs);
        
        // Step 2: Get all courses from all programs in this prodi
        let allCourses = [];
        for (const program of programs) {
          try {
            const coursesRes = await courseAPI.getByProgramId(program.id);
            let courses = [];
            if (coursesRes.data?.data?.data && Array.isArray(coursesRes.data.data.data)) {
              courses = coursesRes.data.data.data;
            } else if (coursesRes.data?.data && Array.isArray(coursesRes.data.data)) {
              courses = coursesRes.data.data;
            } else if (Array.isArray(coursesRes.data)) {
              courses = coursesRes.data;
            }
            allCourses = allCourses.concat(courses);
          } catch (err) {
            console.error('Failed to get courses for program:', program.id, err);
          }
        }
        
        console.log('All courses for filtering:', allCourses);
        const courseIds = new Set(allCourses.map(c => c.id));
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

  const handleExport = async (rpsId, mataKuliah) => {
    try {
      const response = await fetch(`${API_BASE_URL}/generated/${rpsId}/export-html`);
      const blob = await response.blob();
      
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `RPS_${mataKuliah}_${new Date().getTime()}.html`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Export failed:', error);
      alert('Gagal mengekspornya RPS');
    }
  };

  const handleExportWord = async (rpsId, mataKuliah) => {
    try {
      const response = await fetch(`${API_BASE_URL}/generated/${rpsId}/export-word`);
      const blob = await response.blob();
      
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `RPS_${mataKuliah}_${new Date().getTime()}.docx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      setShowExportModal(false);
    } catch (error) {
      console.error('Export Word failed:', error);
      alert('Gagal mengekspornya ke Word');
    }
  };

  const handleExportExcel = async (rpsId, mataKuliah) => {
    try {
      const response = await fetch(`${API_BASE_URL}/generated/${rpsId}/export-excel`);
      const blob = await response.blob();
      
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `RPS_${mataKuliah}_${new Date().getTime()}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      setShowExportModal(false);
    } catch (error) {
      console.error('Export Excel failed:', error);
      alert('Gagal mengekspornya ke Excel');
    }
  };

  const openExportModal = (rps) => {
    setSelectedRPS(rps);
    setShowExportModal(true);
  };

  const handleExportChoice = async (format) => {
    if (!selectedRPS) return;
    
    if (format === 'html') {
      await handleExport(selectedRPS.id, selectedRPS.course?.title || 'Untitled');
    } else if (format === 'word') {
      await handleExportWord(selectedRPS.id, selectedRPS.course?.title || 'Untitled');
    } else if (format === 'excel') {
      await handleExportExcel(selectedRPS.id, selectedRPS.course?.title || 'Untitled');
    }
    setShowExportModal(false);
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
          to={(userRole === 'prodi' || userRole === 'kaprodi') ? '/kaprodi/rps/create' : '/rps/create'}
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

                <div className="flex gap-2 mb-2">
                  <button
                    onClick={() => navigate(
                      (userRole === 'prodi' || userRole === 'kaprodi')
                        ? `/kaprodi/rps/create/${rps.course_id}?edit=${rps.id}`
                        : `/rps/create/${rps.course_id}?edit=${rps.id}`
                    )}
                    className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                    Edit
                  </button>
                  <button
                    onClick={() => openExportModal(rps)}
                    className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-green-600 to-blue-600 text-white px-4 py-2 rounded-lg hover:from-green-700 hover:to-blue-700 transition-all shadow-md hover:shadow-lg"
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

      {/* Export Modal */}
      {showExportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 transform transition-all animate-slideUp">
            {/* Header */}
            <div className="bg-gradient-to-r from-green-600 to-blue-600 px-6 py-4 rounded-t-2xl flex justify-between items-center">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <Download className="w-6 h-6" />
                Pilih Format Export
              </h3>
              <button
                onClick={() => setShowExportModal(false)}
                className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-1 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6">
              <p className="text-gray-600 mb-6 text-center">
                Pilih format dokumen yang ingin Anda download
              </p>

              <div className="space-y-3">
                {/* HTML Option */}
                <button
                  onClick={() => handleExportChoice('html')}
                  className="w-full group relative overflow-hidden bg-gradient-to-r from-green-50 to-emerald-50 hover:from-green-100 hover:to-emerald-100 border-2 border-green-200 hover:border-green-400 rounded-xl p-6 transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
                >
                  <div className="flex items-center gap-4">
                    <div className="bg-green-600 text-white p-3 rounded-lg group-hover:bg-green-700 transition-colors">
                      <FileText className="w-8 h-8" />
                    </div>
                    <div className="text-left flex-1">
                      <h4 className="font-bold text-lg text-green-800">PDF</h4>
                      <p className="text-sm text-green-600">Format PDF, buka di browser</p>
                    </div>
                    <Download className="w-6 h-6 text-green-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </button>

                {/* Word Option - DISABLED/HIDDEN
                <button
                  onClick={() => handleExportChoice('word')}
                  className="w-full group relative overflow-hidden bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 border-2 border-blue-200 hover:border-blue-400 rounded-xl p-6 transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
                >
                  <div className="flex items-center gap-4">
                    <div className="bg-blue-600 text-white p-3 rounded-lg group-hover:bg-blue-700 transition-colors">
                      <FileText className="w-8 h-8" />
                    </div>
                    <div className="text-left flex-1">
                      <h4 className="font-bold text-lg text-blue-800">Word</h4>
                      <p className="text-sm text-blue-600">Format Microsoft Word (.docx)</p>
                    </div>
                    <Download className="w-6 h-6 text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </button>
                */}

                {/* Excel Option */}
                <button
                  onClick={() => handleExportChoice('excel')}
                  className="w-full group relative overflow-hidden bg-gradient-to-r from-emerald-50 to-teal-50 hover:from-emerald-100 hover:to-teal-100 border-2 border-emerald-200 hover:border-emerald-400 rounded-xl p-6 transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
                >
                  <div className="flex items-center gap-4">
                    <div className="bg-emerald-600 text-white p-3 rounded-lg group-hover:bg-emerald-700 transition-colors">
                      <FileText className="w-8 h-8" />
                    </div>
                    <div className="text-left flex-1">
                      <h4 className="font-bold text-lg text-emerald-800">Excel</h4>
                      <p className="text-sm text-emerald-600">Format Microsoft Excel (.xlsx)</p>
                    </div>
                    <Download className="w-6 h-6 text-emerald-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </button>
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 pb-6">
              <button
                onClick={() => setShowExportModal(false)}
                className="w-full px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Batal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
