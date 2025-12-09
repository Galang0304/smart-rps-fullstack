import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Mail, Search, Check, X, BookOpen, CheckCircle } from 'lucide-react';
import api from '../../services/api';

export default function DosenManagement() {
  const [dosens, setDosens] = useState([]);
  const [prodis, setProdis] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedDosen, setSelectedDosen] = useState(null);
  const [search, setSearch] = useState('');
  const [filterProdi, setFilterProdi] = useState('');
  const [showCoursesModal, setShowCoursesModal] = useState(false);
  const [selectedDosenForCourses, setSelectedDosenForCourses] = useState(null);
  const [allCourses, setAllCourses] = useState([]);
  const [dosenCourses, setDosenCourses] = useState([]);
  const [showResetModal, setShowResetModal] = useState(false);
  const [resetUsername, setResetUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [currentUserProdi, setCurrentUserProdi] = useState(null);
  const [formData, setFormData] = useState({
    prodi_id: '',
    nidn: '',
    nama_lengkap: '',
    email: '',
    no_telepon: '',
    jabatan_fungsional: '',
    username: '',
    password: '',
  });

  useEffect(() => {
    fetchCurrentUserProdi();
    fetchProdis();
  }, []);

  useEffect(() => {
    if (currentUserProdi) {
      fetchDosens();
    }
  }, [search, currentUserProdi]);

  const fetchCurrentUserProdi = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const role = localStorage.getItem('role');
      
      console.log('Current user:', user);
      console.log('Current role:', role);
      
      // Jika kaprodi atau prodi, ambil prodi_id dari user
      if (role === 'kaprodi' || role === 'prodi') {
        // Cari prodi berdasarkan user - gunakan /prodis/active
        const prodisRes = await api.get('/prodis/active');
        let allProdis = prodisRes.data.data?.data || prodisRes.data.data || [];
        
        console.log('All prodis:', allProdis);
        console.log('User ID to match:', user.id);
        
        // Find prodi where user_id matches current user
        let userProdi = allProdis.find(p => {
          console.log('Checking prodi:', p.nama_prodi, 'user_id:', p.user_id);
          return p.user_id === user.id;
        });
        
        // Jika tidak ketemu, coba ambil dari localStorage prodi_id
        if (!userProdi) {
          const prodiId = localStorage.getItem('prodi_id');
          console.log('Trying prodi_id from localStorage:', prodiId);
          if (prodiId) {
            userProdi = allProdis.find(p => p.id === prodiId);
          }
        }
        
        // Jika masih tidak ketemu, ambil prodi pertama yang aktif sebagai fallback
        if (!userProdi && allProdis.length > 0) {
          console.log('Using first prodi as fallback');
          userProdi = allProdis[0];
        }
        
        console.log('User prodi found:', userProdi);
        
        if (userProdi) {
          setCurrentUserProdi(userProdi);
          setFormData(prev => ({ ...prev, prodi_id: userProdi.id }));
          // Simpan ke localStorage untuk next time
          localStorage.setItem('prodi_id', userProdi.id);
        }
      }
    } catch (error) {
      console.error('Failed to fetch user prodi:', error);
    }
  };

  const fetchProdis = async () => {
    try {
      const response = await api.get('/prodis/active');
      setProdis(response.data.data.data || []);
    } catch (error) {
      console.error('Failed to fetch prodis:', error);
      setProdis([]);
    }
  };

  const fetchDosens = async () => {
    try {
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      
      // FILTER by current user prodi - hanya tampilkan dosen di prodi ini
      if (currentUserProdi?.id) {
        params.append('prodi_id', currentUserProdi.id);
      }
      
      console.log('Fetching dosens with params:', params.toString());
      
      const response = await api.get(`/dosens?${params.toString()}`);
      const dosenList = response.data.data.data || [];
      
      console.log('Dosens found:', dosenList.length);
      console.log('Sample dosen:', dosenList[0]);
      
      // Enrich with prodi name - backend sudah Preload("Prodi")
      const enriched = dosenList.map(dosen => {
        return {
          ...dosen,
          prodi_nama: dosen.prodi?.nama_prodi || '-'
        };
      });
      
      console.log('Enriched sample:', enriched[0]);
      
      setDosens(enriched);
    } catch (error) {
      console.error('Failed to fetch dosens:', error);
      alert('Gagal memuat data dosen');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Ensure prodi_id is set (from formData or currentUserProdi)
      const prodiId = formData.prodi_id || currentUserProdi?.id || null;
      
      console.log('Submitting with prodi_id:', prodiId);
      console.log('Form data:', formData);
      console.log('Current user prodi:', currentUserProdi);
      
      const submitData = {
        ...formData,
        prodi_id: prodiId,
      };

      if (editMode) {
        await api.put(`/dosens/${selectedDosen.id}`, submitData);
        alert('Dosen berhasil diupdate');
      } else {
        await api.post('/dosens', submitData);
        alert('Dosen berhasil ditambahkan! Email dengan credentials telah dikirim.');
      }
      fetchDosens();
      resetForm();
    } catch (error) {
      alert('Gagal menyimpan: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Yakin ingin menghapus dosen ini? Akun user juga akan terhapus.')) return;
    
    try {
      await api.delete(`/dosens/${id}`);
      alert('Dosen berhasil dihapus');
      fetchDosens();
    } catch (error) {
      alert('Gagal menghapus: ' + (error.response?.data?.message || error.message));
    }
  };

  const openResetModal = (dosen) => {
    if (dosen.user && dosen.user.username) {
      setResetUsername(dosen.user.username);
      setNewPassword('');
      setShowResetModal(true);
    } else {
      alert('Dosen ini belum memiliki akun user');
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!confirm(`Reset password untuk user "${resetUsername}"?`)) return;
    
    setLoading(true);
    try {
      await api.post('/auth/reset-password', {
        username: resetUsername,
        new_password: newPassword,
      });
      alert('Password berhasil direset!');
      setShowResetModal(false);
      setResetUsername('');
      setNewPassword('');
    } catch (error) {
      alert('Gagal reset password: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  const fetchAllCourses = async (prodiId) => {
    try {
      console.log('Fetching courses for prodi_id:', prodiId);
      
      // Fetch all courses - TAMPILKAN SEMUA untuk prodi ini tanpa filter program
      const response = await api.get('/courses');
      let courses = response.data.data.data || [];
      
      console.log('Total courses from API:', courses.length);
      console.log('All courses:', courses);
      
      // Untuk sementara, tampilkan semua mata kuliah yang ada
      // Nanti bisa di-filter lagi jika diperlukan
      setAllCourses(courses);
    } catch (error) {
      console.error('Failed to fetch courses:', error);
      setAllCourses([]);
    }
  };

  const fetchDosenCourses = async (dosenId) => {
    try {
      const response = await api.get(`/dosens/${dosenId}/courses`);
      setDosenCourses(response.data.data || []);
    } catch (error) {
      console.error('Failed to fetch dosen courses:', error);
      setDosenCourses([]);
    }
  };

  const openCoursesModal = async (dosen) => {
    console.log('Opening courses modal for dosen:', dosen);
    
    // Gunakan prodi_id dari dosen, atau dari currentUserProdi jika null
    const prodiId = dosen.prodi_id || currentUserProdi?.id;
    
    console.log('Using prodi_id:', prodiId);
    
    setSelectedDosenForCourses({
      ...dosen,
      prodi_id: prodiId,
      prodi_nama: dosen.prodi_nama || currentUserProdi?.nama_prodi
    });
    
    await fetchAllCourses(prodiId);
    await fetchDosenCourses(dosen.id);
    setShowCoursesModal(true);
  };

  const toggleCourseAssignment = (courseId) => {
    setDosenCourses(prev => {
      const exists = prev.some(c => c.id === courseId);
      if (exists) {
        return prev.filter(c => c.id !== courseId);
      } else {
        const course = allCourses.find(c => c.id === courseId);
        return course ? [...prev, course] : prev;
      }
    });
  };

  const saveCoursesAssignment = async () => {
    try {
      const courseIds = dosenCourses.map(c => c.id);
      await api.post(`/dosens/${selectedDosenForCourses.id}/courses`, {
        course_ids: courseIds
      });
      alert('Mata kuliah berhasil diassign! Email notifikasi telah dikirim.');
      setShowCoursesModal(false);
      setSelectedDosenForCourses(null);
      setAllCourses([]);
      setDosenCourses([]);
    } catch (error) {
      alert('Gagal menyimpan: ' + (error.response?.data?.message || error.message));
    }
  };

  const resetForm = () => {
    setFormData({
      prodi_id: currentUserProdi?.id || '',
      nidn: '',
      nama_lengkap: '',
      email: '',
      no_telepon: '',
      jabatan_fungsional: '',
      username: '',
      password: '',
    });
    setShowModal(false);
    setEditMode(false);
    setSelectedDosen(null);
  };

  const openEditModal = (dosen) => {
    setSelectedDosen(dosen);
    setFormData({
      prodi_id: dosen.prodi_id || '',
      nidn: dosen.nidn || '',
      nama_lengkap: dosen.nama_lengkap,
      email: dosen.email,
      no_telepon: dosen.no_telepon || '',
      jabatan_fungsional: dosen.jabatan_fungsional || '',
    });
    setEditMode(true);
    setShowModal(true);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Kelola Dosen</h1>
          <p className="text-gray-600 mt-1">Tambah dan kelola data dosen</p>
        </div>
        <button
          onClick={() => {
            // Ensure prodi_id is set when opening form
            const prodiId = currentUserProdi?.id || '';
            console.log('Opening form with prodi_id:', prodiId);
            console.log('Current user prodi:', currentUserProdi);
            
            setFormData({
              prodi_id: prodiId,
              nidn: '',
              nama_lengkap: '',
              email: '',
              no_telepon: '',
              jabatan_fungsional: '',
              username: '',
              password: '',
            });
            setShowModal(true);
          }}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          <Plus className="w-5 h-5" />
          Tambah Dosen
        </button>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari nama, NIDN, atau email..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div className="px-4 py-2 border border-gray-300 rounded-lg bg-blue-50 flex items-center">
          <span className="text-sm font-medium text-gray-700 mr-2">Prodi:</span>
          <span className="text-lg font-semibold text-blue-600">
            {currentUserProdi?.nama_prodi || 'Loading...'}
          </span>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <>
          <div className="hidden md:block bg-white rounded-xl shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                      NIDN
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                      Nama Lengkap
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                      Prodi
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                      Jabatan
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                      Mata Kuliah
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                      Aksi
                    </th>
                  </tr>
                </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {dosens.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="px-6 py-12 text-center text-gray-500">
                      Belum ada data dosen
                    </td>
                  </tr>
                ) : (
                  dosens.map((dosen) => (
                    <tr key={dosen.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {dosen.nidn}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {dosen.nama_lengkap}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {dosen.prodi_nama || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <Mail className="w-4 h-4" />
                          {dosen.email}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {dosen.jabatan_fungsional || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {dosen.is_active ? (
                          <span className="flex items-center gap-1 text-green-600 text-sm">
                            <Check className="w-4 h-4" /> Aktif
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 text-red-600 text-sm">
                            <X className="w-4 h-4" /> Nonaktif
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <button
                          onClick={() => openCoursesModal(dosen)}
                          className="flex items-center gap-1 text-blue-600 hover:text-blue-800"
                        >
                          <BookOpen className="w-4 h-4" />
                          Kelola Matkul
                        </button>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <div className="flex gap-2">
                          <button
                            onClick={() => openEditModal(dosen)}
                            className="text-blue-600 hover:text-blue-800"
                            title="Edit"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          {dosen.user && (
                            <button
                              onClick={() => openResetModal(dosen)}
                              className="text-orange-600 hover:text-orange-800"
                              title="Reset Password"
                            >
                              <Mail className="w-4 h-4" />
                            </button>
                          )}
                          <button
                            onClick={() => handleDelete(dosen.id)}
                            className="text-red-600 hover:text-red-800"
                            title="Hapus"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
              </table>
            </div>
          </div>

          <div className="md:hidden space-y-3">
            {dosens.length === 0 ? (
              <div className="bg-white rounded-xl p-8 text-center text-gray-500">
                Belum ada data dosen
              </div>
            ) : (
              dosens.map((dosen) => (
                <div
                  key={dosen.id}
                  className="bg-white rounded-xl shadow p-4"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                          {dosen.nidn || '-'}
                        </span>
                        {dosen.prodi_nama && (
                          <span className="px-2 py-0.5 bg-purple-100 text-purple-800 rounded-full text-xs">
                            {dosen.prodi_nama}
                          </span>
                        )}
                        {dosen.is_active ? (
                          <span className="flex items-center gap-0.5 text-green-600 text-xs">
                            <Check className="w-3 h-3" /> Aktif
                          </span>
                        ) : (
                          <span className="flex items-center gap-0.5 text-red-600 text-xs">
                            <X className="w-3 h-3" /> Nonaktif
                          </span>
                        )}
                      </div>
                      <h3 className="font-semibold text-gray-900 text-sm truncate">
                        {dosen.nama_lengkap}
                      </h3>
                    </div>
                  </div>

                  <div className="space-y-1 text-xs text-gray-600 mb-3">
                    {dosen.jabatan_fungsional && (
                      <p>
                        <span className="font-medium">Jabatan: </span>
                        {dosen.jabatan_fungsional}
                      </p>
                    )}
                    <p className="flex items-center gap-1">
                      <Mail className="w-3 h-3" />
                      <span className="truncate">{dosen.email}</span>
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2 pt-2 border-t border-gray-100">
                    <button
                      onClick={() => openCoursesModal(dosen)}
                      className="inline-flex items-center gap-1 px-2 py-1 text-xs text-blue-600 bg-blue-50 rounded"
                    >
                      <BookOpen className="w-3 h-3" />
                      Kelola
                    </button>
                    <button
                      onClick={() => openEditModal(dosen)}
                      className="inline-flex items-center gap-1 px-2 py-1 text-xs text-orange-600 bg-orange-50 rounded"
                    >
                      <Edit className="w-3 h-3" />
                      Edit
                    </button>
                    {dosen.user && (
                      <button
                        onClick={() => openResetModal(dosen)}
                        className="inline-flex items-center gap-1 px-2 py-1 text-xs text-yellow-700 bg-yellow-50 rounded"
                      >
                        <Mail className="w-3 h-3" />
                        Reset
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(dosen.id)}
                      className="inline-flex items-center gap-1 px-2 py-1 text-xs text-red-600 bg-red-50 rounded"
                    >
                      <Trash2 className="w-3 h-3" />
                      Hapus
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </>
      )}

      {/* Modal Form */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">
              {editMode ? 'Edit Dosen' : 'Tambah Dosen Baru'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              {currentUserProdi && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                  <label className="block text-sm font-medium text-blue-900 mb-1">
                    Program Studi
                  </label>
                  <p className="text-lg font-semibold text-blue-800">
                    {currentUserProdi.nama_prodi}
                  </p>
                  <p className="text-xs text-blue-600 mt-1">
                    📌 Dosen otomatis terdaftar di prodi Anda
                  </p>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  NIDN <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.nidn}
                  onChange={(e) => setFormData({ ...formData, nidn: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="0123456789"
                  required
                  minLength={8}
                  disabled={editMode}
                />
                {editMode && (
                  <p className="text-xs text-gray-500 mt-1">NIDN tidak dapat diubah</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nama Lengkap <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.nama_lengkap}
                  onChange={(e) => setFormData({ ...formData, nama_lengkap: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Dr. Jane Smith, M.T."
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="dosen@unismuh.ac.id"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    No. Telepon
                  </label>
                  <input
                    type="text"
                    value={formData.no_telepon}
                    onChange={(e) => setFormData({ ...formData, no_telepon: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="081234567890"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Jabatan Fungsional
                </label>
                <input
                  type="text"
                  value={formData.jabatan_fungsional}
                  onChange={(e) => setFormData({ ...formData, jabatan_fungsional: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Lektor, Asisten Ahli, dsb"
                />
              </div>

              {!editMode && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Username <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.username}
                        onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="jane_smith"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Password <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="password"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Minimal 6 karakter"
                        required
                        minLength={6}
                      />
                    </div>
                  </div>
                  
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <p className="text-sm text-blue-800">
                      📧 Email dengan username dan password akan otomatis dikirim ke email dosen
                    </p>
                  </div>
                </>
              )}

              <div className="flex gap-2 justify-end mt-6">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  {loading ? 'Menyimpan...' : editMode ? 'Update' : 'Simpan & Kirim Email'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Kelola Mata Kuliah */}
      {showCoursesModal && selectedDosenForCourses && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="mb-4">
              <h2 className="text-xl font-bold">Kelola Mata Kuliah Dosen</h2>
              <p className="text-gray-600 text-sm mt-1">
                Dosen: <span className="font-medium">{selectedDosenForCourses.nama_lengkap}</span>
              </p>
              <p className="text-gray-600 text-sm">
                Prodi: <span className="font-medium">{selectedDosenForCourses.prodi_nama || '-'}</span>
              </p>
              <p className="text-gray-500 text-xs mt-1">
                💡 Dosen hanya dapat akses RPS dari mata kuliah yang dipilih di sini
              </p>
            </div>

            {!selectedDosenForCourses.prodi_id ? (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
                <BookOpen className="w-12 h-12 text-yellow-400 mx-auto mb-2" />
                <p className="text-yellow-800 font-medium">Dosen belum terdaftar di prodi</p>
                <p className="text-yellow-700 text-sm mt-1">Silakan edit data dosen dan pilih prodi terlebih dahulu</p>
              </div>
            ) : allCourses.length === 0 ? (
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
                <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-600">Belum ada mata kuliah di prodi ini</p>
                <p className="text-gray-500 text-sm mt-1">Tambahkan mata kuliah di prodi {selectedDosenForCourses.prodi_nama} terlebih dahulu</p>
              </div>
            ) : (
              <div className="space-y-2 mb-4">
                <p className="text-sm text-gray-700 mb-3 font-medium">
                  Pilih mata kuliah yang diampu oleh dosen:
                </p>
                <div className="max-h-[400px] overflow-y-auto space-y-2">
                  {allCourses.map((course) => {
                    const isAssigned = dosenCourses.some(c => c.id === course.id);
                    return (
                      <div
                        key={course.id}
                        onClick={() => toggleCourseAssignment(course.id)}
                        className={`p-4 border rounded-lg cursor-pointer transition-all ${
                          isAssigned
                            ? 'bg-green-50 border-green-300 hover:bg-green-100'
                            : 'bg-white border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className="mt-1">
                            {isAssigned ? (
                              <CheckCircle className="w-5 h-5 text-green-600" />
                            ) : (
                              <div className="w-5 h-5 border-2 border-gray-300 rounded-full"></div>
                            )}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-gray-900">{course.code || 'N/A'}</span>
                              <span className="text-gray-600">-</span>
                              <span className="text-gray-900">{course.title || 'Untitled'}</span>
                            </div>
                            <div className="flex gap-3 mt-1 text-sm text-gray-500">
                              <span>SKS: {course.credits || '-'}</span>
                              <span>•</span>
                              <span>Semester: {course.semester || '-'}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="flex gap-2 justify-end mt-6 pt-4 border-t">
              <button
                onClick={() => {
                  setShowCoursesModal(false);
                  setSelectedDosenForCourses(null);
                  setAllCourses([]);
                  setDosenCourses([]);
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Batal
              </button>
              <button
                onClick={saveCoursesAssignment}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Simpan & Kirim Email
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reset Password Modal */}
      {showResetModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">Reset Password Dosen</h2>
            <form onSubmit={handleResetPassword} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Username
                </label>
                <input
                  type="text"
                  value={resetUsername}
                  disabled
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password Baru <span className="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Minimal 6 karakter"
                  minLength={6}
                  required
                />
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                <p className="text-sm text-yellow-800">
                  ⚠️ Password akan langsung direset. Pastikan Anda mencatat password baru ini untuk diberikan kepada dosen.
                </p>
              </div>

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowResetModal(false);
                    setResetUsername('');
                    setNewPassword('');
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-50"
                >
                  {loading ? 'Mereset...' : 'Reset Password'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
