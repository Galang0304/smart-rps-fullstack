import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Plus, Edit2, Trash2, Search, X } from 'lucide-react';

export default function ProgramManagement() {
  const [programs, setPrograms] = useState([]);
  const [prodis, setProdis] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingProgram, setEditingProgram] = useState(null);
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    prodi_id: ''
  });

  useEffect(() => {
    loadPrograms();
    loadProdis();
  }, []);

  const loadPrograms = async () => {
    try {
      setLoading(true);
      const response = await api.get('/programs');
      if (response.data.success) {
        setPrograms(response.data.data.data || []);
      }
    } catch (error) {
      console.error('Error loading programs:', error);
      alert('Gagal memuat data program studi');
    } finally {
      setLoading(false);
    }
  };

  const loadProdis = async () => {
    try {
      const response = await api.get('/prodis/active');
      if (response.data.success) {
        setProdis(response.data.data.data || []);
      }
    } catch (error) {
      console.error('Error loading prodis:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        code: formData.code,
        name: formData.name,
        prodi_id: formData.prodi_id || null
      };

      if (editingProgram) {
        await api.put(`/programs/${editingProgram.id}`, payload);
        alert('Program studi berhasil diupdate');
      } else {
        await api.post('/programs', payload);
        alert('Program studi berhasil ditambahkan');
      }
      
      setShowModal(false);
      resetForm();
      loadPrograms();
    } catch (error) {
      console.error('Error saving program:', error);
      alert(error.response?.data?.message || 'Gagal menyimpan program studi');
    }
  };

  const handleEdit = (program) => {
    setEditingProgram(program);
    setFormData({
      code: program.code,
      name: program.name,
      prodi_id: program.prodi_id || ''
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Apakah Anda yakin ingin menghapus program studi ini?')) {
      return;
    }

    try {
      await api.delete(`/programs/${id}`);
      alert('Program studi berhasil dihapus');
      loadPrograms();
    } catch (error) {
      console.error('Error deleting program:', error);
      alert(error.response?.data?.message || 'Gagal menghapus program studi');
    }
  };

  const resetForm = () => {
    setFormData({
      code: '',
      name: '',
      prodi_id: ''
    });
    setEditingProgram(null);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    resetForm();
  };

  const filteredPrograms = programs.filter(program =>
    program.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    program.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div className="mb-4 md:mb-6">
        <h1 className="text-xl md:text-2xl font-bold text-gray-800 mb-1 md:mb-2">Kelola Program Studi</h1>
        <p className="text-sm md:text-base text-gray-600">Kelola data program studi seperti S1 Teknik Informatika, S1 Sistem Informasi, dll</p>
      </div>

      {/* Action Bar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4 md:mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 md:w-5 md:h-5" />
          <input
            type="text"
            placeholder="Cari program studi..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 md:pl-10 pr-4 py-2 text-sm md:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center justify-center px-3 md:px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm md:text-base"
        >
          <Plus className="w-4 h-4 md:w-5 md:h-5 mr-1 md:mr-2" />
          <span className="hidden sm:inline">Tambah Program</span>
          <span className="sm:hidden">Tambah</span>
        </button>
      </div>

      {/* Programs Table */}
      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Memuat data...</p>
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
                    Nama Program Studi
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Kaprodi
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredPrograms.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="px-6 py-12 text-center text-gray-500">
                      {searchTerm ? 'Tidak ada program studi yang sesuai dengan pencarian' : 'Belum ada data program studi. Silakan tambahkan program studi terlebih dahulu.'}
                    </td>
                  </tr>
                ) : (
                  filteredPrograms.map((program) => (
                    <tr key={program.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {program.code}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {program.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {program.prodi ? program.prodi.nama_kaprodi : '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => handleEdit(program)}
                          className="text-blue-600 hover:text-blue-900 mr-4"
                        >
                          <Edit2 size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(program.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden space-y-3">
            {filteredPrograms.length === 0 ? (
              <div className="bg-white rounded-xl p-8 text-center text-gray-500 text-sm">
                {searchTerm ? 'Tidak ada program studi yang sesuai dengan pencarian' : 'Belum ada data program studi.'}
              </div>
            ) : (
              filteredPrograms.map((program) => (
                <div key={program.id} className="bg-white rounded-xl shadow p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                          {program.code}
                        </span>
                      </div>
                      <h3 className="font-medium text-gray-900 text-sm">{program.name}</h3>
                    </div>
                  </div>
                  
                  <div className="text-xs text-gray-600 mb-3">
                    <span className="font-medium">Kaprodi:</span> {program.prodi ? program.prodi.nama_kaprodi : '-'}
                  </div>
                  
                  <div className="flex gap-2 pt-2 border-t border-gray-100">
                    <button
                      onClick={() => handleEdit(program)}
                      className="flex items-center gap-1 px-2 py-1 text-xs text-blue-600 bg-blue-50 rounded"
                    >
                      <Edit2 className="w-3 h-3" />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(program.id)}
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

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800">
                {editingProgram ? 'Edit Program Studi' : 'Tambah Program Studi'}
              </h2>
              <button
                onClick={handleCloseModal}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Kode Program Studi *
                </label>
                <input
                  type="text"
                  required
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Contoh: S1-TI"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nama Program Studi *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Contoh: S1 Teknik Informatika"
                />
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  {editingProgram ? 'Update' : 'Simpan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
