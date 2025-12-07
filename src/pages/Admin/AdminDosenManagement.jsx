import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Search, BookOpen, CheckCircle, X } from 'lucide-react';
import api from '../../services/api';

export default function AdminDosenManagement() {
  const [dosens, setDosens] = useState([]);
  const [prodis, setProdis] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedDosen, setSelectedDosen] = useState(null);
  const [search, setSearch] = useState('');
  const [filterProdi, setFilterProdi] = useState('');
  const [formData, setFormData] = useState({
    prodi_id: '',
    nidn: '',
    nama_lengkap: '',
    email: '',
    username: '',
    password: '',
  });

  useEffect(() => {
    fetchProdis();
    fetchDosens();
  }, [search, filterProdi]);

  const fetchProdis = async () => {
    try {
      const response = await api.get('/prodis/active');
      console.log('Prodis active response:', response.data);
      // Response structure: { data: [...] }
      const prodiList = Array.isArray(response.data.data) ? response.data.data : [];
      setProdis(prodiList);
    } catch (error) {
      console.error('Failed to fetch prodis:', error);
      setProdis([]);
    }
  };

  const fetchDosens = async () => {
    setLoading(true);
    try {
      let url = '/dosens?';
      if (search) url += `search=${search}&`;
      if (filterProdi) url += `prodi_id=${filterProdi}&`;
      
      const response = await api.get(url);
      console.log('Dosens response:', response.data);
      // Response structure: { success: true, data: { data: [...], pagination: {...} } }
      const dosenList = Array.isArray(response.data.data?.data) ? response.data.data.data : [];
      setDosens(dosenList);
    } catch (error) {
      console.error('Failed to fetch dosens:', error);
      setDosens([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      if (editMode) {
        const updateData = {
          prodi_id: formData.prodi_id,
          nidn: formData.nidn,
          nama_lengkap: formData.nama_lengkap,
          email: formData.email,
        };
        await api.put(`/dosens/${selectedDosen.id}`, updateData);
        alert('Dosen berhasil diupdate!');
      } else {
        await api.post('/dosens', formData);
        alert('Dosen berhasil ditambahkan! Email dengan credentials telah dikirim.');
      }
      fetchDosens();
      resetForm();
    } catch (err) {
      alert('Gagal menyimpan: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Yakin ingin menghapus dosen ini? User terkait juga akan terhapus.')) return;
    
    try {
      await api.delete(`/dosens/${id}`);
      alert('Dosen berhasil dihapus');
      fetchDosens();
    } catch (err) {
      alert('Gagal menghapus: ' + (err.response?.data?.message || err.message));
    }
  };

  const resetForm = () => {
    setFormData({
      prodi_id: '',
      nidn: '',
      nama_lengkap: '',
      email: '',
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
      prodi_id: dosen.prodi_id,
      nidn: dosen.nidn,
      nama_lengkap: dosen.nama_lengkap,
      email: dosen.email,
      username: '',
      password: '',
    });
    setEditMode(true);
    setShowModal(true);
  };

  const getProdiName = (prodiId) => {
    const prodi = prodis.find(p => p.id === prodiId);
    return prodi ? prodi.nama_prodi : '-';
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Kelola Dosen</h1>
          <p className="text-gray-600 mt-1">Manajemen dosen semua program studi</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
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
            placeholder="Cari dosen (nama/NIDN)..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <select
          value={filterProdi}
          onChange={(e) => setFilterProdi(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">Semua Prodi</option>
          {prodis.map((prodi) => (
            <option key={prodi.id} value={prodi.id}>
              {prodi.nama_prodi}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  NIDN
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nama Lengkap
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Prodi
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {dosens.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
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
                      <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs">
                        {getProdiName(dosen.prodi_id)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {dosen.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {dosen.is_active ? (
                        <span className="flex items-center gap-1 text-green-600 text-sm">
                          <CheckCircle className="w-4 h-4" /> Aktif
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-red-600 text-sm">
                          <X className="w-4 h-4" /> Nonaktif
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => openEditModal(dosen)}
                          className="text-blue-600 hover:text-blue-800"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
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
      )}

      {/* Modal Form */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">
              {editMode ? 'Edit Dosen' : 'Tambah Dosen Baru'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Program Studi <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.prodi_id}
                  onChange={(e) => setFormData({ ...formData, prodi_id: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="">-- Pilih Prodi --</option>
                  {prodis.map((prodi) => (
                    <option key={prodi.id} value={prodi.id}>
                      {prodi.nama_prodi}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
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
                  />
                </div>
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
                  placeholder="Dr. John Doe, M.Kom"
                  required
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
                        placeholder="dosen123"
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
    </div>
  );
}
