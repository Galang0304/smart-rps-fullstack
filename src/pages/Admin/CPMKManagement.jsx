import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  ChevronDown, 
  ChevronUp,
  BookOpen,
  ListChecks,
  Save,
  X,
  AlertCircle,
  CheckCircle,
  Loader
} from 'lucide-react';
import { courseAPI, cpmkAPI } from '../../services/api';
import Toast from '../../components/Toast';

export default function CPMKManagement() {
  const navigate = useNavigate();
  const location = useLocation();
  const isAdminRoute = location.pathname.includes('/admin/');

  // States
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [cpmkList, setCpmkList] = useState([]);
  const [expandedCpmk, setExpandedCpmk] = useState(null);
  
  // UI States
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingCpmk, setEditingCpmk] = useState(null);
  const [editingSubCpmk, setEditingSubCpmk] = useState(null);
  
  // Form states
  const [newCpmkForm, setNewCpmkForm] = useState({ description: '' });
  const [newSubCpmkForm, setNewSubCpmkForm] = useState({ description: '' });
  const [showAddCpmk, setShowAddCpmk] = useState(false);
  const [showAddSubCpmk, setShowAddSubCpmk] = useState(null);
  
  // Toast
  const [toast, setToast] = useState({ show: false, message: '', type: 'info' });

  const showToast = (message, type = 'info') => {
    setToast({ show: true, message, type });
  };

  // Load courses
  useEffect(() => {
    loadCourses();
  }, []);

  // Search filter
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredCourses(courses);
    } else {
      const term = searchTerm.toLowerCase();
      const filtered = courses.filter(course => 
        course.title?.toLowerCase().includes(term) || 
        course.code?.toLowerCase().includes(term)
      );
      setFilteredCourses(filtered);
    }
  }, [searchTerm, courses]);

  const loadCourses = async () => {
    try {
      setLoading(true);
      const response = await courseAPI.getAll();
      console.log('📦 Course API Response:', response);
      
      if (response.data.success) {
        // Handle nested data structure (response.data.data.data)
        let courseList = response.data.data;
        
        // Check if data is nested one more level
        if (courseList && courseList.data && Array.isArray(courseList.data)) {
          courseList = courseList.data;
        }
        
        // Ensure it's an array
        if (!Array.isArray(courseList)) {
          console.error('❌ courseList is not an array:', courseList);
          courseList = [];
        }
        
        console.log('✅ Course List:', courseList);
        
        // Calculate CPMK & Sub-CPMK counts for each course
        const coursesWithCounts = await Promise.all(
          courseList.map(async (course) => {
            try {
              const cpmkRes = await cpmkAPI.getByCourseId(course.id);
              const cpmks = cpmkRes.data.success ? cpmkRes.data.data || [] : [];
              
              // Count Sub-CPMK across all CPMK
              const subCpmkCount = cpmks.reduce((total, cpmk) => {
                const subCpmks = cpmk.sub_cpmks || cpmk.SubCPMKs || cpmk.subCpmks || [];
                return total + subCpmks.length;
              }, 0);
              
              return {
                ...course,
                cpmkCount: cpmks.length,
                subCpmkCount: subCpmkCount
              };
            } catch (error) {
              return { ...course, cpmkCount: 0, subCpmkCount: 0 };
            }
          })
        );
        
        setCourses(coursesWithCounts);
        setFilteredCourses(coursesWithCounts);
      }
    } catch (error) {
      console.error('Failed to load courses:', error);
      showToast('Gagal memuat data mata kuliah', 'error');
    } finally {
      setLoading(false);
    }
  };

  const loadCpmkForCourse = async (courseId) => {
    try {
      const response = await cpmkAPI.getByCourseId(courseId);
      if (response.data.success) {
        const cpmks = response.data.data || [];
        
        // Normalize Sub-CPMK field names
        const normalizedCpmks = cpmks.map(cpmk => ({
          ...cpmk,
          sub_cpmks: cpmk.sub_cpmks || cpmk.SubCPMKs || cpmk.subCpmks || []
        }));
        
        setCpmkList(normalizedCpmks);
        return normalizedCpmks;
      }
      return [];
    } catch (error) {
      console.error('Failed to load CPMK:', error);
      showToast('Gagal memuat CPMK', 'error');
      return [];
    }
  };

  const handleSelectCourse = async (course) => {
    setSelectedCourse(course);
    setExpandedCpmk(null);
    setEditingCpmk(null);
    setEditingSubCpmk(null);
    setShowAddCpmk(false);
    setShowAddSubCpmk(null);
    await loadCpmkForCourse(course.id);
  };

  const handleAddCpmk = async () => {
    if (!newCpmkForm.description.trim()) {
      showToast('Deskripsi CPMK tidak boleh kosong', 'error');
      return;
    }

    try {
      const nextNumber = cpmkList.length + 1;
      const response = await cpmkAPI.create({
        course_id: selectedCourse.id,
        cpmk_number: nextNumber,
        description: newCpmkForm.description
      });

      if (response.data.success) {
        showToast('CPMK berhasil ditambahkan', 'success');
        await loadCpmkForCourse(selectedCourse.id);
        await loadCourses();
        setNewCpmkForm({ description: '' });
        setShowAddCpmk(false);
      }
    } catch (error) {
      console.error('Failed to add CPMK:', error);
      showToast('Gagal menambahkan CPMK', 'error');
    }
  };

  const handleUpdateCpmk = async (cpmkId) => {
    if (!editingCpmk?.description?.trim()) {
      showToast('Deskripsi CPMK tidak boleh kosong', 'error');
      return;
    }

    try {
      const response = await cpmkAPI.update(cpmkId, {
        description: editingCpmk.description
      });

      if (response.data.success) {
        showToast('CPMK berhasil diperbarui', 'success');
        await loadCpmkForCourse(selectedCourse.id);
        setEditingCpmk(null);
      }
    } catch (error) {
      console.error('Failed to update CPMK:', error);
      showToast('Gagal memperbarui CPMK', 'error');
    }
  };

  const handleDeleteCpmk = async (cpmkId, description) => {
    if (!confirm(`Hapus CPMK "${description}"?\n\nSemua Sub-CPMK di dalamnya juga akan terhapus.`)) {
      return;
    }

    try {
      const response = await cpmkAPI.delete(cpmkId);
      if (response.data.success) {
        showToast('CPMK berhasil dihapus', 'success');
        await loadCpmkForCourse(selectedCourse.id);
        await loadCourses();
      }
    } catch (error) {
      console.error('Failed to delete CPMK:', error);
      showToast('Gagal menghapus CPMK', 'error');
    }
  };

  const handleAddSubCpmk = async (cpmkId) => {
    if (!newSubCpmkForm.description.trim()) {
      showToast('Deskripsi Sub-CPMK tidak boleh kosong', 'error');
      return;
    }

    try {
      const cpmk = cpmkList.find(c => c.id === cpmkId);
      const nextNumber = (cpmk?.sub_cpmks?.length || 0) + 1;
      
      const response = await cpmkAPI.createSubCpmk({
        cpmk_id: cpmkId,
        sub_cpmk_number: nextNumber,
        description: newSubCpmkForm.description
      });

      if (response.data.success) {
        showToast('Sub-CPMK berhasil ditambahkan', 'success');
        await loadCpmkForCourse(selectedCourse.id);
        await loadCourses();
        setNewSubCpmkForm({ description: '' });
        setShowAddSubCpmk(null);
      }
    } catch (error) {
      console.error('Failed to add Sub-CPMK:', error);
      showToast('Gagal menambahkan Sub-CPMK', 'error');
    }
  };

  const handleUpdateSubCpmk = async (cpmkId, subCpmkId) => {
    if (!editingSubCpmk?.description?.trim()) {
      showToast('Deskripsi Sub-CPMK tidak boleh kosong', 'error');
      return;
    }

    try {
      const response = await cpmkAPI.updateSubCpmk(subCpmkId, {
        description: editingSubCpmk.description
      });

      if (response.data.success) {
        showToast('Sub-CPMK berhasil diperbarui', 'success');
        await loadCpmkForCourse(selectedCourse.id);
        setEditingSubCpmk(null);
      }
    } catch (error) {
      console.error('Failed to update Sub-CPMK:', error);
      showToast('Gagal memperbarui Sub-CPMK', 'error');
    }
  };

  const handleDeleteSubCpmk = async (subCpmkId, description) => {
    if (!confirm(`Hapus Sub-CPMK "${description}"?`)) {
      return;
    }

    try {
      const response = await cpmkAPI.deleteSubCpmk(subCpmkId);
      if (response.data.success) {
        showToast('Sub-CPMK berhasil dihapus', 'success');
        await loadCpmkForCourse(selectedCourse.id);
        await loadCourses();
      }
    } catch (error) {
      console.error('Failed to delete Sub-CPMK:', error);
      showToast('Gagal menghapus Sub-CPMK', 'error');
    }
  };

  const toggleExpand = (cpmkId) => {
    setExpandedCpmk(expandedCpmk === cpmkId ? null : cpmkId);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Memuat data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Manajemen CPMK</h1>
              <p className="text-gray-600 mt-1">Kelola Capaian Pembelajaran Mata Kuliah</p>
            </div>
            <button
              onClick={() => navigate(isAdminRoute ? '/admin/courses' : '/kaprodi/courses')}
              className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Kembali
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Course List - Left Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden sticky top-24">
              <div className="p-4 border-b border-gray-200 bg-gray-50">
                <h2 className="font-semibold text-gray-900 mb-3">Mata Kuliah</h2>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Cari mata kuliah..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              
              <div className="max-h-[calc(100vh-280px)] overflow-y-auto">
                {filteredCourses.length === 0 ? (
                  <div className="p-8 text-center text-gray-500">
                    <BookOpen className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                    <p>Tidak ada mata kuliah</p>
                  </div>
                ) : (
                  <div className="divide-y divide-gray-100">
                    {filteredCourses.map((course) => (
                      <button
                        key={course.id}
                        onClick={() => handleSelectCourse(course)}
                        className={`w-full text-left p-4 hover:bg-blue-50 transition-colors ${
                          selectedCourse?.id === course.id ? 'bg-blue-50 border-l-4 border-blue-600' : ''
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-gray-900 truncate">{course.code}</p>
                            <p className="text-sm text-gray-600 line-clamp-2 mt-1">{course.title}</p>
                          </div>
                          <div className="flex flex-col items-end gap-1 flex-shrink-0">
                            <span className="inline-flex items-center px-2 py-0.5 text-xs font-medium bg-green-100 text-green-800 rounded">
                              {course.cpmkCount || 0} CPMK
                            </span>
                            {course.subCpmkCount > 0 && (
                              <span className="inline-flex items-center px-2 py-0.5 text-xs font-medium bg-blue-100 text-blue-800 rounded">
                                {course.subCpmkCount} Sub
                              </span>
                            )}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* CPMK Detail - Main Content */}
          <div className="lg:col-span-2">
            {!selectedCourse ? (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12">
                <div className="text-center text-gray-500">
                  <ListChecks className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Pilih Mata Kuliah</h3>
                  <p>Pilih mata kuliah dari daftar untuk melihat dan mengelola CPMK</p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Course Header */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h2 className="text-2xl font-bold text-gray-900">{selectedCourse.code}</h2>
                      <p className="text-gray-600 mt-1">{selectedCourse.title}</p>
                      <div className="flex items-center gap-4 mt-3">
                        <span className="text-sm text-gray-500">
                          <span className="font-medium">{selectedCourse.credits}</span> SKS
                        </span>
                        <span className="text-sm text-gray-500">
                          Semester <span className="font-medium">{selectedCourse.semester}</span>
                        </span>
                      </div>
                    </div>
                    {!isAdminRoute && (
                      <button
                        onClick={() => setShowAddCpmk(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        <Plus className="w-5 h-5" />
                        Tambah CPMK
                      </button>
                    )}
                  </div>

                  {/* Add CPMK Form */}
                  {showAddCpmk && !isAdminRoute && (
                    <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <div className="flex items-start gap-3">
                        <div className="flex-1">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            CPMK {cpmkList.length + 1}
                          </label>
                          <textarea
                            value={newCpmkForm.description}
                            onChange={(e) => setNewCpmkForm({ description: e.target.value })}
                            placeholder="Deskripsi CPMK..."
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            rows="3"
                          />
                        </div>
                        <div className="flex flex-col gap-2">
                          <button
                            onClick={handleAddCpmk}
                            className="p-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                            title="Simpan"
                          >
                            <Save className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => {
                              setShowAddCpmk(false);
                              setNewCpmkForm({ description: '' });
                            }}
                            className="p-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500 transition-colors"
                            title="Batal"
                          >
                            <X className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* CPMK List */}
                {cpmkList.length === 0 ? (
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12">
                    <div className="text-center text-gray-500">
                      <AlertCircle className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                      <p>Belum ada CPMK untuk mata kuliah ini</p>
                      {!isAdminRoute && (
                        <button
                          onClick={() => setShowAddCpmk(true)}
                          className="mt-4 text-blue-600 hover:text-blue-700 font-medium"
                        >
                          Tambah CPMK Pertama
                        </button>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {cpmkList.map((cpmk, index) => (
                      <div
                        key={cpmk.id}
                        className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
                      >
                        {/* CPMK Header */}
                        <div className="p-4">
                          <div className="flex items-start gap-3">
                            {/* CPMK Number Badge */}
                            <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                              <span className="text-lg font-bold text-blue-700">{cpmk.cpmk_number}</span>
                            </div>

                            {/* CPMK Content */}
                            <div className="flex-1 min-w-0">
                              {editingCpmk?.id === cpmk.id ? (
                                // Edit Mode
                                <div className="space-y-2">
                                  <textarea
                                    value={editingCpmk.description}
                                    onChange={(e) => setEditingCpmk({ ...editingCpmk, description: e.target.value })}
                                    className="w-full px-3 py-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    rows="3"
                                  />
                                  <div className="flex items-center gap-2">
                                    <button
                                      onClick={() => handleUpdateCpmk(cpmk.id)}
                                      className="px-3 py-1.5 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors flex items-center gap-1"
                                    >
                                      <CheckCircle className="w-4 h-4" />
                                      Simpan
                                    </button>
                                    <button
                                      onClick={() => setEditingCpmk(null)}
                                      className="px-3 py-1.5 bg-gray-400 text-white text-sm rounded-lg hover:bg-gray-500 transition-colors flex items-center gap-1"
                                    >
                                      <X className="w-4 h-4" />
                                      Batal
                                    </button>
                                  </div>
                                </div>
                              ) : (
                                // View Mode
                                <>
                                  <div className="flex items-start justify-between gap-2">
                                    <p className="text-gray-900 leading-relaxed flex-1">{cpmk.description}</p>
                                    {!isAdminRoute && (
                                      <div className="flex items-center gap-1 flex-shrink-0">
                                        <button
                                          onClick={() => setEditingCpmk({ id: cpmk.id, description: cpmk.description })}
                                          className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                                          title="Edit CPMK"
                                        >
                                          <Edit className="w-4 h-4" />
                                        </button>
                                        <button
                                          onClick={() => handleDeleteCpmk(cpmk.id, cpmk.description)}
                                          className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"
                                          title="Hapus CPMK"
                                        >
                                          <Trash2 className="w-4 h-4" />
                                        </button>
                                      </div>
                                    )}
                                  </div>

                                  {/* Sub-CPMK Toggle */}
                                  {cpmk.sub_cpmks && cpmk.sub_cpmks.length > 0 && (
                                    <button
                                      onClick={() => toggleExpand(cpmk.id)}
                                      className="mt-3 flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 font-medium"
                                    >
                                      {expandedCpmk === cpmk.id ? (
                                        <>
                                          <ChevronUp className="w-4 h-4" />
                                          Sembunyikan Sub-CPMK ({cpmk.sub_cpmks.length})
                                        </>
                                      ) : (
                                        <>
                                          <ChevronDown className="w-4 h-4" />
                                          Lihat Sub-CPMK ({cpmk.sub_cpmks.length})
                                        </>
                                      )}
                                    </button>
                                  )}
                                </>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Sub-CPMK Section */}
                        {expandedCpmk === cpmk.id && (
                          <div className="border-t border-gray-200 bg-gray-50 p-4">
                            <div className="flex items-center justify-between mb-4">
                              <h4 className="text-sm font-semibold text-gray-700">Sub-CPMK</h4>
                              {!isAdminRoute && (
                                <button
                                  onClick={() => setShowAddSubCpmk(cpmk.id)}
                                  className="flex items-center gap-1 px-3 py-1.5 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors"
                                >
                                  <Plus className="w-4 h-4" />
                                  Tambah Sub
                                </button>
                              )}
                            </div>

                            {/* Add Sub-CPMK Form */}
                            {showAddSubCpmk === cpmk.id && !isAdminRoute && (
                              <div className="mb-4 p-3 bg-white rounded-lg border border-green-200">
                                <div className="flex items-start gap-2">
                                  <div className="flex-1">
                                    <label className="block text-xs font-medium text-gray-700 mb-1">
                                      Sub-CPMK {(cpmk.sub_cpmks?.length || 0) + 1}
                                    </label>
                                    <textarea
                                      value={newSubCpmkForm.description}
                                      onChange={(e) => setNewSubCpmkForm({ description: e.target.value })}
                                      placeholder="Deskripsi Sub-CPMK..."
                                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                      rows="2"
                                    />
                                  </div>
                                  <div className="flex flex-col gap-1">
                                    <button
                                      onClick={() => handleAddSubCpmk(cpmk.id)}
                                      className="p-1.5 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                                      title="Simpan"
                                    >
                                      <Save className="w-4 h-4" />
                                    </button>
                                    <button
                                      onClick={() => {
                                        setShowAddSubCpmk(null);
                                        setNewSubCpmkForm({ description: '' });
                                      }}
                                      className="p-1.5 bg-gray-400 text-white rounded hover:bg-gray-500 transition-colors"
                                      title="Batal"
                                    >
                                      <X className="w-4 h-4" />
                                    </button>
                                  </div>
                                </div>
                              </div>
                            )}

                            {/* Sub-CPMK List */}
                            {cpmk.sub_cpmks && cpmk.sub_cpmks.length > 0 ? (
                              <div className="space-y-2">
                                {cpmk.sub_cpmks.map((sub) => (
                                  <div
                                    key={sub.id}
                                    className="bg-white rounded-lg p-3 border border-gray-200 hover:border-blue-300 transition-colors"
                                  >
                                    {editingSubCpmk?.id === sub.id ? (
                                      // Edit Mode
                                      <div className="space-y-2">
                                        <textarea
                                          value={editingSubCpmk.description}
                                          onChange={(e) => setEditingSubCpmk({ ...editingSubCpmk, description: e.target.value })}
                                          className="w-full px-2 py-1.5 text-sm border border-blue-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                          rows="2"
                                        />
                                        <div className="flex items-center gap-2">
                                          <button
                                            onClick={() => handleUpdateSubCpmk(cpmk.id, sub.id)}
                                            className="px-2 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700 transition-colors flex items-center gap-1"
                                          >
                                            <CheckCircle className="w-3 h-3" />
                                            Simpan
                                          </button>
                                          <button
                                            onClick={() => setEditingSubCpmk(null)}
                                            className="px-2 py-1 bg-gray-400 text-white text-xs rounded hover:bg-gray-500 transition-colors flex items-center gap-1"
                                          >
                                            <X className="w-3 h-3" />
                                            Batal
                                          </button>
                                        </div>
                                      </div>
                                    ) : (
                                      // View Mode
                                      <div className="flex items-start gap-3">
                                        <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center text-xs font-semibold">
                                          {sub.sub_cpmk_number}
                                        </span>
                                        <p className="flex-1 text-sm text-gray-700 leading-relaxed">{sub.description}</p>
                                        {!isAdminRoute && (
                                          <div className="flex items-center gap-1 flex-shrink-0">
                                            <button
                                              onClick={() => setEditingSubCpmk({ id: sub.id, description: sub.description })}
                                              className="p-1 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                                              title="Edit Sub-CPMK"
                                            >
                                              <Edit className="w-3 h-3" />
                                            </button>
                                            <button
                                              onClick={() => handleDeleteSubCpmk(sub.id, sub.description)}
                                              className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                                              title="Hapus Sub-CPMK"
                                            >
                                              <Trash2 className="w-3 h-3" />
                                            </button>
                                          </div>
                                        )}
                                      </div>
                                    )}
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <div className="text-center py-6 text-gray-400 text-sm">
                                Belum ada Sub-CPMK
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

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
