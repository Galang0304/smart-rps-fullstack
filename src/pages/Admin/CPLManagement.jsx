import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Search, FileText, Upload, Download } from 'lucide-react';
import api from '../../services/api';
import Toast from '../../components/Toast';
import { useToast } from '../../hooks/useToast';

export default function CPLManagement() {
  const [cpls, setCpls] = useState([]);
  const [prodis, setProdis] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showBatchModal, setShowBatchModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const { toasts, success, error, warning, removeToast } = useToast();
  const [selectedCPL, setSelectedCPL] = useState(null);
  const [search, setSearch] = useState('');
  const [selectedProdiId, setSelectedProdiId] = useState('');
  const [formData, setFormData] = useState({
    prodi_id: '',
    kode_cpl: '',
    komponen: 'Kompetensi Sikap',
    deskripsi: '',
  });
  const [batchData, setBatchData] = useState('');

  useEffect(() => {
    fetchProdis();
  }, []);

  useEffect(() => {
    if (selectedProdiId) {
      fetchCPLs();
    }
  }, [selectedProdiId, search]);

  const fetchProdis = async () => {
    try {
      const response = await api.get('/prodis/active');
      setProdis(response.data.data || []);
      // Auto-select first prodi if available
      if (response.data.data && response.data.data.length > 0) {
        setSelectedProdiId(response.data.data[0].id);
        setFormData(prev => ({ ...prev, prodi_id: response.data.data[0].id }));
      }
    } catch (err) {
      console.error('Failed to fetch prodis:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCPLs = async () => {
    if (!selectedProdiId) return;
    
    try {
      setLoading(true);
      const response = await api.get(`/cpl?prodi_id=${selectedProdiId}&search=${search}`);
      setCpls(response.data.data || []);
    } catch (err) {
      console.error('Failed to fetch CPLs:', err);
      error('Gagal memuat data CPL');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      if (editMode) {
        await api.put(`/cpl/${selectedCPL.id}`, formData);
        success('CPL berhasil diupdate!');
      } else {
        await api.post('/cpl', { ...formData, prodi_id: selectedProdiId });
        success('CPL berhasil ditambahkan!');
      }
      fetchCPLs();
      resetForm();
    } catch (err) {
      error('Gagal menyimpan: ' + (err.response?.data?.error || err.message));
    } finally {
      setLoading(false);
    }
  };

  const handleBatchSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Parse batch data (format: Kode CPL | Komponen | Deskripsi per line)
      const lines = batchData.trim().split('\n').filter(line => line.trim());
      const data = lines.map(line => {
        const parts = line.split('|').map(p => p.trim());
        return {
          kode_cpl: parts[0] || '',
          komponen: parts[1] || 'Kompetensi Sikap',
          deskripsi: parts[2] || '',
        };
      }).filter(item => item.kode_cpl && item.deskripsi);

      if (data.length === 0) {
        error('Format data tidak valid. Gunakan format: Kode CPL | Komponen | Deskripsi');
        setLoading(false);
        return;
      }

      const response = await api.post('/cpl/batch', {
        prodi_id: selectedProdiId,
        data: data,
      });
      
      success(`${response.data.created} CPL berhasil ditambahkan! ${response.data.skipped} dilewati.`);
      fetchCPLs();
      setShowBatchModal(false);
      setBatchData('');
    } catch (err) {
      error('Gagal menyimpan: ' + (err.response?.data?.error || err.message));
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Yakin ingin menghapus CPL ini?')) return;
    
    try {
      await api.delete(`/cpl/${id}`);
      success('CPL berhasil dihapus');
      fetchCPLs();
    } catch (err) {
      error('Gagal menghapus: ' + (err.response?.data?.error || err.message));
    }
  };

  const resetForm = () => {
    setFormData({
      prodi_id: selectedProdiId,
      kode_cpl: '',
      komponen: 'Kompetensi Sikap',
      deskripsi: '',
    });
    setShowModal(false);
    setEditMode(false);
    setSelectedCPL(null);
  };

  const openEditModal = (cpl) => {
    setSelectedCPL(cpl);
    setFormData({
      prodi_id: cpl.prodi_id,
      kode_cpl: cpl.kode_cpl,
      komponen: cpl.komponen,
      deskripsi: cpl.deskripsi,
    });
    setEditMode(true);
    setShowModal(true);
  };

  const komponenOptions = [
    'Kompetensi Sikap',
    'Kompetensi Khusus',
    'Sikap',
    'Pengetahuan',
    'Keterampilan Umum',
    'Keterampilan Khusus',
  ];

  return (
    <div>
      {/* Toast Container */}
      <div className="fixed top-4 right-4 z-50 space-y-2">
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            message={toast.message}
            type={toast.type}
            onClose={() => removeToast(toast.id)}
          />
        ))}
      </div>

      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-4 md:mb-6">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-gray-900">Kelola CPL</h1>
          <p className="text-sm md:text-base text-gray-600 mt-1">Capaian Pembelajaran Lulusan Program Studi</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowBatchModal(true)}
            disabled={!selectedProdiId}
            className="flex items-center justify-center gap-2 bg-green-600 text-white px-3 md:px-4 py-2 rounded-lg hover:bg-green-700 text-sm md:text-base disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Upload className="w-4 h-4 md:w-5 md:h-5" />
            <span>Import Batch</span>
          </button>
          <button
            onClick={() => setShowModal(true)}
            disabled={!selectedProdiId}
            className="flex items-center justify-center gap-2 bg-blue-600 text-white px-3 md:px-4 py-2 rounded-lg hover:bg-blue-700 text-sm md:text-base disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Plus className="w-4 h-4 md:w-5 md:h-5" />
            <span>Tambah CPL</span>
          </button>
        </div>
      </div>

      {/* Prodi Selector */}
      <div className="mb-4 bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Pilih Program Studi
        </label>
        <select
          value={selectedProdiId}
          onChange={(e) => {
            setSelectedProdiId(e.target.value);
            setFormData(prev => ({ ...prev, prodi_id: e.target.value }));
          }}
          className="w-full md:w-1/2 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">-- Pilih Prodi --</option>
          {prodis.map((prodi) => (
            <option key={prodi.id} value={prodi.id}>
              {prodi.nama_prodi} ({prodi.kode_prodi})
            </option>
          ))}
        </select>
      </div>

      {/* Search */}
      {selectedProdiId && (
        <div className="mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 md:w-5 md:h-5" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari CPL..."
              className="w-full pl-9 md:pl-10 pr-4 py-2 text-sm md:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      )}

      {/* CPL Table */}
      {selectedProdiId ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-16">No</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-28">Kode CPL</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-40">Komponen</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Deskripsi CPL</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider w-24">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan="5" className="px-4 py-8 text-center text-gray-500">
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                        <span className="ml-2">Memuat data...</span>
                      </div>
                    </td>
                  </tr>
                ) : cpls.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-4 py-8 text-center text-gray-500">
                      <FileText className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                      <p>Belum ada data CPL</p>
                      <p className="text-sm">Klik tombol "Tambah CPL" untuk menambahkan</p>
                    </td>
                  </tr>
                ) : (
                  cpls.map((cpl, index) => (
                    <tr key={cpl.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm text-gray-900">{index + 1}</td>
                      <td className="px-4 py-3 text-sm font-medium text-blue-600">{cpl.kode_cpl}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                          {cpl.komponen}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700">{cpl.deskripsi}</td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => openEditModal(cpl)}
                            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg"
                            title="Edit"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(cpl.id)}
                            className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg"
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
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center text-gray-500">
          <FileText className="w-12 h-12 mx-auto mb-2 text-gray-300" />
          <p>Silakan pilih Program Studi terlebih dahulu</p>
        </div>
      )}

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="p-4 md:p-6 border-b border-gray-200">
              <h2 className="text-lg md:text-xl font-semibold">
                {editMode ? 'Edit CPL' : 'Tambah CPL Baru'}
              </h2>
            </div>
            <form onSubmit={handleSubmit} className="p-4 md:p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Kode CPL <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.kode_cpl}
                  onChange={(e) => setFormData({ ...formData, kode_cpl: e.target.value })}
                  placeholder="Contoh: CPL-01"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Komponen <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.komponen}
                  onChange={(e) => setFormData({ ...formData, komponen: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  {komponenOptions.map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Deskripsi CPL <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={formData.deskripsi}
                  onChange={(e) => setFormData({ ...formData, deskripsi: e.target.value })}
                  placeholder="Masukkan deskripsi CPL..."
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  {loading ? 'Menyimpan...' : editMode ? 'Update' : 'Simpan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Batch Import Modal */}
      {showBatchModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-4 md:p-6 border-b border-gray-200">
              <h2 className="text-lg md:text-xl font-semibold">Import CPL Batch</h2>
              <p className="text-sm text-gray-600 mt-1">
                Masukkan data CPL dengan format: <code className="bg-gray-100 px-1 rounded">Kode CPL | Komponen | Deskripsi</code> (satu per baris)
              </p>
            </div>
            <form onSubmit={handleBatchSubmit} className="p-4 md:p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Data CPL <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={batchData}
                  onChange={(e) => setBatchData(e.target.value)}
                  placeholder={`CPL-01 | Kompetensi Sikap | Mampu memahami prinsip etika profesi dan tanggung jawab sosial.
CPL-02 | Kompetensi Khusus | Mampu menerapkan ilmu pengetahuan dan teknologi secara profesional.
CPL-03 | Sikap | Mampu bekerja sama dalam tim secara efektif.`}
                  rows={10}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
                  required
                />
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-sm text-blue-800">
                  <strong>Tips:</strong> Anda dapat menyalin data dari Excel atau spreadsheet. Pastikan format sesuai dengan contoh di atas.
                </p>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowBatchModal(false);
                    setBatchData('');
                  }}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
                >
                  {loading ? 'Mengimpor...' : 'Import CPL'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
