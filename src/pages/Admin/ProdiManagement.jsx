import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Mail, Search, Check, X } from 'lucide-react';
import api from '../../services/api';
import Toast from '../../components/Toast';
import { useToast } from '../../hooks/useToast';

export default function ProdiManagement() {
  const [prodis, setProdis] = useState([]);
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const { toasts, success, error, warning, removeToast } = useToast();
  const [selectedProdi, setSelectedProdi] = useState(null);
  const [search, setSearch] = useState('');
  const [showResetModal, setShowResetModal] = useState(false);
  const [resetUsername, setResetUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [formData, setFormData] = useState({
    program_id: '',
    kode_prodi: '',
    nama_prodi: '',
    fakultas: 'Fakultas Teknik',
    jenjang: 'S1',
    email_kaprodi: '',
    nama_kaprodi: '',
    username: '',
    password: '',
  });

  useEffect(() => {
    fetchPrograms();
    fetchProdis();
  }, [search]);

  const fetchPrograms = async () => {
    try {
      const response = await api.get('/programs');
      setPrograms(response.data.data.data || []);
    } catch (error) {
      console.error('Failed to fetch programs:', error);
    }
  };

  const fetchProdis = async () => {
    try {
      const response = await api.get(`/prodis?search=${search}`);
      console.log('Prodis response:', response.data);
      setProdis(response.data.data || []);
    } catch (error) {
      console.error('Failed to fetch prodis:', error);
      error('Gagal memuat data prodi');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      if (editMode) {
        await api.put(`/prodis/${selectedProdi.id}`, formData);
        success('Prodi berhasil diupdate!');
      } else {
        await api.post('/prodis', formData);
        success('Prodi berhasil ditambahkan! Email dengan credentials telah dikirim ke Kaprodi.');
      }
      fetchProdis();
      resetForm();
    } catch (err) {
      error('Gagal menyimpan: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Yakin ingin menghapus prodi ini? User terkait juga akan terhapus.')) return;
    
    try {
      await api.delete(`/prodis/${id}`);
      success('Prodi berhasil dihapus');
      fetchProdis();
    } catch (err) {
      error('Gagal menghapus: ' + (err.response?.data?.message || err.message));
    }
  };

  const openResetModal = (prodi) => {
    if (prodi.user && prodi.user.username) {
      setResetUsername(prodi.user.username);
      setNewPassword('');
      setShowResetModal(true);
    } else {
      warning('Prodi ini belum memiliki akun user');
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
      success('Password berhasil direset!');
      setShowResetModal(false);
      setResetUsername('');
      setNewPassword('');
    } catch (err) {
      error('Gagal reset password: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  const handleProgramChange = (programId) => {
    const selectedProgram = programs.find(p => p.id === programId);
    if (selectedProgram) {
      // Auto-fill form dari data program
      setFormData({
        ...formData,
        program_id: programId,
        kode_prodi: selectedProgram.code || '',
        nama_prodi: selectedProgram.name || '',
        jenjang: selectedProgram.name.includes('D3') ? 'D3' : 
                 selectedProgram.name.includes('D4') ? 'D4' :
                 selectedProgram.name.includes('S2') ? 'S2' :
                 selectedProgram.name.includes('S3') ? 'S3' : 'S1',
      });
    } else {
      setFormData({ ...formData, program_id: programId });
    }
  };

  const resetForm = () => {
    setFormData({
      program_id: '',
      kode_prodi: '',
      nama_prodi: '',
      fakultas: 'Fakultas Teknik',
      jenjang: 'S1',
      email_kaprodi: '',
      nama_kaprodi: '',
      username: '',
      password: '',
    });
    setShowModal(false);
    setEditMode(false);
    setSelectedProdi(null);
  };

  const openEditModal = (prodi) => {
    setSelectedProdi(prodi);
    setFormData({
      nama_prodi: prodi.nama_prodi,
      fakultas: prodi.fakultas,
      jenjang: prodi.jenjang,
      email_kaprodi: prodi.email_kaprodi,
      nama_kaprodi: prodi.nama_kaprodi,
    });
    setEditMode(true);
    setShowModal(true);
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-4 md:mb-6">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-gray-900">Kelola Program Studi</h1>
          <p className="text-sm md:text-base text-gray-600 mt-1">Tambah dan kelola program studi</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center justify-center gap-2 bg-blue-600 text-white px-3 md:px-4 py-2 rounded-lg hover:bg-blue-700 text-sm md:text-base"
        >
          <Plus className="w-4 h-4 md:w-5 md:h-5" />
          <span>Tambah Prodi</span>
        </button>
      </div>

      {/* Search */}
      <div className="mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 md:w-5 md:h-5" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari prodi..."
            className="w-full pl-9 md:pl-10 pr-4 py-2 text-sm md:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <>
          {/* Desktop Table */}
          <div className="hidden md:block bg-white rounded-xl shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Kode
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nama Prodi
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Jenjang
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Kaprodi
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {prodis.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="px-6 py-12 text-center text-gray-500">
                      Belum ada data prodi
                    </td>
                  </tr>
                ) : (
                  prodis.map((prodi) => (
                    <tr key={prodi.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {prodi.kode_prodi}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {prodi.nama_prodi}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                          {prodi.jenjang}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {prodi.nama_kaprodi}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <Mail className="w-4 h-4" />
                          {prodi.email_kaprodi}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {prodi.is_active ? (
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
                        <div className="flex gap-2">
                          <button
                            onClick={() => openEditModal(prodi)}
                            className="text-blue-600 hover:text-blue-800"
                            title="Edit"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          {prodi.user && (
                            <button
                              onClick={() => openResetModal(prodi)}
                              className="text-orange-600 hover:text-orange-800"
                              title="Reset Password"
                            >
                              <Mail className="w-4 h-4" />
                            </button>
                          )}
                          <button
                            onClick={() => handleDelete(prodi.id)}
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

          {/* Mobile Cards */}
          <div className="md:hidden space-y-3">
            {prodis.length === 0 ? (
              <div className="bg-white rounded-xl p-8 text-center text-gray-500">
                Belum ada data prodi
              </div>
            ) : (
              prodis.map((prodi) => (
                <div key={prodi.id} className="bg-white rounded-xl shadow p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                          {prodi.kode_prodi}
                        </span>
                        <span className="px-2 py-0.5 bg-purple-100 text-purple-800 rounded-full text-xs">
                          {prodi.jenjang}
                        </span>
                        {prodi.is_active ? (
                          <span className="flex items-center gap-0.5 text-green-600 text-xs">
                            <Check className="w-3 h-3" /> Aktif
                          </span>
                        ) : (
                          <span className="flex items-center gap-0.5 text-red-600 text-xs">
                            <X className="w-3 h-3" /> Nonaktif
                          </span>
                        )}
                      </div>
                      <h3 className="font-medium text-gray-900 text-sm">{prodi.nama_prodi}</h3>
                    </div>
                  </div>
                  
                  <div className="space-y-1 text-xs text-gray-600 mb-3">
                    <p><span className="font-medium">Kaprodi:</span> {prodi.nama_kaprodi}</p>
                    <p className="flex items-center gap-1">
                      <Mail className="w-3 h-3" />
                      <span className="truncate">{prodi.email_kaprodi}</span>
                    </p>
                  </div>
                  
                  <div className="flex gap-2 pt-2 border-t border-gray-100">
                    <button
                      onClick={() => openEditModal(prodi)}
                      className="flex items-center gap-1 px-2 py-1 text-xs text-blue-600 bg-blue-50 rounded"
                    >
                      <Edit className="w-3 h-3" />
                      Edit
                    </button>
                    {prodi.user && (
                      <button
                        onClick={() => openResetModal(prodi)}
                        className="flex items-center gap-1 px-2 py-1 text-xs text-orange-600 bg-orange-50 rounded"
                      >
                        <Mail className="w-3 h-3" />
                        Reset
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(prodi.id)}
                      className="flex items-center gap-1 px-2 py-1 text-xs text-red-600 bg-red-50 rounded"
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
              {editMode ? 'Edit Prodi' : 'Tambah Prodi Baru'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Program Studi <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.program_id}
                  onChange={(e) => handleProgramChange(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="">-- Pilih Program Studi --</option>
                  {programs.map((program) => (
                    <option key={program.id} value={program.id}>
                      {program.code} - {program.name}
                    </option>
                  ))}
                </select>
                <p className="text-xs text-gray-500 mt-1">
                  Belum ada program? Buat di menu "Kelola Program" terlebih dahulu
                </p>
              </div>

              {!editMode && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Kode Prodi <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.kode_prodi}
                      readOnly
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-700 cursor-not-allowed"
                      placeholder="Otomatis dari program"
                      required
                    />
                    <p className="text-xs text-gray-500 mt-1">Otomatis terisi dari Program</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Jenjang <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.jenjang}
                      readOnly
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-700 cursor-not-allowed"
                      placeholder="Otomatis dari program"
                      required
                    />
                  </div>
                </div>
              )}
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nama Prodi <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.nama_prodi}
                  readOnly
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-700 cursor-not-allowed"
                  placeholder="Otomatis dari program"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">Otomatis terisi dari Program</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fakultas <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.fakultas}
                  onChange={(e) => setFormData({ ...formData, fakultas: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nama Kaprodi <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.nama_kaprodi}
                    onChange={(e) => setFormData({ ...formData, nama_kaprodi: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Dr. John Doe"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email Kaprodi <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    value={formData.email_kaprodi}
                    onChange={(e) => setFormData({ ...formData, email_kaprodi: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="kaprodi@unismuh.ac.id"
                    required
                  />
                </div>
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
                        placeholder="kaprodi_if"
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
                      📧 Email dengan username dan password akan otomatis dikirim ke email kaprodi
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

      {/* Reset Password Modal */}
      {showResetModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">Reset Password</h2>
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
                  ⚠️ Password akan langsung direset. Pastikan Anda mencatat password baru ini untuk diberikan kepada Kaprodi.
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

      {/* Toast Notifications */}
      <div className="fixed top-0 right-0 z-50 p-4 space-y-2">
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            message={toast.message}
            type={toast.type}
            onClose={() => removeToast(toast.id)}
            duration={toast.duration}
          />
        ))}
      </div>
    </div>
  );
}
