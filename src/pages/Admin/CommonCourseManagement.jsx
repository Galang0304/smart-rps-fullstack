import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Edit2, 
  Trash2, 
  Search, 
  X, 
  Check, 
  BookOpen,
  Building2,
  ChevronDown,
  ChevronUp,
  Users
} from 'lucide-react';
import { commonCourseAPI, prodiAPI } from '../../services/api';
import Toast from '../../components/Toast';

export default function CommonCourseManagement() {
  // States
  const [courses, setCourses] = useState([]);
  const [prodis, setProdis] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Form states
  const [showForm, setShowForm] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [formData, setFormData] = useState({
    code: '',
    title: '',
    credits: '',
    semester: '',
    tahun: '2025',
    prodi_ids: []
  });
  
  // Assignment modal
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [assigningCourse, setAssigningCourse] = useState(null);
  const [selectedProdis, setSelectedProdis] = useState([]);
  
  // Expanded rows
  const [expandedRows, setExpandedRows] = useState({});
  
  // Toast
  const [toast, setToast] = useState({ show: false, message: '', type: 'info' });

  const showToast = (message, type = 'info') => {
    setToast({ show: true, message, type });
  };

  // Load data
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [coursesRes, prodisRes] = await Promise.all([
        commonCourseAPI.getAll(),
        prodiAPI.getActive()
      ]);
      setCourses(coursesRes.data?.data || []);
      setProdis(prodisRes.data?.data || []);
    } catch (error) {
      console.error('Failed to load data:', error);
      showToast('Gagal memuat data', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Filter courses by search
  const filteredCourses = courses.filter(course => 
    course.code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.title?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.code.trim() || !formData.title.trim()) {
      showToast('Kode dan nama mata kuliah wajib diisi', 'error');
      return;
    }

    try {
      const payload = {
        code: formData.code,
        title: formData.title,
        credits: formData.credits ? parseInt(formData.credits) : null,
        semester: formData.semester ? parseInt(formData.semester) : null,
        tahun: formData.tahun || '2025',
        prodi_ids: formData.prodi_ids
      };

      if (editingCourse) {
        await commonCourseAPI.update(editingCourse.id, payload);
        showToast('Mata kuliah berhasil diperbarui', 'success');
      } else {
        await commonCourseAPI.create(payload);
        showToast('Mata kuliah umum berhasil ditambahkan', 'success');
      }

      resetForm();
      loadData();
    } catch (error) {
      console.error('Failed to save course:', error);
      showToast('Gagal menyimpan mata kuliah', 'error');
    }
  };

  // Handle delete
  const handleDelete = async (course) => {
    if (!confirm(`Hapus mata kuliah "${course.title}"?\n\nSemua assignment ke prodi akan ikut terhapus.`)) {
      return;
    }

    try {
      await commonCourseAPI.delete(course.id);
      showToast('Mata kuliah berhasil dihapus', 'success');
      loadData();
    } catch (error) {
      console.error('Failed to delete course:', error);
      showToast('Gagal menghapus mata kuliah', 'error');
    }
  };

  // Handle edit
  const handleEdit = (course) => {
    setEditingCourse(course);
    setFormData({
      code: course.code || '',
      title: course.title || '',
      credits: course.credits || '',
      semester: course.semester || '',
      tahun: course.tahun || '2025',
      prodi_ids: course.assigned_prodis?.map(ap => ap.prodi_id) || []
    });
    setShowForm(true);
  };

  // Reset form
  const resetForm = () => {
    setShowForm(false);
    setEditingCourse(null);
    setFormData({
      code: '',
      title: '',
      credits: '',
      semester: '',
      tahun: '2025',
      prodi_ids: []
    });
  };

  // Handle assign modal
  const openAssignModal = (course) => {
    setAssigningCourse(course);
    setSelectedProdis(course.assigned_prodis?.map(ap => ap.prodi_id) || []);
    setShowAssignModal(true);
  };

  // Handle save assignment
  const handleSaveAssignment = async () => {
    if (!assigningCourse) return;

    try {
      await commonCourseAPI.assignToProdi(assigningCourse.id, selectedProdis);
      showToast('Assignment berhasil disimpan', 'success');
      setShowAssignModal(false);
      setAssigningCourse(null);
      loadData();
    } catch (error) {
      console.error('Failed to save assignment:', error);
      showToast('Gagal menyimpan assignment', 'error');
    }
  };

  // Toggle prodi selection
  const toggleProdiSelection = (prodiId) => {
    setSelectedProdis(prev => 
      prev.includes(prodiId)
        ? prev.filter(id => id !== prodiId)
        : [...prev, prodiId]
    );
  };

  // Toggle expand row
  const toggleExpand = (courseId) => {
    setExpandedRows(prev => ({
      ...prev,
      [courseId]: !prev[courseId]
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Memuat data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Mata Kuliah Umum</h1>
              <p className="text-sm sm:text-base text-gray-600 mt-1">
                Kelola mata kuliah yang bisa di-assign ke beberapa prodi
              </p>
            </div>
            <button
              onClick={() => setShowForm(true)}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-5 h-5" />
              Tambah Matkul Umum
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        {/* Info Card */}
        <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <BookOpen className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-blue-900">Tentang Mata Kuliah Umum</h3>
              <p className="text-sm text-blue-700 mt-1">
                Mata kuliah umum adalah mata kuliah yang diajarkan di beberapa program studi sekaligus, 
                seperti Pendidikan Agama, Pancasila, Bahasa Indonesia, dll. 
                Anda dapat membuat satu mata kuliah dan meng-assign ke prodi-prodi yang membutuhkan.
              </p>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="mb-4 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Cari mata kuliah..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Course List */}
        {filteredCourses.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <BookOpen className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchTerm ? 'Tidak ada hasil' : 'Belum ada mata kuliah umum'}
            </h3>
            <p className="text-gray-600 mb-4">
              {searchTerm 
                ? 'Coba kata kunci lain' 
                : 'Tambahkan mata kuliah umum untuk mulai'}
            </p>
            {!searchTerm && (
              <button
                onClick={() => setShowForm(true)}
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <Plus className="w-5 h-5" />
                Tambah Pertama
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {filteredCourses.map((course) => (
              <div
                key={course.id}
                className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
              >
                {/* Course Header */}
                <div className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="px-2.5 py-1 bg-purple-100 text-purple-800 text-sm font-medium rounded">
                          {course.code}
                        </span>
                        <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded">
                          {course.credits || 0} SKS
                        </span>
                        <span className="px-2 py-0.5 bg-gray-100 text-gray-700 text-xs rounded">
                          Semester {course.semester || '-'}
                        </span>
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mt-2">{course.title}</h3>
                      
                      {/* Assigned Prodis */}
                      <div className="mt-3">
                        <button
                          onClick={() => toggleExpand(course.id)}
                          className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700"
                        >
                          <Building2 className="w-4 h-4" />
                          <span>
                            {course.assigned_prodis?.length || 0} Prodi ter-assign
                          </span>
                          {expandedRows[course.id] ? (
                            <ChevronUp className="w-4 h-4" />
                          ) : (
                            <ChevronDown className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => openAssignModal(course)}
                        className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                        title="Assign ke Prodi"
                      >
                        <Users className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleEdit(course)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <Edit2 className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(course)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Hapus"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Expanded - Show Assigned Prodis */}
                {expandedRows[course.id] && (
                  <div className="border-t border-gray-200 bg-gray-50 p-4">
                    <h4 className="text-sm font-semibold text-gray-700 mb-3">Prodi yang mendapat mata kuliah ini:</h4>
                    {course.assigned_prodis?.length > 0 ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                        {course.assigned_prodis.map((assign) => (
                          <div 
                            key={assign.id}
                            className="flex items-center gap-2 px-3 py-2 bg-white rounded border border-gray-200"
                          >
                            <Building2 className="w-4 h-4 text-gray-500" />
                            <span className="text-sm text-gray-700">{assign.prodi?.nama_prodi || 'Unknown'}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500">Belum ada prodi yang di-assign</p>
                    )}
                    <button
                      onClick={() => openAssignModal(course)}
                      className="mt-3 text-sm text-blue-600 hover:text-blue-700 font-medium"
                    >
                      + Kelola Assignment
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add/Edit Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="p-4 sm:p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">
                  {editingCourse ? 'Edit Mata Kuliah Umum' : 'Tambah Mata Kuliah Umum'}
                </h2>
                <button
                  onClick={resetForm}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Kode MK *
                  </label>
                  <input
                    type="text"
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                    placeholder="MK001"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tahun
                  </label>
                  <input
                    type="text"
                    value={formData.tahun}
                    onChange={(e) => setFormData({ ...formData, tahun: e.target.value })}
                    placeholder="2025"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nama Mata Kuliah *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Pendidikan Agama Islam"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    SKS
                  </label>
                  <input
                    type="number"
                    value={formData.credits}
                    onChange={(e) => setFormData({ ...formData, credits: e.target.value })}
                    placeholder="2"
                    min="1"
                    max="6"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Semester
                  </label>
                  <input
                    type="number"
                    value={formData.semester}
                    onChange={(e) => setFormData({ ...formData, semester: e.target.value })}
                    placeholder="1"
                    min="1"
                    max="8"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Prodi Selection for new course */}
              {!editingCourse && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Assign ke Prodi (opsional)
                  </label>
                  <div className="border border-gray-300 rounded-lg max-h-40 overflow-y-auto p-2 space-y-1">
                    {prodis.map((prodi) => (
                      <label key={prodi.id} className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.prodi_ids.includes(prodi.id)}
                          onChange={() => {
                            setFormData(prev => ({
                              ...prev,
                              prodi_ids: prev.prodi_ids.includes(prodi.id)
                                ? prev.prodi_ids.filter(id => id !== prodi.id)
                                : [...prev.prodi_ids, prodi.id]
                            }));
                          }}
                          className="w-4 h-4 text-blue-600 rounded"
                        />
                        <span className="text-sm text-gray-700">{prodi.nama_prodi}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={resetForm}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  {editingCourse ? 'Simpan Perubahan' : 'Tambah Mata Kuliah'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Assignment Modal */}
      {showAssignModal && assigningCourse && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg max-h-[80vh] overflow-hidden">
            <div className="p-4 sm:p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Assign ke Prodi</h2>
                  <p className="text-sm text-gray-600 mt-1">{assigningCourse.title}</p>
                </div>
                <button
                  onClick={() => {
                    setShowAssignModal(false);
                    setAssigningCourse(null);
                  }}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="p-4 sm:p-6 overflow-y-auto max-h-[50vh]">
              <p className="text-sm text-gray-600 mb-4">
                Pilih prodi yang akan mendapat mata kuliah ini:
              </p>
              <div className="space-y-2">
                {prodis.map((prodi) => (
                  <label
                    key={prodi.id}
                    className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition-colors ${
                      selectedProdis.includes(prodi.id)
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={selectedProdis.includes(prodi.id)}
                      onChange={() => toggleProdiSelection(prodi.id)}
                      className="w-5 h-5 text-blue-600 rounded"
                    />
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{prodi.nama_prodi}</p>
                      <p className="text-xs text-gray-500">{prodi.fakultas}</p>
                    </div>
                    {selectedProdis.includes(prodi.id) && (
                      <Check className="w-5 h-5 text-blue-600" />
                    )}
                  </label>
                ))}
              </div>
            </div>

            <div className="p-4 sm:p-6 border-t border-gray-200 bg-gray-50">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-gray-600">
                  {selectedProdis.length} prodi dipilih
                </span>
                <button
                  onClick={() => setSelectedProdis(prodis.map(p => p.id))}
                  className="text-sm text-blue-600 hover:text-blue-700"
                >
                  Pilih Semua
                </button>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowAssignModal(false);
                    setAssigningCourse(null);
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100"
                >
                  Batal
                </button>
                <button
                  onClick={handleSaveAssignment}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Simpan Assignment
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast.show && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast({ ...toast, show: false })}
        />
      )}
    </div>
  );
}
